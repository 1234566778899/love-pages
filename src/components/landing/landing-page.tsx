'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AppPromoAd } from '@/components/ads/AppPromoAd';
import { ArrowUpRight, ArrowDown, Check, Heart, Star, Play, LayoutTemplate } from 'lucide-react';

/**
 * Landing ligera.
 *
 * Todo el peso lo llevan el espacio y el tamaño del texto, no los bordes ni las
 * sombras: fondo casi blanco, superficies blancas sin contorno, un único acento
 * morado y una escala tipográfica grande (hero de hasta 70px, cuerpo de 20px).
 *
 * Los colores salen de las variables globales, así que la landing ya no define
 * paleta propia — cambiar el token cambia también esta página.
 */

const ACCENT = 'var(--accent-hex)';
const INK = 'var(--ink-black)';
const INK_SOFT = 'var(--ink-soft)';

// ── Piezas tipográficas ───────────────────────────────────────

/** Etiqueta suave en píldora — sustituye al eyebrow mono en versalitas. */
function Pill({ children, tone = 'accent' }: { children: React.ReactNode; tone?: 'accent' | 'soft' }) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 999,
                background: tone === 'accent' ? 'var(--accent-soft)' : 'var(--paper-2)',
                color: tone === 'accent' ? 'var(--accent-2-hex)' : INK_SOFT,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.3,
            }}
        >
            {children}
        </span>
    );
}

/** Acento manuscrito. Antes era una cursiva serif; ahora firma en morado. */
function Script({ children, size }: { children: React.ReactNode; size?: number | string }) {
    return (
        <span
            style={{
                fontFamily: 'var(--hand)',
                fontWeight: 700,
                color: ACCENT,
                fontSize: size,
                letterSpacing: '0.01em',
                lineHeight: 1.1,
            }}
        >
            {children}
        </span>
    );
}

function Headline({ children, size = 'section' }: { children: React.ReactNode; size?: 'hero' | 'section' }) {
    return (
        <h2
            style={{
                fontFamily: 'var(--display)',
                fontWeight: 700,
                fontSize: size === 'hero' ? 'clamp(2.5rem, 6vw, 4.375rem)' : 'clamp(1.85rem, 3.6vw, 2.75rem)',
                lineHeight: size === 'hero' ? 1.08 : 1.18,
                letterSpacing: '-0.025em',
                color: INK,
                margin: 0,
                textWrap: 'balance',
            }}
        >
            {children}
        </h2>
    );
}

function SectionHead({ eyebrow, children, center }: { eyebrow?: string; children: React.ReactNode; center?: boolean }) {
    return (
        <div style={{ marginBottom: 56, textAlign: center ? 'center' : 'left' }}>
            {eyebrow && <div style={{ marginBottom: 20 }}><Pill>{eyebrow}</Pill></div>}
            <Headline>{children}</Headline>
        </div>
    );
}

// ── Botones ───────────────────────────────────────────────────

function PrimaryButton({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <button className="btn-accent" style={{ width: wide ? '100%' : undefined, padding: '14px 26px' }}>
            {children}
            <ArrowUpRight size={17} strokeWidth={2.4} />
        </button>
    );
}

function SecondaryButton({ children, wide = false, icon }: { children: React.ReactNode; wide?: boolean; icon?: React.ReactNode }) {
    return (
        <button className="btn-ink" style={{ width: wide ? '100%' : undefined, padding: '14px 26px' }}>
            {children}
            {icon}
        </button>
    );
}

// ── Cifra ─────────────────────────────────────────────────────

function Stat({ n, label }: { n: string; label: string }) {
    return (
        <div style={{ flex: 1, minWidth: 108 }}>
            <div
                style={{
                    fontFamily: 'var(--display)',
                    fontWeight: 700,
                    fontSize: 'clamp(28px, 3.2vw, 36px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    color: INK,
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                {n}
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: INK_SOFT }}>{label}</div>
        </div>
    );
}

// ── Pilar ─────────────────────────────────────────────────────

