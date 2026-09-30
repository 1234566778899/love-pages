'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppPromoAd } from '@/components/ads/AppPromoAd';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { ProPageRenderer } from '@/components/ProPageRenderer';
import { ParticleCanvas, animToKind, hasParticles } from '@/components/ParticleCanvas';
import { pageThemeVars, titleFontFamily, bodyFontFamily, googleFontsHref, DEFAULT_FONT, LETTER_TEXT_HALO } from '@/lib/page-theme';
import { fleeDelta, clampDelta } from '@/lib/escape-button';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/i18n';

// ── Embed URL helper ──────────────────────────────────────────
function getEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
            let videoId = u.searchParams.get('v');
            if (!videoId) {
                const parts = u.pathname.split('/').filter(Boolean);
                videoId = parts[parts.indexOf('shorts') + 1] || parts[parts.length - 1];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
        }
        if (u.hostname.includes('tiktok.com')) {
            const match = u.pathname.match(/\/video\/(\d+)/);
            return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
        }
        return null;
    } catch {
        return null;
    }
}

// ── Sticker map ───────────────────────────────────────────────
const STICKER_MAP: Record<string, string> = {
    'heart-big': '❤️',
    'heart-sparkling': '💖',
    'heart-arrow': '💘',
    'kiss': '💋',
    'rose': '🌹',
    'ring': '💍',
    'couple': '💑',
    'love-letter': '💌',
    'star': '⭐',
    'fire': '🔥',
    'butterfly': '🦋',
    'teddy': '🧸',
    'chocolate': '🍫',
    'champagne': '🍾',
    'moon': '🌙',
    'rainbow': '🌈',
};

// ── Music URLs ────────────────────────────────────────────────
const MUSIC_URLS: Record<string, string> = {
    'romantic-piano': '/audio/romantic-piano.mp3',
    'acoustic-guitar': '/audio/acoustic-guitar.mp3',
    'love-song': '/audio/love-song.mp3',
    'music-box': '/audio/music-box.mp3',
    'orchestra': '/audio/orchestra.mp3',
};

