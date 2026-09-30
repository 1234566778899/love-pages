'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api';
import {
    ArrowLeft,
    Crown,
    Sparkles,
    Lock,
    Eye,
    Pencil,
    Rocket,
    Users,
    Heart,
    RefreshCw,
    Monitor,
    Smartphone,
    CheckCircle2,
    Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CustomSlugInput } from '@/components/CustomSlugInput';
import { TemplateImageUpload } from '@/components/TemplateImageUpload';
import { useTranslation } from '@/i18n';

interface ImageConfig {
    maxSizeMB?: number;
    aspectRatio?: string | null;
    minWidth?: number;
    minHeight?: number;
    fallbackImageUrl?: string | null;
}

interface EditableField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'color' | 'image_url';
    defaultValue: string;
    placeholder: string;
    maxLength: number;
    required: boolean;
    order: number;
    imageConfig?: ImageConfig | null;
}

interface TemplateData {
    _id: string;
    name: string;
    description: string;
    previewImageUrl: string;
    category: string;
    html: string;
    css: string;
    editableFields: EditableField[];
    isPro: boolean;
    tags: string[];
    usageCount: number;
}

/**
 * Sanitizar URL para uso seguro en src="" dentro del preview del iframe.
 * Replica la lógica del backend para mantener consistencia.
 */
function sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    try {
        const parsed = new URL(trimmed);
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
            return parsed.href.replace(/"/g, '%22');
        }
        return '';
    } catch {
        return '';
    }
}

