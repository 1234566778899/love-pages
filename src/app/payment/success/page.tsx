'use client';

import { Header } from '@/components/layout/header';
import { CheckCircle2, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';
import { useTranslation } from '@/i18n';

export default function PaymentSuccessPage() {
    const { width, height } = useWindowSize();
    const { t } = useTranslation();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
            <Header />

            <main style={{ maxWidth: 600, margin: '0 auto' }} className="px-5 py-16 sm:px-10">

                {/* Masthead */}
                <div style={{ borderBottom: '3px double var(--ink-black)', paddingBottom: 10, marginBottom: 40, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span className="mono-eyebrow" style={{ color: 'var(--ink-black)' }}>{t.payment.completedEyebrow}</span>
                    <span className="mono-eyebrow" style={{ color: 'var(--accent-hex)' }}>love pages pro</span>
                </div>

                {/* Success card */}
                <div style={{ border: '1px solid var(--hairline)', background: 'var(--paper-soft)', textAlign: 'center' }}>
                    {/* Header */}
                    <div style={{ background: 'var(--ink-black)', padding: '40px 32px', borderBottom: '1px solid var(--hairline)', position: 'relative', overflow: 'hidden' }}>
                        <svg style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, mixBlendMode: 'multiply', opacity: 0.4 }} viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="56" fill="var(--accent-hex)" />
                        </svg>
                        <div style={{ width: 64, height: 64, background: 'rgba(248,241,222,0.2)', border: '2px solid rgba(248,241,222,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative', zIndex: 1 }}>
                            <CheckCircle2 style={{ width: 32, height: 32, color: 'var(--paper)' }} />
                        </div>
                        <h1 className="serif-display" style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--paper)', marginBottom: 8, position: 'relative', zIndex: 1 }}>
                            {t.payment.successHeading}
                        </h1>
                        <p style={{ fontSize: 15, color: 'rgba(248,241,222,0.85)', fontFamily: 'var(--serif)', position: 'relative', zIndex: 1 }}>
                            {t.payment.nowMemberPrefix}<strong style={{ fontStyle: 'normal', fontFamily: 'var(--mono)', textTransform: 'none', letterSpacing: 0 }}>PRO</strong>{t.payment.nowMemberSuffix}
                        </p>
                    </div>

                    {/* Benefits */}
                    <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--hairline)' }}>
                        <div className="mono-eyebrow" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Crown style={{ width: 12, height: 12, color: 'var(--ink-black)' }} />
                            {t.payment.benefitsEyebrow}
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                            {[
                                t.payment.benefit1,
                                t.payment.benefit2,
                                t.payment.benefit3,
                            ].map((item) => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--ink-soft)' }}>
                                    <Sparkles style={{ width: 12, height: 12, color: 'var(--accent-hex)', flexShrink: 0 }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div style={{ padding: '24px 32px', display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/create">
                            <button className="btn-accent" style={{ padding: '12px 22px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Crown style={{ width: 13, height: 13 }} />
                                {t.payment.createProCta}
                            </button>
                        </Link>
                        <Link href="/dashboard">
                            <button className="btn-ink" style={{ padding: '12px 22px', fontSize: 15 }}>
                                {t.payment.goDashboardCta}
                            </button>
                        </Link>
                    </div>

                    <p style={{ fontSize: 14, color: 'var(--ink-soft)', paddingBottom: 20, fontFamily: 'var(--mono)', letterSpacing: 0 }}>
                        {t.payment.closeNote}
                    </p>
                </div>
            </main>
        </div>
    );
}
