'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Gamepad2, LayoutGrid, List, Check } from 'lucide-react';
import { useTranslation } from '@/i18n';

const GAME_URLS: Record<string, string> = {
    'anonymous-questions': 'https://preguntas-anonimas-web.vercel.app/',
};

const GAME_META: { id: string; emoji: string; tone: string }[] = [
    { id: 'anonymous-questions', emoji: '🎭', tone: 'var(--butter)' },
];

const APP_STORE_URL = 'https://apps.apple.com/us/app/mydiess/id6811741530';

/** Logotipo de Apple, para el botón de descarga. */
function AppleLogo({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.05 12.54c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.79-.41 6.92 1.15 9.18.77 1.11 1.68 2.35 2.88 2.3 1.16-.05 1.6-.75 3-.75s1.79.75 3.01.72c1.24-.02 2.03-1.12 2.79-2.24.88-1.28 1.24-2.53 1.26-2.59-.03-.01-2.42-.93-2.44-3.69M14.79 5.6c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.78-.97 2.83 1.03.08 2.07-.52 2.71-1.29" />
        </svg>
    );
}

/**
 * Ficha de la app móvil.
 *
 * Va delante de los juegos porque es producto propio y no una web externa: la
 * tarjeta oscura la separa del resto de la página, que es toda clara, y el
 * icono real evita tener que redibujarlo.
 */
