import type { CSSProperties } from 'react';

/**
 * Traduce la paleta y la tipografía elegidas en el editor a las variables que
 * usan tanto el preview como la página publicada.
 *
 * Todo el diseño de la carta está escrito contra `--paper`, `--ink-black`,
 * `--accent-hex` y sus derivadas. Redefiniéndolas en el contenedor, la carta
 * entera adopta la paleta sin tocar un solo estilo.
 */

export interface PagePalette {
    backgroundColor?: string | null;
    textColor?: string | null;
    accentColor?: string | null;
    titleFont?: string | null;
    bodyFont?: string | null;
}

/**
 * Identificadores de la paleta y la tipografía por defecto.
 *
 * El valor sigue siendo `'riso'` porque es uno de los que acepta el enum de
 * `theme` en el backend y las páginas ya publicadas lo tienen guardado; lo que
 * cambió es la paleta a la que apunta, que ahora es la de la app.
 */
export const DEFAULT_THEME_ID = 'riso';
export const DEFAULT_FONT = 'Love Pages';

/** Los primarios de la app: papel cálido casi blanco, tinta pizarra, acento vino. */
export const DEFAULT_COLORS = { bg: '#faf8f8', text: '#494a5f', accent: '#7b2240' };

/**
 * ¿Es la tipografía del producto, y no una Google Font?
 *
 * `'Riso'` es como se llamaba antes y está guardado en las páginas ya
 * publicadas. Sin este alias se pediría a Google Fonts una familia inexistente
 * y esas cartas perderían su tipografía.
 */
function isBuiltInFont(font?: string | null): boolean {
    return !font || font === DEFAULT_FONT || font === 'Riso';
}

function parseHex(hex: string): [number, number, number] | null {
    const h = hex.trim().replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return null;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, alpha: number): string {
    const c = parseHex(hex);
    return c ? `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})` : hex;
}

