'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/store';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Menu, X, LogOut, Crown, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { NotificationBell } from '@/components/NotificationBell';
import { LoginButton } from '@/components/auth/login-page';
import { useTranslation } from '@/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

/** Píldora neutra reutilizada por casi todos los controles del header. */
const softButton: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    background: 'var(--paper-2)',
    border: 'none',
    borderRadius: 10,
    fontFamily: 'var(--sans)',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--ink-black)',
    cursor: 'pointer',
    transition: 'background 140ms',
};

export function Header() {
    const { user, firebaseUser } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const onDashboard = pathname === '/dashboard';
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            if (!auth) { toast.error(t.nav.authError); return; }
            await signOut(auth);
            toast.success(t.nav.sessionClosed);
            router.push('/');
        } catch {
            toast.error(t.nav.sessionCloseError);
        }
    };

    const closeMobile = () => setMobileMenuOpen(false);

    const navLinks = [
        { href: '/templates', label: t.nav.templates },
        { href: '/games', label: t.nav.games },
        { href: '/contact', label: t.nav.contact },
    ];

    return (
        <>
        <header
            ref={headerRef}
            style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, zIndex: 50,
                background: 'var(--surface-blur)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--hairline)',
            }}
            className="px-5 py-3 sm:px-10 sm:py-4"
        >
            <Link href="/" aria-label="love pages" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, lineHeight: 0 }}>
                {/* Logo generado con ChatGPT, recortado y teñido al vino exacto
                    de la marca (public/logo.png, 688×144). */}
                <Image src="/logo.png" alt="love pages" width={153} height={32} priority style={{ height: 32, width: 'auto' }} />
            </Link>

            {/* Nav de escritorio */}
            <nav className="hidden md:flex" style={{ gap: 6, alignItems: 'center' }}>
                {navLinks.map(({ href, label }) => (
                    <Link key={href} href={href}
                        style={{ padding: '8px 14px', borderRadius: 8, color: 'var(--ink-soft)', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}
                        className="hover:bg-paper-2 hover:!text-[var(--ink-black)] transition-colors">
                        {label}
                    </Link>
                ))}
                {user && (
                    // Destacado: es a donde vuelve el usuario con sesión. Relleno
                    // suave de acento, y sólido cuando ya está en el dashboard.
                    <Link href="/dashboard"
                        aria-current={onDashboard ? 'page' : undefined}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 6,
                            padding: '8px 14px', borderRadius: 999, textDecoration: 'none', fontSize: 15, fontWeight: 700,
                            background: onDashboard ? 'var(--accent-hex)' : 'var(--accent-soft)',
                            color: onDashboard ? '#fff' : 'var(--accent-2-hex)',
                        }}
                        className="hover:brightness-95 transition-all">
                        <LayoutGrid size={15} strokeWidth={2.4} />
                        {t.nav.myPages}
                    </Link>
                )}
            </nav>

            {/* Acciones de escritorio */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
                <LanguageSwitcher compact />
                {user ? (
                    <>
                        <NotificationBell />
                        {!user.isPro && (
                            <Link href="/upgrade">
                                <button style={softButton} className="hover:brightness-95">
                                    <Crown size={14} />
                                    {t.nav.upgradePro}
                                </button>
                            </Link>
                        )}
                        {user.isPro && (
                            <span
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px',
                                    background: 'var(--accent-hex)', borderRadius: 999,
                                    fontSize: 14, fontWeight: 600, color: '#fff',
                                }}
                            >
                                <Crown size={13} /> PRO
                            </span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 6px', background: 'var(--paper-2)', borderRadius: 999 }}>
                            {firebaseUser?.photoURL ? (
                                <Image src={firebaseUser.photoURL} alt={user.displayName} width={28} height={28} style={{ borderRadius: '50%' }} />
                            ) : (
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-hex)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 15, color: '#fff', fontFamily: 'var(--display)', fontWeight: 700 }}>{user.displayName?.[0]?.toUpperCase()}</span>
                                </div>
                            )}
                            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-black)' }}>{user.displayName}</span>
                        </div>
                        <button onClick={handleLogout}
                            style={{ width: 40, height: 40, border: 'none', borderRadius: 10, background: 'var(--paper-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            className="hover:brightness-95 transition-all"
                            title={t.nav.closeSession}>
                            <LogOut size={16} style={{ color: 'var(--ink-soft)' }} />
                        </button>
                    </>
                ) : (
                    <>
                        <LoginButton />
                        <Link href="/create">
                            <button className="btn-accent" style={{ padding: '11px 20px', fontSize: 15 }}>
                                {t.nav.createPage}
                            </button>
                        </Link>
                    </>
                )}
            </div>

            {/* Lado derecho en móvil */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 8 }}>
                <LanguageSwitcher compact />
                {user && <NotificationBell />}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ width: 40, height: 40, border: 'none', borderRadius: 10, background: 'var(--paper-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label={t.nav.menu}
                >
                    {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>
        </header>

        {/* Menú móvil */}
        {mobileMenuOpen && (
            <div
                className="md:hidden"
                style={{
                    position: 'fixed',
                    top: headerRef.current ? headerRef.current.getBoundingClientRect().bottom : 60,
                    left: 0, right: 0, bottom: 0,
                    background: 'var(--paper)',
                    padding: '20px',
                    display: 'flex', flexDirection: 'column', gap: 4,
                    zIndex: 49, overflowY: 'auto',
                    maxHeight: 'calc(100vh - 60px)',
                }}
            >
                {user && (
                    <Link href="/dashboard" onClick={closeMobile}
                        aria-current={onDashboard ? 'page' : undefined}
                        style={{
                            padding: '15px 16px', borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
                            background: onDashboard ? 'var(--accent-hex)' : 'var(--accent-soft)',
                            color: onDashboard ? '#fff' : 'var(--accent-2-hex)',
                        }}>
                        <LayoutGrid size={18} strokeWidth={2.4} />
                        {t.nav.myPages}
                    </Link>
                )}
                {navLinks.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={closeMobile}
                        style={{ padding: '15px 16px', borderRadius: 12, fontSize: 17, fontWeight: 600, color: 'var(--ink-black)', textDecoration: 'none', display: 'block' }}
                        className="active:bg-paper-2">
                        {label}
                    </Link>
                ))}

                <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {user ? (
                        <>
                            {!user.isPro && (
                                <Link href="/upgrade" onClick={closeMobile}>
                                    <button style={{ ...softButton, width: '100%', justifyContent: 'center', padding: '14px 16px', fontSize: 17 }}>
                                        <Crown size={16} /> {t.nav.upgradePro}
                                    </button>
                                </Link>
                            )}
                            <button onClick={() => { handleLogout(); closeMobile(); }}
                                style={{ ...softButton, width: '100%', justifyContent: 'center', padding: '14px 16px', fontSize: 17 }}>
                                <LogOut size={16} />
                                {t.nav.closeSession}
                            </button>
                        </>
                    ) : (
                        <>
                            <LoginButton />
                            <Link href="/create" onClick={closeMobile}>
                                <button className="btn-accent" style={{ width: '100%', padding: '15px 20px' }}>
                                    {t.nav.createPageFree}
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        )}
        </>
    );
}