export default function TemplateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const templateId = params.templateId as string;
    const { user, loading: authLoading } = useAuthStore();
    const { t } = useTranslation();
    const tt = t.templateDetail;
    // La carga arranca al montar, antes de que se aplique el idioma guardado.
    const ttRef = useRef(tt);
    ttRef.current = tt;

    const [template, setTemplate] = useState<TemplateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

    // Valores editables del usuario
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

    // Campos extra para crear la página
    const [recipientName, setRecipientName] = useState('');
    const [yesButtonText, setYesButtonText] = useState('Sí');
    const [noButtonText, setNoButtonText] = useState('No');
    const [noButtonEscapes, setNoButtonEscapes] = useState(false);
    const [customSlug, setCustomSlug] = useState('');

    // Ref para el iframe de preview
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const isPro = user?.isPro || false;
    const freeLimitReached = !!user && !isPro && user.canCreatePage === false;

    useEffect(() => {
        loadTemplate();
    }, [templateId]);

    // Inicializar valores con defaults cuando carga la plantilla
    useEffect(() => {
        if (template) {
            const defaults: Record<string, string> = {};
            template.editableFields
                .sort((a, b) => a.order - b.order)
                .forEach((field) => {
                    defaults[field.key] = field.defaultValue || '';
                });
            setFieldValues(defaults);
        }
    }, [template]);

    // Actualizar preview cuando cambian los valores
    useEffect(() => {
        if (template && Object.keys(fieldValues).length > 0) {
            updatePreview();
        }
    }, [fieldValues, template]);

    const loadTemplate = async () => {
        try {
            setLoading(true);
            const { data } = await api.templates.getById(templateId);
            setTemplate(data.data);
        } catch (error) {
            console.error('Error loading template:', error);
            toast.error(ttRef.current.loadError);
            router.push('/templates');
        } finally {
            setLoading(false);
        }
    };

    const updatePreview = useCallback(() => {
        if (!template || !iframeRef.current) return;

        // Renderizar HTML/CSS con los valores actuales del usuario
        let renderedHtml = template.html;
        let renderedCss = template.css;

        for (const field of template.editableFields) {
            const value = fieldValues[field.key] || field.defaultValue || '';
            const placeholder = `{{${field.key}}}`;

            let processedValue: string;

            switch (field.type) {
                case 'image_url':
                    // Para imágenes: sanitizar URL, no escapar como HTML
                    processedValue = sanitizeUrl(value);
                    if (!processedValue && field.imageConfig?.fallbackImageUrl) {
                        processedValue = sanitizeUrl(field.imageConfig.fallbackImageUrl);
                    }
                    break;

                case 'color':
                    // Para colores: validar formato hex
                    processedValue = /^#[0-9a-fA-F]{3,8}$/.test(value)
                        ? value
                        : field.defaultValue || '#000000';
                    break;

                default:
                    // Para texto: escapar HTML para seguridad
                    processedValue = value
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;');
                    break;
            }

            renderedHtml = renderedHtml.replaceAll(placeholder, processedValue);
            renderedCss = renderedCss.replaceAll(placeholder, processedValue);
        }

        const fullHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }
        ${renderedCss}
    </style>
</head>
<body>
    ${renderedHtml}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;

        // Limpiar URL blob anterior
        return () => URL.revokeObjectURL(url);
    }, [template, fieldValues]);

    const updateField = (key: string, value: string) => {
        setFieldValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleCreatePage = async () => {
        if (!user) {
            toast.error(tt.loginToCreate);
            return;
        }
        if (freeLimitReached) {
            toast.error(tt.freeLimit);
            router.push('/upgrade');
            return;
        }

        if (template?.isPro && !isPro) {
            toast.error(tt.requiresPro);
            return;
        }
        if (!recipientName.trim()) {
            toast.error(tt.recipientRequired);
            return;
        }

        // Validar campos requeridos
        for (const field of template?.editableFields || []) {
            if (field.required) {
                const value = fieldValues[field.key];
                if (field.type === 'image_url') {
                    // Para imágenes requeridas: verificar que hay una URL
                    if (!value || !value.trim()) {
                        toast.error(tt.imageRequired.replace('{label}', field.label));
                        return;
                    }
                } else {
                    if (!value || !value.trim()) {
                        toast.error(tt.fieldRequired.replace('{label}', field.label));
                        return;
                    }
                }
            }
        }

        setCreating(true);
        try {
            const { data } = await api.templates.createPage(templateId, {
                values: fieldValues,
                recipientName: recipientName.trim(),
                yesButtonText,
                noButtonText,
                noButtonEscapes,
                customSlug: customSlug.trim() || undefined,
            });

            toast.success(tt.created);
            const identifier = data.data.customSlug || data.data.shortId;
            router.push(`/p/${identifier}`);
        } catch (error: any) {
            console.error('Error creating page:', error);
            toast.error(error.response?.data?.message || tt.createError);
        } finally {
            setCreating(false);
        }
    };

    /**
     * Contar campos por tipo para mostrar resumen
     */
    const getFieldTypeCounts = () => {
        if (!template) return { text: 0, image: 0, color: 0 };
        return template.editableFields.reduce(
            (acc, f) => {
                if (f.type === 'image_url') acc.image++;
                else if (f.type === 'color') acc.color++;
                else acc.text++;
                return acc;
            },
            { text: 0, image: 0, color: 0 }
        );
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-12 w-12" style={{ border: '3px solid var(--lila)', borderTopColor: 'var(--accent-hex)', borderRadius: '50%' }} />
            </div>
        );
    }

    if (!template) return null;

    const fieldCounts = getFieldTypeCounts();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink-black)', fontFamily: 'var(--mono)' }}>
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
                {freeLimitReached && (
                    <div className="mb-6" style={{ border: '1px solid var(--hairline)', background: 'var(--paper-2)', padding: '10px 14px', fontSize: 15, color: 'var(--ink-black)' }}>
                        {tt.freeLimit}
                    </div>
                )}

                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <Link href="/templates">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                            {template.name}
                            {template.isPro && (
                                <span style={{ padding: '2px 8px', background: 'var(--ink-black)', color: 'var(--paper)', fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', letterSpacing: 0, textTransform: 'none', border: '1px solid var(--hairline)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <Crown style={{ width: 10, height: 10 }} />
                                    PRO
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-500 text-sm mt-0.5">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        {tt.uses.replace('{count}', String(template.usageCount))}
                    </div>
                </div>

                {/* Main layout: 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT: Preview */}
                    <div className="order-2 lg:order-1">
                        <Card className="overflow-hidden sticky top-24">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        {tt.preview}
                                    </CardTitle>
                                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setPreviewDevice('desktop')}
                                            className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop'
                                                ? 'bg-white shadow-sm text-pink-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <Monitor className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setPreviewDevice('mobile')}
                                            className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile'
                                                ? 'bg-white shadow-sm text-pink-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <Smartphone className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div
                                    className={`bg-gray-200 flex justify-center ${previewDevice === 'mobile' ? 'p-4' : ''
                                        }`}
                                >
                                    <div
                                        className={`bg-white overflow-hidden transition-all duration-300 ${previewDevice === 'mobile'
                                            ? 'w-[375px] rounded-[2rem] border-[8px] border-gray-800 shadow-xl'
                                            : 'w-full'
                                            }`}
                                    >
                                        <iframe
                                            ref={iframeRef}
                                            title="Template Preview"
                                            className="w-full border-0"
                                            style={{
                                                height:
                                                    previewDevice === 'mobile'
                                                        ? '667px'
                                                        : '600px',
                                            }}
                                            sandbox="allow-same-origin allow-scripts"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: Editor / Info */}
                    <div className="order-1 lg:order-2 space-y-5">
                        {/* Default view (not editing) */}
                        {!isEditing ? (
                            <>
                                {/* Template info card */}
                                <Card>
                                    <CardContent className="p-5 space-y-4">
                                        <img
                                            src={template.previewImageUrl}
                                            alt={template.name}
                                            className="w-full aspect-video object-cover rounded-xl"
                                        />

                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                                {template.name}
                                            </h2>
                                            <p className="text-gray-500 text-sm">
                                                {template.description}
                                            </p>
                                        </div>

                                        {/* Tags */}
                                        {template.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {template.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-1 bg-pink-50 text-pink-600 text-xs rounded-full font-medium"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Editable fields summary */}
                                        <div className="p-3 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-medium text-gray-500 mb-2">
                                                {tt.customizableFields}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {template.editableFields
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((field) => (
                                                        <span
                                                            key={field.key}
                                                            className={`px-2 py-0.5 border text-xs rounded-md flex items-center gap-1 ${field.type === 'image_url'
                                                                ? 'bg-purple-50 border-purple-200 text-purple-600'
                                                                : field.type === 'color'
                                                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                                                    : 'bg-white border-gray-200 text-gray-600'
                                                                }`}
                                                        >
                                                            {field.type === 'image_url' && (
                                                                <ImageIcon className="w-3 h-3" />
                                                            )}
                                                            {field.label}
                                                            {field.required && (
                                                                <span className="text-red-400 ml-0.5">
                                                                    *
                                                                </span>
                                                            )}
                                                        </span>
                                                    ))}
                                            </div>
                                            {/* Resumen de tipos */}
                                            {fieldCounts.image > 0 && (
                                                <p className="text-xs text-purple-500 mt-2 flex items-center gap-1">
                                                    <ImageIcon className="w-3 h-3" />
                                                    {fieldCounts.image > 1
                                                        ? tt.imageFieldsMany.replace('{count}', String(fieldCounts.image))
                                                        : tt.imageFieldsOne}
                                                </p>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        {(!template.isPro || isPro) ? (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                variant="gradient"
                                                className="w-full gap-2"
                                                size="lg"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                {tt.customizeAndCreate}
                                            </Button>
                                        ) : (
                                            <div className="space-y-3">
                                                <div style={{ padding: '24px', border: '1px solid var(--hairline)', background: 'var(--paper-soft)', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
                                                    <Lock style={{ width: 24, height: 24, color: 'var(--ink-black)', margin: '0 auto 10px' }} />
                                                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, fontFamily: 'var(--display)', textTransform: 'none', color: 'var(--ink-black)' }}>
                                                        {tt.proExclusive}
                                                    </p>
                                                    <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 16 }}>
                                                        {tt.upgradeForPremium}
                                                    </p>
                                                    <Link href="/upgrade">
                                                        <button className="btn-accent" style={{ padding: '10px 20px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                            <Crown style={{ width: 13, height: 13 }} />
                                                            {tt.getPro}
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            /* Editing mode */
                            <>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Pencil className="w-5 h-5 text-pink-600" />
                                                {tt.customize}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsEditing(false)}
                                                className="text-gray-500"
                                            >
                                                {tt.cancel}
                                            </Button>
                                        </div>
                                        <CardDescription>
                                            {tt.editDesc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Template editable fields */}
                                        {template.editableFields
                                            .sort((a, b) => a.order - b.order)
                                            .map((field) => (
                                                <div key={field.key}>
                                                    {/* === IMAGE_URL FIELD === */}
                                                    {field.type === 'image_url' ? (
                                                        <TemplateImageUpload
                                                            templateId={templateId}
                                                            fieldKey={field.key}
                                                            label={field.label}
                                                            required={field.required}
                                                            value={
                                                                fieldValues[field.key] || ''
                                                            }
                                                            onChange={(url) =>
                                                                updateField(field.key, url)
                                                            }
                                                            imageConfig={
                                                                field.imageConfig || null
                                                            }
                                                        />
                                                    ) : /* === TEXTAREA FIELD === */
                                                        field.type === 'textarea' ? (
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                                    {field.label}
                                                                    {field.required && (
                                                                        <span className="text-red-500 ml-1">
                                                                            *
                                                                        </span>
                                                                    )}
                                                                </label>
                                                                <textarea
                                                                    value={
                                                                        fieldValues[field.key] ||
                                                                        ''
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateField(
                                                                            field.key,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder={
                                                                        field.placeholder
                                                                    }
                                                                    maxLength={field.maxLength}
                                                                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all min-h-[80px] resize-none"
                                                                />
                                                                <p className="text-xs text-gray-400 mt-1 text-right">
                                                                    {(
                                                                        fieldValues[field.key] ||
                                                                        ''
                                                                    ).length}
                                                                    /{field.maxLength}
                                                                </p>
                                                            </div>
                                                        ) : /* === COLOR FIELD === */
                                                            field.type === 'color' ? (
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                                        {field.label}
                                                                    </label>
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="color"
                                                                            value={
                                                                                fieldValues[
                                                                                field.key
                                                                                ] || '#000000'
                                                                            }
                                                                            onChange={(e) =>
                                                                                updateField(
                                                                                    field.key,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="w-10 h-10 rounded-lg border cursor-pointer"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                fieldValues[
                                                                                field.key
                                                                                ] || ''
                                                                            }
                                                                            onChange={(e) =>
                                                                                updateField(
                                                                                    field.key,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono"
                                                                            placeholder="#ff69b4"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* === TEXT FIELD (default) === */
                                                                <Input
                                                                    label={`${field.label}${field.required ? ' *' : ''
                                                                        }`}
                                                                    value={
                                                                        fieldValues[field.key] || ''
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateField(
                                                                            field.key,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder={field.placeholder}
                                                                    maxLength={field.maxLength}
                                                                />
                                                            )}
                                                </div>
                                            ))}
                                    </CardContent>
                                </Card>

                                {/* Page settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-pink-600" />
                                            {tt.pageSettings}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input
                                            label={tt.recipientLabel}
                                            value={recipientName}
                                            onChange={(e) =>
                                                setRecipientName(e.target.value)
                                            }
                                            placeholder={tt.recipientPlaceholder}
                                            maxLength={100}
                                        />

                                        {isPro && (
                                            <div className="border-t pt-4">
                                                <CustomSlugInput
                                                    value={customSlug}
                                                    onChange={setCustomSlug}
                                                    isPro={isPro}
                                                    onUpgrade={() => { }}
                                                    recipientName={recipientName}
                                                />
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleCreatePage}
                                            loading={creating}
                                            variant="gradient"
                                            className="w-full gap-2"
                                            size="lg"
                                        >
                                            <Rocket className="w-5 h-5" />
                                            {tt.createWithTemplate}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
