'use client';

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import { CustomSlugInput } from '@/components/CustomSlugInput';
import { ParticleCanvas, animToKind, hasParticles } from '@/components/ParticleCanvas';
import { LoginGateModal } from '@/components/auth/login-gate-modal';
import { saveDraft, loadDraft, clearDraft } from '@/lib/draft';
import {
    pageThemeVars,
    titleFontFamily,
    bodyFontFamily,
    googleFontsHref,
    DEFAULT_THEME_ID,
    DEFAULT_FONT,
    DEFAULT_COLORS,
    LETTER_TEXT_HALO,
    contrastRatio,
} from '@/lib/page-theme';
import { useTranslation } from '@/i18n';
import esT from '@/i18n/translations/es';
import enT from '@/i18n/translations/en';
import { fleeDelta } from '@/lib/escape-button';

import {
    Heart,
    Sparkles,
    Eye,
    ArrowLeft,
    Upload,
    Crown,
    CheckCircle2,
    Type,
    Palette,
    Link2,
    Image as ImageIcon,
    Music,
    Wand2,
    X,
    Plus,
    Trash2,
    Volume2,
    Stars,
    PartyPopper,
    Snowflake,
    Flame,
    CloudRain,
    Clock,
    Smartphone,
    Tablet,
    Monitor,
    AlertCircle,
    RotateCcw,
    ChevronDown,
    Check,
    Copy,
    Share2,
    MessageCircle,
    MousePointerClick,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HexColorPicker } from 'react-colorful';
import { useDropzone } from 'react-dropzone';

// ============================================================
// CONFIGURACIÓN DE OPCIONES
// ============================================================

const GOOGLE_FONTS = [
    // La display condensada del producto. Va primera y es la de fábrica, para
    // que elegir tipografía sea una decisión y no un cambio por omisión.
    { name: DEFAULT_FONT, category: 'sans-serif', free: true },
    { name: 'Dancing Script', category: 'cursive', free: true },
    { name: 'Pacifico', category: 'cursive', free: true },
    { name: 'Lobster', category: 'cursive', free: true },
    { name: 'Great Vibes', category: 'cursive', free: true },
    { name: 'Satisfy', category: 'cursive', free: true },
    { name: 'Playfair Display', category: 'serif', free: true },
    { name: 'Quicksand', category: 'sans-serif', free: true },
    { name: 'Comfortaa', category: 'sans-serif', free: true },
    // PRO fonts
    { name: 'Cormorant Garamond', category: 'serif', free: false },
    { name: 'Cinzel', category: 'serif', free: false },
    { name: 'Abril Fatface', category: 'display', free: false },
    { name: 'Righteous', category: 'display', free: false },
    { name: 'Sacramento', category: 'cursive', free: false },
    { name: 'Amatic SC', category: 'cursive', free: false },
    { name: 'Caveat', category: 'cursive', free: false },
    { name: 'Indie Flower', category: 'cursive', free: false },
];

const THEMES = [
    {
        id: DEFAULT_THEME_ID,
        name: 'Love Pages',
        emoji: '💜',
        colors: DEFAULT_COLORS,
        preview: 'bg-gradient-to-br from-violet-50 to-violet-300',
        free: true,
    },
    {
        id: 'romantic',
        name: 'Romántico',
        emoji: '💕',
        colors: { bg: '#d6246e', text: '#ffffff', accent: '#ffc2d9' },
        preview: 'bg-gradient-to-br from-pink-400 to-rose-500',
        free: true,
    },
    {
        id: 'sunset',
        name: 'Atardecer',
        emoji: '🌅',
        colors: { bg: '#c2410c', text: '#ffffff', accent: '#ffd8a8' },
        preview: 'bg-gradient-to-br from-orange-400 to-pink-500',
        free: true,
    },
    {
        id: 'ocean',
        name: 'Océano',
        emoji: '🌊',
        colors: { bg: '#0077b6', text: '#ffffff', accent: '#90e0ef' },
        preview: 'bg-gradient-to-br from-cyan-400 to-blue-600',
        free: true,
    },
    {
        id: 'garden',
        name: 'Jardín',
        emoji: '🌸',
        colors: { bg: '#ffc8dd', text: '#5c374c', accent: '#ffafcc' },
        preview: 'bg-gradient-to-br from-pink-200 to-purple-300',
        free: true,
    },
    {
        id: 'playful',
        name: 'Divertido',
        emoji: '🎉',
        colors: { bg: '#ffd700', text: '#333333', accent: '#ff6b6b' },
        preview: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        free: true,
    },
    {
        id: 'elegant',
        name: 'Elegante',
        emoji: '✨',
        colors: { bg: '#2c3e50', text: '#ecf0f1', accent: '#c9a84c' },
        preview: 'bg-gradient-to-br from-slate-600 to-purple-700',
        free: true,
    },
    {
        id: 'minimal',
        name: 'Minimal',
        emoji: '🤍',
        colors: { bg: '#ffffff', text: '#333333', accent: '#e91e63' },
        preview: 'bg-gradient-to-br from-gray-100 to-gray-300',
        free: true,
    },
    {
        id: 'dark',
        name: 'Oscuro',
        emoji: '🖤',
        colors: { bg: '#1a1a2e', text: '#e0e0e0', accent: '#e94560' },
        preview: 'bg-gradient-to-br from-gray-900 to-indigo-950',
        free: true,
    },
    // PRO themes
    {
        id: 'neon',
        name: 'Neón',
        emoji: '💜',
        colors: { bg: '#0f0f23', text: '#ffffff', accent: '#bf00ff' },
        preview: 'bg-gradient-to-br from-purple-900 to-fuchsia-800',
        free: false,
    },
    {
        id: 'vintage',
        name: 'Vintage',
        emoji: '📜',
        colors: { bg: '#f4e8c1', text: '#5c4033', accent: '#a0522d' },
        preview: 'bg-gradient-to-br from-amber-100 to-orange-200',
        free: false,
    },
    {
        id: 'aurora',
        name: 'Aurora',
        emoji: '🌌',
        colors: { bg: '#0b0c1e', text: '#e0f7fa', accent: '#00e5ff' },
        preview: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-teal-800',
        free: false,
    },
    {
        id: 'cherry',
        name: 'Cerezo',
        emoji: '🌸',
        colors: { bg: '#fff0f5', text: '#8b0032', accent: '#ff69b4' },
        preview: 'bg-gradient-to-br from-pink-100 to-rose-200',
        free: false,
    },
];

const ANIMATIONS = [
    { id: 'none', name: 'Sin animación', emoji: '—', free: true },
    { id: 'hearts-falling', name: 'Corazones cayendo', emoji: '💕', free: true },
    { id: 'fade-in', name: 'Aparecer suave', emoji: '✨', free: true },
    { id: 'float-up', name: 'Flotar', emoji: '🎈', free: true },
    // PRO animations
    { id: 'confetti', name: 'Confetti', emoji: '🎊', free: false },
    { id: 'particles', name: 'Partículas', emoji: '⭐', free: false },
    { id: 'fireworks', name: 'Fuegos artificiales', emoji: '🎆', free: false },
    { id: 'snow', name: 'Nieve', emoji: '❄️', free: false },
    { id: 'petals', name: 'Pétalos', emoji: '🌸', free: false },
    { id: 'bubbles', name: 'Burbujas', emoji: '🫧', free: false },
];

const STICKERS = [
    { id: 'heart-big', emoji: '❤️', free: true },
    { id: 'heart-sparkling', emoji: '💖', free: true },
    { id: 'heart-arrow', emoji: '💘', free: true },
    { id: 'kiss', emoji: '💋', free: true },
    { id: 'rose', emoji: '🌹', free: true },
    { id: 'ring', emoji: '💍', free: true },
    { id: 'couple', emoji: '💑', free: true },
    { id: 'love-letter', emoji: '💌', free: true },
    { id: 'star', emoji: '⭐', free: false },
    { id: 'fire', emoji: '🔥', free: false },
    { id: 'butterfly', emoji: '🦋', free: false },
    { id: 'teddy', emoji: '🧸', free: false },
    { id: 'chocolate', emoji: '🍫', free: false },
    { id: 'champagne', emoji: '🍾', free: false },
    { id: 'moon', emoji: '🌙', free: false },
    { id: 'rainbow', emoji: '🌈', free: false },
];

const BACKGROUND_MUSIC = [
    { id: 'none', name: 'Sin música', free: true },
    { id: 'romantic-piano', name: '🎹 Piano romántico', free: false },
    { id: 'acoustic-guitar', name: '🎸 Guitarra acústica', free: false },
    { id: 'love-song', name: '🎵 Canción de amor', free: false },
    { id: 'music-box', name: '🎶 Caja musical', free: false },
    { id: 'orchestra', name: '🎻 Orquesta suave', free: false },
];

/**
 * Cartas de partida por ocasión. El texto vive en las traducciones
 * (`create.occasionPresets`); aquí sólo el aspecto que acompaña a cada una.
 * Sólo paletas y animaciones gratis: elegir ocasión no debe meter nada PRO.
 */
const OCCASIONS = [
    { id: 'valentine', theme: DEFAULT_THEME_ID, animation: 'hearts-falling' },
    { id: 'anniversary', theme: 'elegant', animation: 'fade-in' },
    { id: 'askOut', theme: 'garden', animation: 'hearts-falling' },
    { id: 'apology', theme: 'minimal', animation: 'float-up' },
    { id: 'birthday', theme: 'playful', animation: 'float-up' },
] as const;

type OccasionId = (typeof OCCASIONS)[number]['id'];

/** «María José» → «maria-jose», para sugerir el enlace a partir del nombre. */
function slugify(text: string): string {
    return text
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        .slice(0, 24);
}

// ============================================================
// TIPOS
// ============================================================

interface PageFormData {
    title: string;
    recipientName: string;
    message: string;
    yesButtonText: string;
    noButtonText: string;
    noButtonEscapes: boolean;
    pageType: 'free' | 'pro';
    // Diseño
    theme: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    // Tipografía
    titleFont: string;
    bodyFont: string;
    // Imágenes
    backgroundImage: File | null;
    decorativeImages: File[];
    referenceImage: File | null; // Para IA PRO
    // Stickers
    selectedStickers: string[];
    // Animaciones
    animation: string;
    // Música
    backgroundMusic: string;
    // Video embed (PRO)
    videoUrl: string;
    // Extras
    showWatermark: boolean; // free = true siempre
    customSlug: string;
    /** Fecha que celebra la carta; alimenta el recordatorio anual. */
    occasionDate: string;
}

type Step = 'content' | 'design' | 'media' | 'effects' | 'preview';

