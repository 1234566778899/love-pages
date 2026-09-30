import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
    title: 'Blog — Love Pages | Consejos de Amor y Relaciones',
    description:
        'Artículos con ideas románticas, consejos para parejas, juegos, aniversarios y más. Todo lo que necesitas para expresar el amor de forma única.',
    alternates: { canonical: 'https://lovepages.ink/blog' },
    openGraph: {
        title: 'Blog — Love Pages | Consejos de Amor y Relaciones',
        description: 'Artículos con ideas románticas, consejos para parejas, juegos y más.',
        url: 'https://lovepages.ink/blog',
        type: 'website',
    },
};

/* Fondos claros con texto oscuro: las etiquetas acompañan al titular,
   no compiten con él. */
const CATEGORY_STYLE: Record<string, { bg: string; color: string }> = {
    'San Valentín': { bg: 'var(--accent-soft)', color: 'var(--accent-2-hex)' },
    'Consejos': { bg: 'var(--paper-2)', color: 'var(--ink-soft)' },
    'Juegos': { bg: 'var(--mint)', color: '#4a6b33' },
    'Relación a Distancia': { bg: 'var(--melocoton)', color: '#8a4a33' },
    'Aniversario': { bg: 'var(--butter)', color: '#8a6a20' },
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function CategoryBadge({ category }: { category: string }) {
    const style = CATEGORY_STYLE[category] ?? { bg: 'var(--paper-2)', color: 'var(--ink-black)' };
    return (
        <span style={{ display: 'inline-block', padding: '6px 13px', background: style.bg, color: style.color, border: 'none', borderRadius: 'var(--r-pill)', fontSize: 14, fontWeight: 600 }}>
            {category}
        </span>
    );
}

export default function BlogPage() {
    const sorted = [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    const [featured, ...rest] = sorted;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <main style={{ maxWidth: 860, margin: '0 auto' }} className="px-5 py-12 sm:px-12 sm:py-16">

                {/* Hero */}
                <div style={{ marginBottom: 48 }}>
                    <div className="sticker-badge" style={{ marginBottom: 20 }}>Artículos</div>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: 0, lineHeight: 1.1 }}>
                        El blog de Love Pages
                    </h1>
                    <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(14px, 2vw, 17px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20, maxWidth: 560 }}>
                        Ideas románticas, consejos para parejas, juegos y todo lo que necesitas
                        para expresar el amor de forma única.
                    </p>
                </div>

                {/* Featured article */}
                <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 0 }}>
                    <article style={{ border: 'none', borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-soft)' }}>
                        {/* Red header */}
                        <div style={{ background: 'var(--accent-hex)', padding: '32px 36px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 'var(--r-pill)', background: 'rgba(255,255,255,0.22)', border: 'none', fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
                                Destacado
                            </div>
                            <h2 className="serif-display" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.15, position: 'relative', zIndex: 1 }}>
                                {featured.title}
                            </h2>
                            <p style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, marginBottom: 20, position: 'relative', zIndex: 1, maxWidth: 600 }}>
                                {featured.description}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', position: 'relative', zIndex: 1 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock style={{ width: 11, height: 11 }} />
                                    {featured.readingTime} min
                                </span>
                                <span>{formatDate(featured.publishedAt)}</span>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--paper-soft)', borderTop: '1px solid var(--hairline)' }}>
                            <CategoryBadge category={featured.category} />
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 0, textTransform: 'none', color: 'var(--ink-black)', fontWeight: 700 }}>
                                Leer artículo <ArrowRight style={{ width: 12, height: 12 }} />
                            </span>
                        </div>
                    </article>
                </Link>

                {/* Rest of articles */}
                <div style={{ border: '1px solid var(--hairline)', borderTop: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }} className="sm:grid-cols-2">
                    {rest.map((post, i) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}
                            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', padding: '20px 24px', borderBottom: '1px solid var(--hairline)', borderRight: i % 2 === 0 ? '1px solid var(--hairline)' : 'none', background: i % 3 === 0 ? 'var(--paper)' : i % 3 === 1 ? 'var(--paper-soft)' : 'var(--paper-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <CategoryBadge category={post.category} />
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: 0 }}>
                                    <Clock style={{ width: 9, height: 9 }} />
                                    {post.readingTime} min
                                </span>
                            </div>
                            <h2 className="serif-display" style={{ fontSize: 18, color: 'var(--ink-black)', margin: '0 0 8px', lineHeight: 1.25 }}>
                                {post.title}
                            </h2>
                            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, flex: 1, fontFamily: 'var(--serif)' }}>
                                {post.description}
                            </p>
                            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: 0 }}>{formatDate(post.publishedAt)}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', color: 'var(--ink-black)', fontWeight: 700 }}>
                                    leer <ArrowRight style={{ width: 11, height: 11 }} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <section style={{ border: '1px solid var(--hairline)', borderTop: 'none', padding: '32px', textAlign: 'center', background: 'var(--paper)' }}>
                    <h2 className="serif-display" style={{ fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: 12 }}>
                        <span className="mis-red" style={{ display: 'block' }}>¿listo para</span>
                        <span className="mis-blue" style={{ display: 'block' }}>sorprender?</span>
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 24 }}>
                        Crea tu página personalizada gratis en menos de 5 minutos.
                    </p>
                    <Link href="/create">
                        <button className="btn-accent" style={{ padding: '12px 24px', fontSize: 15 }}>
                            crear mi página gratis →
                        </button>
                    </Link>
                </section>


                {/* Footer links */}
                <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--rule)', display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                    {[{ href: '/', label: 'Inicio' }, { href: '/templates', label: 'Plantillas' }, { href: '/about', label: 'Acerca de' }, { href: '/privacy-policy', label: 'Privacidad' }].map(({ href, label }, i, arr) => (
                        <Link key={href} href={href} style={{ fontSize: 14, color: 'var(--ink-soft)', textDecoration: 'none', fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', padding: '4px 12px', borderRight: i < arr.length - 1 ? '1px solid var(--rule)' : 'none' }}>{label}</Link>
                    ))}
                </div>
            </main>

            <footer style={{ borderTop: '1px solid var(--hairline)', background: 'var(--paper-soft)', padding: '14px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none' }}>
                    © {new Date().getFullYear()} love pages.
                </span>
            </footer>
        </div>
    );
}
