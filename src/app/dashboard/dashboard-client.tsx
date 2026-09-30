'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, usePageStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import { useTranslation } from '@/i18n';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Plus, Eye, Trash2, ToggleLeft, ToggleRight, Crown, Sparkles, Link2, Clock, Bell, BellOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getTimeAgo, copyToClipboard } from '@/lib/utils';
import { AppPromoAd } from '@/components/ads/AppPromoAd';

// ── Mini stat ────────────────────────────────────────────────
function Mini({ n, l, accent }: { n: string | number; l: string; accent?: boolean }) {
    return (
        <div style={{ padding: '16px 24px', borderRight: '1px solid var(--hairline)' }}>
            <div className="serif-display" style={{ fontSize: 'clamp(26px, 5.5vw, 42px)', lineHeight: 1, color: accent ? 'var(--accent-hex)' : 'var(--ink-black)' }}>{n}</div>
            <div className="mono-eyebrow" style={{ marginTop: 6, color: 'var(--ink-black)' }}>{l}</div>
        </div>
    );
}

// ── Sparkline chart ──────────────────────────────────────────
function Sparkline({ points }: { points: number[] }) {
    const { t } = useTranslation();
    const max = Math.max(...points, 1);
    const w = 200, h = 48;
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * w} ${h - (p / max) * h}`).join(' ');
    const last = points[points.length - 1];
    return (
        <div>
            <div className="mono-eyebrow" style={{ fontSize: 14, marginBottom: 6 }}>{t.dashboard.responses14d}</div>
            <svg viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%', height: h }}>
                <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="rgba(123,34,64,0.12)" />
                <path d={path} stroke="var(--accent-hex)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={w} cy={h - (last / max) * h} r="4.5" fill="var(--accent-hex)" stroke="var(--paper-soft)" strokeWidth="2" />
            </svg>
        </div>
    );
}

// ── Page card ────────────────────────────────────────────────
function PageCard({
    page, onToggle, onDelete, onCopy, openMenuId, setOpenMenuId,
}: {
    page: any; onToggle: () => void; onDelete: () => void; onCopy: () => void;
    openMenuId: string | null; setOpenMenuId: (id: string | null) => void;
}) {
    const { t, locale } = useTranslation();
    const total = page.yesCount + page.noCount;
    const yesPct = total ? Math.round((page.yesCount / total) * 100) : 0;

    const toneIndex = Math.abs(page.title?.charCodeAt(0) ?? 0) % 3;
    const tones = ['lila', 'butter', 'peach'];
    const tone = tones[toneIndex];
    const bgs: Record<string, string> = {
        lila: 'var(--accent-soft)',
        butter: 'var(--butter)',
        peach: 'var(--melocoton)',
    };

    const isExpired = page.expiresAt ? new Date(page.expiresAt) < new Date() : false;
    const expirationText = page.expiresAt
        ? isExpired ? t.dashboard.cardExpired : t.dashboard.cardExpires.replace('{time}', getTimeAgo(page.expiresAt, locale))
        : null;

    const titleChars = [...(page.title ?? '')];
    const emoji = titleChars.find((c: string) => c.codePointAt(0)! > 0xffff) ?? '💌';

    return (
        <div style={{ border: 'none', borderRadius: 'var(--r-xl)', background: 'var(--paper-soft)', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
            {/* Card header — un color plano por carta, sin la doble tinta riso */}
            <div style={{ height: 140, background: bgs[tone], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1, fontSize: 50 }}>{emoji}</div>

                <span style={{ position: 'absolute', top: 12, left: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 14, fontWeight: 600, borderRadius: 'var(--r-pill)', background: 'rgba(255,255,255,0.9)', color: page.isActive ? 'var(--accent-2-hex)' : 'var(--ink-soft)', zIndex: 2 }}>
                    <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: page.isActive ? 'var(--accent-hex)' : 'var(--ink-faint)' }} />
                    {page.isActive ? t.dashboard.active : t.dashboard.draft}
                </span>

                {page.pageType === 'pro' && (
                    <span style={{ position: 'absolute', top: 12, left: page.isActive ? 'auto' : 12, right: page.isActive ? 54 : 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 'var(--r-pill)', background: 'var(--accent-hex)', color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 2 }}>
                        <Sparkles style={{ width: 12, height: 12 }} /> PRO
                    </span>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === page._id ? null : page._id); }}
                    style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: 'var(--ink-soft)', zIndex: 10 }}>
                    ⋯
                </button>
                {openMenuId === page._id && (
                    <div style={{ position: 'absolute', top: 52, right: 12, background: 'var(--paper-soft)', border: 'none', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', minWidth: 170, zIndex: 50 }}>
                        <button onClick={() => { onToggle(); setOpenMenuId(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', width: '100%', fontSize: 15, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', textAlign: 'left' }}
                            className="hover:bg-[var(--lila-soft)]">
                            {page.isActive ? <ToggleRight style={{ width: 14, height: 14 }} /> : <ToggleLeft style={{ width: 14, height: 14 }} />}
                            {page.isActive ? t.dashboard.deactivate : t.dashboard.activate}
                        </button>
                        <button onClick={() => { onDelete(); setOpenMenuId(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', width: '100%', fontSize: 15, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', textAlign: 'left', borderTop: '1px solid var(--rule)' }}
                            className="hover:bg-red-50">
                            <Trash2 style={{ width: 14, height: 14 }} />
                            {t.common.delete}
                        </button>
                    </div>
                )}
            </div>

            {/* Card body */}
            <div style={{ padding: 20 }}>
                <div className="mono-eyebrow" style={{ fontSize: 14 }}>{t.dashboard.forName.replace('{name}', page.recipientName)}</div>
                <h3 className="serif-display" style={{ fontSize: 22, margin: '6px 0 4px', color: 'var(--ink)', lineHeight: 1.1 }}>
                    {page.title}
                </h3>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink-soft)' }}>
                    /p/{page.shortId}
                </div>

                {expirationText && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, padding: '3px 10px', background: isExpired ? '#fee2e2' : 'var(--butter)', border: '1px solid var(--hairline)', fontSize: 14, fontWeight: 600, color: isExpired ? '#dc2626' : 'var(--ink)' }}>
                        <Clock style={{ width: 10, height: 10 }} /> {expirationText}
                    </span>
                )}

                {page.isActive && page.totalResponses > 0 ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                            <div>
                                <div className="serif-display" style={{ fontSize: 26, lineHeight: 1, color: 'var(--ink-black)' }}>{page.views}</div>
                                <div className="mono-eyebrow" style={{ fontSize: 14, marginTop: 4 }}>{t.dashboard.statsViews}</div>
                            </div>
                            <div>
                                <div className="serif-display" style={{ fontSize: 26, lineHeight: 1, color: 'var(--accent-hex)' }}>{page.yesCount}</div>
                                <div className="mono-eyebrow" style={{ fontSize: 14, marginTop: 4 }}>{t.dashboard.statsSi}</div>
                            </div>
                            <div>
                                <div className="serif-display" style={{ fontSize: 26, lineHeight: 1, color: 'var(--ink-black)' }}>{page.noCount}</div>
                                <div className="mono-eyebrow" style={{ fontSize: 14, marginTop: 4 }}>{t.dashboard.statsNo}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <div style={{ display: 'flex', height: 10, overflow: 'hidden', background: 'var(--paper-3)', border: '1px solid var(--hairline)' }}>
                                <div style={{ width: `${yesPct}%`, background: 'var(--accent-hex)', mixBlendMode: 'multiply' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 14, color: 'var(--ink-soft)' }}>
                                <span>{t.dashboard.saidYesPct.replace('{pct}', String(yesPct))}</span>
                                <span>{getTimeAgo(page.createdAt, locale)}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--rule)', fontSize: 15, color: 'var(--ink-soft)' }}>
                        {page.isActive ? `${page.views} ${t.dashboard.statsViews} · ${t.dashboard.statsNo}` : `${t.dashboard.noPublished} · ${getTimeAgo(page.createdAt, locale)}`}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <Link href={`/page/${page.shortId}`} style={{ flex: 1 }}>
                        <button style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--hairline)', background: page.isActive ? 'var(--accent-hex)' : 'var(--ink-black)', color: 'var(--paper)', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-card)', fontFamily: 'var(--mono)', letterSpacing: 0 }}>
                            {page.isActive ? t.dashboard.viewPage : t.dashboard.continuePage}
                        </button>
                    </Link>
                    <button onClick={onCopy} style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--hairline)', background: 'var(--paper-soft)', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-card)', color: 'var(--ink-black)', fontFamily: 'var(--mono)', letterSpacing: 0 }}>
                        {t.dashboard.copyBtn}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Free limit modal ─────────────────────────────────────────
function LimitModal({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}
            onClick={onClose}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(45,27,61,0.45)', backdropFilter: 'blur(4px)' }} />
            <div style={{ position: 'relative', background: 'white', border: '1px solid var(--hairline)', padding: '40px 32px', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}
                onClick={(e) => e.stopPropagation()}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>💌</div>
                <h2 className="serif-display" style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.15 }}>
                    {t.dashboard.limitModalTitle}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 28 }}>
                    {t.dashboard.limitModalDesc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/upgrade">
                        <button className="btn-accent" style={{ width: '100%', padding: '14px 20px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <Crown style={{ width: 16, height: 16 }} /> {t.dashboard.limitModalCta}
                        </button>
                    </Link>
                    <button onClick={onClose}
                        style={{ width: '100%', padding: '12px 20px', border: '1px solid var(--hairline)', background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--ink)', boxShadow: 'var(--shadow-card)' }}>
                        {t.dashboard.limitModalDecline}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── New page card ────────────────────────────────────────────
function NewCard({ onClick }: { onClick: () => void }) {
    const { t } = useTranslation();
    return (
        <button onClick={onClick} style={{ border: '2px dashed var(--lila-2)', borderRadius: 'var(--r-xl)', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--sans)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 380, width: '100%' }}
            className="hover:bg-white/60 transition-colors">
            <div style={{ width: 60, height: 60, borderRadius: 20, background: 'var(--accent-soft)', color: 'var(--accent-hex)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus style={{ width: 26, height: 26 }} strokeWidth={2.4} />
            </div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, color: 'var(--ink)' }}>{t.dashboard.newLetter}</div>
            <div style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{t.dashboard.newLetterDesc}</div>
        </button>
    );
}

// ── Main dashboard ───────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, updateUser } = useAuthStore();
    const { pages, setPages, removePage, updatePage } = usePageStore();
    const [loadingPages, setLoadingPages] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'draft'>('all');
    const [showLimitModal, setShowLimitModal] = useState(false);
    const { t } = useTranslation();
    const { permission, loading: pushLoading, subscribe, unsubscribe } = usePushNotifications();

    const handlePushToggle = async () => {
        if (permission === 'granted') { await unsubscribe(); toast(t.dashboard.pushToastDeactivated); return; }
        const ok = await subscribe();
        if (ok) toast.success(t.dashboard.pushToastActivated);
        else if (permission === 'denied') toast.error(t.dashboard.pushToastDenied);
    };

    useEffect(() => { if (user) loadPages(); }, [user]);

    useEffect(() => {
        const close = () => setOpenMenuId(null);
        if (openMenuId) { document.addEventListener('click', close); return () => document.removeEventListener('click', close); }
    }, [openMenuId]);

    const loadPages = async () => {
        try {
            setLoadingPages(true);
            const { data } = await api.pages.getMyPages();
            setPages(data.data);
        } catch { toast.error(t.dashboard.loadError); }
        finally { setLoadingPages(false); }
    };

    const handleCopyUrl = (url: string) => { copyToClipboard(url); toast.success(t.dashboard.linkCopied); };

    const handleToggleStatus = async (pageId: string, current: boolean) => {
        try {
            await api.pages.toggleStatus(pageId);
            updatePage(pageId, { isActive: !current });
            toast.success(current ? t.dashboard.pageDeactivated : t.dashboard.pageActivated);
        } catch { toast.error(t.dashboard.statusChangeError); }
    };

    const handleDelete = async (pageId: string) => {
        if (!confirm(t.dashboard.confirmDelete)) return;
        try {
            await api.pages.delete(pageId);
            removePage(pageId);
            const newCount = Math.max(0, user!.pagesCreated - 1);
            updateUser({
                pagesCreated: newCount,
                canCreatePage: true,
                remainingPages: typeof user!.remainingPages === 'number' ? user!.remainingPages + 1 : 'unlimited',
            });
            toast.success(t.dashboard.pageDeleted);
        } catch { toast.error(t.dashboard.deleteError); }
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
                <Header />
                <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <span style={{ fontSize: 64 }}>💌</span>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(28px, 5vw, 48px)', margin: '16px 0 12px', color: 'var(--ink)', lineHeight: 1.12 }}>
                        <em style={{ color: 'var(--accent-hex)' }}>{t.dashboard.loginToSeeEm}</em>{t.dashboard.loginToSeeRest}
                    </h1>
                    <p style={{ color: 'var(--ink-2)', fontSize: 17, lineHeight: 1.55 }}>{t.dashboard.heroDesc}</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
                        <Link href="/create">
                            <button className="btn-accent" style={{ fontSize: 15, padding: '14px 24px' }}>
                                <Plus style={{ width: 16, height: 16, display: 'inline', marginRight: 6 }} />
                                {t.dashboard.createPageFree}
                            </button>
                        </Link>
                        <Link href="/templates">
                            <button style={{ background: 'white', border: '1px solid var(--hairline)', color: 'var(--ink)', padding: '12px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>
                                {t.dashboard.viewTemplates}
                            </button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const totalViews = pages.reduce((s, p) => s + p.views, 0);
    const totalResponses = pages.reduce((s, p) => s + p.totalResponses, 0);
    const activeCount = pages.filter((p) => p.isActive).length;
    const draftCount = pages.filter((p) => !p.isActive).length;
    const freeLimitReached = !user.isPro && user.canCreatePage === false;
    const handleCreate = () => {
        if (freeLimitReached) { setShowLimitModal(true); return; }
        router.push('/create');
    };

    const filteredPages = pages.filter((p) =>
        filter === 'all' ? true : filter === 'active' ? p.isActive : !p.isActive
    );

    const greetingHour = new Date().getHours();
    const greeting = greetingHour < 12 ? t.dashboard.goodMorning : greetingHour < 19 ? t.dashboard.goodAfternoon : t.dashboard.goodEvening;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--sans)', color: 'var(--ink)' }}>
            <Header />

            <main style={{ maxWidth: 1200, margin: '0 auto' }} className="px-5 pb-20 sm:px-12">
                {/* ── Hero section ── */}
                <section style={{ padding: '40px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <span className="sticker-badge" style={{ marginBottom: 12 }}>
                            {greeting}, {user.displayName?.split(' ')[0] ?? t.dashboard.you}
                        </span>
                        <h1 className="serif-display" style={{ fontSize: 'clamp(38px, 5vw, 56px)', margin: '12px 0 0', color: 'var(--ink-black)', lineHeight: 1.12 }}>
                            {t.dashboard.yourLetters}
                        </h1>
                    </div>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Filtros — segmentado suave, el activo sube a blanco */}
                        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 'var(--r-pill)', background: 'var(--paper-2)' }}>
                            {([['all', t.dashboard.filterAll, pages.length], ['active', t.dashboard.filterActive, activeCount], ['draft', t.dashboard.filterDrafts, draftCount]] as const).map(([val, label, count]) => (
                                <button key={val} onClick={() => setFilter(val)}
                                    style={{ padding: '8px 16px', borderRadius: 'var(--r-pill)', background: filter === val ? 'var(--paper-soft)' : 'transparent', color: filter === val ? 'var(--ink-black)' : 'var(--ink-soft)', border: 'none', boxShadow: filter === val ? 'var(--shadow-soft)' : 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 140ms' }}>
                                    {label} · {count}
                                </button>
                            ))}
                        </div>

                        <button onClick={handleCreate} className="btn-accent" style={{ padding: '12px 20px', fontSize: 16 }}>
                            <Plus style={{ width: 17, height: 17 }} strokeWidth={2.4} />
                            {t.dashboard.newLetter}
                        </button>
                    </div>
                </section>

                {/* ── Stats strip ── */}
                <section style={{ margin: '0 0 32px', border: 'none', borderRadius: 'var(--r-xl)', background: 'var(--paper-soft)', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }} className="grid grid-cols-2 sm:grid-cols-[repeat(4,1fr)_2fr] items-center">
                    {/* Todas las cifras de esta tira salen de `pages`, igual que la
                        lista de abajo. Usar aquí el contador histórico del backend
                        hacía que dijera «7 páginas» junto a «aún no has creado ninguna». */}
                    <Mini n={pages.length} l={t.dashboard.statPages} />
                    <Mini n={totalViews} l={t.dashboard.statTotalViews} />
                    <Mini n={totalResponses} l={t.dashboard.statYesResponses} accent />
                    <Mini n={activeCount} l={t.dashboard.statActive} />
                    <div className="max-sm:col-span-2" style={{ padding: '16px 24px' }}>
                        <Sparkline points={[3, 7, 4, 12, 18, 11, 22, 28, 18, 24, 31, 29, 38, totalResponses || 1]} />
                    </div>
                </section>

                {/* ── Push notifications toggle ── */}
                {permission !== 'unsupported' && (
                    <div style={{ marginBottom: 24 }}>
                        <button onClick={handlePushToggle} disabled={pushLoading || permission === 'denied'}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', border: 'none', borderRadius: 'var(--r-lg)', background: permission === 'granted' ? 'var(--mint)' : 'var(--paper-soft)', cursor: permission === 'denied' ? 'not-allowed' : 'pointer', opacity: permission === 'denied' ? 0.6 : 1, boxShadow: 'var(--shadow-soft)' }}
                            title={permission === 'denied' ? t.dashboard.pushTitleBlocked : permission === 'granted' ? t.dashboard.pushTitleDeactivate : t.dashboard.pushTitleActivate}>
                            {permission === 'granted' ? <Bell style={{ width: 16, height: 16 }} /> : <BellOff style={{ width: 16, height: 16 }} />}
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                                    {permission === 'granted' ? t.dashboard.pushAlertsActive : t.dashboard.pushAlertsTitle}
                                </div>
                                <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                                    {permission === 'granted' ? t.dashboard.pushAlertsActiveDesc : permission === 'denied' ? t.dashboard.pushAlertsBlockedDesc : t.dashboard.pushAlertsInactiveDesc}
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* ── Pages grid ── */}
                <section>
                    <div className="mono-eyebrow" style={{ marginBottom: 18, fontSize: 15 }}>{t.dashboard.sectionTitle}</div>

                    {loadingPages ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 999, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                        </div>
                    ) : filteredPages.length === 0 && pages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px', border: '2px dashed var(--lila-2)', borderRadius: 'var(--r-xl)' }}>
                            <span style={{ fontSize: 64 }}>💌</span>
                            <h3 className="serif-display" style={{ fontSize: 'clamp(22px, 4vw, 36px)', margin: '16px 0 8px', color: 'var(--ink)', lineHeight: 1.12 }}>
                                {t.dashboard.noPages}
                            </h3>
                            <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginBottom: 28 }}>{t.dashboard.noPagesDesc}</p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/create">
                                    <button className="btn-accent" style={{ padding: '14px 24px', fontSize: 14 }}>
                                        + {t.dashboard.createFirstPage}
                                    </button>
                                </Link>
                                <Link href="/templates">
                                    <button style={{ background: 'white', border: '1px solid var(--hairline)', color: 'var(--ink)', padding: '12px 22px', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>
                                        {t.dashboard.useTemplate}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
                            {filteredPages.map((page) => (
                                <PageCard
                                    key={page._id}
                                    page={page}
                                    onToggle={() => handleToggleStatus(page._id, page.isActive)}
                                    onDelete={() => handleDelete(page._id)}
                                    onCopy={() => handleCopyUrl(page.url)}
                                    openMenuId={openMenuId}
                                    setOpenMenuId={setOpenMenuId}
                                />
                            ))}
                            <AppPromoAd variant="card" placement="dashboard" />
                            {filter === 'all' && <NewCard onClick={handleCreate} />}
                        </div>
                    )}
                </section>
            </main>

            {/* Mobile FAB */}
            {pages.length > 0 && (
                <button onClick={handleCreate} className="btn-accent fixed bottom-5 right-5 z-40 md:hidden" style={{ width: 56, height: 56, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '4px 4px 0 var(--accent-deep-hex)' }}>
                    +
                </button>
            )}

            {showLimitModal && <LimitModal onClose={() => setShowLimitModal(false)} />}
        </div>
    );
}