function Pillar({ n, title, body, tint }: { n: string; title: string; body: string; tint: string }) {
    return (
        <div
            style={{
                background: 'var(--paper-soft)',
                borderRadius: 'var(--r-xl)',
                padding: 'clamp(28px, 3vw, 40px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxShadow: 'var(--shadow-soft)',
            }}
        >
            <span
                style={{
                    width: 48, height: 48, borderRadius: 16, background: tint,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--display)', fontWeight: 700, fontSize: 17,
                    color: 'var(--accent-2-hex)', marginBottom: 6,
                }}
            >
                {n}
            </span>
            <h3
                style={{
                    fontFamily: 'var(--display)', fontWeight: 700,
                    fontSize: 'clamp(20px, 2vw, 24px)', lineHeight: 1.28,
                    letterSpacing: '-0.02em', color: INK, margin: 0,
                    textWrap: 'balance',
                }}
            >
                {title}
            </h3>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: INK_SOFT, margin: 0 }}>{body}</p>
        </div>
    );
}

// ── Tarjeta de precio ─────────────────────────────────────────

function PriceCard({ plan, price, sub, pitch, features, highlight, ctaLabel, ctaHref, recommendedLabel }: {
    plan: string; price: string; sub?: string; pitch: string;
    features: string[]; highlight?: boolean; ctaLabel: string; ctaHref: string;
    recommendedLabel?: string;
}) {
    return (
        <div
            style={{
                padding: 'clamp(28px, 3.2vw, 44px)',
                background: 'var(--paper-soft)',
                borderRadius: 'var(--r-xl)',
                boxShadow: highlight ? 'var(--shadow-card)' : 'var(--shadow-soft)',
                outline: highlight ? '2px solid var(--accent-3-hex)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            {highlight && recommendedLabel && (
                <span
                    style={{
                        position: 'absolute', top: -14, left: 'clamp(28px, 3.2vw, 44px)',
                        background: ACCENT, color: '#fff',
                        fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
                        padding: '6px 14px', borderRadius: 999,
                        boxShadow: 'var(--shadow-sticker)',
                    }}
                >
                    {recommendedLabel}
                </span>
            )}

            {/* La tarjeta es un flex column: sin esto la píldora se estira a todo el ancho */}
            <span style={{ alignSelf: 'flex-start' }}>
                <Pill tone={highlight ? 'accent' : 'soft'}>{plan}</Pill>
            </span>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 24 }}>
                <span
                    style={{
                        fontFamily: 'var(--display)', fontWeight: 700,
                        fontSize: 'clamp(44px, 5vw, 58px)', lineHeight: 1,
                        letterSpacing: '-0.04em', color: INK,
                    }}
                >
                    {price}
                </span>
                {sub && <span style={{ fontSize: 16, color: INK_SOFT }}>{sub}</span>}
            </div>

            <p style={{ fontSize: 17, lineHeight: 1.6, color: INK_SOFT, margin: '14px 0 32px' }}>{pitch}</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                {features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 16, lineHeight: 1.5, color: INK }}>
                        <span
                            aria-hidden="true"
                            style={{
                                width: 22, height: 22, borderRadius: 999, flexShrink: 0, marginTop: 1,
                                background: 'var(--accent-soft)', color: 'var(--accent-2-hex)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Check size={13} strokeWidth={3} />
                        </span>
                        {f}
                    </li>
                ))}
            </ul>

            <Link href={ctaHref} style={{ display: 'block' }}>
                {highlight ? <PrimaryButton wide>{ctaLabel}</PrimaryButton> : <SecondaryButton wide>{ctaLabel}</SecondaryButton>}
            </Link>
        </div>
    );
}

// ── Plantilla destacada ───────────────────────────────────────

/* El id apunta al registro de la plantilla en el backend. Si se resiembra la
   base, este enlace hay que actualizarlo — el botón general de la sección va a
   /templates, que nunca caduca. */
const NETFLIX_TEMPLATE_ID = '6991755b290d5bf4fb8ae855';

/**
 * Maqueta de la plantilla «Netflix & Love».
 *
 * Se dibuja aquí en vez de usar `previewImageUrl` del backend: esa URL apunta a
 * un CDN ajeno con una foto genérica que no enseña la plantilla, y además
 * obligaría a añadir el dominio a next.config. Los textos son los mismos
 * valores por defecto que trae la plantilla.
 */
