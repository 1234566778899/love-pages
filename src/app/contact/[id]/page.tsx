'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import {
    ArrowLeft,
    MessageCircle,
    Mail,
    Clock,
    CheckCircle2,
    User,
    AlertCircle,
    Reply,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation, type Locale } from '@/i18n';
import type { Translations } from '@/i18n/translations/es';

interface ContactDetail {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    adminReply: string | null;
    adminRepliedAt: string | null;
    createdAt: string;
}

type DetailKey = keyof Translations['contactDetail'];

const STATUS_STYLE: Record<string, { label: DetailKey; bg: string; color: string }> = {
    pending: { label: 'statusPending', bg: 'var(--paper-2)', color: 'var(--ink-black)' },
    in_progress: { label: 'statusInProgress', bg: 'var(--lila-2)', color: 'var(--ink-black)' },
    resolved: { label: 'statusResolved', bg: 'var(--ink-black)', color: 'var(--paper)' },
    closed: { label: 'statusClosed', bg: 'var(--ink-black)', color: 'var(--paper)' },
};

const TYPE_MAP: Record<string, DetailKey> = {
    comment: 'typeComment',
    custom_page: 'typeCustomPage',
    support: 'typeSupport',
    other: 'typeOther',
};

function timeAgo(date: string, locale: Locale) {
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: locale === 'en' ? enUS : es });
    } catch {
        return '';
    }
}

function formatDate(date: string, locale: Locale) {
    try {
        return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return '';
    }
}

export default function ContactDetailPage() {
    const params = useParams();
    const router = useRouter();
    const contactId = params.id as string;
    const { user, loading: authLoading } = useAuthStore();
    const { t, locale } = useTranslation();
    const td = t.contactDetail;
    // La carga arranca al montar, antes de que se aplique el idioma guardado.
    const tdRef = useRef(td);
    tdRef.current = td;

    const [contact, setContact] = useState<ContactDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => { if (contactId) loadContact(); }, [contactId]);

    const loadContact = async () => {
        try {
            setLoading(true);
            const { data } = await api.contact.getMyMessage(contactId);
            setContact(data.data);
        } catch (err: any) {
            setError(true);
            if (err.response?.status === 404) toast.error(tdRef.current.notFoundToast);
            else if (err.response?.status === 403) toast.error(tdRef.current.noPermissionToast);
            else toast.error(tdRef.current.loadError);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
                <Header />
                <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </main>
            </div>
        );
    }

    if (error || !contact) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
                <Header />
                <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <AlertCircle style={{ width: 48, height: 48, color: 'var(--ink-soft)', margin: '0 auto 16px' }} />
                    <h2 className="serif-display" style={{ fontSize: 28, marginBottom: 8 }}>{td.notFoundTitle}</h2>
                    <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 24 }}>
                        {td.notFoundDesc}
                    </p>
                    <Link href="/notifications">
                        <button className="btn-ink" style={{ padding: '10px 20px', fontSize: 15 }}>{td.backToNotifications}</button>
                    </Link>
                </main>
            </div>
        );
    }

    const statusStyle = STATUS_STYLE[contact.status] || STATUS_STYLE.pending;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <main style={{ maxWidth: 640, margin: '0 auto' }} className="px-5 py-10 sm:px-10">

                {/* Masthead */}
                <div style={{ borderBottom: '3px double var(--ink-black)', paddingBottom: 10, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <Link href="/notifications" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--ink-soft)', textDecoration: 'none', fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none' }}>
                        <ArrowLeft style={{ width: 12, height: 12 }} /> {td.notifications}
                    </Link>
                    <span className="mono-eyebrow" style={{ color: 'var(--accent-hex)' }}>{td.support}</span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(24px, 4vw, 40px)', margin: '0 0 12px', lineHeight: 1.12 }}>
                        <span className="mis-red">{td.titleA}</span>{' '}
                        <span className="mis-blue">{td.titleB}</span>
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: statusStyle.bg, color: statusStyle.color, border: '1px solid var(--hairline)', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, letterSpacing: 0, textTransform: 'none' }}>
                            {contact.status === 'resolved' ? <CheckCircle2 style={{ width: 10, height: 10 }} /> : <Clock style={{ width: 10, height: 10 }} />}
                            {td[statusStyle.label]}
                        </span>
                        <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{TYPE_MAP[contact.type] ? td[TYPE_MAP[contact.type]] : contact.type}</span>
                    </div>
                </div>

                {/* Tu mensaje */}
                <div style={{ border: '1px solid var(--hairline)', background: 'var(--paper-soft)', marginBottom: 0 }}>
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--paper-2)' }}>
                        <User style={{ width: 12, height: 12, color: 'var(--accent-hex)' }} />
                        <span style={{ fontSize: 14, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', fontWeight: 700 }}>{contact.name}</span>
                        <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{td.you} · {timeAgo(contact.createdAt, locale)}</span>
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                        <h3 style={{ fontFamily: 'var(--display)', fontSize: 18, textTransform: 'none', color: 'var(--ink-black)', marginBottom: 12, letterSpacing: 0 }}>
                            {contact.subject}
                        </h3>
                        <p style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                            {contact.message}
                        </p>
                        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--rule)', fontSize: 14, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Mail style={{ width: 11, height: 11 }} />
                            {contact.email} · {formatDate(contact.createdAt, locale)}
                        </div>
                    </div>
                </div>

                {/* Respuesta del admin */}
                {contact.adminReply ? (
                    <div style={{ border: '1px solid var(--hairline)', borderTop: 'none', background: 'var(--paper)', marginBottom: 32 }}>
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ink-black)' }}>
                            <Reply style={{ width: 12, height: 12, color: 'var(--paper)' }} />
                            <span style={{ fontSize: 14, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', fontWeight: 700, color: 'var(--paper)' }}>{td.supportTeam}</span>
                            <span style={{ padding: '1px 6px', background: 'rgba(248,241,222,0.2)', border: '1px solid rgba(248,241,222,0.4)', fontSize: 15, fontWeight: 700, color: 'var(--paper)', letterSpacing: 0, textTransform: 'none' }}>{td.team}</span>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            {contact.adminRepliedAt && (
                                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 12, fontFamily: 'var(--mono)' }}>{timeAgo(contact.adminRepliedAt, locale)}</p>
                            )}
                            <p style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                                {contact.adminReply}
                            </p>
                            {contact.adminRepliedAt && (
                                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--rule)', fontSize: 14, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <CheckCircle2 style={{ width: 11, height: 11, color: 'var(--ink-black)' }} />
                                    {td.repliedOn.replace('{date}', formatDate(contact.adminRepliedAt, locale))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ border: '1.5px dashed var(--ink-black)', borderTop: 'none', padding: '24px', textAlign: 'center', background: 'var(--paper-soft)', marginBottom: 32 }}>
                        <Clock style={{ width: 24, height: 24, color: 'var(--ink-soft)', margin: '0 auto 10px' }} />
                        <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
                            {td.underReview}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link href="/notifications" style={{ flex: 1 }}>
                        <button className="btn-ink" style={{ width: '100%', padding: '12px 16px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <ArrowLeft style={{ width: 13, height: 13 }} /> {td.notifications}
                        </button>
                    </Link>
                    <Link href="/contact" style={{ flex: 1 }}>
                        <button className="btn-accent" style={{ width: '100%', padding: '12px 16px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <MessageCircle style={{ width: 13, height: 13 }} /> {td.newMessage}
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
