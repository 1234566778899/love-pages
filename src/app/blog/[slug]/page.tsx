import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { getBlogPost, getAllSlugs, blogPosts } from '@/lib/blog';

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = getBlogPost(params.slug);
    if (!post) return {};
    return {
        title: `${post.title} — Love Pages Blog`,
        description: post.description,
        alternates: { canonical: `https://lovepages.ink/blog/${post.slug}` },
        openGraph: {
            title: post.title,
            description: post.description,
            url: `https://lovepages.ink/blog/${post.slug}`,
            type: 'article',
            publishedTime: post.publishedAt,
            siteName: 'Love Pages',
        },
    };
}

const CATEGORY_STYLE: Record<string, { bg: string; color: string }> = {
    'San Valentín': { bg: 'var(--accent-hex)', color: 'var(--paper)' },
    'Consejos': { bg: 'var(--ink-black)', color: 'var(--paper)' },
    'Juegos': { bg: 'var(--accent-2-hex)', color: 'var(--paper)' },
    'Relación a Distancia': { bg: 'var(--paper-2)', color: 'var(--ink-black)' },
    'Aniversario': { bg: 'var(--accent-hex)', color: 'var(--paper)' },
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function CategoryBadge({ category }: { category: string }) {
    const style = CATEGORY_STYLE[category] ?? { bg: 'var(--paper-2)', color: 'var(--ink-black)' };
    return (
        <span style={{ display: 'inline-block', padding: '3px 10px', background: style.bg, color: style.color, border: '1px solid var(--hairline)', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, letterSpacing: 0, textTransform: 'none' }}>
            {category}
        </span>
    );
}

export default function BlogPostPage({ params }: Props) {
    const post = getBlogPost(params.slug);
    if (!post) notFound();

    const allPosts = [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
    const prevPost = allPosts[currentIndex + 1] ?? null;
    const nextPost = allPosts[currentIndex - 1] ?? null;

    const related = allPosts
        .filter((p) => p.slug !== post.slug && p.category === post.category)
        .slice(0, 2);
    const otherRelated = related.length < 2
        ? allPosts.filter((p) => p.slug !== post.slug && !related.includes(p)).slice(0, 2 - related.length)
        : [];
    const relatedPosts = [...related, ...otherRelated].slice(0, 2);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: post.title,
                        description: post.description,
                        datePublished: post.publishedAt,
                        author: { '@type': 'Organization', name: 'Love Pages', url: 'https://lovepages.ink' },
                        publisher: { '@type': 'Organization', name: 'Love Pages', url: 'https://lovepages.ink' },
                        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://lovepages.ink/blog/${post.slug}` },
                    }),
                }}
            />

            <main style={{ maxWidth: 760, margin: '0 auto' }} className="px-5 py-12 sm:px-12 sm:py-16">

                {/* Masthead */}
                <div style={{ borderBottom: '3px double var(--ink-black)', paddingBottom: 10, marginBottom: 40, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', color: 'var(--ink-soft)' }}>
                        <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>inicio</Link>
                        <span>/</span>
                        <Link href="/blog" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>blog</Link>
                        <span>/</span>
                        <span style={{ color: 'var(--ink-black)' }}>artículo</span>
                    </nav>
                    <span className="mono-eyebrow" style={{ color: 'var(--accent-hex)' }}>love pages</span>
                </div>

                {/* Article header */}
                <header style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                        <CategoryBadge category={post.category} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: 0 }}>
                            <Clock style={{ width: 11, height: 11 }} />
                            {post.readingTime} min de lectura
                        </span>
                        <span style={{ fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{formatDate(post.publishedAt)}</span>
                    </div>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: 'var(--ink-black)', margin: '0 0 16px', lineHeight: 1.12 }}>
                        {post.title}
                    </h1>
                    <p style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                        {post.description}
                    </p>
                </header>

                {/* Article content */}
                <article
                    style={{ border: '1px solid var(--hairline)', padding: '32px', background: 'var(--paper-soft)', marginBottom: 32 }}
                    className="
                        prose max-w-none
                        prose-headings:font-black prose-headings:text-[var(--ink-black)] prose-headings:font-[var(--display)] prose-headings:uppercase
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
                        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                        prose-p:text-[var(--ink-soft)] prose-p:leading-relaxed prose-p:mb-4 prose-p:font-[var(--serif)] prose-p:italic
                        prose-ul:pl-6 prose-ul:space-y-2 prose-li:text-[var(--ink-soft)]
                        prose-ol:pl-6 prose-ol:space-y-2
                        prose-a:text-[var(--ink-black)] prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent-hex)]
                        prose-blockquote:bg-[var(--paper-2)] prose-blockquote:px-5 prose-blockquote:py-3
                        prose-blockquote:not-italic
                        prose-strong:text-[var(--ink-black)] prose-strong:font-[var(--sans)] prose-strong:not-italic
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA box */}
                <div style={{ background: 'var(--accent-hex)', border: '1px solid var(--hairline)', padding: '32px', textAlign: 'center', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
                    <svg style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, mixBlendMode: 'multiply', opacity: 0.4 }} viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="56" fill="var(--ink-black)" />
                    </svg>
                    <h2 className="serif-display" style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--paper)', marginBottom: 12, position: 'relative', zIndex: 1 }}>
                        ¿listo para crear algo especial?
                    </h2>
                    <p style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'rgba(248,241,222,0.85)', marginBottom: 24, position: 'relative', zIndex: 1 }}>
                        Crea una página personalizada gratis para esa persona especial en menos de 5 minutos.
                    </p>
                    <Link href="/create" style={{ position: 'relative', zIndex: 1 }}>
                        <button className="btn-ink" style={{ padding: '12px 24px', fontSize: 15 }}>
                            crear mi página ahora →
                        </button>
                    </Link>
                </div>

                {/* Prev / Next navigation */}
                <div style={{ display: 'grid', gap: 12, marginBottom: 40 }} className="grid-cols-1 sm:grid-cols-2">
                    {prevPost && (
                        <Link href={`/blog/${prevPost.slug}`}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--hairline)', padding: '14px 18px', background: 'var(--paper-soft)', textDecoration: 'none' }}>
                            <ArrowLeft style={{ width: 16, height: 16, color: 'var(--accent-hex)', flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 4, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none' }}>anterior</p>
                                <p style={{ fontSize: 15, fontFamily: 'var(--display)', textTransform: 'none', color: 'var(--ink-black)', lineHeight: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{prevPost.title}</p>
                            </div>
                        </Link>
                    )}
                    {nextPost && (
                        <Link href={`/blog/${nextPost.slug}`}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--hairline)', padding: '14px 18px', background: 'var(--paper-soft)', textDecoration: 'none' }}>
                            <div style={{ minWidth: 0, flex: 1, textAlign: 'right' }}>
                                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 4, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none' }}>siguiente</p>
                                <p style={{ fontSize: 15, fontFamily: 'var(--display)', textTransform: 'none', color: 'var(--ink-black)', lineHeight: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{nextPost.title}</p>
                            </div>
                            <ArrowRight style={{ width: 16, height: 16, color: 'var(--accent-hex)', flexShrink: 0 }} />
                        </Link>
                    )}
                </div>


                {/* Related articles */}
                {relatedPosts.length > 0 && (
                    <section style={{ marginBottom: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--hairline)' }}>
                            <BookOpen style={{ width: 14, height: 14, color: 'var(--accent-hex)' }} />
                            <span className="mono-eyebrow" style={{ color: 'var(--ink-black)' }}>artículos relacionados</span>
                        </div>
                        <div style={{ display: 'grid', gap: 0 }} className="grid-cols-1 sm:grid-cols-2">
                            {relatedPosts.map((p, i) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`}
                                    style={{ display: 'block', border: '1px solid var(--hairline)', borderRight: i === 0 ? 'none' : '1px solid var(--hairline)', padding: '18px 20px', background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-soft)', textDecoration: 'none' }}>
                                    <CategoryBadge category={p.category} />
                                    <h3 className="serif-display" style={{ fontSize: 15, color: 'var(--ink-black)', margin: '8px 0 6px', lineHeight: 0.96 }}>
                                        {p.title}
                                    </h3>
                                    <p style={{ fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--serif)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer links */}
                <div style={{ paddingTop: 24, borderTop: '1px solid var(--rule)', display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                    {[{ href: '/blog', label: '← todos los artículos' }, { href: '/', label: 'inicio' }, { href: '/create', label: 'crear página' }].map(({ href, label }, i, arr) => (
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