function NetflixTemplatePreview() {
    const { t } = useTranslation();

    const moments = [
        { title: t.landing.tplMoment1, match: '99%', date: 'Feb 2023', tint: '#4a2330' },
        { title: t.landing.tplMoment2, match: '100%', date: 'Jul 2023', tint: '#2a2a4a' },
        { title: t.landing.tplMoment3, match: '100%', date: 'Dic 2024', tint: '#3d2447' },
    ];

    return (
        <div
            aria-hidden="true"
            style={{
                background: '#0d0d0f',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: '0 24px 60px -20px rgba(73, 74, 95, 0.45)',
                userSelect: 'none',
            }}
        >
            {/* Barra superior */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
                <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', color: '#e50914' }}>
                    LOVEFLIX
                </span>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    L
                </span>
            </div>

            {/* Banner principal */}
            <div
                style={{
                    position: 'relative',
                    padding: '26px 18px 22px',
                    background: 'linear-gradient(180deg, #3a0d18 0%, #1a0a10 62%, #0d0d0f 100%)',
                }}
            >
                <h4 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 26, lineHeight: 1.15, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                    {t.landing.tplHeroTitle}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: '#46d369', fontWeight: 700 }}>{t.landing.tplHeroMeta.split('·')[0].trim()}</span>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {t.landing.tplHeroMeta.split('·').slice(1).join('·').trim()}
                    </span>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.72)', margin: '0 0 16px', maxWidth: '46ch' }}>
                    {t.landing.tplHeroDesc}
                </p>
                <span
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 18px', borderRadius: 6, background: '#fff',
                        color: '#0d0d0f', fontSize: 14, fontWeight: 700,
                    }}
                >
                    <Play size={13} fill="#0d0d0f" stroke="none" /> Reproducir
                </span>
            </div>

            {/* Carrusel de momentos */}
            <div style={{ padding: '18px 0 22px 18px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{t.landing.tplRowTitle}</div>
                <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
                    {moments.map((m) => (
                        <div key={m.title} style={{ width: 132, flexShrink: 0 }}>
                            <div
                                style={{
                                    height: 74, borderRadius: 6, marginBottom: 8,
                                    background: `linear-gradient(140deg, ${m.tint}, #17171a)`,
                                    display: 'flex', alignItems: 'flex-end', padding: 7,
                                }}
                            >
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#46d369' }}>{m.match}</span>
                            </div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 2 }}>{m.title}</div>
                            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>{m.date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Demo del teléfono ─────────────────────────────────────────

function DemoPhone() {
    const [answered, setAnswered] = useState(false);
    const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
    const { t } = useTranslation();

    const bumpNo = () => setNoPos({ x: Math.random() * 150 - 20, y: Math.random() * 70 });

    const noBtnStyle: React.CSSProperties = {
        background: 'var(--paper-2)', border: 'none', padding: '11px 20px',
        fontSize: 15, fontWeight: 600, cursor: 'default', borderRadius: 10, color: INK,
    };

    return (
        <div
            style={{
                width: 300, height: 600, flexShrink: 0,
                background: '#1b1721',
                borderRadius: 40, padding: 9,
                boxShadow: '0 30px 70px -24px rgba(73, 74, 95, 0.4)',
            }}
        >
            <div
                style={{
                    width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden',
                    position: 'relative', background: 'var(--paper-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 78, height: 21, background: '#1b1721', borderRadius: 999 }} />

                <div style={{ padding: '0 24px', textAlign: 'center', position: 'relative', width: '100%' }}>
                    <Pill>{t.landing.demoCardBadge}</Pill>

                    <h3
                        style={{
                            fontFamily: 'var(--display)', fontWeight: 700, fontSize: 27,
                            lineHeight: 1.2, letterSpacing: '-0.025em', margin: '20px 0 0', color: INK,
                        }}
                    >
                        {t.landing.demoCardTitle1}{' '}
                        <Script size={30}>{t.landing.demoCardTitle2Italic}</Script>
                    </h3>

                    <p style={{ marginTop: 14, fontSize: 15, color: INK_SOFT, lineHeight: 1.6 }}>
                        {t.landing.demoCardSubtitle}
                    </p>

                    {!answered ? (
                        <div style={{ marginTop: 28, position: 'relative', minHeight: 48 }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                <button
                                    onClick={() => setAnswered(true)}
                                    style={{ background: ACCENT, color: '#fff', border: 'none', padding: '11px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', borderRadius: 10 }}
                                >
                                    {t.landing.demoYesBtn}
                                </button>
                                {!noPos && (
                                    <button onMouseEnter={bumpNo} style={noBtnStyle}>
                                        {t.landing.demoNoBtn}
                                    </button>
                                )}
                            </div>
                            {noPos && (
                                <button
                                    onMouseEnter={bumpNo}
                                    style={{
                                        ...noBtnStyle,
                                        position: 'absolute', left: noPos.x, top: noPos.y - 48,
                                        transition: 'all 260ms cubic-bezier(.2,.9,.3,1.1)',
                                    }}
                                >
                                    {t.landing.demoNoBtn}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ marginTop: 28 }}>
                            <h2 style={{ margin: 0 }}>
                                <Script size={62}>{t.landing.demoAnsweredYes}</Script>
                            </h2>
                            <button
                                onClick={() => { setAnswered(false); setNoPos(null); }}
                                style={{ marginTop: 14, fontSize: 14, color: INK_SOFT, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {t.landing.demoReset}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/** Corazones sueltos detrás de la maqueta — el único adorno de la página. */
function FloatingHearts() {
    const hearts = [
        { top: '6%', left: '-4%', size: 74, rotate: -14, opacity: 0.5 },
        { top: '44%', left: '-12%', size: 52, rotate: 10, opacity: 0.35 },
        { top: '18%', right: '-8%', size: 88, rotate: 12, opacity: 0.45 },
        { top: '62%', right: '-3%', size: 46, rotate: -8, opacity: 0.3 },
    ];
    return (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {hearts.map((h, i) => (
                <Heart
                    key={i}
                    size={h.size}
                    fill="var(--accent-3-hex)"
                    stroke="none"
                    style={{
                        position: 'absolute',
                        top: h.top, left: h.left, right: h.right,
                        opacity: h.opacity,
                        transform: `rotate(${h.rotate}deg)`,
                        animation: `float ${4 + i * 0.7}s ease-in-out infinite`,
                    }}
                />
            ))}
        </div>
    );
}

// ── Página ────────────────────────────────────────────────────

export default function LandingPage() {
    const { user } = useAuthStore();
    const { t } = useTranslation();

    const occasions = ['san valentín', 'aniversarios', 'cumpleaños', 'declaraciones', 'amistad', 'pedidas', 'perdón'];

    return (
        <div style={{ width: '100%', background: 'var(--paper)', color: INK, position: 'relative', overflowX: 'hidden' }}>

            {/* ── Cinta superior ── */}
            <div style={{ background: ACCENT, color: '#fff', textAlign: 'center', padding: '11px 20px', fontSize: 14, fontWeight: 600 }}>
                {t.landing.heroBadge}
            </div>

            {/* ── Cabecera ── */}
            <header
                style={{
                    position: 'sticky', top: 0, zIndex: 40,
                    background: 'rgba(249, 248, 252, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--hairline)',
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 0' }} className="px-6 sm:px-10">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span
                            aria-hidden="true"
                            style={{
                                width: 32, height: 32, borderRadius: 11, background: 'var(--accent-soft)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT,
                            }}
                        >
                            <Heart size={17} fill={ACCENT} stroke="none" />
                        </span>
                        <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', color: INK }}>
                            love pages
                        </span>
                    </span>

                    <nav className="hidden md:flex" style={{ gap: 30 }}>
                        {[
                            { href: '#plantillas', label: t.landing.templatesEyebrow },
                            { href: '#demo', label: t.landing.navDemo },
                            { href: '#planes', label: t.landing.navPricing },
                            { href: '/blog', label: 'Blog' },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                style={{ fontSize: 15, fontWeight: 500, color: INK_SOFT, textDecoration: 'none' }}
                                className="hover:!text-[#494a5f] transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <LanguageSwitcher compact />
                        <Link href={user ? '/dashboard' : '/create'}>
                            <button
                                style={{
                                    background: 'var(--accent-soft)', color: INK, border: 'none',
                                    padding: '10px 18px', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                                }}
                                className="hover:brightness-95 transition-all"
                            >
                                {user ? t.nav.myPages : t.landing.freePlanCtaLabel}
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <section
                style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}
                className="px-6 sm:px-10 pt-14 pb-20 sm:pt-20 sm:pb-28 grid grid-cols-1 lg:grid-cols-[1.05fr_auto] gap-16 items-center"
            >
                <div>
                    <Pill>{t.landing.mastheadEdition}</Pill>

                    <div style={{ marginTop: 26 }}>
                        <Headline size="hero">
                            {t.landing.heroLine1}
                            <br />
                            {t.landing.heroLine2}{' '}
                            <Script size="clamp(2.3rem, 5.4vw, 4rem)">{t.landing.heroLine2Italic}</Script>
                        </Headline>
                    </div>

                    <p style={{ fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.6, color: INK_SOFT, maxWidth: '46ch', margin: '24px 0 0' }}>
                        {t.landing.heroDesc}
                    </p>

                    <div style={{ display: 'flex', gap: 12, marginTop: 34, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href="/create"><PrimaryButton>{t.landing.ctaCreateRiso}</PrimaryButton></Link>
                        <a href="#demo"><SecondaryButton icon={<ArrowDown size={17} strokeWidth={2.4} />}>{t.landing.ctaDemoRiso}</SecondaryButton></a>
                    </div>

                    {/* Prueba social en pequeño, como la reseña de la referencia */}
                    <div style={{ marginTop: 40, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <span
                            aria-hidden="true"
                            style={{
                                width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                                background: 'var(--accent-soft)', color: 'var(--accent-2-hex)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'var(--display)', fontWeight: 700, fontSize: 17,
                            }}
                        >
                            {t.landing.testimonialName.trim().charAt(0).toUpperCase()}
                        </span>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 15, fontWeight: 600, color: INK }}>{t.landing.testimonialName}</span>
                                <span style={{ display: 'flex', gap: 2 }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={13} fill="var(--accent-3-hex)" stroke="none" />
                                    ))}
                                </span>
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: 15, color: INK_SOFT, maxWidth: '42ch' }}>
                                &ldquo;{t.landing.testimonialLine1} {t.landing.testimonialLine2}{' '}
                                {t.landing.testimonialLine3Italic}&rdquo;
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex" style={{ justifyContent: 'center', position: 'relative' }}>
                    <FloatingHearts />
                    <DemoPhone />
                </div>
            </section>

            {/* ── Ocasiones ── */}
            <section className="px-6 sm:px-10 pb-6">
                <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--accent-3-hex)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', animation: 'scroll-x 46s linear infinite', whiteSpace: 'nowrap', padding: '20px 0' }}>
                        {Array.from({ length: 4 }).flatMap((_, k) =>
                            occasions.map((o, i) => (
                                <span key={`${k}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 28, paddingRight: 28 }}>
                                    <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{o}</span>
                                    <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.65)', display: 'inline-block', flexShrink: 0 }} />
                                </span>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ── Pilares ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto' }} className="px-6 sm:px-10 py-16 sm:py-24">
                <SectionHead eyebrow={t.landing.mastheadVol} center>
                    {t.landing.pillarsLine1}{' '}
                    <Script size="clamp(1.85rem, 3.6vw, 2.75rem)">{t.landing.pillarsLine2}</Script>
                </SectionHead>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Pillar n="01" title={t.landing.pillar1Title} body={t.landing.pillar1Body} tint="var(--accent-soft)" />
                    <Pillar n="02" title={t.landing.pillar2Title} body={t.landing.pillar2Body} tint="var(--melocoton)" />
                    <Pillar n="03" title={t.landing.pillar3Title} body={t.landing.pillar3Body} tint="var(--mint)" />
                </div>
            </section>

            {/* ── Plantillas ──
                Va justo detrás de los pilares: los pilares prometen que es
                fácil, y la plantilla lo demuestra con un ejemplo concreto. */}
            <section id="plantillas" style={{ maxWidth: 1200, margin: '0 auto' }} className="px-6 sm:px-10 pb-16 sm:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
                    <div>
                        <Pill>{t.landing.templatesEyebrow}</Pill>

                        <div style={{ marginTop: 20 }}>
                            <Headline>
                                {t.landing.templatesLine1}{' '}
                                <Script size="clamp(1.85rem, 3.6vw, 2.75rem)">{t.landing.templatesLine2}</Script>
                            </Headline>
                        </div>

                        <p style={{ fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.6, color: INK_SOFT, margin: '20px 0 0', maxWidth: '46ch' }}>
                            {t.landing.templatesDesc}
                        </p>

                        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-faint)', margin: '16px 0 0', maxWidth: '46ch' }}>
                            {t.landing.templatesOthers}
                        </p>

                        <div style={{ display: 'flex', gap: 12, marginTop: 30, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Link href="/templates">
                                <PrimaryButton>{t.landing.templatesCta}</PrimaryButton>
                            </Link>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 15, color: INK_SOFT }}>
                                <LayoutTemplate size={16} />
                                {t.landing.templatesCount}
                            </span>
                        </div>
                    </div>

                    {/* Ejemplo: la plantilla Netflix & Love */}
                    <div>
                        <NetflixTemplatePreview />

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 19, color: INK }}>
                                        {t.landing.templatesFeaturedName}
                                    </span>
                                    <Pill>{t.landing.templatesFeaturedLabel}</Pill>
                                </div>
                                <p style={{ fontSize: 16, lineHeight: 1.55, color: INK_SOFT, margin: 0, maxWidth: '46ch' }}>
                                    {t.landing.templatesFeaturedDesc}
                                </p>
                            </div>
                            <Link href={`/templates/${NETFLIX_TEMPLATE_ID}`} style={{ flexShrink: 0 }}>
                                <SecondaryButton>{t.landing.templatesFeaturedCta}</SecondaryButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Cifras ── */}
            <section className="px-6 sm:px-10">
                <div
                    style={{
                        maxWidth: 1200, margin: '0 auto', background: 'var(--paper-soft)',
                        borderRadius: 'var(--r-xl)', padding: 'clamp(28px, 3.4vw, 44px)',
                        boxShadow: 'var(--shadow-soft)',
                    }}
                    className="flex flex-wrap gap-8"
                >
                    <Stat n="2.4M" label={t.landing.statsPagesLabel} />
                    <Stat n="89%" label={t.landing.statsSiLabel} />
                    <Stat n="$9" label={t.landing.statsProLabel} />
                </div>
            </section>

            {/* ── Anuncio ── */}
            <section className="px-6 sm:px-10" style={{ marginTop: 32 }}>
                <AppPromoAd variant="banner" placement="landing" style={{ maxWidth: 760, margin: '0 auto' }} />
            </section>

            {/* ── Testimonio ── */}
            <section className="px-6 sm:px-10 py-16 sm:py-24">
                <div
                    style={{
                        maxWidth: 900, margin: '0 auto', textAlign: 'center',
                        background: 'var(--accent-soft)', borderRadius: 'var(--r-xl)',
                        padding: 'clamp(36px, 5vw, 72px)',
                    }}
                >
                    <Pill tone="soft">{t.landing.testimonialBadge}</Pill>

                    <blockquote
                        style={{
                            fontFamily: 'var(--display)', fontWeight: 700,
                            fontSize: 'clamp(24px, 3.2vw, 38px)', lineHeight: 1.3,
                            letterSpacing: '-0.025em', color: INK,
                            margin: '26px 0 0', textWrap: 'balance',
                        }}
                    >
                        {t.landing.testimonialLine1} {t.landing.testimonialLine2}{' '}
                        <Script size="clamp(26px, 3.4vw, 42px)">{t.landing.testimonialLine3Italic}</Script>
                    </blockquote>

                    <div style={{ marginTop: 30, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                        <span
                            aria-hidden="true"
                            style={{
                                width: 42, height: 42, borderRadius: 999, background: 'var(--paper-soft)',
                                color: 'var(--accent-2-hex)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'var(--display)', fontWeight: 700, fontSize: 16, flexShrink: 0,
                            }}
                        >
                            {t.landing.testimonialName.trim().charAt(0).toUpperCase()}
                        </span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: INK }}>{t.landing.testimonialName}</div>
                            <div style={{ fontSize: 14, color: INK_SOFT }}>{t.landing.testimonialDate}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Demo ── */}
            <section id="demo" style={{ maxWidth: 1200, margin: '0 auto' }} className="px-6 sm:px-10 py-16 sm:py-24">
                <SectionHead center>
                    {t.landing.demoSectionLine1}{' '}
                    <Script size="clamp(1.85rem, 3.6vw, 2.75rem)">{t.landing.demoSectionLine2}</Script>
                </SectionHead>

                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative', transform: 'scale(min(1, calc((100vw - 48px) / 300px)))', transformOrigin: 'top center' }}>
                        <FloatingHearts />
                        <DemoPhone />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 48 }}>
                    <Link href="/create"><PrimaryButton>{t.landing.demoCtaBtn}</PrimaryButton></Link>
                </div>
            </section>

            {/* ── Precios ── */}
            <section id="planes" className="px-6 sm:px-10 py-16 sm:py-24">
                <div style={{ maxWidth: 1080, margin: '0 auto' }}>
                    <SectionHead center>
                        {t.landing.pricingLine1}{' '}
                        <Script size="clamp(1.85rem, 3.6vw, 2.75rem)">{t.landing.pricingLine2}</Script>
                    </SectionHead>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PriceCard
                            plan="Free"
                            price="$0"
                            pitch={t.landing.freePlanPitch}
                            features={[t.landing.freePlanFeature1, t.landing.freePlanFeature2, t.landing.freePlanFeature3, t.landing.freePlanFeature4]}
                            ctaLabel={t.landing.freePlanCtaLabel}
                            ctaHref="/create"
                        />
                        <PriceCard
                            plan="Pro"
                            price="$9"
                            sub={t.landing.proPlanSub}
                            pitch={t.landing.proPlanPitch}
                            features={[t.landing.proPlanFeature1, t.landing.proPlanFeature2, t.landing.proPlanFeature3, t.landing.proPlanFeature4, t.landing.proPlanFeature5, t.landing.proPlanFeature6]}
                            highlight
                            ctaLabel={t.landing.proPlanCtaLabel}
                            ctaHref="/upgrade"
                            recommendedLabel={t.landing.pricingRecommended}
                        />
                    </div>
                </div>
            </section>

            {/* ── Cierre ── */}
            <section className="px-6 sm:px-10 pb-20 sm:pb-28">
                <div
                    style={{
                        maxWidth: 1080, margin: '0 auto', textAlign: 'center',
                        background: 'var(--accent-hex)', borderRadius: 'var(--r-xl)',
                        padding: 'clamp(48px, 7vw, 96px) clamp(24px, 4vw, 64px)',
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'var(--display)', fontWeight: 700,
                            fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.12,
                            letterSpacing: '-0.03em', margin: 0, color: '#fff', textWrap: 'balance',
                        }}
                    >
                        {t.landing.finalLine1}{' '}
                        <span style={{ fontFamily: 'var(--hand)', fontWeight: 700, color: '#fff', opacity: 0.92 }}>
                            {t.landing.finalLine2Italic}
                        </span>
                    </h2>

                    <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center' }}>
                        <Link href={user ? '/dashboard' : '/create'}>
                            <button
                                style={{
                                    background: '#fff', color: 'var(--accent-2-hex)', border: 'none',
                                    padding: '15px 30px', borderRadius: 12, fontSize: 17, fontWeight: 600,
                                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                                }}
                                className="hover:-translate-y-px transition-transform"
                            >
                                {user ? t.landing.finalCtaUser : t.landing.finalCtaGuest}
                                <ArrowUpRight size={17} strokeWidth={2.4} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Pie ── */}
            <footer
                style={{ borderTop: '1px solid var(--hairline)' }}
                className="px-6 sm:px-10 py-10 flex flex-wrap justify-between items-center gap-6 max-sm:flex-col max-sm:text-center"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                        aria-hidden="true"
                        style={{
                            width: 28, height: 28, borderRadius: 10, background: 'var(--accent-soft)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <Heart size={15} fill={ACCENT} stroke="none" />
                    </span>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', color: INK }}>
                        love pages
                    </span>
                </div>

                <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 26px' }}>
                    {[
                        { href: '/blog', label: 'Blog' },
                        { href: '/about', label: t.landing.footerAbout },
                        { href: '/privacy-policy', label: t.landing.footerPrivacy },
                        { href: '/terms', label: t.landing.footerTerms },
                        { href: '/contact', label: t.nav.contact },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            style={{ fontSize: 15, color: INK_SOFT, textDecoration: 'none' }}
                            className="hover:!text-[#494a5f] transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <p style={{ fontSize: 14, color: 'var(--ink-faint)', margin: 0 }}>
                    © {new Date().getFullYear()} love pages.
                </p>
            </footer>
        </div>
    );
}
