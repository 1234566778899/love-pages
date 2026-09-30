'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import { useTranslation } from '@/i18n';
import { Crown, Check, Sparkles, Zap, CreditCard, LinkIcon, Wand2, Music, Palette, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

type PaymentProvider = 'mercadopago' | 'paypal';

const FEATURES = [
    { icon: Palette, key: 'feature1' },
    { icon: Wand2, key: 'feature2' },
    { icon: LinkIcon, key: 'feature3' },
    { icon: Music, key: 'feature4' },
    { icon: Sparkles, key: 'feature5' },
    { icon: Zap, key: 'feature6' },
    { icon: Clock, key: 'feature7' },
] as const;

export default function UpgradePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('mercadopago');
    const { t } = useTranslation();
    const freeLimitReached = !!user && !user.isPro && user.canCreatePage === false;

    useEffect(() => { if (!authLoading && !user) router.push('/'); }, [user, authLoading, router]);
    useEffect(() => { if (user?.isPro) { toast.success(t.upgrade.alreadyPro); router.push('/dashboard'); } }, [user, router, t]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            if (selectedProvider === 'mercadopago') {
                const { data } = await api.payments.createMercadoPagoPayment();
                const url = data.data.initPoint;
                const w = window.open(url, '_blank');
                if (!w) window.location.href = url;
            } else {
                const { data } = await api.payments.createPayPalOrder();
                const url = data.data.approvalUrl;
                const w = window.open(url, '_blank');
                if (!w) window.location.href = url;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || t.upgrade.paymentError);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
            <Header />

            <main style={{ maxWidth: 900, margin: '0 auto' }} className="px-5 pt-10 pb-20 sm:px-12">
                {/* Hero */}
                <section style={{ textAlign: 'center', marginBottom: 48 }}>
                    <span className="sticker-badge" style={{ background: 'var(--butter)', marginBottom: 20 }}>
                        <Crown style={{ width: 14, height: 14 }} /> {t.upgrade.badge}
                    </span>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(40px, 6vw, 72px)', margin: '16px 0 12px', color: 'var(--ink)', lineHeight: 1.12 }}>
                        {t.upgrade.heroTitle}
                    </h1>
                    <p style={{ fontSize: 18, color: 'var(--ink-2)', lineHeight: 1.55 }}>{t.upgrade.subtitle}</p>
                    {freeLimitReached && (
                        <div className="sticker-badge" style={{ background: 'var(--melocoton)', marginTop: 16, display: 'inline-flex' }}>
                            ⚠️ {t.upgrade.freeLimitBanner}
                        </div>
                    )}
                </section>

                {/* Main pricing card */}
                <div style={{ marginBottom: 32 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Free */}
                    <div style={{ border: 'none', borderRadius: 'var(--r-xl)', background: 'var(--paper-soft)', boxShadow: 'var(--shadow-soft)' }} className="p-5 sm:p-8">
                        <div className="mono-eyebrow" style={{ color: 'var(--ink-soft)', marginBottom: 12 }}>Free</div>
                        <div className="serif-display" style={{ fontSize: 56, color: 'var(--ink)', marginBottom: 8 }}>$0</div>
                        <p style={{ fontSize: 15, color: 'var(--ink-2)', marginBottom: 24 }}>{t.upgrade.currentPlan}</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[t.upgrade.freeFeature1, t.upgrade.freeFeature3, t.upgrade.freeFeature4, t.upgrade.freeFeature5].map((f) => (
                                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 14, color: 'var(--ink-2)' }}>
                                    <span style={{ color: 'var(--ink-soft)' }}>♥</span> {f}
                                </li>
                            ))}
                            {[t.upgrade.freeFeature2, t.upgrade.freeFeature6, t.upgrade.freeFeature10].map((f) => (
                                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 14, color: 'var(--ink-soft)', textDecoration: 'line-through' }}>
                                    <span>✕</span> {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pro */}
                    <div style={{ border: 'none', borderRadius: 'var(--r-xl)', background: 'var(--accent-hex)', color: 'white', position: 'relative', boxShadow: 'var(--shadow-card)' }} className="p-5 sm:p-8">
                        <div className="sticker-badge" style={{ position: 'absolute', top: -16, right: 24, background: 'var(--paper-soft)', color: 'var(--accent-2-hex)', boxShadow: 'var(--shadow-soft)' }}>
                            <span>⭐</span><span>{t.upgrade.recommended}</span>
                        </div>
                        <div className="mono-eyebrow" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 12 }}>Pro</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                            <span className="serif-display" style={{ fontSize: 56, color: 'white' }}>$3.99</span>
                            <span style={{ fontSize: 15, opacity: 0.7 }}>{t.upgrade.oncePayment}</span>
                        </div>
                        <p style={{ fontSize: 15, marginBottom: 24, opacity: 0.85 }}>{t.upgrade.permanentAccess}</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                            {[t.upgrade.proFeature1, t.upgrade.proFeature2, t.upgrade.proFeature3, t.upgrade.proFeature4, t.upgrade.proFeature5, t.upgrade.proFeature6].map((f) => (
                                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 14 }}>
                                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>♥</span> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Payment section */}
                <div style={{ border: 'none', borderRadius: 'var(--r-xl)', background: 'var(--paper-soft)', boxShadow: 'var(--shadow-soft)' }} className="p-5 sm:p-8">
                    <div className="mono-eyebrow" style={{ marginBottom: 16 }}>{t.upgrade.selectPayment}</div>

                    <div style={{ marginBottom: 24 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {([['mercadopago', '💳', 'Mercado Pago', t.upgrade.mercadoPagoDesc], ['paypal', '🅿️', 'PayPal', t.upgrade.paypalDesc]] as const).map(([id, icon, name, desc]) => (
                            <button key={id} onClick={() => setSelectedProvider(id)}
                                style={{
                                    padding: '14px 18px', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', background: selectedProvider === id ? 'var(--lila-soft)' : 'white',
                                    cursor: 'pointer', textAlign: 'left', boxShadow: selectedProvider === id ? '3px 3px 0 var(--ink)' : '2px 2px 0 var(--ink)',
                                    transition: 'all 120ms',
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15, marginBottom: 4, color: 'var(--ink)' }}>
                                    {icon} {name}
                                </div>
                                <div style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{desc}</div>
                            </button>
                        ))}
                    </div>

                    <button onClick={handlePayment} disabled={loading}
                        style={{ width: '100%', padding: '16px 24px', border: '1px solid var(--hairline)', borderRadius: 10, background: loading ? 'var(--lila)' : 'var(--accent-hex)', color: 'white', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '4px 4px 0 var(--accent-deep-hex)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Crown style={{ width: 18, height: 18 }} />
                        {loading ? t.upgrade.processing : t.upgrade.unlockProPrice}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--ink-soft)', marginTop: 12 }}>
                        {t.upgrade.securePayment} {selectedProvider === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}
                    </p>
                </div>

                {/* Features detail */}
                <section style={{ marginTop: 40 }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 20 }}>{t.upgrade.proIncludesLabel}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                        {FEATURES.map(({ icon: Icon, key }) => {
                            const titleKey = `${key}Title` as keyof typeof t.upgrade;
                            const descKey = `${key}Desc` as keyof typeof t.upgrade;
                            return (
                                <div key={key} style={{ padding: '18px 20px', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)', background: 'white', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--butter)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon style={{ width: 16, height: 16, color: 'var(--ink)' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--ink)' }}>{t.upgrade[titleKey]}</div>
                                        <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{t.upgrade[descKey]}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}