// ============================================================
// COMPONENTE: ProBadge (lock indicator para features PRO)
// ============================================================
function ProBadge({ small = false }: { small?: boolean }) {
    return (
        <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'var(--ink-black)', color: 'var(--paper)', fontWeight: 700, border: '1px solid var(--hairline)', padding: small ? '1px 6px' : '2px 8px', fontSize: small ? 10 : 11, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none' }}
        >
            <Crown className={small ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
            PRO
        </span>
    );
}

// ============================================================
// COMPONENTE: UpgradeModal (modal en vez de redirección)
// ============================================================
function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white max-w-md w-full p-0 overflow-hidden" style={{ border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-card)' }}>
                {/* Header */}
                <div className="p-6 text-white text-center" style={{ background: 'var(--accent-hex)' }}>
                    <div className="flex items-center justify-center mx-auto mb-3" style={{ width: 64, height: 64, background: 'rgba(248,241,222,0.2)', border: '2px solid rgba(248,241,222,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Crown className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">{t.create.unlockPro}</h3>
                    <p className="text-white/90 text-sm mt-1">{t.create.unlockProDesc}</p>
                </div>

                {/* Features */}
                <div className="p-6 space-y-3">
                    {[t.create.proFeature9, t.create.proFeature1, t.create.proFeature2, t.create.proFeature3, t.create.proFeature4, t.create.proFeature5, t.create.proFeature6, t.create.proFeature7, t.create.proFeature8].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 space-y-3">
                    <Link href="/upgrade" className="block">
                        <button className="btn-accent" style={{ width: '100%', padding: '14px 20px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--mono)', letterSpacing: 0 }}>
                            <Crown className="w-4 h-4" />
                            {t.create.viewProPlans}
                        </button>
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                    >
                        {t.create.stayFree}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTE: ProDecisionModal
// Se abre al publicar con opciones PRO puestas y sin plan PRO.
// El usuario ya vio esas opciones funcionando en su propia carta, así que
// aquí sólo hay que decidir: publicar sin ellas o desbloquearlas.
// ============================================================
function ProDecisionModal({
    isOpen,
    onClose,
    onPublishFree,
    onUpgrade,
    selections,
}: {
    isOpen: boolean;
    onClose: () => void;
    onPublishFree: () => void;
    onUpgrade: () => void;
    selections: { label: string; value: string }[];
}) {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div
                className="relative w-full max-w-sm"
                style={{ background: 'var(--paper-soft)', border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-card)' }}
            >
                <div style={{ padding: '28px 26px 26px' }}>
                    <span className="mono-eyebrow" style={{ fontSize: 14, letterSpacing: 0, color: 'var(--accent-hex)', display: 'block', marginBottom: 12 }}>{selections.length === 1 ? t.create.proModalOne : t.create.proModalMany.replace('{count}', String(selections.length))}
                    </span>

                    <h3 className="serif-display" style={{ fontSize: 28, lineHeight: 1.12, margin: 0, color: 'var(--ink-black)' }}>
                        {t.create.proModalTitle}
                    </h3>

                    <p style={{ marginTop: 12, fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-black)' }}>
                        {t.create.proModalDesc}
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selections.map((s) => (
                            <li
                                key={`${s.label}-${s.value}`}
                                style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 12px', background: 'var(--paper)', border: '1px solid var(--hairline)', fontFamily: 'var(--mono)', fontSize: 14 }}
                            >
                                <span style={{ color: 'var(--ink-soft)', textTransform: 'none', letterSpacing: 0 }}>{s.label}</span>
                                <span style={{ fontWeight: 700, textAlign: 'right' }}>{s.value}</span>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button
                            onClick={onUpgrade}
                            className="btn-accent"
                            style={{ width: '100%', padding: '13px 18px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--mono)', letterSpacing: 0 }}
                        >
                            <Crown style={{ width: 14, height: 14 }} />
                            {t.create.unlockThemPrice}
                        </button>
                        <button
                            onClick={onPublishFree}
                            style={{ width: '100%', padding: '11px 18px', background: 'transparent', border: '1px solid var(--hairline)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 0, textTransform: 'none', color: 'var(--ink-black)' }}
                        >
                            {t.create.proModalPublishFree}
                        </button>
                        <button
                            onClick={onClose}
                            style={{ width: '100%', padding: '4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink-soft)', letterSpacing: 0 }}
                        >
                            {t.create.proModalKeepEditing}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// DESKTOP HELPERS — defined outside component to avoid remount on each render
// ============================================================

/** Tamaños del lienzo de vista previa (columna izquierda del editor desktop). */
const PREVIEW_DEVICES = [
    { id: 'phone', labelKey: 'devicePhone', icon: Smartphone, width: 320, height: 640, radius: 44, notch: true },
    { id: 'tablet', labelKey: 'deviceTablet', icon: Tablet, width: 480, height: 660, radius: 24, notch: false },
    { id: 'wide', labelKey: 'deviceDesktop', icon: Monitor, width: 720, height: 460, radius: 8, notch: false },
] as const;

type PreviewDeviceId = (typeof PREVIEW_DEVICES)[number]['id'];
/** Etiqueta de campo: legible y en caja baja, sin el filete de guiones. */
function DField({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-black)' }}>{label}</span>
                {hint && <span style={{ fontSize: 14, color: 'var(--ink-faint)', flexShrink: 0 }}>{hint}</span>}
            </div>
            {children}
        </div>
    );
}

/* El campo del editor. Sin borde: el relleno lo separa del panel, y el foco lo
   sube a blanco con un halo morado. */
const dI: React.CSSProperties = {
    width: '100%', padding: '13px 15px',
    border: '1px solid transparent', background: 'var(--paper-2)',
    borderRadius: 'var(--r-md)', fontSize: 16, color: 'var(--ink-black)',
    outline: 'none', fontFamily: 'var(--sans)', lineHeight: 1.5,
    transition: 'background 140ms, border-color 140ms',
};

/** Mismo campo, marcado tras un intento de publicar sin rellenarlo. */
const dInvalid: React.CSSProperties = {
    ...dI,
    border: '1px solid var(--destructive-border)',
    background: 'var(--destructive-soft)',
};

/** Marca de campo obligatorio: visible desde el principio, no sólo al fallar. */
function RequiredMark({ filled, label }: { filled: boolean; label: string }) {
    return (
        <span
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 14, fontFamily: 'var(--sans)', fontWeight: 500,
                color: filled ? 'var(--ink-faint)' : 'var(--accent-2-hex)',
            }}
        >
            {filled ? <Check style={{ width: 13, height: 13 }} /> : <span aria-hidden="true">•</span>}
            {label}
        </span>
    );
}

const colorKeyMap = { bg: 'backgroundColor', text: 'textColor', accent: 'accentColor' } as const;

/**
 * El «No» de la vista previa. Si está activado que escape, huye de verdad
 * dentro de la carta, para que se pueda probar antes de publicar; si no, un
 * clic lleva a su campo como el resto de textos de la carta.
 */
function PreviewNoButton({ label, escapes, onEdit }: { label: string; escapes: boolean; onEdit: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const posRef = useRef({ x: 0, y: 0 });
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!escapes) { posRef.current = { x: 0, y: 0 }; setPos({ x: 0, y: 0 }); }
    }, [escapes]);

    const flee = (pointerX: number, pointerY: number) => {
        const btn = ref.current;
        const box = btn?.closest('[data-preview-body]') as HTMLElement | null;
        if (!escapes || !btn || !box) return;
        const r = btn.getBoundingClientRect();
        const c = box.getBoundingClientRect();
        const delta = fleeDelta({
            btn: { left: r.left, top: r.top, width: r.width, height: r.height },
            container: c, viewport: c, pointerX, pointerY, force: true, margin: 8,
        });
        if (!delta) return;
        posRef.current = { x: posRef.current.x + delta.dx, y: posRef.current.y + delta.dy };
        setPos(posRef.current);
    };

    return (
        <button
            ref={ref}
            type="button"
            className={escapes ? undefined : 'lp-editable'}
            onMouseEnter={(e) => flee(e.clientX, e.clientY)}
            onPointerDown={(e) => { if (e.pointerType !== 'mouse') flee(e.clientX, e.clientY); }}
            onClick={() => { if (!escapes) onEdit(); }}
            style={{
                fontSize: 14, padding: '10px 20px', cursor: escapes ? 'default' : 'text',
                background: 'var(--paper-2)', border: 'none', borderRadius: 'var(--r-md)',
                color: 'var(--ink-black)', fontFamily: 'var(--sans)', fontWeight: 600, whiteSpace: 'nowrap',
                transform: `translate(${pos.x}px, ${pos.y}px)`, transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
                position: 'relative', zIndex: 4,
            }}
        >
            {label}
        </button>
    );
}

function renderMsg(text: string): React.ReactNode {
    if (!text || !text.includes('*')) return text;
    return text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2
            ? <em key={i} style={{ fontFamily: 'var(--display)' }}>{part.slice(1, -1)}</em>
            : part
    );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function CreatePageEnhanced() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [currentStep, setCurrentStep] = useState<Step>('content');
    /**
     * Pestaña de «Personalizar» abierta. Antes eran acordeones plegados y las
     * opciones pasaban desapercibidas; ahora siempre hay una a la vista.
     */
    const [openSection, setOpenSection] = useState<Exclude<Step, 'content'>>('design');
    const tabsRef = useRef<HTMLDivElement>(null);
    /** Vista previa a pantalla completa. Sólo se usa por debajo de `lg`. */
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
    const [decorativeImagePreviews, setDecorativeImagePreviews] = useState<string[]>([]);
    const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
    const [showColorPicker, setShowColorPicker] = useState<'bg' | 'text' | 'accent' | null>(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    /**
     * Hay un campo de texto enfocado, o sea que el teclado está abierto.
     *
     * En un móvil de ~700px el bloque fijo (cabecera + maqueta + secciones)
     * ocupa unos 350px. Con el teclado encima no quedaba sitio para ver lo que
     * se está escribiendo, así que mientras se escribe la maqueta se pliega y
     * la barra de publicar se aparta.
     */
    const { t, locale } = useTranslation();
    /** Hay un campo de texto enfocado: en móvil el botón «Ver mi carta» se aparta. */
    const [typing, setTyping] = useState(false);
    /** Carta recién publicada: se ofrece compartirla antes de salir del editor. */
    const [published, setPublished] = useState<{ url: string; identifier: string } | null>(null);

    // ── Borrador ──
    const [savedAt, setSavedAt] = useState<number | null>(null);
    const [restoredNotice, setRestoredNotice] = useState<{ hadImages: boolean } | null>(null);
    const hydratedRef = useRef(false);
    /** El aviso de «carta de ejemplo» se retira al restaurar un borrador propio. */
    const [showStarter, setShowStarter] = useState(true);

    // ── Publicación ──
    const [showLoginGate, setShowLoginGate] = useState(false);
    const [showProDecision, setShowProDecision] = useState(false);
    const pendingPublishRef = useRef(false);

    // ── Validación ──
    const [invalidField, setInvalidField] = useState<'title' | 'recipientName' | null>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const recipientRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const yesRef = useRef<HTMLInputElement>(null);
    const noRef = useRef<HTMLInputElement>(null);

    // ── Lienzo ──
    const [previewDevice, setPreviewDevice] = useState<PreviewDeviceId>('phone');

    const isPro = user?.isPro || false;
    const freeLimitReached = !!user && !isPro && user.canCreatePage === false;

    const [formData, setFormData] = useState<PageFormData>({
        title: t.create.starterTitle,
        recipientName: '',
        message: t.create.starterMessage,
        yesButtonText: t.landing.defaultYesText,
        noButtonText: t.landing.defaultNoText,
        noButtonEscapes: false,
        pageType: 'free',
        theme: DEFAULT_THEME_ID,
        backgroundColor: DEFAULT_COLORS.bg,
        textColor: DEFAULT_COLORS.text,
        accentColor: DEFAULT_COLORS.accent,
        titleFont: DEFAULT_FONT,
        bodyFont: DEFAULT_FONT,
        backgroundImage: null,
        decorativeImages: [],
        referenceImage: null,
        selectedStickers: [],
        animation: 'hearts-falling',
        backgroundMusic: 'none',
        videoUrl: '',
        showWatermark: !isPro,
        customSlug: '',
        occasionDate: '',
    });

    // Cargar Google Fonts dinámicamente (todas, para poder previsualizar la lista)
    useEffect(() => {
        const href = googleFontsHref(GOOGLE_FONTS.map((f) => f.name));
        if (!href) return;
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        link.onload = () => setFontsLoaded(true);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    // ── Borrador: restaurar al montar ──────────────────────────
    // Se ejecuta una sola vez y antes del primer autoguardado, para no pisar
    // lo guardado con el formulario vacío del render inicial.
    useEffect(() => {
        const draft = loadDraft();
        if (draft) {
            setFormData((prev) => ({ ...prev, ...(draft.values as Partial<PageFormData>) }));
            setSavedAt(draft.savedAt);
            setRestoredNotice({ hadImages: draft.hadImages });
            setShowStarter(false);
        }
        hydratedRef.current = true;
    }, []);

    // ── Borrador: autoguardar con debounce ─────────────────────
    useEffect(() => {
        if (!hydratedRef.current) return;
        const id = setTimeout(() => {
            const at = saveDraft(formData);
            if (at) setSavedAt(at);
        }, 600);
        return () => clearTimeout(id);
    }, [formData]);

    // Refresca la etiqueta «guardado hace X» sin depender de nuevas ediciones.
    const [savedTick, setSavedTick] = useState(0);
    useEffect(() => {
        if (!savedAt) return;
        const id = setInterval(() => setSavedTick((n) => n + 1), 15000);
        return () => clearInterval(id);
    }, [savedAt]);

    const savedLabel = (() => {
        void savedTick; // fuerza el recálculo con el intervalo
        if (!savedAt) return null;
        const secs = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
        if (secs < 10) return t.create.draftSavedNow;
        if (secs < 60) return t.create.draftSavedSeconds.replace('{n}', String(secs));
        const mins = Math.round(secs / 60);
        return t.create.draftSavedMinutes.replace('{n}', String(mins));
    })();

    /** ¿El foco está en algo que abre teclado? */
    const discardDraft = () => {
        clearDraft();
        setSavedAt(null);
        setRestoredNotice(null);
        setFormData((prev) => ({
            ...prev,
            title: '', recipientName: '', message: '',
            yesButtonText: t.landing.defaultYesText,
            noButtonText: t.landing.defaultNoText,
            customSlug: '',
        }));
        setCurrentStep('content');
        toast.success(t.create.draftDiscarded);
    };

    // ── Ocasión ─────────────────────────────────────────────
    const presets = t.create.occasionPresets;

    /** La ocasión cuya carta de partida sigue intacta en el formulario. */
    const activeOccasion = (Object.keys(presets) as OccasionId[]).find(
        (id) => presets[id].title === formData.title && presets[id].message === formData.message
    ) ?? null;
    const isBlank = !formData.title.trim() && !formData.message.trim();

    const applyOccasion = (id: OccasionId) => {
        const previous = formData;
        const preset = presets[id];
        const meta = OCCASIONS.find((o) => o.id === id)!;
        const theme = THEMES.find((th) => th.id === meta.theme) ?? THEMES[0];
        setFormData((prev) => ({
            ...prev,
            title: preset.title, message: preset.message,
            yesButtonText: preset.yes, noButtonText: preset.no,
            theme: theme.id, backgroundColor: theme.colors.bg, textColor: theme.colors.text, accentColor: theme.colors.accent,
            animation: meta.animation,
        }));
        setShowStarter(false);
        // Pisa texto y estilo: se puede deshacer de un toque.
        toast(
            (tt) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {t.create.occasionApplied.replace('{occasion}', preset.label)}
                    <button
                        onClick={() => { setFormData(previous); toast.dismiss(tt.id); }}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent-2-hex)', fontWeight: 700 }}
                    >
                        {t.create.undo}
                    </button>
                </span>
            ),
            { id: 'occasion', duration: 5000 }
        );
    };

    const startBlank = () => {
        updateForm({ title: '', message: '' });
        setShowStarter(false);
        requestAnimationFrame(() => titleRef.current?.focus());
    };

    // La carta de ejemplo se crea en el primer render, antes de saber el
    // idioma guardado. Si sigue intacta en el otro idioma, se traduce.
    useEffect(() => {
        const other = (locale === 'en' ? esT : enT).create.occasionPresets;
        setFormData((prev) => {
            const id = (Object.keys(other) as OccasionId[]).find(
                (k) => other[k].title === prev.title && other[k].message === prev.message
            );
            if (!id) return prev;
            const cur = presets[id];
            return {
                ...prev,
                title: cur.title, message: cur.message,
                yesButtonText: prev.yesButtonText === other[id].yes ? cur.yes : prev.yesButtonText,
                noButtonText: prev.noButtonText === other[id].no ? cur.no : prev.noButtonText,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale]);

    // ── Editar desde la carta ───────────────────────────────
    const fieldRefs = { title: titleRef, recipientName: recipientRef, message: messageRef, yes: yesRef, no: noRef };
    /** Clic en un texto de la vista previa: lleva a su campo y lo resalta. */
    const editField = (key: keyof typeof fieldRefs) => {
        setShowPreview(false);
        requestAnimationFrame(() => {
            const el = fieldRefs[key].current;
            if (!el) return;
            el.focus({ preventScroll: true });
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
            // Los campos cortos se seleccionan para reescribirlos de una vez;
            // el mensaje no, que un toque de más lo borraría entero.
            if (key === 'message') el.setSelectionRange(el.value.length, el.value.length);
            else el.select();
        });
    };

    // El mensaje crece con el texto en vez de quedar cortado en una caja.
    useLayoutEffect(() => {
        const el = messageRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight + 2, 420)}px`;
    }, [formData.message]);

    // ── Enlace ──────────────────────────────────────────────
    const suggestedSlug = formData.recipientName.trim()
        ? `${t.customSlug.slugPrefix}-${slugify(formData.recipientName)}`
        : t.customSlug.defaultSlug;

    // La tira de estilos desplaza: el tema elegido (por ocasión o borrador)
    // podía quedar fuera de la vista y no se sabía cuál estaba activo.
    const styleStripRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const box = styleStripRef.current;
        const el = box?.querySelector<HTMLElement>('[aria-pressed="true"]');
        if (!box || !el) return;
        box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' });
    }, [formData.theme]);

    const openTab = (id: Exclude<Step, 'content'>) => {
        setShowPreview(false);
        setOpenSection(id);
        requestAnimationFrame(() => tabsRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
    };

    const isTextInput = (el: EventTarget) =>
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLInputElement && ['text', 'url', 'search', 'email', ''].includes(el.type));

    // Auth no requerido - usuarios pueden diseñar sin login
    // Se pedirá login al momento de guardar si no están autenticados

    const updateForm = (updates: Partial<PageFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const goToUpgrade = () => {
        setShowUpgradeModal(true);
    };

    // Las opciones PRO se pueden elegir sin plan PRO: se aplican al preview para
    // que la persona vea si le sirven. El cobro se plantea al publicar, cuando ya
    // sabe qué está comprando (ver handleSubmit y ProDecisionModal).
    const noteProTrial = () => {
        if (isPro) return;
        toast(t.create.proTrialToast, { icon: '👑', id: 'pro-trial' });
    };

    const selectTheme = (theme: (typeof THEMES)[0]) => {
        if (!theme.free && !isPro) noteProTrial();
        updateForm({
            theme: theme.id,
            backgroundColor: theme.colors.bg,
            textColor: theme.colors.text,
            accentColor: theme.colors.accent,
        });
    };

    const selectFont = (font: (typeof GOOGLE_FONTS)[0], target: 'titleFont' | 'bodyFont') => {
        if (!font.free && !isPro) noteProTrial();
        updateForm({ [target]: font.name });
    };

    const toggleSticker = (stickerId: string) => {
        const sticker = STICKERS.find((s) => s.id === stickerId);
        if (sticker && !sticker.free && !isPro) noteProTrial();

        setFormData((prev) => {
            const exists = prev.selectedStickers.includes(stickerId);
            const maxStickers = isPro ? 10 : 3;

            if (exists) {
                return { ...prev, selectedStickers: prev.selectedStickers.filter((s) => s !== stickerId) };
            }
            if (prev.selectedStickers.length >= maxStickers) {
                toast.error(t.create.maxStickers.replace('{count}', String(maxStickers)) + (!isPro ? t.create.maxStickersProHint : ''));
                return prev;
            }
            return { ...prev, selectedStickers: [...prev.selectedStickers, stickerId] };
        });
    };

    // ---- Dropzones ----
    const onDropBackground = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                if (file.size > 15 * 1024 * 1024) {
                    toast.error(t.create.imageTooLarge);
                    return;
                }
                updateForm({ backgroundImage: file });
                setBgImagePreview(URL.createObjectURL(file));
            }
        },
        []
    );

    const onDropDecorative = useCallback(
        (acceptedFiles: File[]) => {
            const maxImages = isPro ? 5 : 1;
            const currentCount = formData.decorativeImages.length;

            if (currentCount >= maxImages) {
                toast.error(
                    t.create.maxDecorativeImages
                        .replace('{count}', String(maxImages))
                        .replace('{plural}', maxImages > 1 ? 'es' : '')
                        .replace('{plural2}', maxImages > 1 ? 's' : '')
                    + (!isPro ? t.create.maxDecorativeProHint : '')
                );
                return;
            }

            const file = acceptedFiles[0];
            if (file) {
                if (file.size > 15 * 1024 * 1024) {
                    toast.error(t.create.imageTooLarge);
                    return;
                }
                updateForm({ decorativeImages: [...formData.decorativeImages, file] });
                setDecorativeImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
            }
        },
        [formData.decorativeImages, isPro]
    );

    const onDropReference = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                toast.error(t.create.imageTooLarge);
                return;
            }
            updateForm({ referenceImage: file });
            setReferenceImagePreview(URL.createObjectURL(file));
        }
    }, []);

    const bgDropzone = useDropzone({
        onDrop: onDropBackground,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        maxFiles: 1,
    });

    const decorativeDropzone = useDropzone({
        onDrop: onDropDecorative,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        maxFiles: 1,
    });

    const referenceDropzone = useDropzone({
        onDrop: onDropReference,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        maxFiles: 1,
    });

    const removeDecorativeImage = (index: number) => {
        const newImages = [...formData.decorativeImages];
        newImages.splice(index, 1);
        const newPreviews = [...decorativeImagePreviews];
        newPreviews.splice(index, 1);
        updateForm({ decorativeImages: newImages });
        setDecorativeImagePreviews(newPreviews);
    };

    // ---- Validación ----
    // Una sola fuente de verdad, compartida por móvil y desktop: el botón de
    // publicar dice qué falta y al pulsarlo lleva al campo, en vez de avisar
    // desde una pestaña distinta a la del problema.
    const missingFields: { key: 'title' | 'recipientName'; label: string; step: Step }[] = [];
    if (!formData.title.trim()) missingFields.push({ key: 'title', label: t.create.fieldTitle, step: 'content' });
    if (!formData.recipientName.trim()) missingFields.push({ key: 'recipientName', label: t.create.fieldRecipient, step: 'content' });

    const focusMissing = () => {
        const first = missingFields[0];
        if (!first) return;
        setInvalidField(first.key);
        const el = first.key === 'title' ? titleRef.current : recipientRef.current;
        el?.focus();
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    // La marca roja desaparece en cuanto el campo deja de estar vacío.
    useEffect(() => {
        if (!invalidField) return;
        if (formData[invalidField].trim()) setInvalidField(null);
    }, [formData.title, formData.recipientName, invalidField]);

    // ---- Opciones PRO en uso por alguien sin plan PRO ----
    // Cada entrada sabe cómo quitarse, para poder publicar sin ella de un clic.
    const proSelections: { label: string; value: string; strip: () => Partial<PageFormData> }[] = [];
    if (!isPro) {
        const theme = THEMES.find((th) => th.id === formData.theme);
        if (theme && !theme.free) {
            const fallback = THEMES[0];
            proSelections.push({
                label: t.create.summaryThemeKey,
                value: t.themes[theme.id as keyof typeof t.themes] || theme.name,
                strip: () => ({ theme: fallback.id, backgroundColor: fallback.colors.bg, textColor: fallback.colors.text, accentColor: fallback.colors.accent }),
            });
        }

        // El backend valida titleFont y bodyFont por separado, así que aquí se
        // miran los dos aunque hoy sólo el del título se pueda elegir.
        const font = GOOGLE_FONTS.find((f) => f.name === formData.titleFont);
        if (font && !font.free) {
            proSelections.push({ label: t.create.fieldFont, value: font.name, strip: () => ({ titleFont: GOOGLE_FONTS[0].name }) });
        }
        const bFont = GOOGLE_FONTS.find((f) => f.name === formData.bodyFont);
        if (bFont && !bFont.free) {
            proSelections.push({ label: t.create.fieldFont, value: bFont.name, strip: () => ({ bodyFont: GOOGLE_FONTS[0].name }) });
        }

        const anim = ANIMATIONS.find((a) => a.id === formData.animation);
        if (anim && !anim.free) {
            proSelections.push({
                label: t.create.summaryAnimKey,
                value: t.animations[anim.id as keyof typeof t.animations] || anim.name,
                strip: () => ({ animation: 'hearts-falling' }),
            });
        }

        const music = BACKGROUND_MUSIC.find((m) => m.id === formData.backgroundMusic);
        if (music && !music.free) {
            proSelections.push({
                label: t.create.fieldMusic,
                value: t.music[music.id as keyof typeof t.music] || music.name,
                strip: () => ({ backgroundMusic: 'none' }),
            });
        }

        const proStickers = formData.selectedStickers.filter((id) => STICKERS.find((s) => s.id === id)?.free === false);
        if (proStickers.length > 0) {
            proSelections.push({
                label: t.create.fieldStickers,
                value: proStickers.map((id) => STICKERS.find((s) => s.id === id)?.emoji).join(' '),
                strip: () => ({ selectedStickers: formData.selectedStickers.filter((id) => STICKERS.find((s) => s.id === id)?.free !== false) }),
            });
        }

        if (formData.videoUrl.trim()) {
            proSelections.push({ label: t.create.fieldVideo, value: formData.videoUrl.trim(), strip: () => ({ videoUrl: '' }) });
        }

        if (formData.customSlug.trim()) {
            proSelections.push({ label: t.create.fieldUrlCustom, value: `/p/${formData.customSlug.trim()}`, strip: () => ({ customSlug: '' }) });
        }
    }

    // ---- Publicación ----
    /**
     * `theme` es un enum cerrado en el backend: un id desconocido rompe la
     * validación de Mongoose. Cualquier id que esta lista no reconozca viaja
     * como 'custom', que el aspecto no depende de él — lo definen
     * backgroundColor / textColor / accentColor, que es lo que el renderizador
     * lee de verdad.
     *
     * 'riso' se queda fuera a propósito: el backend ya lo acepta en el código,
     * pero hasta que ese cambio esté desplegado enviarlo rompería la
     * publicación. Una vez desplegado, añadirlo aquí es opcional y sólo cambia
     * cómo queda guardado el id.
     */
    const API_THEME_IDS = new Set([
        'romantic', 'sunset', 'ocean', 'garden', 'playful',
        'elegant', 'minimal', 'dark',
        'neon', 'vintage', 'aurora', 'cherry', 'custom',
    ]);
    const apiThemeId = (theme: string) => (API_THEME_IDS.has(theme) ? theme : 'custom');

    const publish = async (values: PageFormData) => {
        setLoading(true);
        try {
            const data = new FormData();

            // Campos básicos
            data.append('title', values.title);
            data.append('recipientName', values.recipientName);
            data.append('message', values.message);
            data.append('yesButtonText', values.yesButtonText);
            data.append('noButtonText', values.noButtonText);
            data.append('noButtonEscapes', values.noButtonEscapes.toString());
            data.append('pageType', values.pageType);
            data.append('theme', apiThemeId(values.theme));
            data.append('backgroundColor', values.backgroundColor);
            data.append('textColor', values.textColor);
            data.append('accentColor', values.accentColor);

            // Nuevos campos
            data.append('titleFont', values.titleFont);
            data.append('bodyFont', values.bodyFont);
            data.append('animation', values.animation);
            data.append('backgroundMusic', values.backgroundMusic);
            if (isPro && values.videoUrl.trim()) {
                data.append('videoUrl', values.videoUrl.trim());
            }
            data.append('selectedStickers', JSON.stringify(values.selectedStickers));
            data.append('showWatermark', values.showWatermark.toString());
            if (values.occasionDate) {
                data.append('occasionDate', values.occasionDate);
            }

            // Imágenes
            if (values.backgroundImage) {
                data.append('backgroundImage', values.backgroundImage);
            }
            values.decorativeImages.forEach((img, i) => {
                data.append(`decorativeImage_${i}`, img);
            });
            if (values.referenceImage) {
                data.append('referenceImage', values.referenceImage);
            }
            if (isPro && values.customSlug && values.customSlug.trim()) {
                data.append('customSlug', values.customSlug.trim());
            }
            const response = await api.pages.create(data);
            // La página ya vive en el servidor: el borrador local sobra y, si se
            // quedara, reaparecería la próxima vez que alguien abra el editor.
            clearDraft();
            const identifier = response.data.data.customSlug || response.data.data.shortId;
            // Antes se saltaba directo a la carta publicada. Ahora se ofrece
            // mandarla, que es lo siguiente que va a querer hacer.
            setPublished({ identifier, url: `${window.location.origin}/p/${identifier}` });
        } catch (error: any) {
            console.error('Error creating page:', error);
            toast.error(error.response?.data?.message || t.create.createError);
        } finally {
            setLoading(false);
        }
    };

    /** Quita las opciones PRO del formulario y publica lo que queda. */
    const publishWithoutPro = () => {
        const stripped = proSelections.reduce<PageFormData>(
            (acc, sel) => ({ ...acc, ...sel.strip() }),
            formData
        );
        setFormData(stripped);
        setShowProDecision(false);
        publish(stripped);
    };

    const handleSubmit = async () => {
        // La sesión aún se está resolviendo: publicar ahora pediría login a
        // alguien que quizá ya lo tiene.
        if (authLoading) return;

        // 1. Lo que falta se resuelve antes que nada, y llevando al campo.
        if (missingFields.length > 0) {
            focusMissing();
            toast.error(
                missingFields.length === 1
                    ? t.create.missingOne.replace('{field}', missingFields[0].label)
                    : t.create.missingMany.replace('{fields}', missingFields.map((f) => f.label).join(', '))
            );
            return;
        }

        // 2. Sin sesión: se pide aquí mismo y la publicación sigue al volver.
        if (!user) {
            pendingPublishRef.current = true;
            setShowLoginGate(true);
            return;
        }

        if (freeLimitReached) {
            toast.error(t.create.freeLimitReached);
            router.push('/upgrade');
            return;
        }

        if (formData.pageType === 'pro' && !isPro) {
            toast.error(t.create.needProPlan);
            setShowUpgradeModal(true);
            return;
        }

        // 3. Probó cosas PRO: ahora sabe qué son y decide.
        if (proSelections.length > 0) {
            setShowProDecision(true);
            return;
        }

        publish(formData);
    };

    // Al volver del popup de Google, retomar la publicación que lo disparó.
    useEffect(() => {
        if (user && pendingPublishRef.current) {
            pendingPublishRef.current = false;
            setShowLoginGate(false);
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Antes había aquí un spinner a pantalla completa mientras se resolvía la
    // sesión. El editor no necesita usuario para funcionar — la cuenta sólo
    // hace falta al publicar — así que bloquearlo metía una pantalla en blanco
    // y un spinner entre la landing y el editor. Ahora pinta de inmediato y
    // los datos de la cuenta (isPro, límite) llegan cuando llegan.

    // ---- Compartir ----
    const shareText = published
        ? t.create.shareMessage.replace('{name}', formData.recipientName.trim()).replace('{url}', published.url)
        : '';
    const copyPublished = async () => {
        if (!published) return;
        try {
            await navigator.clipboard.writeText(published.url);
            toast.success(t.create.shareCopied);
        } catch {
            toast.error(t.create.createError);
        }
    };
    const nativeShare = async () => {
        if (!published) return;
        try {
            await navigator.share({ title: formData.title, text: shareText, url: published.url });
        } catch {
            // Cancelado por el usuario: no es un error.
        }
    };
    const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    // ---- Steps config ----
    const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
        { key: 'content', label: t.create.stepContent, icon: <Type className="w-4 h-4" /> },
        { key: 'design', label: t.create.stepDesign, icon: <Palette className="w-4 h-4" /> },
        { key: 'media', label: t.create.stepMedia, icon: <ImageIcon className="w-4 h-4" /> },
        { key: 'effects', label: t.create.stepEffects, icon: <Sparkles className="w-4 h-4" /> },
        { key: 'preview', label: t.create.stepPublish, icon: <Eye className="w-4 h-4" /> },
    ];
    const stepIndex = steps.findIndex((s) => s.key === currentStep);

    const canGoNext = () => {
        if (currentStep === 'content') return missingFields.length === 0;
        return true;
    };

    const goNext = () => {
        if (!canGoNext()) {
            focusMissing();
            toast.error(
                missingFields.length === 1
                    ? t.create.missingOne.replace('{field}', missingFields[0].label)
                    : t.create.missingMany.replace('{fields}', missingFields.map((f) => f.label).join(', '))
            );
            return;
        }
        const nextIndex = stepIndex + 1;
        if (nextIndex < steps.length) setCurrentStep(steps[nextIndex].key);
    };

    const goBack = () => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) setCurrentStep(steps[prevIndex].key);
    };

    // ============================================================
    // RENDER
    // ============================================================
    // ---- Preview component (reutilizable) ----
    // ── Campos del formulario ─────────────────────────────────
    // Son funciones que devuelven JSX, no componentes: así el móvil y el
    // escritorio pintan exactamente los mismos controles sin duplicar markup,
    // y sin que React los desmonte en cada render (que es lo que pasaría con
    // componentes definidos aquí dentro).

    const contentFields = () => (<>
                <DField label={t.create.fieldTitle} hint={<RequiredMark filled={!!formData.title.trim()} label={t.create.requiredMark} />}>
                    <input
                        ref={titleRef}
                        value={formData.title}
                        onChange={e => updateForm({ title: e.target.value })}
                        placeholder={t.create.titlePlaceholder}
                        maxLength={200}
                        aria-required="true"
                        aria-invalid={invalidField === 'title'}
                        style={invalidField === 'title' ? dInvalid : dI}
                    />
                </DField>
                <DField label={t.create.fieldRecipient} hint={<RequiredMark filled={!!formData.recipientName.trim()} label={t.create.requiredMark} />}>
                    <input
                        ref={recipientRef}
                        value={formData.recipientName}
                        onChange={e => updateForm({ recipientName: e.target.value })}
                        placeholder={t.create.recipientPlaceholder}
                        maxLength={100}
                        aria-required="true"
                        aria-invalid={invalidField === 'recipientName'}
                        style={invalidField === 'recipientName' ? dInvalid : dI}
                    />
                </DField>
                <DField label={t.create.fieldMessage} hint={`${formData.message.length}/1000`}>
                    <textarea ref={messageRef} value={formData.message} onChange={e => updateForm({ message: e.target.value })} placeholder={t.create.messagePlaceholder} maxLength={1000} rows={5} style={{ ...dI, resize: 'none', lineHeight: 1.5, overflowY: 'auto', minHeight: 140 }} />
                </DField>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <DField label={t.create.fieldYesBtn}>
                        <input ref={yesRef} value={formData.yesButtonText} onChange={e => updateForm({ yesButtonText: e.target.value })} maxLength={50} style={dI} />
                    </DField>
                    <DField label={t.create.fieldNoBtn}>
                        <input ref={noRef} value={formData.noButtonText} onChange={e => updateForm({ noButtonText: e.target.value })} maxLength={50} style={dI} />
                    </DField>
                </div>
                {/* El «No» que escapa es la gracia del producto: se elige como una
                    opción con nombre, no escondido en una casilla. */}
                <DField label={t.create.noBehaviorLabel}>
                    <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {([
                            [false, '🙂', t.create.noBehaviorStay, t.create.noBehaviorStayDesc],
                            [true, '🏃', t.create.noBehaviorEscape, t.create.noBehaviorEscapeDesc],
                        ] as const).map(([value, emoji, title, desc]) => {
                            const active = formData.noButtonEscapes === value;
                            return (
                                <button
                                    key={String(value)}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => updateForm({ noButtonEscapes: value })}
                                    style={{
                                        textAlign: 'left', padding: '12px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer',
                                        background: active ? 'var(--accent-soft)' : 'var(--paper-2)',
                                        border: active ? '2px solid var(--accent-hex)' : '2px solid transparent',
                                        display: 'flex', flexDirection: 'column', gap: 2,
                                    }}
                                >
                                    <span style={{ fontSize: 20, lineHeight: 1.2 }}>{emoji}</span>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-black)' }}>{title}</span>
                                    <span style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.35 }}>{desc}</span>
                                </button>
                            );
                        })}
                    </div>
                    {formData.noButtonEscapes && (
                        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--accent-2-hex)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MousePointerClick style={{ width: 14, height: 14, flexShrink: 0 }} />
                            {t.create.noBehaviorTry}
                        </p>
                    )}
                </DField>
                {isPro && (
                    <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
                        <CustomSlugInput value={formData.customSlug} onChange={v => updateForm({ customSlug: v })} isPro={isPro} onUpgrade={goToUpgrade} recipientName={formData.recipientName} />
                    </div>
                )}
                {isPro && (
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'var(--paper)', border: '1px solid var(--hairline)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--mono)' }}>
                        <input type="checkbox" checked={formData.pageType === 'pro'} onChange={e => updateForm({ pageType: e.target.checked ? 'pro' : 'free' })} style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--accent-hex)' }} />
                        <div>
                            <span style={{ fontWeight: 700, letterSpacing: 0, textTransform: 'none' }}>{t.create.useAI}</span>
                            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.4 }}>{t.create.useAIDesc}</p>
                        </div>
                    </label>
                )}
    </>);

    /**
     * Paletas a la vista, justo después de lo obligatorio. Antes vivían dentro
     * de un acordeón plegado y había quien no sabía que se podía cambiar el
     * color de la carta.
     */
    const styleStrip = () => (
        <DField
            label={t.create.quickStyleLabel}
            hint={
                <button
                    type="button"
                    onClick={() => openTab('design')}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent-2-hex)', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 2 }}
                >
                    {t.create.quickStyleMore}
                    <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
            }
        >
            <div ref={styleStripRef} style={{ position: 'relative', display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 2px 6px', margin: '0 -2px' }}>
                {THEMES.map((theme) => {
                    const active = formData.theme === theme.id;
                    const name = t.themes[theme.id as keyof typeof t.themes] || theme.name;
                    return (
                        <button
                            key={theme.id}
                            type="button"
                            onClick={() => selectTheme(theme)}
                            aria-pressed={active}
                            title={name}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: 58 }}
                        >
                            <span
                                style={{
                                    position: 'relative', width: 46, height: 46, borderRadius: 999,
                                    background: `linear-gradient(135deg, ${theme.colors.bg} 50%, ${theme.colors.accent} 50%)`,
                                    border: '1px solid var(--rule)',
                                    boxShadow: active ? '0 0 0 2px var(--paper-soft), 0 0 0 4px var(--accent-hex)' : 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: theme.colors.text, fontSize: 15, fontWeight: 700,
                                }}
                            >
                                Aa
                                {!theme.free && !isPro && (
                                    <Crown style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, padding: 2, borderRadius: 999, background: 'var(--ink-black)', color: 'var(--paper)' }} />
                                )}
                            </span>
                            <span style={{ fontSize: 13, lineHeight: 1.2, color: active ? 'var(--ink-black)' : 'var(--ink-soft)', fontWeight: active ? 700 : 500, textAlign: 'center' }}>{name}</span>
                        </button>
                    );
                })}
            </div>
        </DField>
    );

    const textContrast = contrastRatio(formData.textColor, formData.backgroundColor);
    const readableText = contrastRatio('#1b1721', formData.backgroundColor) >= contrastRatio('#ffffff', formData.backgroundColor) ? '#1b1721' : '#ffffff';

    const themeFields = () => (<>
                <DField label={t.create.fieldColors}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {(['bg', 'text', 'accent'] as const).map(ct => {
                            const labels = { bg: t.create.colorBg, text: t.create.colorText, accent: t.create.colorAccent };
                            const ck = colorKeyMap[ct];
                            const val = formData[ck] as string;
                            return (
                                <div key={ct}>
                                    <span className="mono-eyebrow" style={{ fontSize: 15, color: 'var(--ink-soft)', display: 'block', marginBottom: 4 }}>{labels[ct]}</span>
                                    <button
                                        onClick={() => setShowColorPicker(showColorPicker === ct ? null : ct)}
                                        style={{ width: '100%', height: 40, border: '1px solid var(--hairline)', background: val, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <span style={{ fontSize: 15, fontFamily: 'var(--mono)', color: 'white', mixBlendMode: 'difference' }}>{val}</span>
                                    </button>
                                    {showColorPicker === ct && (
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'fixed', inset: 0, zIndex: 19 }} onClick={() => setShowColorPicker(null)} />
                                            <div style={{ position: 'absolute', zIndex: 20, marginTop: 8 }}>
                                                <HexColorPicker color={val} onChange={c => updateForm({ [ck]: c })} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* El título usa el color elegido tal cual: si no se lee, se
                        avisa y se ofrece arreglarlo, en vez de cambiarlo a escondidas. */}
                    {textContrast < 4.5 && (
                        <div role="alert" style={{ marginTop: 10, padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--destructive-soft)', border: '1px solid var(--destructive-border)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 14, color: 'var(--ink-black)' }}>
                            <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--destructive-hex)' }} />
                            <span style={{ flex: 1, minWidth: 160 }}>{t.create.lowContrast.replace('{ratio}', textContrast.toFixed(1))}</span>
                            <button
                                type="button"
                                onClick={() => updateForm({ textColor: readableText })}
                                style={{ border: 'none', borderRadius: 999, padding: '6px 12px', background: readableText, color: formData.backgroundColor, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                            >
                                {t.create.lowContrastFix}
                            </button>
                        </div>
                    )}
                </DField>

                <DField label={t.create.fieldFont}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                        {GOOGLE_FONTS.map(font => (
                            <div key={font.name} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => selectFont(font, 'titleFont')}
                                    style={{
                                        width: '100%', padding: '10px 12px',
                                        border: formData.titleFont === font.name ? '2px solid var(--accent-hex)' : '1px solid var(--hairline)',
                                        background: 'var(--paper)', cursor: 'pointer', textAlign: 'left',
                                    }}
                                >
                                    <span className="mono-eyebrow" style={{ fontSize: 15, color: 'var(--ink-soft)', display: 'block', marginBottom: 4 }}>{font.name}</span>
                                    <span style={{ fontSize: 22, fontFamily: titleFontFamily(font.name), display: 'block' }}>Aa Bb Cc</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </DField>
    </>);

    const mediaFields = () => (<>
                <DField label={t.create.fieldBgImage}>
                    <div {...bgDropzone.getRootProps()} style={{ border: '2px dashed var(--ink)', borderRadius: 10, padding: 16, textAlign: 'center', cursor: 'pointer', background: bgDropzone.isDragActive ? 'var(--lila-soft)' : 'var(--paper)', boxShadow: 'var(--shadow-card)' }}>
                        <input {...bgDropzone.getInputProps()} />
                        {bgImagePreview ? (
                            <div>
                                <img src={bgImagePreview} alt="Fondo" style={{ maxHeight: 90, borderRadius: 10, margin: '0 auto', display: 'block' }} />
                                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6 }}>{t.create.bgImageChange}</p>
                            </div>
                        ) : (
                            <div>
                                <Upload style={{ width: 26, height: 26, margin: '0 auto 6px', color: 'var(--ink-soft)' }} />
                                <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{t.create.bgImageDrop}</p>
                            </div>
                        )}
                    </div>
                    {bgImagePreview && (
                        <button onClick={() => { updateForm({ backgroundImage: null }); setBgImagePreview(null); }} style={{ marginTop: 6, fontSize: 14, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Trash2 style={{ width: 11, height: 11 }} /> {t.create.bgImageRemove}
                        </button>
                    )}
                </DField>

                <DField label={t.create.fieldStickers} hint={`${formData.selectedStickers.length}/${isPro ? 10 : 3}`}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                        {STICKERS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => toggleSticker(s.id)}
                                style={{
                                    aspectRatio: '1', border: '1px solid var(--hairline)', borderRadius: 10,
                                    background: formData.selectedStickers.includes(s.id) ? 'var(--lila)' : 'white',
                                    cursor: 'pointer', fontSize: 22,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: formData.selectedStickers.includes(s.id) ? '3px 3px 0 var(--ink)' : '2px 2px 0 var(--ink)', position: 'relative',
                                }}
                            >
                                {s.emoji}
                            </button>
                        ))}
                    </div>
                </DField>

                <DField label={t.create.fieldDecorative} hint={<span style={{ fontSize: 15, padding: '2px 8px', background: 'var(--lila-soft)', border: '1px solid var(--ink)', borderRadius: 10 }}>{!isPro ? t.create.decorativeHintFree : t.create.decorativeHintPro}</span>}>
                    {decorativeImagePreviews.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                            {decorativeImagePreviews.map((p, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <img src={p} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--hairline)', display: 'block' }} />
                                    <button onClick={() => removeDecorativeImage(i)} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#ef4444', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div {...decorativeDropzone.getRootProps()} style={{ border: '2px dashed var(--ink)', borderRadius: 10, padding: 12, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: 'var(--shadow-card)', background: 'var(--paper)' }}>
                        <input {...decorativeDropzone.getInputProps()} />
                        <Plus style={{ width: 18, height: 18, color: 'var(--ink-soft)' }} />
                        <span style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{t.create.decorativeAdd}</span>
                    </div>
                </DField>
    </>);

    const effectsFields = () => (<>
                <DField label={t.create.fieldParticles}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                        {ANIMATIONS.map(anim => (
                            <div key={anim.id} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => { if (!anim.free && !isPro) noteProTrial(); updateForm({ animation: anim.id }); }}
                                    style={{
                                        aspectRatio: '1', width: '100%',
                                        border: formData.animation === anim.id ? '2px solid var(--accent-hex)' : '1px solid var(--hairline)',
                                        background: 'var(--paper)', cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                                    }}
                                >
                                    <span style={{ fontSize: 22, color: 'var(--accent-hex)' }}>{anim.emoji}</span>
                                    <span className="mono-eyebrow" style={{ fontSize: 13, lineHeight: 1.15, textAlign: 'center', padding: '0 4px', color: 'var(--ink-soft)' }}>{t.animations[anim.id as keyof typeof t.animations] || anim.name}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </DField>

                <DField label={t.create.fieldMusic}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {BACKGROUND_MUSIC.map(music => (
                            <button
                                key={music.id}
                                onClick={() => { if (!music.free && !isPro) noteProTrial(); updateForm({ backgroundMusic: music.id }); }}
                                style={{
                                    padding: '10px 12px',
                                    border: formData.backgroundMusic === music.id ? '2px solid var(--accent-hex)' : '1px solid var(--hairline)',
                                    background: 'var(--paper)',
                                    cursor: 'pointer', textAlign: 'left', fontSize: 14, fontFamily: 'var(--mono)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}
                            >
                                <span>{t.music[music.id as keyof typeof t.music] || music.name}</span>
                                {formData.backgroundMusic === music.id && <CheckCircle2 style={{ width: 12, height: 12, color: 'var(--accent-hex)' }} />}
                            </button>
                        ))}
                    </div>
                </DField>

                <DField label={t.create.fieldVideo}>
                    <input
                        type="url"
                        placeholder="https://youtube.com/..."
                        value={formData.videoUrl}
                        onChange={e => {
                            if (!isPro && e.target.value && !formData.videoUrl) noteProTrial();
                            updateForm({ videoUrl: e.target.value });
                        }}
                        style={dI}
                    />
                </DField>
    </>);

    const linkFields = () => (<>
                {/* El slug se puede escribir sin PRO: se ve en la insignia de
                    URL del lienzo y se decide al publicar, como el resto. */}
                <DField label={t.create.fieldUrlCustom}>
                    <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--hairline)', background: 'var(--paper)', overflow: 'hidden' }}>
                        <span style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink-soft)', borderRight: '1px solid var(--hairline)', background: 'var(--paper-3)', flexShrink: 0 }}>lovepages.ink/p/</span>
                        <input
                            value={formData.customSlug}
                            onChange={e => {
                                if (!isPro && e.target.value && !formData.customSlug) noteProTrial();
                                updateForm({ customSlug: e.target.value });
                            }}
                            style={{ ...dI, border: 'none', flex: 1, color: 'var(--accent-hex)' }}
                            placeholder={formData.recipientName.trim() ? suggestedSlug : t.create.slugPlaceholder}
                        />
                    </div>
                </DField>

                {/* La fecha alimenta el recordatorio anual: es lo que
                    da un motivo para volver fuera de San Valentín. */}
                <DField label={t.create.fieldOccasion} hint={t.create.occasionHint}>
                    <input
                        type="date"
                        value={formData.occasionDate}
                        onChange={e => updateForm({ occasionDate: e.target.value })}
                        style={dI}
                    />
                    <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>
                        {t.create.occasionHelp}
                    </p>
                </DField>

                <DField label={t.create.fieldPrivacy}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ padding: 12, border: '2px solid var(--accent-hex)', background: 'var(--paper)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 18 }}>🔓</span>
                            <div>
                                <div style={{ fontSize: 15, fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>{t.create.privacyPublic}</div>
                                <div style={{ fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{t.create.privacyPublicDesc}</div>
                            </div>
                        </label>
                        {/* Todavía no existe: se enseña, pero no se ofrece como si se pudiera elegir. */}
                        <div aria-disabled="true" style={{ padding: 12, border: '1.5px dashed var(--rule)', background: 'transparent', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.6, cursor: 'not-allowed' }}>
                            <span style={{ fontSize: 18, filter: 'grayscale(1)' }}>🔒</span>
                            <div>
                                <div style={{ fontSize: 15, fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'none', letterSpacing: 0, color: 'var(--ink-soft)' }}>{t.create.privacyCode}</div>
                                <div style={{ fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{t.create.privacyCodeDesc}</div>
                            </div>
                        </div>
                    </div>
                </DField>

                <div style={{ padding: 14, background: 'var(--paper)', border: '1px solid var(--hairline)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                        { k: t.create.summaryTitleKey, v: formData.title || '—', missing: !formData.title.trim() },
                        { k: t.create.summaryForKey, v: formData.recipientName || '—', missing: !formData.recipientName.trim() },
                        { k: t.create.summaryThemeKey, v: t.themes[formData.theme as keyof typeof t.themes] || THEMES.find(th => th.id === formData.theme)?.name || '—', missing: false },
                        { k: t.create.summaryAnimKey, v: t.animations[formData.animation as keyof typeof t.animations] || ANIMATIONS.find(a => a.id === formData.animation)?.name || '—', missing: false },
                    ].map(({ k, v, missing }) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 14, fontFamily: 'var(--mono)' }}>
                            <span style={{ color: 'var(--ink-soft)', textTransform: 'none', letterSpacing: 0 }}>{k}</span>
                            {/* Un campo obligatorio vacío no puede parecerse a uno opcional vacío */}
                            {missing ? (
                                <button
                                    onClick={focusMissing}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent-hex)', fontWeight: 700, fontFamily: 'var(--mono)', fontSize: 14, textDecoration: 'underline' }}
                                >
                                    <AlertCircle style={{ width: 11, height: 11 }} />
                                    {t.create.requiredMark}
                                </button>
                            ) : (
                                <span style={{ fontWeight: 700, textAlign: 'right' }}>{v}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* La caducidad se cuenta aquí, junto al enlace que se va a
                    mandar, y no como aviso descartable antes de escribir nada. */}
                {!isPro && (
                    <div style={{ padding: 14, background: 'var(--paper-2)', border: '1px solid var(--hairline)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Clock style={{ width: 14, height: 14, color: 'var(--accent-hex)' }} />
                            <span className="mono-eyebrow" style={{ fontSize: 14, letterSpacing: 0, color: 'var(--ink-black)' }}>{t.create.expirationLinkTitle}</span>
                        </div>
                        <p style={{ fontSize: 14, fontFamily: 'var(--mono)', lineHeight: 1.5, color: 'var(--ink-soft)', margin: 0 }}>
                            {t.create.expirationLinkDesc}
                        </p>
                        <button onClick={goToUpgrade} style={{ marginTop: 2, width: '100%', padding: '9px 14px', background: 'var(--accent-hex)', color: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', boxShadow: 'var(--shadow-card)' }}>
                            {t.create.expirationLinkCta}
                        </button>
                    </div>
                )}

                <div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || freeLimitReached}
                        style={{ width: '100%', padding: '12px 20px', background: freeLimitReached ? '#ccc' : 'var(--accent-hex)', color: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 10, cursor: freeLimitReached ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: 0, boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: freeLimitReached ? 0.5 : 1 }}
                    >
                        <Sparkles style={{ width: 16, height: 16 }} />
                        {loading ? t.create.publishing : t.create.publishPageBtn}
                    </button>
                    {missingFields.length > 0 && (
                        <p style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--accent-hex)', letterSpacing: 0 }}>
                            <AlertCircle style={{ width: 11, height: 11 }} />
                            {t.create.missingHint.replace('{fields}', missingFields.map((f) => f.label).join(' + '))}
                        </p>
                    )}
                </div>
    </>);

    /**
     * El marco del dispositivo con la carta dentro.
     *
     * `forceId` lo usa la vista previa de móvil: allí no se enseña el selector
     * de dispositivo, así que meter una maqueta de escritorio dentro de un
     * teléfono no tendría sentido.
     */
    const previewFrame = (forceId?: PreviewDeviceId) => {
        const wanted = forceId ?? previewDevice;
        const device = PREVIEW_DEVICES.find((d) => d.id === wanted) ?? PREVIEW_DEVICES[0];
        return (
            <div
                style={{
                    position: 'relative',
                    // El marco se encoge para caber en el hueco sin deformar la
                    // proporción del dispositivo.
                    aspectRatio: `${device.width} / ${device.height}`,
                    width: device.width, maxWidth: '100%', maxHeight: '100%',
                    background: '#1b1721', borderRadius: device.radius, padding: 10,
                    flexShrink: 1, zIndex: 1,
                    boxShadow: '0 24px 60px -20px rgba(73, 74, 95, 0.35)',
                }}
            >
                <div style={{ width: '100%', height: '100%', borderRadius: Math.max(0, device.radius - 8), overflow: 'hidden' }}>
                    {previewContent()}
                </div>
                {device.notch && (
                    <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: '#1b1721', borderRadius: 999, zIndex: 10, pointerEvents: 'none' }} />
                )}
            </div>
        );
    };

    const previewContent = () => {
        const recipient = formData.recipientName || t.create.previewDefaultRecipient;
        const customBodyFont = formData.bodyFont !== DEFAULT_FONT;
        const stk = formData.selectedStickers.slice(0, 3).map(
            (id) => STICKERS.find((s) => s.id === id)?.emoji ?? ''
        );
        return (
            <div
                style={{
                    // La paleta elegida redefine las variables aquí dentro,
                    // así que todo lo de abajo se tiñe solo.
                    ...pageThemeVars(formData),
                    width: '100%', height: '100%',
                    background: 'var(--paper)',
                    position: 'relative', overflow: 'hidden',
                    fontFamily: 'var(--sans)', color: 'var(--ink-black)',
                }}
            >
                {/* Imagen de fondo: se ve de verdad, con un velo de papel encima
                    para que el texto siga siendo legible. */}
                {bgImagePreview && (
                    <>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0 }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', opacity: 0.68, pointerEvents: 'none', zIndex: 1 }} />
                    </>
                )}
                {/* Partículas — mismo componente que la página publicada, para que
                    lo que se elige aquí sea exactamente lo que se va a ver. */}
                {hasParticles(formData.animation) && (
                    <ParticleCanvas kind={animToKind(formData.animation)} density={0.4} />
                )}
                {/* Halo del acento: sustituye a los dos círculos de tinta
                    superpuesta, que sólo tenían sentido en la estética riso. */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute', top: '-22%', right: '-28%', width: 300, height: 300,
                        background: 'radial-gradient(closest-side, var(--melocoton-2), transparent 72%)',
                        pointerEvents: 'none', zIndex: 2,
                    }}
                />

                {/* Top chrome */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, padding: '5px 12px', borderRadius: 999, color: 'var(--ink-soft)', background: 'var(--paper-2)' }}>
                        lovepages.ink
                    </div>
                    {formData.backgroundMusic !== 'none' && (
                        <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--paper-2)', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>♪</span>
                    )}
                </div>

                {/* Cuerpo de la carta.
                    Va centrado cuando el texto es corto y desplazable cuando no
                    cabe: con `justify-content: center` a secas, un mensaje largo
                    se salía por arriba y por abajo del marco. `margin: auto` en
                    el hijo hace las dos cosas sin romper el scroll. */}
                <div data-preview-body style={{ position: 'absolute', inset: 0, display: 'flex', overflowY: 'auto', zIndex: 3 }}>
                    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 20px 92px', textAlign: 'center', width: '100%' }}>
                    {/* Eyebrow */}
                    <div style={{ marginBottom: 16 }}>
                        <span
                            className="lp-editable"
                            onClick={() => editField('recipientName')}
                            style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: 'var(--melocoton)', color: 'var(--ink-red-ink)', fontSize: 13, fontWeight: 600 }}
                        >
                            {t.create.previewForLabel} {recipient}
                        </span>
                    </div>

                    {/* Stickers + title (stickers float absolutely around title) */}
                    <div style={{ position: 'relative' }}>
                        {stk[0] && <span style={{ position: 'absolute', left: -22, top: 4, fontSize: 18, color: 'var(--accent-hex)', transform: 'rotate(-18deg)' }}>{stk[0]}</span>}
                        {stk[1] && <span style={{ position: 'absolute', right: -18, top: -8, fontSize: 16, color: 'var(--ink-black)', transform: 'rotate(14deg)' }}>{stk[1]}</span>}
                        <h1
                            className="lp-editable"
                            onClick={() => editField('title')}
                            style={{
                                fontFamily: titleFontFamily(formData.titleFont),
                                fontWeight: 700,
                                lineHeight: 1.15,
                                letterSpacing: '-0.025em',
                                color: 'var(--ink-black)',
                                fontSize: 40, margin: 0, maxWidth: 260,
                                textShadow: LETTER_TEXT_HALO,
                            }}
                        >
                            {formData.title || t.create.previewDefaultTitle}
                        </h1>
                    </div>

                    {/* Message */}
                    <div
                        className="lp-editable"
                        onClick={() => editField('message')}
                        style={{ marginTop: 16, fontFamily: bodyFontFamily(formData.bodyFont), fontSize: 15, color: 'var(--ink-soft)', maxWidth: 240, lineHeight: 1.6, whiteSpace: 'pre-wrap', textShadow: LETTER_TEXT_HALO }}
                    >
                        {formData.message ? renderMsg(formData.message) : t.create.previewMessagePlaceholder}
                    </div>

                    {/* Decorative images */}
                    {decorativeImagePreviews.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {decorativeImagePreviews.slice(0, 3).map((src, i) => (
                                <img key={i} src={src} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 12 }} />
                            ))}
                        </div>
                    )}

                    {/* Sender */}
                    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 14, height: 1, background: 'var(--ink-red-ink)' }} />
                        <span style={{ fontFamily: 'var(--hand)', fontSize: 18, color: 'var(--ink-red-ink)' }}>{t.create.previewFrom}</span>
                        {stk[2] && <span style={{ fontSize: 14 }}>{stk[2]}</span>}
                    </div>

                    {/* CTA */}
                    {/* Sin partir el texto de los botones: si no caben juntos,
                        uno baja debajo del otro. */}
                    <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, alignItems: 'center' }}>
                        <button
                            type="button"
                            className="btn-accent lp-editable"
                            onClick={() => editField('yes')}
                            style={{ fontSize: 14, padding: '10px 20px', cursor: 'text', whiteSpace: 'nowrap' }}
                        >
                            {formData.yesButtonText || t.common.yes}
                        </button>
                        <PreviewNoButton
                            label={formData.noButtonText || t.common.no}
                            escapes={formData.noButtonEscapes}
                            onEdit={() => editField('no')}
                        />
                    </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * El enlace que se va a mandar. Sin URL personalizada es un código
     * aleatorio que no existe hasta publicar, así que se dice eso en vez de
     * enseñar un «—» y un botón de copiar que copiaba un enlace roto.
     */
    const linkPill = () => (
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '8px 10px 8px 16px', borderRadius: 'var(--r-pill)', background: 'var(--paper-soft)', boxShadow: 'var(--shadow-soft)', fontSize: 14 }}>
            <span style={{ color: 'var(--ink-soft)' }}>{t.create.linkPillLabel}</span>
            <span style={{ color: 'var(--ink-faint)' }}>
                lovepages.ink/p/
                {formData.customSlug.trim()
                    ? <span style={{ color: 'var(--accent-2-hex)', fontWeight: 600 }}>{formData.customSlug.trim()}</span>
                    : <em style={{ fontStyle: 'normal' }}>… ({t.create.linkRandom})</em>}
            </span>
            {!formData.customSlug.trim() && (
                <button
                    type="button"
                    onClick={() => {
                        if (isPro) updateForm({ customSlug: suggestedSlug });
                        openTab('preview');
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: 'none', borderRadius: 'var(--r-pill)', background: 'var(--accent-soft)', color: 'var(--accent-2-hex)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                    {!isPro && <Crown style={{ width: 12, height: 12 }} />}
                    {isPro ? `/p/${suggestedSlug}` : t.create.linkProHint.replace('{slug}', suggestedSlug)}
                </button>
            )}
        </div>
    );

    // ── Render ───────────────────────────────────────────────────
    return (
        <>
        {/* ═══════════════════════════════════════════════════════
            EDITOR — un solo layout responsive
            Antes había dos árboles completos (uno por breakpoint) que
            renderizaban los mismos campos con markup distinto. Ahora la
            diferencia entre móvil y escritorio es sólo la rejilla.
        ═══════════════════════════════════════════════════════ */}
        <div
            style={{
                background: 'var(--paper)', color: 'var(--ink-black)',
                minHeight: 'var(--app-h)', display: 'flex', flexDirection: 'column',
                fontFamily: 'var(--sans)',
            }}
            className="lg:h-screen lg:overflow-hidden"
        >
            {/* ── Barra superior ──
                Fija en móvil: es donde viven «Vista previa» y «Publicar», y con
                el formulario largo se perdían de vista al primer scroll. En
                escritorio el contenedor ya no desplaza, así que `sticky` no
                cambia nada allí. */}
            <header
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: 12, padding: '12px 16px', flexShrink: 0,
                    position: 'sticky', top: 0, zIndex: 40,
                    background: 'var(--surface-blur)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--hairline)',
                }}
                className="sm:px-6"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <Link href="/dashboard" aria-label={t.create.backToPages} style={{ lineHeight: 0, color: 'var(--ink-soft)', flexShrink: 0 }}>
                        <ArrowLeft style={{ width: 18, height: 18 }} />
                    </Link>
                    <span className="hidden sm:inline" style={{ width: 1, height: 18, background: 'var(--rule)', flexShrink: 0 }} />
                    <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formData.title || t.create.newLetter}
                    </span>
                    <span className="hidden sm:inline" style={{ padding: '5px 12px', fontSize: 14, fontWeight: 600, borderRadius: 'var(--r-pill)', background: 'var(--paper-2)', color: 'var(--ink-soft)', flexShrink: 0 }}>
                        {t.create.draftBadge}
                    </span>
                    {isPro && <ProBadge />}
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                    {savedLabel && (
                        <span className="hidden sm:inline-flex" style={{ alignItems: 'center', gap: 5, fontSize: 14, color: 'var(--ink-faint)' }}>
                            <Check style={{ width: 13, height: 13 }} />
                            {savedLabel}
                        </span>
                    )}
                    {savedLabel && (
                        <button
                            onClick={discardDraft}
                            title={t.create.draftDiscard}
                            className="hidden sm:flex"
                            style={{ width: 36, height: 36, border: 'none', borderRadius: 10, background: 'var(--paper-2)', cursor: 'pointer', color: 'var(--ink-soft)', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <RotateCcw style={{ width: 15, height: 15 }} />
                        </button>
                    )}

                    {/* Estado: la señal de «ya puedes publicar» es lo que le dice
                        al usuario que las 4 secciones de abajo son opcionales. */}
                    {freeLimitReached ? (
                        <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{t.create.limitReached}</span>
                    ) : missingFields.length > 0 ? (
                        <button
                            onClick={focusMissing}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, color: 'var(--ink-soft)' }}
                        >
                            <AlertCircle style={{ width: 14, height: 14 }} />
                            <span className="hidden sm:inline">
                                {t.create.missingHint.replace('{fields}', missingFields.map((f) => f.label).join(' + '))}
                            </span>
                        </button>
                    ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--accent-2-hex)' }}>
                            <CheckCircle2 style={{ width: 15, height: 15 }} />
                            <span className="hidden sm:inline">{t.create.readyToPublish}</span>
                        </span>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || freeLimitReached}
                        className="btn-accent"
                        style={{ padding: '10px 20px', fontSize: 15 }}
                    >
                        {loading ? t.create.publishing : t.create.publishBtn}
                    </button>
                </div>
            </header>

            {/* ── Cuerpo ── */}
            <div className="flex-1 lg:grid lg:grid-cols-[1fr_440px] lg:overflow-hidden">

                {/* ── Lienzo ──
                    Sólo en escritorio, donde hay sitio para que la carta y los
                    campos convivan. En móvil la maqueta encogida sobre el
                    formulario no se leía: allí se abre a pantalla completa. */}
                <main
                    className="relative hidden lg:flex lg:h-full lg:p-7"
                    style={{ background: 'var(--paper)', flexDirection: 'column', alignItems: 'center', gap: 18, overflow: 'hidden' }}
                >
                    {/* Controles arriba, carta en medio y enlace debajo, en flujo:
                        como capas absolutas se montaban sobre el marco en
                        pantallas bajas. */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', flexShrink: 0 }}>
                    <div
                        role="group"
                        aria-label={t.create.canvasDevice}
                        style={{ display: 'flex', gap: 6, padding: 5, borderRadius: 'var(--r-pill)', background: 'var(--paper-2)' }}
                    >
                        {PREVIEW_DEVICES.map((device) => {
                            const Icon = device.icon;
                            const active = previewDevice === device.id;
                            return (
                                <button
                                    key={device.id}
                                    onClick={() => setPreviewDevice(device.id)}
                                    aria-pressed={active}
                                    style={{
                                        height: 34, padding: '0 12px', gap: 6, fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 999,
                                        background: active ? 'var(--paper-soft)' : 'transparent',
                                        boxShadow: active ? 'var(--shadow-soft)' : 'none',
                                        color: active ? 'var(--accent-2-hex)' : 'var(--ink-soft)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 140ms',
                                    }}
                                >
                                    <Icon style={{ width: 16, height: 16 }} />
                                    {t.create[device.labelKey]}
                                </button>
                            );
                        })}
                    </div>

                    {/* Pista: la carta también es un control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--r-pill)', background: 'var(--paper-2)', color: 'var(--ink-soft)', fontSize: 14 }}>
                        <MousePointerClick style={{ width: 14, height: 14 }} />
                        {t.create.previewEditHint}
                    </div>
                    </div>

                    <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {previewFrame()}
                    </div>

                    {/* Enlace que se va a compartir */}
                    <div style={{ flexShrink: 0 }}>{linkPill()}</div>
                </main>

                {/* ── Formulario ── */}
                <aside
                    style={{ background: 'var(--paper-soft)', display: 'flex', flexDirection: 'column' }}
                    className="lg:border-l lg:border-hairline lg:overflow-y-auto"
                >
                    <div
                        style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}
                        className="pb-28 sm:p-6 sm:pb-28 lg:pb-6"
                        onFocusCapture={(e) => { if (isTextInput(e.target)) setTyping(true); }}
                        onBlurCapture={(e) => { if (isTextInput(e.target)) setTyping(false); }}
                    >

                        {/* Borrador recuperado */}
                        {restoredNotice && (
                            <div style={{ padding: '13px 16px', background: 'var(--paper-2)', border: 'none', borderRadius: 'var(--r-md)', fontSize: 15, display: 'flex', gap: 10, alignItems: 'flex-start', lineHeight: 1.5 }}>
                                <RotateCcw style={{ width: 15, height: 15, flexShrink: 0, marginTop: 3, color: 'var(--ink-soft)' }} />
                                <span style={{ flex: 1 }}>
                                    {restoredNotice.hadImages ? t.create.draftRestoredImages : t.create.draftRestored}{' '}
                                    <button onClick={discardDraft} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent-2-hex)', fontWeight: 600, fontSize: 15 }}>
                                        {t.create.draftStartOver}
                                    </button>
                                </span>
                                <button onClick={() => setRestoredNotice(null)} aria-label={t.create.close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-soft)', padding: 0, lineHeight: 1 }}>×</button>
                            </div>
                        )}

                        {/* Único punto de upsell: aparece sólo si hay algo PRO en uso */}
                        {proSelections.length > 0 && (
                            <button
                                onClick={() => setShowProDecision(true)}
                                style={{ padding: '13px 16px', background: 'var(--accent-soft)', border: 'none', borderRadius: 'var(--r-md)', fontSize: 15, display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'var(--ink-black)' }}
                            >
                                <Crown style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--accent-hex)' }} />
                                <span style={{ flex: 1, lineHeight: 1.5 }}>
                                    {proSelections.length === 1
                                        ? t.create.proTrialBarOne
                                        : t.create.proTrialBarMany.replace('{n}', String(proSelections.length))}
                                </span>
                                <span style={{ color: 'var(--accent-2-hex)', fontWeight: 600, whiteSpace: 'nowrap' }}>{t.create.proTrialBarCta}</span>
                            </button>
                        )}

                        {/* ── Lo necesario ── */}
                        {/* La ocasión decide título, mensaje, botones y estilo de
                            partida: es la primera decisión, no la carta de
                            San Valentín para todo. */}
                        <DField label={t.create.occasionLabel}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {OCCASIONS.map(({ id }) => {
                                    const active = activeOccasion === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => applyOccasion(id)}
                                            style={{
                                                padding: '9px 14px', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 15, fontWeight: 600,
                                                border: 'none',
                                                background: active ? 'var(--accent-hex)' : 'var(--paper-2)',
                                                color: active ? 'var(--on-accent-default)' : 'var(--ink-black)',
                                            }}
                                        >
                                            {presets[id].label}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    aria-pressed={isBlank}
                                    onClick={startBlank}
                                    style={{
                                        padding: '9px 14px', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 15, fontWeight: 600,
                                        border: '1px dashed var(--lila-2)',
                                        background: isBlank ? 'var(--accent-soft)' : 'transparent',
                                        color: 'var(--ink-soft)',
                                    }}
                                >
                                    {t.create.occasionBlank}
                                </button>
                            </div>
                        </DField>

                        {contentFields()}
                        {styleStrip()}

                        {/* ── Lo opcional ──
                            Plegado por defecto: si esto estuviera abierto, las 82
                            opciones volverían a pesar lo mismo que los 2 campos
                            que de verdad hacen falta para publicar. */}
                        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div>
                                <h2 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 17, margin: 0, color: 'var(--ink-black)' }}>
                                    {t.create.customizeTitle}
                                </h2>
                                <p style={{ fontSize: 14, color: 'var(--ink-faint)', margin: '4px 0 0' }}>{t.create.customizeDesc}</p>
                            </div>

                            {(() => {
                                const tabs = [
                                    ['design', t.create.tabDesign, Palette, themeFields],
                                    ['media', t.create.tabMedia, ImageIcon, mediaFields],
                                    ['effects', t.create.tabEffects, Sparkles, effectsFields],
                                    ['preview', t.create.tabLink, Link2, linkFields],
                                ] as const;
                                const current = tabs.find(([id]) => id === openSection) ?? tabs[0];
                                return (
                                    <div ref={tabsRef} style={{ scrollMarginTop: 80 }}>
                                        <div role="tablist" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: 4, borderRadius: 'var(--r-md)', background: 'var(--paper-2)' }}>
                                            {tabs.map(([id, label, Icon]) => {
                                                const active = openSection === id;
                                                return (
                                                    <button
                                                        key={id}
                                                        role="tab"
                                                        aria-selected={active}
                                                        onClick={() => setOpenSection(id)}
                                                        style={{
                                                            flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                            padding: '9px 12px', border: 'none', borderRadius: 10, cursor: 'pointer',
                                                            fontSize: 15, fontWeight: 600, fontFamily: 'var(--sans)', whiteSpace: 'nowrap',
                                                            background: active ? 'var(--paper-soft)' : 'transparent',
                                                            boxShadow: active ? 'var(--shadow-soft)' : 'none',
                                                            color: active ? 'var(--accent-2-hex)' : 'var(--ink-soft)',
                                                        }}
                                                    >
                                                        <Icon style={{ width: 15, height: 15 }} />
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div role="tabpanel" style={{ padding: '18px 2px 4px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                                            {current[3]()}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </aside>
            </div>
        </div>

        {/* ── Móvil: la carta siempre a un toque ──
            Antes era un icono de ojo sin texto en la cabecera. Se aparta
            mientras se escribe para no tapar el campo con el teclado abierto. */}
        {!showPreview && !typing && (
            <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex lg:hidden"
                style={{
                    position: 'fixed', left: '50%', bottom: 'calc(18px + env(safe-area-inset-bottom))', transform: 'translateX(-50%)', zIndex: 45,
                    alignItems: 'center', gap: 10, padding: '8px 20px 8px 8px',
                    border: 'none', borderRadius: 'var(--r-pill)', cursor: 'pointer',
                    background: 'var(--ink-black)', color: 'var(--paper)',
                    boxShadow: '0 12px 28px -10px rgba(27, 23, 33, 0.55)',
                    fontSize: 16, fontWeight: 700, fontFamily: 'var(--sans)', whiteSpace: 'nowrap',
                }}
            >
                {/* Miniatura de la carta con su paleta */}
                <span
                    aria-hidden="true"
                    style={{
                        width: 34, height: 34, borderRadius: 999, flexShrink: 0,
                        background: formData.backgroundColor, border: `3px solid ${formData.accentColor}`,
                        color: formData.textColor, fontSize: 12, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    Aa
                </span>
                {t.create.seeMyLetter}
                <Eye style={{ width: 17, height: 17, opacity: 0.8 }} />
            </button>
        )}

        {/* ═══════════════════════════════════════════════════════
            VISTA PREVIA A PANTALLA COMPLETA (móvil)
            La carta se mira sola, sin el formulario alrededor.
        ═══════════════════════════════════════════════════════ */}
        {showPreview && (
            <div
                className="lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label={t.create.previewBtn}
                style={{
                    position: 'fixed', inset: 0, zIndex: 60,
                    background: 'var(--paper)',
                    display: 'flex', flexDirection: 'column',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', flexShrink: 0, borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 16 }}>{t.create.previewBtn}</span>

                    <button
                        onClick={() => setShowPreview(false)}
                        aria-label={t.common.close}
                        style={{ width: 36, height: 36, border: 'none', borderRadius: 999, background: 'var(--paper-2)', color: 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <X style={{ width: 17, height: 17 }} />
                    </button>
                </div>

                <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    {previewFrame('phone')}
                </div>

                <div style={{ flexShrink: 0, padding: '14px 16px 22px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--ink-soft)' }}>
                        <MousePointerClick style={{ width: 14, height: 14 }} />
                        {t.create.previewEditHint}
                    </span>
                    {linkPill()}
                    <button onClick={() => setShowPreview(false)} className="btn-ink" style={{ width: '100%', maxWidth: 360, padding: '14px 20px' }}>
                        {t.create.previewBackToEdit}
                    </button>
                </div>
            </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SHARED — BottomSheets + Modal (mobile + desktop)
        ═══════════════════════════════════════════════════════ */}
        <LoginGateModal
            isOpen={showLoginGate}
            onClose={() => { pendingPublishRef.current = false; setShowLoginGate(false); }}
            title={t.create.loginGateTitle}
            description={t.create.loginGateDesc}
        />

        <ProDecisionModal
            isOpen={showProDecision}
            onClose={() => setShowProDecision(false)}
            onPublishFree={publishWithoutPro}
            onUpgrade={() => { setShowProDecision(false); setShowUpgradeModal(true); }}
            selections={proSelections.map(({ label, value }) => ({ label, value }))}
        />

        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

        {/* ── Publicada: mandarla es el siguiente paso ── */}
        {published && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t.create.publishedTitle}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => router.push(`/p/${published.identifier}`)} />
                <div className="relative w-full max-w-sm" style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-card)', padding: '30px 26px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: 44, lineHeight: 1 }}>💌</div>
                    <h3 className="serif-display" style={{ fontSize: 28, lineHeight: 1.15, margin: '14px 0 8px', color: 'var(--ink-black)' }}>
                        {t.create.publishedTitle}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-soft)', margin: 0 }}>
                        {t.create.publishedDesc.replace('{name}', formData.recipientName.trim())}
                    </p>

                    <div style={{ marginTop: 18, padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--paper-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: 'var(--ink-black)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                            {published.url.replace(/^https?:\/\//, '')}
                        </span>
                        <button onClick={copyPublished} aria-label={t.create.shareCopy} title={t.create.shareCopy} style={{ flexShrink: 0, width: 34, height: 34, border: 'none', borderRadius: 10, background: 'var(--paper-soft)', color: 'var(--accent-2-hex)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Copy style={{ width: 15, height: 15 }} />
                        </button>
                    </div>

                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 18px', borderRadius: 'var(--r-md)', background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}
                        >
                            <MessageCircle style={{ width: 18, height: 18 }} />
                            {t.create.shareWhatsApp}
                        </a>
                        <div style={{ display: 'grid', gridTemplateColumns: canNativeShare ? '1fr 1fr' : '1fr', gap: 10 }}>
                            {canNativeShare && (
                                <button onClick={nativeShare} className="btn-ink" style={{ padding: '12px 14px', fontSize: 15, justifyContent: 'center' }}>
                                    <Share2 style={{ width: 15, height: 15 }} /> {t.create.shareMore}
                                </button>
                            )}
                            <button onClick={copyPublished} className="btn-ink" style={{ padding: '12px 14px', fontSize: 15, justifyContent: 'center' }}>
                                <Copy style={{ width: 15, height: 15 }} /> {t.create.shareCopy}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 18, fontSize: 15 }}>
                        <button onClick={() => router.push(`/p/${published.identifier}`)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent-2-hex)', fontWeight: 700 }}>
                            {t.create.shareViewLetter}
                        </button>
                        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink-soft)', fontWeight: 600 }}>
                            {t.create.shareGoPages}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
