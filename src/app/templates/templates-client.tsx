'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import { Crown, Eye, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/i18n';
import { AppPromoAd } from '@/components/ads/AppPromoAd';

interface Template {
    _id: string;
    name: string;
    description: string;
    previewImageUrl: string;
    category: string;
    isPro: boolean;
    tags: string[];
    usageCount: number;
    editableFields: { key: string; label: string; type: string; defaultValue: string }[];
}

const CAT_TONES: Record<string, string> = {
    all: 'var(--lila)', 'san-valentin': 'var(--accent-hex)', declaracion: 'var(--melocoton)',
    cumpleanos: 'var(--butter)', aniversario: 'var(--lila-2)', amistad: 'var(--mint)',
    navidad: 'var(--mint)', otro: 'var(--butter)',
};

export default function TemplatesPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const CATEGORIES = [
        { id: 'all', name: t.templates.categoryAll, emoji: '✨' },
        { id: 'san-valentin', name: t.templates.categoryValentine, emoji: '💕' },
        { id: 'declaracion', name: t.templates.categoryDeclaration, emoji: '💘' },
        { id: 'cumpleanos', name: t.templates.categoryBirthday, emoji: '🎂' },
        { id: 'aniversario', name: t.templates.categoryAnniversary, emoji: '💍' },
        { id: 'amistad', name: t.templates.categoryFriendship, emoji: '🤝' },
        { id: 'navidad', name: t.templates.categoryChristmas, emoji: '🎄' },
        { id: 'otro', name: t.templates.categoryOther, emoji: '🎁' },
    ];

    useEffect(() => { loadTemplates(); }, [activeCategory]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const { data } = await api.templates.getAll(activeCategory !== 'all' ? activeCategory : undefined);
            setTemplates(data.data);
        } catch {
            toast.error(t.templates.loadError);
        } finally {
            setLoading(false);
        }
    };

    const filtered = templates.filter((t) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
    });

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
            <Header />

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px' }} className="max-sm:px-4">
                {/* Hero */}
                <section style={{ padding: '40px 0 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                        <div>
                            <span className="sticker-badge" style={{ background: 'var(--lila)', marginBottom: 12 }}>
                                {t.templates.badgeLabel}
                            </span>
                            <h1 className="serif-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '12px 0 0', color: 'var(--ink)', lineHeight: 1.12 }}>
                                {t.templates.heroTitle}
                            </h1>
                        </div>
                        {/* Search */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--hairline)', borderRadius: 10, background: 'white', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                            <span style={{ padding: '0 14px', fontSize: 16 }}>🔍</span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.templates.searchPlaceholder}
                                style={{ padding: '10px 16px 10px 0', border: 'none', background: 'transparent', fontSize: 14, color: 'var(--ink)', outline: 'none', width: 220 }}
                            />
                        </div>
                    </div>

                    {/* Category pills */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {CATEGORIES.map((cat) => (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                                    borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                                    border: '1px solid var(--hairline)',
                                    background: activeCategory === cat.id ? CAT_TONES[cat.id] : 'white',
                                    boxShadow: activeCategory === cat.id ? '3px 3px 0 var(--ink)' : '2px 2px 0 var(--ink)',
                                    color: 'var(--ink)',
                                    transition: 'all 120ms',
                                }}>
                                {cat.emoji} {cat.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Count */}
                {!loading && (
                    <div className="mono-eyebrow" style={{ marginBottom: 20, fontSize: 15 }}>
                        {t.templates.templateCount.replace('{count}', String(filtered.length)).replace('{plural}', filtered.length !== 1 ? 's' : '')}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 10, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px', border: '2px dashed var(--ink)', borderRadius: 10 }}>
                        <span style={{ fontSize: 64 }}>📭</span>
                        <h3 className="serif-display" style={{ fontSize: 32, margin: '16px 0 8px', color: 'var(--ink)' }}>
                            {searchQuery ? t.templates.tryOtherSearch : t.templates.noTemplates}
                        </h3>
                        <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>
                            {searchQuery ? t.templates.tryOtherSearch : t.templates.moreComingSoon}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }} className="max-sm:grid-cols-1">
                        {filtered.map((template, i) => {
                            const catTone = CAT_TONES[template.category] || 'var(--lila)';
                            return (
                                <Fragment key={template._id}>
                                {i === Math.min(2, filtered.length - 1) && <AppPromoAd variant="card" placement="templates" />}
                                <div
                                    onClick={() => router.push(`/templates/${template._id}`)}
                                    style={{ border: '1px solid var(--hairline)', borderRadius: 10, background: 'white', overflow: 'hidden', boxShadow: 'var(--shadow-card)', cursor: 'pointer', transition: 'transform 120ms' }}
                                    className="hover:-translate-y-0.5 transition-transform">

                                    {/* Preview */}
                                    <div style={{ height: 180, background: catTone, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--hairline)', overflow: 'hidden' }}>
                                        {template.previewImageUrl ? (
                                            <img src={template.previewImageUrl} alt={template.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                        ) : (
                                            <span style={{ fontSize: 56 }}>
                                                {CATEGORIES.find((c) => c.id === template.category)?.emoji ?? '💌'}
                                            </span>
                                        )}

                                        {template.isPro && (
                                            <span style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'var(--butter)', border: '1px solid var(--hairline)', borderRadius: 10, fontSize: 14, fontWeight: 700, color: 'var(--ink)', boxShadow: 'var(--shadow-card)' }}>
                                                <Crown style={{ width: 10, height: 10 }} /> PRO
                                            </span>
                                        )}

                                        <span style={{ position: 'absolute', top: 10, left: 10, padding: '3px 10px', background: 'rgba(255,255,255,0.85)', border: '1px solid var(--hairline)', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                                            {CATEGORIES.find((c) => c.id === template.category)?.emoji}{' '}
                                            {CATEGORIES.find((c) => c.id === template.category)?.name}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: '16px 18px' }}>
                                        <h3 className="serif-display" style={{ fontSize: 20, margin: '0 0 6px', color: 'var(--ink)', lineHeight: 1.1 }}>
                                            {template.name}
                                        </h3>
                                        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {template.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--ink-soft)' }}>
                                                <Users style={{ width: 12, height: 12 }} />
                                                {t.templates.usesLabel.replace('{count}', String(template.usageCount))}
                                            </div>
                                            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid var(--hairline)', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', background: template.isPro ? 'var(--butter)' : 'var(--mint)', boxShadow: 'var(--shadow-card)', color: 'var(--ink)' }}>
                                                <Eye style={{ width: 12, height: 12 }} />
                                                {t.templates.useBtn}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </Fragment>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
