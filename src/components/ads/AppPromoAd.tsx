'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n';

// Anuncios propios (house ads) de las apps del creador, con el aspecto de un
// anuncio nativo de Google. No usan AdSense: son enlaces directos a la App Store.

export type PromoAppId = 'mydiess' | 'cercaya';

interface PromoApp {
    name: string;
    icon: string;
    url: string;
    category: { es: string; en: string };
    headline: { es: string; en: string };
    body: { es: string; en: string };
}

const APPS: Record<PromoAppId, PromoApp> = {
    mydiess: {
        name: 'MyDiess',
        icon: '/ads/mydiess.jpg',
        url: 'https://apps.apple.com/app/mydiess/id6811741530',
        category: { es: 'Estilo de vida', en: 'Lifestyle' },
        headline: { es: 'El diario de su historia de amor', en: 'The diary of your love story' },
        body: {
            es: 'Guarden recuerdos, vean su mapa de amor y envíense notas al instante.',
            en: 'Save memories, see your love map and send each other notes instantly.',
        },
    },
    cercaya: {
        name: 'CercaYa',
        icon: '/ads/cercaya.jpg',
        url: 'https://apps.apple.com/app/cercaya/id6792215233',
        category: { es: 'Navegación', en: 'Navigation' },
        headline: { es: 'Duerme en el viaje, te avisamos al llegar', en: 'Nap on the ride, we’ll wake you up' },
        body: {
            es: 'Alarma de llegada para bus, tren o metro. Funciona con la pantalla bloqueada.',
            en: 'Arrival alarm for bus, train or subway. Works with the screen locked.',
        },
    },
};

const COPY = {
    es: { ad: 'Anuncio', install: 'Instalar', free: 'Gratis', close: 'Cerrar anuncio', why: 'Anuncio de otra app del creador de Love Pages.' },
    en: { ad: 'Ad', install: 'Install', free: 'Free', close: 'Close ad', why: 'Ad for another app by the creator of Love Pages.' },
};

interface AppPromoAdProps {
    /** Si se omite, se elige una app al azar. */
    app?: PromoAppId;
    /** card: tarjeta vertical para grids · banner: tira horizontal · compact: banner pequeño */
    variant?: 'card' | 'banner' | 'compact';
    /** Identifica dónde se muestra; se usa para recordar si el usuario lo cerró. */
    placement: string;
    className?: string;
    style?: React.CSSProperties;
}

const dismissKey = (placement: string) => `lp-promo-dismissed:${placement}`;

export function AppPromoAd({ app, variant = 'banner', placement, className, style }: AppPromoAdProps) {
    const { locale } = useTranslation();
    const [appId, setAppId] = useState<PromoAppId | null>(app ?? null);
    const [hidden, setHidden] = useState(false);
    const [showWhy, setShowWhy] = useState(false);

    // Se resuelve en el cliente para no provocar mismatch de hidratación
    useEffect(() => {
        try {
            if (sessionStorage.getItem(dismissKey(placement))) setHidden(true);
        } catch {}
        if (!app) setAppId(Math.random() < 0.5 ? 'mydiess' : 'cercaya');
    }, [app, placement]);

    if (hidden || !appId) return null;

    const a = APPS[appId];
    const c = COPY[locale] ?? COPY.es;

    const dismiss = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setHidden(true);
        try { sessionStorage.setItem(dismissKey(placement), '1'); } catch {}
    };

    const toggleWhy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowWhy((v) => !v);
    };

    return (
        <a
            href={a.url}
            target="_blank"
            rel="noopener sponsored"
            className={`gad gad--${variant}${className ? ` ${className}` : ''}`}
            style={style}
            aria-label={`${c.ad}: ${a.name} — ${a.headline[locale] ?? a.headline.es}`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* AdChoices + cerrar, como en los anuncios de Google */}
            <span className="gad__chrome">
                <button type="button" className="gad__chip" onClick={toggleWhy} aria-label="AdChoices">
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        <rect x="7.25" y="7" width="1.5" height="4.5" rx=".6" fill="currentColor" />
                        <circle cx="8" cy="4.9" r=".95" fill="currentColor" />
                    </svg>
                </button>
                <button type="button" className="gad__chip" onClick={dismiss} aria-label={c.close}>
                    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            </span>

            {showWhy && <span className="gad__why">{c.why}</span>}

            <span className="gad__main">
                <img className="gad__icon" src={a.icon} alt="" width={64} height={64} loading="lazy" />
                <span className="gad__text">
                    <span className="gad__meta">
                        <span className="gad__label">{c.ad}</span>
                        <span className="gad__dot">·</span>
                        <span>App Store</span>
                    </span>
                    <span className="gad__title">{a.headline[locale] ?? a.headline.es}</span>
                    <span className="gad__sub">
                        {a.name} · {a.category[locale] ?? a.category.es} · {c.free}
                    </span>
                    {variant !== 'compact' && <span className="gad__body">{a.body[locale] ?? a.body.es}</span>}
                </span>
                <span className="gad__cta">{c.install}</span>
            </span>
        </a>
    );
}