/** Mezcla `a` hacia `b` en proporción `t` (0–1) y devuelve hex. */
function mix(a: string, b: string, t: number): string {
    const ca = parseHex(a);
    const cb = parseHex(b);
    if (!ca || !cb) return a;
    const out = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
    return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Luminancia percibida (ITU-R BT.601), suficiente para decidir contraste. */
function luminance(hex: string): number {
    const c = parseHex(hex);
    if (!c) return 255;
    return (c[0] * 299 + c[1] * 587 + c[2] * 114) / 1000;
}

/** Un tono claro se lee mejor sobre tinta oscura, y al revés. */
export function isDarkColor(hex: string): boolean {
    return luminance(hex) < 140;
}

/** Luminancia relativa WCAG 2.x. */
function relLuminance(hex: string): number {
    const c = parseHex(hex);
    if (!c) return 1;
    const [r, g, b] = c.map((v) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste WCAG entre dos colores (1 a 21). AA pide 4.5 en texto normal y 3 en grande. */
export function contrastRatio(a: string, b: string): number {
    const la = relLuminance(a);
    const lb = relLuminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Texto normal (WCAG AA). */
const AA = 4.5;
/** Extremos a los que se recurre cuando la paleta no da para más. */
const INK_DARK = '#1b1721';
const INK_LIGHT = '#ffffff';

/**
 * Acerca `fg` a `toward` en pasos hasta que se lea sobre todos los `bgs`.
 * Si ni así llega (p. ej. el texto elegido se parece al fondo), sigue hacia el
 * negro o el blanco, el que más contraste. Así cualquier paleta, también las
 * que el usuario crea a mano, deja el texto derivado legible.
 */
function ensureContrast(fg: string, bgs: string[], toward: string, min = AA): string {
    const worst = (c: string) => Math.min(...bgs.map((b) => contrastRatio(c, b)));
    if (worst(fg) >= min) return fg;
    for (let t = 0.1; t < 1.001; t += 0.1) {
        const c = mix(fg, toward, t);
        if (worst(c) >= min) return c;
    }
    const end = worst(INK_DARK) >= worst(INK_LIGHT) ? INK_DARK : INK_LIGHT;
    for (let t = 0.1; t < 1.001; t += 0.1) {
        const c = mix(fg, end, t);
        if (worst(c) >= min) return c;
    }
    // Con tonos medios (p. ej. el rosa de Minimal) sólo el negro puro llega.
    return worst('#000000') >= worst(INK_LIGHT) ? '#000000' : INK_LIGHT;
}

/**
 * Superficie ligeramente separada del papel (botón «No», etiquetas) sobre la
 * que va `ink`. Se tiñe hacia `tint` como siempre, pero si eso la acerca
 * demasiado a la tinta (texto claro sobre papel oscuro), se separa en sentido
 * contrario: la superficie sigue viéndose y el texto gana contraste.
 */
function surface(bg: string, tint: string, amount: number, ink: string): string {
    const toward = mix(bg, tint, amount);
    if (contrastRatio(ink, toward) >= AA) return toward;
    const away = contrastRatio(INK_DARK, ink) > contrastRatio(INK_LIGHT, ink) ? INK_DARK : INK_LIGHT;
    const opposite = mix(bg, away, amount);
    return contrastRatio(ink, opposite) >= contrastRatio(ink, toward) ? opposite : toward;
}

/** De los candidatos, el que más contrasta con `base`. */
function mostContrasting(base: string, candidates: string[]): string {
    return candidates.reduce((best, c) => (contrastRatio(c, base) > contrastRatio(best, base) ? c : best));
}

/**
 * Variables CSS derivadas de la paleta. Se aplican como `style` en el
 * contenedor de la carta, tanto en el editor como en la página pública.
 */
export function pageThemeVars(palette: PagePalette): CSSProperties {
    const bg = palette.backgroundColor || DEFAULT_COLORS.bg;
    const text = palette.textColor || DEFAULT_COLORS.text;
    const accent = palette.accentColor || DEFAULT_COLORS.accent;

    const paper2 = surface(bg, text, 0.08, text);
    // La firma se calcula contra el papel; su etiqueta, sobre un lavado del
    // acento que se aparta de ella si hace falta.
    const accentInk = ensureContrast(accent, [bg], text);
    const accentWash = surface(bg, accent, 0.14, accentInk);

    return {
        // Papel y sus profundidades
        '--paper': bg,
        '--paper-soft': mix(bg, text, 0.03),
        '--paper-2': paper2,
        '--paper-3': mix(bg, text, 0.16),

        // Tintas
        '--ink-black': text,
        '--ink': text,
        '--ink-2': text,
        '--ink-blue': text,
        // El mensaje. Antes era el texto al 62 % de opacidad, y en casi todas
        // las paletas quedaba por debajo de 4.5:1. Ahora parte de ese tono más
        // suave y se oscurece o aclara lo justo para leerse.
        '--ink-soft': ensureContrast(mix(bg, text, 0.62), [bg, paper2], text),
        '--rule': rgba(text, 0.24),

        // Acento
        '--ink-red': accent,
        '--accent-hex': accent,
        // Texto de los botones sobre el acento: el papel o la tinta, el que más
        // contraste, y si ninguno llega, corregido hasta que se lea.
        '--on-accent': ensureContrast(mostContrasting(accent, [bg, text]), [accent], mostContrasting(accent, [INK_DARK, INK_LIGHT])),
        // El acento cuando hace de texto: la firma sobre el papel y la
        // etiqueta «Una carta para…» sobre su lavado.
        '--ink-red-ink': ensureContrast(accentInk, [bg, accentWash], text),
        '--ink-overlap': mix(accent, text, 0.45),
        '--plum': mix(accent, text, 0.45),

        // Lavados
        '--lila': rgba(text, 0.14),
        '--lila-2': rgba(text, 0.26),
        '--melocoton': accentWash,
        '--melocoton-2': rgba(accent, 0.26),
    } as CSSProperties;
}

/**
 * Halo del color del papel alrededor de las letras de la carta. Las
 * partículas pasan por detrás del texto; sin esto, pétalos y corazones
 * cruzaban el título y el mensaje y ensuciaban la lectura.
 */
export const LETTER_TEXT_HALO = '0 0 10px var(--paper), 0 0 18px var(--paper), 0 0 2px var(--paper)';

/**
 * Familia tipográfica para los títulos. La opción por defecto usa la display de
 * la app; cualquier otra es una Google Font elegida en el editor.
 */
export function titleFontFamily(font?: string | null): string {
    if (isBuiltInFont(font)) return 'var(--display)';
    return `'${font}', var(--display)`;
}

/** Familia para el cuerpo del mensaje. */
export function bodyFontFamily(font?: string | null): string {
    if (isBuiltInFont(font)) return 'var(--serif)';
    return `'${font}', var(--serif)`;
}

/**
 * URL de Google Fonts para las familias que hagan falta. Devuelve null si sólo
 * se usan las del producto, para no pedir nada.
 */
export function googleFontsHref(fonts: (string | null | undefined)[]): string | null {
    const families = Array.from(
        new Set(fonts.filter((f): f is string => !isBuiltInFont(f)))
    );
    if (families.length === 0) return null;
    const query = families.map((f) => `family=${f.replace(/ /g, '+')}:wght@400;700`).join('&');
    return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
