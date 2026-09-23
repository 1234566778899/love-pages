'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Info, X } from 'lucide-react';
import { useTranslation } from '@/i18n';

const APP_STORE_URL = 'https://apps.apple.com/us/app/mydiess/id6811741530';
const DISMISS_KEY = 'mydiess-ad-dismissed-at';
const DISMISS_DAYS = 3;
const SHOW_DELAY_MS = 3000;

// El editor y las páginas que recibe la pareja se dejan limpias:
// el anuncio taparía controles o el botón "No" que escapa.
const HIDDEN_PREFIXES = ['/create', '/p/'];

function wasDismissedRecently(): boolean {
    try {
        const at = Number(localStorage.getItem(DISMISS_KEY));
        return !!at && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch {
        return false;
    }
}

function track(event: string) {
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') gtag('event', event, { app: 'mydiess' });
}

export function MyDiessAd() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    const hiddenHere = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p));

    useEffect(() => {
        if (hiddenHere || wasDismissedRecently()) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => {
            setVisible(true);
            track('mydiess_ad_impression');
        }, SHOW_DELAY_MS);
        return () => clearTimeout(timer);
    }, [hiddenHere]);

    if (!visible) return null;

    const handleClose = () => {
        setVisible(false);
        track('mydiess_ad_close');
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch {
            // Sin storage el anuncio solo se cierra en esta visita.
        }
    };

    return (
        <aside
            role="complementary"
            aria-label={t.mydiessAd.adLabel}
            className="fixed z-[9000] bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 sm:w-[360px] animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <div className="relative bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
                {/* Barra superior estilo Google: etiqueta + info + aspa */}
                <div className="flex items-center justify-between pl-2 pr-1 pt-1">
                    <span className="inline-flex items-center rounded-[3px] bg-[#fbbc04] px-1.5 py-[1px] text-[10px] font-bold leading-4 text-gray-900">
                        {t.mydiessAd.adLabel}
                    </span>
                    <div className="flex items-center">
                        <span className="p-1 text-sky-600" title={t.mydiessAd.info}>
                            <Info className="w-3.5 h-3.5" />
                        </span>
                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label={t.mydiessAd.close}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('mydiess_ad_click')}
                    className="flex items-center gap-3 px-3 pb-3 pt-1 group"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/mydiess-icon.jpg"
                        alt="MyDiess"
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-[14px] border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[15px] text-gray-900 leading-tight group-hover:underline">
                            MyDiess
                        </p>
                        <p className="text-[12.5px] text-gray-600 leading-snug line-clamp-2 mt-0.5">
                            {t.mydiessAd.description}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                            {t.mydiessAd.meta}
                        </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#1a73e8] group-hover:bg-[#1765cc] px-4 py-1.5 text-[13px] font-medium text-white transition-colors">
                        {t.mydiessAd.cta}
                    </span>
                </a>
            </div>
        </aside>
    );
}