function AppPromo() {
    const { t } = useTranslation();
    const points = [t.games.appPoint1, t.games.appPoint2, t.games.appPoint3];

    return (
        <section
            style={{
                marginBottom: 40,
                borderRadius: 'var(--r-xl)',
                background: 'linear-gradient(135deg, #1b1721 0%, #2a1626 55%, #3d1730 100%)',
                padding: 'clamp(28px, 4vw, 48px)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(24px, 4vw, 48px)',
                overflow: 'hidden',
                position: 'relative',
            }}
            className="max-sm:flex-col max-sm:items-start"
        >
            {/* Resplandor que recoge el rosa del icono */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute', right: '-8%', top: '-40%', width: 460, height: 460,
                    background: 'radial-gradient(closest-side, rgba(236, 72, 153, 0.28), transparent 72%)',
                    pointerEvents: 'none',
                }}
            />

            <Image
                src="/ads/mydiess.jpg"
                alt=""
                width={128}
                height={128}
                style={{ borderRadius: 28, flexShrink: 0, position: 'relative', boxShadow: '0 18px 40px -14px rgba(0,0,0,0.7)' }}
            />

            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <span
                    style={{
                        display: 'inline-block', padding: '7px 14px', borderRadius: 'var(--r-pill)',
                        background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)',
                        fontSize: 14, fontWeight: 600, marginBottom: 14,
                    }}
                >
                    {t.games.appBadge}
                </span>

                <h2
                    style={{
                        fontFamily: 'var(--display)', fontWeight: 700,
                        fontSize: 'clamp(28px, 3.4vw, 40px)', lineHeight: 1.15,
                        letterSpacing: '-0.025em', color: '#fff', margin: '0 0 6px',
                    }}
                >
                    {t.games.appName}
                </h2>
                <p style={{ fontSize: 'clamp(17px, 1.6vw, 20px)', color: 'rgba(255,255,255,0.82)', margin: '0 0 14px', lineHeight: 1.4 }}>
                    {t.games.appTagline}
                </p>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.62)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: '62ch' }}>
                    {t.games.appDesc}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {points.map((p) => (
                        <li key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                            <span
                                aria-hidden="true"
                                style={{
                                    width: 21, height: 21, borderRadius: 999, flexShrink: 0, marginTop: 1,
                                    background: 'rgba(236, 72, 153, 0.25)', color: '#f9a8d4',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <Check size={13} strokeWidth={3} />
                            </span>
                            {p}
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <a
                        href={APP_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 9,
                            padding: '14px 24px', borderRadius: 'var(--r-md)',
                            background: '#fff', color: '#1b1721',
                            fontSize: 17, fontWeight: 600, textDecoration: 'none',
                            transition: 'transform 150ms',
                        }}
                        className="hover:-translate-y-px"
                    >
                        <AppleLogo />
                        {t.games.appCta}
                    </a>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{t.games.appPlatform}</span>
                </div>
            </div>
        </section>
    );
}

export default function GamesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { t } = useTranslation();

    const GAMES = [
        { id: 'anonymous-questions', name: t.games.anonQuestions, description: t.games.anonQuestionsDesc },
    ].map((g) => ({
        ...g,
        url: GAME_URLS[g.id],
        emoji: GAME_META.find((m) => m.id === g.id)!.emoji,
        tone: GAME_META.find((m) => m.id === g.id)!.tone,
        badge: t.games.new,
    }));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
            <Header />

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px' }} className="max-sm:px-4">
                {/* Hero */}
                <section style={{ padding: '40px 0 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <span className="sticker-badge" style={{ background: 'var(--melocoton)', marginBottom: 12 }}>
                                <Gamepad2 style={{ width: 14, height: 14 }} /> {t.games.badgeLabel}
                            </span>
                            <h1 className="serif-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '12px 0 8px', color: 'var(--ink)', lineHeight: 1.12 }}>
                                {t.games.heroTitle}
                            </h1>
                            <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                                {t.games.subtitle}
                            </p>
                        </div>

                        {/* View toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)', background: 'white', padding: 4, boxShadow: 'var(--shadow-card)' }}>
                            <button onClick={() => setViewMode('grid')}
                                style={{ padding: '6px 10px', borderRadius: 10, border: 'none', background: viewMode === 'grid' ? 'var(--ink)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 120ms' }}
                                title={t.games.gridView}>
                                <LayoutGrid style={{ width: 16, height: 16 }} />
                            </button>
                            <button onClick={() => setViewMode('list')}
                                style={{ padding: '6px 10px', borderRadius: 10, border: 'none', background: viewMode === 'list' ? 'var(--ink)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 120ms' }}
                                title={t.games.listView}>
                                <List style={{ width: 16, height: 16 }} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* App móvil destacada */}
                <AppPromo />

                {/* Count */}
                <div className="mono-eyebrow" style={{ marginBottom: 20, fontSize: 15 }}>
                    {t.games.gameCount.replace('{count}', String(GAMES.length)).replace('{plural}', GAMES.length !== 1 ? 's' : '')}
                </div>

                {/* Grid */}
                {viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }} className="max-sm:grid-cols-1">
                        {GAMES.map((game) => (
                            <a key={game.id} href={game.url} target="_blank" rel="noopener noreferrer"
                                style={{ border: '1px solid var(--hairline)', borderRadius: 10, background: 'white', overflow: 'hidden', boxShadow: 'var(--shadow-card)', cursor: 'pointer', textDecoration: 'none', display: 'block', transition: 'transform 120ms' }}
                                className="hover:-translate-y-0.5 transition-transform">

                                {/* Banner */}
                                <div style={{ height: 160, background: game.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--hairline)' }}>
                                    <span style={{ fontSize: 64, userSelect: 'none' }}>{game.emoji}</span>
                                    {game.badge && (
                                        <span style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', background: 'white', border: '1px solid var(--hairline)', borderRadius: 10, fontSize: 14, fontWeight: 700, color: 'var(--ink)', boxShadow: 'var(--shadow-card)' }}>
                                            {game.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: '16px 20px' }}>
                                    <h2 className="serif-display" style={{ fontSize: 20, margin: '0 0 8px', color: 'var(--ink)', lineHeight: 1.1 }}>
                                        {game.name}
                                    </h2>
                                    <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {game.description}
                                    </p>
                                    <span className="btn-accent" style={{ padding: '8px 18px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        {t.games.playNow}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {GAMES.map((game) => (
                            <a key={game.id} href={game.url} target="_blank" rel="noopener noreferrer"
                                style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', background: 'white', overflow: 'hidden', boxShadow: 'var(--shadow-card)', textDecoration: 'none', display: 'block', transition: 'transform 120ms' }}
                                className="hover:-translate-y-0.5 transition-transform">
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {/* Side banner */}
                                    <div style={{ width: 100, flexShrink: 0, background: game.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--hairline)', position: 'relative' }}>
                                        <span style={{ fontSize: 40, userSelect: 'none' }}>{game.emoji}</span>
                                        {game.badge && (
                                            <span style={{ position: 'absolute', top: 6, right: 6, padding: '2px 7px', background: 'white', border: '1px solid var(--hairline)', borderRadius: 10, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                                                {game.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 16 }}>
                                        <div>
                                            <h2 className="serif-display" style={{ fontSize: 18, margin: '0 0 4px', color: 'var(--ink)', lineHeight: 1.1 }}>
                                                {game.name}
                                            </h2>
                                            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {game.description}
                                            </p>
                                        </div>
                                        <span style={{ flexShrink: 0, padding: '8px 16px', border: '1px solid var(--hairline)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', background: 'white', boxShadow: 'var(--shadow-card)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                                            {t.games.playNow}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
