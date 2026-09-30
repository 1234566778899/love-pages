'use client';

import { useState } from 'react';
import { signInWithPopup, Auth, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/i18n';

/**
 * Pide la sesión sin sacar al usuario de donde está.
 *
 * El editor deja diseñar sin cuenta, así que la sesión se pide al publicar.
 * Mandar a /login en ese momento significaría abandonar el borrador a medio
 * hacer: por eso el popup de Google se abre sobre el propio editor y, al
 * volver, la acción que lo disparó continúa sola.
 */
export function LoginGateModal({
    isOpen,
    onClose,
    onSuccess,
    title,
    description,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    title: string;
    description: string;
}) {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        if (!auth || !googleProvider) {
            toast.error(t.auth.firebaseNotInitialized);
            return;
        }
        setLoading(true);
        try {
            await signInWithPopup(auth as Auth, googleProvider as GoogleAuthProvider);
            onSuccess?.();
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error(t.auth.loginFailedRetry);
            }
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={loading ? undefined : onClose} />

            <div
                className="relative w-full max-w-sm"
                style={{ background: 'var(--paper-soft)', border: 'none', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-card)' }}
            >
                <button
                    onClick={onClose}
                    disabled={loading}
                    aria-label={t.auth.close}
                    style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 999, background: 'var(--paper-2)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
                >
                    <X style={{ width: 16, height: 16 }} />
                </button>

                <div style={{ padding: '32px 28px 28px' }}>
                    <span
                        className="mono-eyebrow"
                        style={{ color: 'var(--accent-2-hex)', display: 'block', marginBottom: 12 }}
                    >{t.auth.lastStep}
                    </span>

                    <h3
                        className="serif-display"
                        style={{ fontSize: 30, lineHeight: 1.12, margin: 0, color: 'var(--ink-black)' }}
                    >
                        {title}
                    </h3>

                    <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
                        {description}
                    </p>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            marginTop: 24, width: '100%',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            padding: '13px 18px',
                            background: 'var(--paper-2)',
                            border: 'none',
                            borderRadius: 'var(--r-md)',
                            color: 'var(--ink-black)',
                            fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {!loading && (
                            <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" aria-hidden="true">
                                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {loading ? t.auth.signingIn : t.auth.continueWithGoogle}
                    </button>

                    <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-faint)', textAlign: 'center' }}>
                        {t.auth.draftKept}
                    </p>
                </div>
            </div>
        </div>
    );
}