// ── EscapeNoButton — riso flat, blue outline ──────────────────
function EscapeNoButton({
    label,
    containerRef,
    noButtonEscapes,
    onAnswer,
    answered,
}: {
    label: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
    noButtonEscapes: boolean;
    onAnswer: () => void;
    answered: boolean;
}) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const posRef = useRef({ x: 0, y: 0 });
    const ref = useRef<HTMLButtonElement>(null);
    /** Posición natural del botón, en coordenadas de página (aguanta el scroll). */
    const homeRef = useRef<{ left: number; top: number } | null>(null);

    const escaping = noButtonEscapes && !answered;
    const escapingRef = useRef(escaping);
    escapingRef.current = escaping;

    const measureHome = useCallback(() => {
        const btn = ref.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        homeRef.current = {
            left: r.left + window.scrollX - posRef.current.x,
            top: r.top + window.scrollY - posRef.current.y,
        };
    }, []);

    useEffect(() => { measureHome(); }, [measureHome]);

    /**
     * Dónde va a estar el botón cuando termine la transición. Medirlo con
     * `getBoundingClientRect()` mientras la animación corre da la posición
     * intermedia, y acotar contra ella hacía que cada movimiento del ratón se
     * pasara del límite hasta sacarlo de la pantalla.
     */
    const targetRect = useCallback(() => {
        const btn = ref.current;
        const home = homeRef.current;
        if (!btn || !home) return null;
        const r = btn.getBoundingClientRect();
        return {
            left: home.left - window.scrollX + posRef.current.x,
            top: home.top - window.scrollY + posRef.current.y,
            width: r.width,
            height: r.height,
        };
    }, []);

    const flee = useCallback((pointerX: number, pointerY: number, force: boolean) => {
        if (!escapingRef.current) return;
        const c = containerRef.current;
        const target = targetRect();
        if (!c || !target) return;

        const delta = fleeDelta({
            btn: target,
            container: c.getBoundingClientRect(),
            pointerX,
            pointerY,
            force,
        });
        if (!delta) return;

        const next = { x: posRef.current.x + delta.dx, y: posRef.current.y + delta.dy };
        posRef.current = next;
        setPos(next);
    }, [containerRef, targetRect]);

    // Se aparta al acercarse el puntero, sin esperar a que llegue encima.
    // `pointermove` cubre ratón, dedo y lápiz; `mouseenter` no existe en táctil.
    useEffect(() => {
        const c = containerRef.current;
        if (!c || !escaping) return;
        const onMove = (e: PointerEvent) => flee(e.clientX, e.clientY, false);
        c.addEventListener('pointermove', onMove, { passive: true });
        return () => c.removeEventListener('pointermove', onMove);
    }, [escaping, flee, containerRef]);

    // Si la ventana cambia de tamaño (girar el móvil) después de haber huido,
    // el botón podría quedarse fuera de la vista: se le devuelve a la pantalla.
    useEffect(() => {
        const c = containerRef.current;
        if (!c) return;
        const onResize = () => {
            measureHome();
            const target = targetRect();
            if (!target) return;
            const delta = clampDelta({
                btn: target,
                container: c.getBoundingClientRect(),
            });
            if (!delta) return;
            const next = { x: posRef.current.x + delta.dx, y: posRef.current.y + delta.dy };
            posRef.current = next;
            setPos(next);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [containerRef, measureHome, targetRect]);

    return (
        <button
            ref={ref}
            // En táctil no hay hover: el dedo iba directo al click. Interceptar
            // el pointerdown lo aparta antes de que el toque llegue a serlo.
            onPointerDown={(e) => {
                if (!escapingRef.current) return;
                e.preventDefault();
                flee(e.clientX, e.clientY, true);
            }}
            onPointerEnter={(e) => flee(e.clientX, e.clientY, true)}
            onFocus={() => {
                const b = ref.current?.getBoundingClientRect();
                if (b) flee(b.left + b.width / 2, b.top + b.height / 2, true);
            }}
            onClick={(e) => {
                if (escapingRef.current) {
                    e.preventDefault();
                    return;
                }
                if (!answered) onAnswer();
            }}
            style={{
                position: 'relative',
                whiteSpace: 'nowrap',
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: 'transform 180ms cubic-bezier(.2,.9,.3,1.1)',
                background: 'var(--paper-2)',
                color: 'var(--ink-black)',
                border: 'none',
                padding: '14px 28px',
                borderRadius: 12,
                fontFamily: 'var(--sans)',
                fontWeight: 600,
                fontSize: 16,
                cursor: escaping ? 'default' : 'pointer',
                touchAction: 'manipulation',
                userSelect: 'none',
            }}
        >
            {label}
        </button>
    );
}

// ── VideoEmbed ─────────────────────────────────────────────────
function VideoEmbed({ url }: { url: string }) {
    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) return null;
    return (
        <div style={{ width: '100%', maxWidth: 480, margin: '20px auto', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                <iframe
                    src={embedUrl}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title="Video embed"
                />
            </div>
        </div>
    );
}

function renderMsg(text: string): React.ReactNode {
    if (!text || !text.includes('*')) return text;
    return text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2
            ? <em key={i} style={{ fontFamily: 'var(--serif-italic)', fontStyle: 'italic' }}>{part.slice(1, -1)}</em>
            : part
    );
}

// ── AnswerScene ───────────────────────────────────────────────
// Quien acaba de responder una carta es la persona con más intención de
// crear la suya: está en una relación y acaba de vivir algo con el producto.
// Antes esta pantalla sólo ofrecía «ver carta otra vez».
function AnswerScene({
    recipient,
    answer,
    onReset,
    t,
}: {
    recipient: string;
    answer: 'yes' | 'no' | null;
    onReset: () => void;
    t: any;
}) {
    const isYes = answer !== 'no';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'fadeUp .6s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 24, height: 1.5, background: 'var(--ink-black)' }} />
                <span className="mono-eyebrow" style={{ fontSize: 10 }}>{t.publicPage.responseRegistered}</span>
                <span style={{ width: 24, height: 1.5, background: 'var(--ink-black)' }} />
            </div>

            <h1 className="serif-display mis-red" style={{ fontSize: 'clamp(96px, 26vw, 140px)', margin: 0, lineHeight: 0.86 }}>
                {isYes ? t.publicPage.answeredYes : t.publicPage.answeredNo}
            </h1>

            <div style={{ marginTop: 24, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-black)', maxWidth: 340, lineHeight: 1.5 }}>
                {(isYes ? t.publicPage.answeredYesNote : t.publicPage.answeredNoNote).replace('{name}', recipient)}
            </div>

            {/* El bucle: de destinatario a autor */}
            <div style={{ marginTop: 44, paddingTop: 32, borderTop: '1.5px solid var(--rule)', maxWidth: 360, width: '100%' }}>
                <h2 className="serif-display" style={{ fontSize: 'clamp(26px, 7vw, 34px)', margin: 0, lineHeight: 1, color: 'var(--ink-black)' }}>
                    {t.publicPage.ctaHeading}
                </h2>
                <p style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
                    {t.publicPage.ctaBody}
                </p>
                <Link href="/create?ref=carta" style={{ display: 'inline-block', marginTop: 20 }}>
                    <button className="btn-accent" style={{ padding: '14px 28px', fontSize: 12 }}>
                        {t.publicPage.ctaButton}
                    </button>
                </Link>
            </div>

            <AppPromoAd app="mydiess" variant="compact" placement="public-answer" style={{ marginTop: 28, maxWidth: 380 }} />

            <button
                onClick={onReset}
                style={{ marginTop: 32, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
                {t.publicPage.seeAgain}
            </button>

            <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`}</style>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────
export default function PublicPageView() {
    const params = useParams();
    const shortId = params.shortId as string;
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pageExpired, setPageExpired] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
    const [musicOn, setMusicOn] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageLoadedRef = useRef(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (pageLoadedRef.current) return;
        pageLoadedRef.current = true;
        api.pages.getByShortId(shortId)
            .then(({ data }) => setPage(data.data))
            .catch((err: any) => {
                if (err.response?.status === 410 || err.response?.data?.code === 'PAGE_EXPIRED') {
                    setPageExpired(true);
                } else {
                    toast.error(t.publicPage.pageNotFound);
                }
            })
            .finally(() => setLoading(false));
    }, [shortId]);

    // Sólo se pide a Google la tipografía que esta carta use de verdad.
    useEffect(() => {
        const href = googleFontsHref([page?.titleFont, page?.bodyFont]);
        if (!href) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        return () => { link.remove(); };
    }, [page?.titleFont, page?.bodyFont]);

    const handleAnswer = async (answer: 'yes' | 'no') => {
        if (answered) return;
        try {
            await api.pages.respond(shortId, answer);
            setAnswered(true);
            setSelectedAnswer(answer);
        } catch {
            toast.error(t.publicPage.responseError);
        }
    };

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (musicOn) {
            audio.pause();
            setMusicOn(false);
        } else {
            audio.volume = 0.3;
            audio.play().then(() => setMusicOn(true)).catch(() => { });
        }
    };

    // ── Loading ───────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    // ── Expired ───────────────────────────────────────────────
    if (pageExpired) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: 24, fontFamily: 'var(--mono)' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 16, color: 'var(--accent-hex)' }}>{t.publicPage.expiredEyebrow}</div>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(48px, 10vw, 72px)', lineHeight: 0.88, color: 'var(--ink-black)', marginBottom: 16 }}>
                        <span className="mis-red">{t.publicPage.expiredTitle1}</span> <span className="mis-blue">{t.publicPage.expiredTitle2}</span> {t.publicPage.expiredTitle3}
                    </h1>
                    <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 28 }}>
                        {t.publicPage.expiredDesc}
                    </p>
                    <a href="/upgrade" className="btn-accent" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        {t.publicPage.expiredCta}
                    </a>
                </div>
            </div>
        );
    }

    // ── Not found ─────────────────────────────────────────────
    if (!page) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: 24, fontFamily: 'var(--mono)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 16, color: 'var(--ink-black)' }}>— 404 —</div>
                    <h1 className="serif-display mis-red" style={{ fontSize: 'clamp(48px, 10vw, 72px)', lineHeight: 0.88, marginBottom: 12 }}>
                        {t.publicPage.pageNotFound}
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{t.publicPage.pageNotFoundDesc}</p>
                </div>
            </div>
        );
    }

    // ── PRO page — custom AI HTML ─────────────────────────────
    if (page.pageType === 'pro' && page.customHTML && page.customCSS) {
        return (
            <>
                {answered && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div style={{ background: 'var(--paper-soft)', borderRadius: 20, boxShadow: 'var(--shadow-card)', padding: '32px 40px', textAlign: 'center', maxWidth: 400 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>{selectedAnswer === 'yes' ? '💕' : '😊'}</div>
                            <h2 className="serif-display" style={{ fontSize: 36, color: 'var(--ink-black)', marginBottom: 8 }}>
                                {selectedAnswer === 'yes' ? t.publicPage.thanks : t.publicPage.understood}
                            </h2>
                            <p style={{ color: 'var(--ink-soft)', fontFamily: 'var(--mono)', fontSize: 13 }}>{t.publicPage.responseRecorded}</p>

                            {/* Mismo bucle que en las páginas estándar */}
                            <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1.5px solid var(--rule)' }}>
                                <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--ink-black)', margin: '0 0 14px', lineHeight: 1.4 }}>
                                    {t.publicPage.ctaHeading}
                                </p>
                                <Link href="/create?ref=carta">
                                    <button className="btn-accent" style={{ padding: '12px 24px', fontSize: 12 }}>
                                        {t.publicPage.ctaButton}
                                    </button>
                                </Link>
                            </div>

                            <AppPromoAd app="mydiess" variant="compact" placement="public-answer-pro" style={{ marginTop: 22 }} />
                        </div>
                    </div>
                )}
                {page.backgroundMusic && page.backgroundMusic !== 'none' && (
                    <audio ref={audioRef} src={MUSIC_URLS[page.backgroundMusic]} loop preload="auto" />
                )}
                <ProPageRenderer
                    html={page.customHTML}
                    css={page.customCSS}
                    noButtonEscapes={page.noButtonEscapes && !answered}
                    onYesClick={() => handleAnswer('yes')}
                    onNoClick={() => handleAnswer('no')}
                />
            </>
        );
    }

    // ── Página FREE ───────────────────────────────────────────
    const stickers = (page.selectedStickers || []).map((id: string) => STICKER_MAP[id] || '💖');
    const hasMusic = page.backgroundMusic && page.backgroundMusic !== 'none';
    const hasAnimation = hasParticles(page.animation);

    return (
        <div
            ref={containerRef}
            style={{
                // Misma traducción de paleta que usa el editor: lo que se ve en
                // el preview es literalmente lo que se publica.
                ...pageThemeVars(page),
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                background: 'var(--paper)',
                overflow: 'hidden',
                fontFamily: 'var(--sans)',
                color: 'var(--ink-black)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Imagen de fondo — cubre la página entera, no sólo el bloque de
                texto donde estaba antes, y con un velo de papel que mantiene
                legible la carta. */}
            {page.backgroundImageUrl && (
                <>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${page.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', opacity: 0.68, pointerEvents: 'none', zIndex: 0 }} />
                </>
            )}

            {/* Particle canvas */}
            {hasAnimation && <ParticleCanvas kind={animToKind(page.animation)} />}

            {/* Halo del acento — el mismo que dibuja el preview del editor */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute', top: '-14%', right: '-18%', width: 460, height: 460,
                    background: 'radial-gradient(closest-side, var(--melocoton-2), transparent 72%)',
                    pointerEvents: 'none', zIndex: 0,
                }}
            />

            {/* Audio */}
            {hasMusic && <audio ref={audioRef} src={MUSIC_URLS[page.backgroundMusic]} loop preload="auto" />}

            {/* Top chrome — music toggle only */}
            {hasMusic && (
                <div style={{ position: 'absolute', top: 14, right: 20, zIndex: 5 }}>
                    <button
                        onClick={toggleMusic}
                        aria-label={t.publicPage.musicLabel}
                        style={{ width: 40, height: 40, borderRadius: 999, border: 'none', background: musicOn ? 'var(--accent-hex)' : 'var(--paper-2)', color: musicOn ? 'var(--on-accent)' : 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}
                    >
                        ♪
                    </button>
                </div>
            )}

            {/* Main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '70px 24px 100px', textAlign: 'center', zIndex: 3, position: 'relative' }}>

                {!answered ? (
                    <>
                        {/* Eyebrow */}
                        <div style={{ marginBottom: 22 }}>
                            <span style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 999, background: 'var(--melocoton)', color: 'var(--ink-red-ink)', fontSize: 15, fontWeight: 600 }}>
                                {t.publicPage.letterFor.replace('{name}', page.recipientName)}
                            </span>
                        </div>

                        {/* Stickers + title */}
                        <div style={{ position: 'relative' }}>
                            {stickers[0] && (
                                <span style={{ position: 'absolute', left: -28, top: 4, fontSize: 26, color: 'var(--accent-hex)', transform: 'rotate(-18deg)' }}>{stickers[0]}</span>
                            )}
                            {stickers[1] && (
                                <span style={{ position: 'absolute', right: -24, top: -10, fontSize: 22, color: 'var(--ink-black)', transform: 'rotate(14deg)' }}>{stickers[1]}</span>
                            )}
                            <h1
                                className="serif-display"
                                style={{
                                    fontFamily: titleFontFamily(page.titleFont),
                                    textTransform: 'none',
                                    lineHeight: 1.15,
                                    letterSpacing: '-0.025em',
                                    fontSize: 'clamp(40px, 10vw, 62px)', margin: 0, maxWidth: 380,
                                    textShadow: LETTER_TEXT_HALO,
                                }}
                            >
                                {page.title}
                            </h1>
                        </div>

                        {/* Message */}
                        {page.message && (
                            <div style={{ marginTop: 24, fontFamily: bodyFontFamily(page.bodyFont), fontSize: 18, color: 'var(--ink-soft)', maxWidth: 340, lineHeight: 1.6, textShadow: LETTER_TEXT_HALO }}>
                                {renderMsg(page.message)}
                            </div>
                        )}

                        {/* Decorative images */}
                        {(page.decorativeImageUrls || []).length > 0 && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {page.decorativeImageUrls.slice(0, 3).map((url: string, i: number) => (
                                    <img key={i} src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 14 }} />
                                ))}
                            </div>
                        )}

                        {/* Video */}
                        {page.videoUrl && <VideoEmbed url={page.videoUrl} />}

                        {/* Sender */}
                        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 18, height: 1, background: 'var(--ink-red-ink)' }} />
                            <span style={{ fontSize: 26, color: 'var(--ink-red-ink)', fontFamily: 'var(--hand)' }}>{t.publicPage.signOff}</span>
                            {stickers[2] && <span style={{ fontSize: 18 }}>{stickers[2]}</span>}
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, alignItems: 'center', position: 'relative' }}>
                            <button
                                onClick={() => handleAnswer('yes')}
                                className="btn-accent"
                                style={{ padding: '14px 32px', fontSize: 15, whiteSpace: 'nowrap' }}
                            >
                                {page.yesButtonText}
                            </button>
                            <EscapeNoButton
                                label={page.noButtonText}
                                containerRef={containerRef}
                                noButtonEscapes={!!page.noButtonEscapes}
                                onAnswer={() => handleAnswer('no')}
                                answered={answered}
                            />
                        </div>

                        {/* Footer */}
                        <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                            <span>printed with ♥</span>
                            <Link
                                href="/?ref=carta"
                                style={{ color: 'var(--ink-soft)', textDecoration: 'none', borderBottom: '1px solid var(--rule)' }}
                            >
                                {t.publicPage.brandFooter}
                            </Link>
                        </div>
                    </>
                ) : (
                    <AnswerScene
                        recipient={page.recipientName || ''}
                        answer={selectedAnswer}
                        onReset={() => { setAnswered(false); setSelectedAnswer(null); }}
                        t={t}
                    />
                )}
            </div>
        </div>
    );
}
