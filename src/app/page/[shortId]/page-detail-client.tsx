'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    ExternalLink,
    Copy,
    Globe,
    Sparkles,
    QrCode,
    Download,
    Crown,
    X,
    ChevronDown,
    Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@/lib/utils';
import Link from 'next/link';
import QRCodeLib from 'qrcode';
import { useTranslation } from '@/i18n';

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
}

function BottomSheet({
    isOpen,
    onClose,
    children,
    title,
    height = '90vh',
}: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    height?: string;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(45,27,61,0.45)', backdropFilter: 'blur(4px)', zIndex: 40 }}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--paper)', borderTop: '1px solid var(--hairline)', borderRadius: 10, zIndex: 50, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: height }}
                    >
                        <div style={{ flexShrink: 0, paddingTop: 12, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}>
                            <div style={{ width: 40, height: 4, background: 'var(--ink)', borderRadius: 10, margin: '0 auto', opacity: 0.2 }} />
                        </div>
                        {title && (
                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px', borderBottom: '1.5px dashed var(--rule)' }}>
                                <h3 className="serif-display" style={{ fontSize: 20, color: 'var(--ink)' }}>{title}</h3>
                                <button
                                    onClick={onClose}
                                    style={{ width: 32, height: 32, borderRadius: 10, border: '1px solid var(--hairline)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}
                                >
                                    <X style={{ width: 16, height: 16, color: 'var(--ink)' }} />
                                </button>
                            </div>
                        )}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ── Stat chip ─────────────────────────────────────────────────
export default function PageDetailView() {
    const params = useParams();
    const router = useRouter();
    const shortId = params.shortId as string;
    const { user, loading: authLoading } = useAuthStore();
    const { t, locale } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 1023px)');
    const [pageData, setPageData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    /** Los detalles de la carta arrancan plegados: son consulta, no resultado. */
    const [showInfo, setShowInfo] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [generatingQr, setGeneratingQr] = useState(false);
    const brandedCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!authLoading && !user) router.push('/');
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) loadPageDetails();
    }, [user, shortId]);

    const loadPageDetails = async () => {
        try {
            setLoading(true);
            const { data: pagesData } = await api.pages.getMyPages();
            const page = pagesData.data.find((p: any) => p.shortId === shortId);
            if (!page) {
                toast.error(t.pageDetail.pageNotFound);
                router.push('/dashboard');
                return;
            }
            const { data } = await api.pages.getDetails(page._id);
            setPageData(data.data.page);
            setStats(data.data.stats);
            setResponses(data.data.responses || []);
        } catch {
            toast.error(t.pageDetail.loadError);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyUrl = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        const url = pageData?.url || `${window.location.origin}/p/${identifier}`;
        copyToClipboard(url);
        toast.success(t.pageDetail.linkCopied);
    };

    const handleOpenPublic = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        window.open(`/p/${identifier}`, '_blank');
    };

    const getPageUrl = () => {
        const identifier = pageData?.customSlug || pageData?.shortId || shortId;
        return pageData?.url || `${window.location.origin}/p/${identifier}`;
    };

    const closeQrModal = () => {
        setShowQrModal(false);
        setQrDataUrl(null);
    };

    const generateQrCode = useCallback(async () => {
        if (!user?.isPro) { setShowQrModal(true); return; }
        setGeneratingQr(true);
        setShowQrModal(true);
        try {
            const url = getPageUrl();
            const rawQrDataUrl = await QRCodeLib.toDataURL(url, {
                width: 360, margin: 2,
                color: { dark: '#2d1b3d', light: '#ffffff' },
                errorCorrectionLevel: 'M',
            });
            const img = new Image();
            img.src = rawQrDataUrl;
            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    try {
                        const canvas = brandedCanvasRef.current;
                        if (!canvas) { reject(new Error('Canvas not available')); return; }
                        const qrSize = 360, padding = 44, bottomExtra = 64;
                        canvas.width = qrSize + padding * 2;
                        canvas.height = qrSize + padding * 2 + bottomExtra;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) { reject(new Error('Context not available')); return; }
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
                        ctx.fill();
                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                        gradient.addColorStop(0, '#ff6b9d');
                        gradient.addColorStop(1, '#c4458b');
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.roundRect(0, 0, canvas.width, 6, [16, 16, 0, 0]);
                        ctx.fill();
                        ctx.drawImage(img, padding, padding, qrSize, qrSize);
                        ctx.fillStyle = '#8a7099';
                        ctx.font = '600 15px system-ui, -apple-system, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('💕 lovepages.ink', canvas.width / 2, qrSize + padding + 30);
                        ctx.fillStyle = '#b8a0c8';
                        ctx.font = '400 12px system-ui, -apple-system, sans-serif';
                        const title = pageData?.title || '';
                        const truncated = title.length > 40 ? title.substring(0, 40) + '...' : title;
                        ctx.fillText(truncated, canvas.width / 2, qrSize + padding + 50);
                        setQrDataUrl(canvas.toDataURL('image/png'));
                        resolve();
                    } catch (err) { reject(err); }
                };
                img.onerror = () => reject(new Error('Error loading QR image'));
            });
        } catch {
            toast.error(t.pageDetail.loadError);
            setShowQrModal(false);
        } finally {
            setGeneratingQr(false);
        }
    }, [user, pageData, shortId, t]);

    const downloadQr = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = `lovepages-qr-${pageData?.shortId || 'code'}.png`;
        link.href = qrDataUrl;
        link.click();
        toast.success(t.pageDetail.qrDownloaded);
    };

    const copyQrToClipboard = async () => {
        if (!qrDataUrl || !brandedCanvasRef.current) return;
        try {
            const blob = await new Promise<Blob | null>((resolve) =>
                brandedCanvasRef.current!.toBlob(resolve, 'image/png')
            );
            if (blob) {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                toast.success(t.pageDetail.qrCopied);
            }
        } catch {
            toast.error(t.pageDetail.qrCopyError);
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-PE', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
                <Header />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            </div>
        );
    }

    if (!user || !pageData) return null;

    const yesPercentage = stats?.totalResponses > 0
        ? ((stats.yesCount / stats.totalResponses) * 100).toFixed(1) : 0;
    const noPercentage = stats?.totalResponses > 0
        ? ((stats.noCount / stats.totalResponses) * 100).toFixed(1) : 0;

    // ── QR modal content ──────────────────────────────────────
    const qrModalContent = user.isPro ? (
        <>
            <div style={{ padding: '8px 24px 24px', textAlign: 'center' }}>
                {generatingQr ? (
                    <div style={{ padding: '64px 0' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{t.pageDetail.generatingQR}</p>
                    </div>
                ) : qrDataUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ background: 'var(--lila-soft)', borderRadius: 10, padding: 12, border: '1px solid var(--hairline)', display: 'inline-block' }}>
                            <img src={qrDataUrl} alt={t.pageDetail.qrCode} style={{ width: '100%', maxWidth: 280, borderRadius: 8, display: 'block', margin: '0 auto' }} />
                        </div>
                        <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
                            {t.pageDetail.scanToOpen} &quot;{pageData.title}&quot;
                        </p>
                    </div>
                ) : null}
            </div>
            {qrDataUrl && (
                <div
                    style={isMobile ? { borderTop: '1.5px dashed var(--rule)', padding: 16, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', display: 'flex', gap: 10 } as React.CSSProperties : { borderTop: '1.5px dashed var(--rule)', padding: 16, display: 'flex', gap: 10 }}
                >
                    <button onClick={downloadQr} className="btn-accent" style={{ flex: 1, padding: '12px 16px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Download style={{ width: 14, height: 14 }} />
                        {t.pageDetail.download}
                    </button>
                    <button onClick={copyQrToClipboard} style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--hairline)', background: 'white', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-card)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Copy style={{ width: 14, height: 14 }} />
                        {t.common.copy}
                    </button>
                </div>
            )}
        </>
    ) : (
        <>
            <div style={{ background: 'var(--butter)', borderBottom: '1px solid var(--hairline)', padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 10, background: 'white', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: 'var(--shadow-card)' }}>
                    <QrCode style={{ width: 28, height: 28, color: 'var(--ink)' }} />
                </div>
                <h3 className="serif-display" style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 4 }}>{t.pageDetail.qrCode}</h3>
                <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{t.pageDetail.proExclusive}</p>
            </div>
            <div style={isMobile ? { padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' } as React.CSSProperties : { padding: 24 }}>
                <div style={{ background: 'var(--lila-soft)', borderRadius: 10, padding: 24, border: '1px solid var(--hairline)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <div style={{ width: 160, height: 160, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, filter: 'blur(6px)', opacity: 0.4 }}>
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ borderRadius: 3, background: [0,1,4,5,6,9,10,14,15,16,19,20,21,24].includes(i) ? 'var(--ink)' : 'white' }} />
                        ))}
                    </div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 10, background: 'white', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
                            <Lock style={{ width: 20, height: 20, color: 'var(--ink)' }} />
                        </div>
                    </div>
                </div>
                <p style={{ fontSize: 15, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
                    {t.pageDetail.qrProDesc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/upgrade">
                        <button style={{ width: '100%', padding: '14px 20px', background: 'var(--butter)', border: '1px solid var(--hairline)', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--shadow-card)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <Crown style={{ width: 16, height: 16 }} />
                            {t.pageDetail.getProPrice}
                        </button>
                    </Link>
                    <button onClick={closeQrModal} style={{ width: '100%', padding: '12px 20px', border: 'none', background: 'transparent', fontSize: 15, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-soft)' }}>
                        {t.pageDetail.notNow}
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--sans)', color: 'var(--ink)' }}>
            <Header />
            <canvas ref={brandedCanvasRef} style={{ display: 'none' }} />

            <main style={{ maxWidth: 960, margin: '0 auto' }} className="px-5 pb-20 sm:px-8">

                {/* ── Cabecera ── */}
                <section style={{ padding: '28px 0 20px', display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                    <button
                        onClick={() => router.push('/dashboard')}
                        aria-label={t.pageDetail.backToPages}
                        style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: 'var(--paper-2)', color: 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}
                    >
                        <ArrowLeft style={{ width: 18, height: 18 }} />
                    </button>

                    <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 4 }}>
                            {t.dashboard.forRecipient.replace('{name}', pageData.recipientName)}
                        </div>
                        <h1 className="serif-display" style={{ fontSize: 'clamp(26px, 3.4vw, 38px)', color: 'var(--ink)', lineHeight: 1.15, margin: 0 }}>
                            {pageData.title}
                        </h1>
                        {/* Estado y enlace juntos: es la misma pregunta — «¿dónde vive
                            esta carta y sigue viva?» — y antes estaban en tarjetas distintas. */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 'var(--r-pill)', background: pageData.isActive ? 'var(--accent-soft)' : 'var(--paper-2)', color: pageData.isActive ? 'var(--accent-2-hex)' : 'var(--ink-soft)', fontSize: 14, fontWeight: 600 }}>
                                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: pageData.isActive ? 'var(--accent-hex)' : 'var(--ink-faint)' }} />
                                {pageData.isActive ? t.pageDetail.active : t.pageDetail.inactive}
                            </span>
                            {pageData.pageType === 'pro' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 'var(--r-pill)', background: 'var(--accent-hex)', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                                    <Sparkles style={{ width: 12, height: 12 }} /> PRO
                                </span>
                            )}
                            <span style={{ fontSize: 14, color: 'var(--ink-faint)' }}>
                                /p/{pageData.customSlug || pageData.shortId}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 4 }}>
                        <button onClick={handleCopyUrl} className="btn-ink" style={{ padding: '10px 16px', fontSize: 15 }}>
                            <Copy style={{ width: 15, height: 15 }} />
                            <span className="hidden sm:inline">{t.pageDetail.copyLink}</span>
                        </button>
                        <button onClick={handleOpenPublic} className="btn-accent" style={{ padding: '10px 16px', fontSize: 15 }}>
                            <ExternalLink style={{ width: 15, height: 15 }} />
                            <span className="hidden sm:inline">{t.pageDetail.viewPage}</span>
                        </button>
                    </div>
                </section>

                {/* ── Resultado ──
                    Antes esto eran tres tarjetas (cifras, barra y porcentaje) que
                    repetían el mismo dato. Ahora es un bloque: la respuesta grande,
                    la proporción debajo y las cifras de apoyo en una fila sin
                    marco propio — las cajas dentro de cajas eran la mitad del peso. */}
                <section style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-soft)', marginBottom: 16, overflow: 'hidden' }}>
                    <div style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
                        {stats?.totalResponses > 0 ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                                    <span className="serif-display" style={{ fontSize: 'clamp(34px, 5vw, 46px)', color: 'var(--ink)', lineHeight: 1 }}>
                                        {yesPercentage}%
                                    </span>
                                    <span style={{ fontSize: 17, color: 'var(--ink-soft)' }}>{t.pageDetail.saidYes}</span>
                                </div>

                                <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', background: 'var(--paper-3)', margin: '16px 0 10px' }}>
                                    <div style={{ width: `${yesPercentage}%`, background: 'var(--accent-hex)', transition: 'width 500ms ease' }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                    <span style={{ color: 'var(--accent-2-hex)', fontWeight: 600 }}>{t.pageDetail.yesLabel}: {stats.yesCount}</span>
                                    <span style={{ color: 'var(--ink-soft)' }}>{t.pageDetail.noLabel}: {stats.noCount}</span>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <span style={{ fontSize: 34 }}>💌</span>
                                <div>
                                    <div className="serif-display" style={{ fontSize: 20, color: 'var(--ink)' }}>{t.pageDetail.noResponses}</div>
                                    <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 2 }}>{t.pageDetail.shareToGetResponses}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cifras de apoyo: separadas por un filete, no por marcos */}
                    <div style={{ borderTop: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {[
                            { v: stats?.uniqueViews || 0, l: t.pageDetail.views },
                            { v: stats?.totalResponses || 0, l: t.pageDetail.responses },
                            { v: formatDate(pageData.createdAt).split(',')[0], l: t.pageDetail.createdAt.replace(':', '') },
                        ].map(({ v, l }, i) => (
                            <div key={l} style={{ padding: '16px 18px', borderLeft: i > 0 ? '1px solid var(--rule)' : 'none' }}>
                                <div className="serif-display" style={{ fontSize: 22, color: 'var(--ink)', lineHeight: 1.2 }}>{v}</div>
                                <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 2 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Respuestas ── */}
                {responses.length > 0 && (
                    <section style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-soft)', marginBottom: 16, overflow: 'hidden' }}>
                        <div style={{ padding: '18px 22px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h2 className="serif-display" style={{ fontSize: 18, color: 'var(--ink)', margin: 0 }}>
                                {t.pageDetail.responsesTitle}
                            </h2>
                            <span style={{ padding: '3px 10px', borderRadius: 'var(--r-pill)', background: 'var(--paper-2)', color: 'var(--ink-soft)', fontSize: 14, fontWeight: 600 }}>{responses.length}</span>
                        </div>
                        <div>
                            {responses.map((response: any, index: number) => (
                                <div
                                    key={response._id || index}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                                        padding: '12px 22px',
                                        borderTop: '1px solid var(--rule)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 999, background: response.answer === 'yes' ? 'var(--accent-soft)' : 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {response.answer === 'yes'
                                                ? <ThumbsUp style={{ width: 15, height: 15, color: 'var(--accent-2-hex)' }} />
                                                : <ThumbsDown style={{ width: 15, height: 15, color: 'var(--ink-soft)' }} />}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                                                {response.answer === 'yes' ? t.pageDetail.yesResponse : t.pageDetail.noResponse}
                                            </span>
                                            {response.location?.city && (
                                                <p style={{ fontSize: 14, color: 'var(--ink-faint)', display: 'flex', alignItems: 'center', gap: 4, margin: '2px 0 0' }}>
                                                    <Globe style={{ width: 11, height: 11, flexShrink: 0 }} />
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {response.location.city}, {response.location.country}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 14, color: 'var(--ink-faint)', flexShrink: 0 }}>
                                        <span className="hidden sm:inline">{formatDate(response.respondedAt)}</span>
                                        <span className="sm:hidden">{new Date(response.respondedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Lo que escribiste — plegado ──
                    Es material de consulta, no lo que se viene a ver: quien abre
                    esta pantalla quiere saber qué contestaron, no releer sus
                    propios textos de botón. */}
                <section style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-soft)', marginBottom: 16, overflow: 'hidden' }}>
                    <button
                        onClick={() => setShowInfo((v) => !v)}
                        aria-expanded={showInfo}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                        <h2 className="serif-display" style={{ fontSize: 18, color: 'var(--ink)', margin: 0, flex: 1 }}>{t.pageDetail.pageInfo}</h2>
                        <ChevronDown style={{ width: 17, height: 17, color: 'var(--ink-faint)', transform: showInfo ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }} />
                    </button>
                    {showInfo && (
                        <div style={{ padding: '0 22px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {pageData.message && (
                                <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{pageData.message}</p>
                            )}
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {[
                                    { label: t.pageDetail.yesButton, value: pageData.yesButtonText },
                                    { label: t.pageDetail.noButton, value: pageData.noButtonText },
                                    ...(pageData.noButtonEscapes ? [{ label: t.pageDetail.escapeButton, value: t.common.yes }] : []),
                                ].map(({ label, value }) => (
                                    <span key={label} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '8px 14px', borderRadius: 'var(--r-pill)', background: 'var(--paper-2)', fontSize: 14 }}>
                                        <span style={{ color: 'var(--ink-faint)' }}>{label}</span>
                                        <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{value}</strong>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* ── QR ──
                    Baja al final y pierde el cartel: es una función extra, no el
                    contenido, y en amarillo con borde discontinuo era lo que más
                    llamaba de toda la pantalla. */}
                <section style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-soft)', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                        <span style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent-2-hex)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <QrCode style={{ width: 18, height: 18 }} />
                        </span>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>{t.pageDetail.qrCode}</div>
                            <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 2 }}>
                                {user.isPro ? t.pageDetail.qrDesc : t.pageDetail.qrShareDesc}
                            </div>
                        </div>
                    </div>
                    <button onClick={generateQrCode} className="btn-ink" style={{ padding: '10px 16px', fontSize: 15, flexShrink: 0 }}>
                        {user.isPro
                            ? <><QrCode style={{ width: 15, height: 15 }} /><span className="hidden sm:inline">{t.pageDetail.generateQR}</span></>
                            : <><Crown style={{ width: 15, height: 15 }} /><span className="hidden sm:inline">{t.pageDetail.unlock}</span><span className="sm:hidden">PRO</span></>}
                    </button>
                </section>


                {/* ── QR Modal ── */}
                {isMobile ? (
                    <BottomSheet isOpen={showQrModal} onClose={closeQrModal} title={user.isPro ? t.pageDetail.qrCode : undefined}>
                        {qrModalContent}
                    </BottomSheet>
                ) : (
                    <AnimatePresence>
                        {showQrModal && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'fixed', inset: 0, background: 'rgba(45,27,61,0.45)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                                onClick={closeQrModal}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }}
                                    style={{ background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 10, boxShadow: 'var(--shadow-card)', maxWidth: 400, width: '100%', overflow: 'hidden' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {user.isPro && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 12px', borderBottom: '1.5px dashed var(--rule)' }}>
                                            <h3 className="serif-display" style={{ fontSize: 22, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <QrCode style={{ width: 20, height: 20, color: 'var(--accent-hex)' }} />
                                                {t.pageDetail.qrCode}
                                            </h3>
                                            <button onClick={closeQrModal} style={{ width: 32, height: 32, borderRadius: 10, border: '1px solid var(--hairline)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
                                                <X style={{ width: 16, height: 16 }} />
                                            </button>
                                        </div>
                                    )}
                                    {qrModalContent}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

            </main>
        </div>
    );
}
