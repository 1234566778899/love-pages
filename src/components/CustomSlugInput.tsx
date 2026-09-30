'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import {
    Check, X, Loader2, AlertCircle, Link as LinkIcon,
    Crown, Sparkles, Heart, ArrowRight, Zap
} from 'lucide-react';
import { debounce } from 'lodash';
import { useTranslation } from '@/i18n';

interface CustomSlugInputProps {
    value: string;
    onChange: (value: string) => void;
    isPro: boolean;
    onUpgrade?: () => void;
    recipientName?: string; // 🆕 Para generar preview emocional
}

export function CustomSlugInput({
    value,
    onChange,
    isPro,
    onUpgrade,
    recipientName = ''
}: CustomSlugInputProps) {
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [message, setMessage] = useState('');
    const [touched, setTouched] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const { t } = useTranslation();
    const ts = t.customSlug;

    // Generar slug sugerido basado en el nombre del destinatario
    const suggestedSlug = recipientName
        ? `${ts.slugPrefix}-${recipientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
        : ts.defaultSlug;

    const baseUrl = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}/p/`
        : 'lovepages.com/p/';

    // Validación local del formato
    const validateFormat = (slug: string): { valid: boolean; message: string } => {
        if (!slug || slug.length === 0) {
            return { valid: true, message: '' };
        }

        if (slug.length < 3) {
            return { valid: false, message: ts.minChars };
        }

        if (slug.length > 30) {
            return { valid: false, message: ts.maxChars };
        }

        if (!/^[a-z0-9-]+$/.test(slug)) {
            return { valid: false, message: ts.onlyLowercase };
        }

        if (slug.startsWith('-') || slug.endsWith('-')) {
            return { valid: false, message: ts.noStartEndHyphen };
        }

        if (slug.includes('--')) {
            return { valid: false, message: ts.noConsecutiveHyphens };
        }

        return { valid: true, message: '' };
    };

    // Verificar disponibilidad en el servidor
    const checkAvailability = useCallback(
        debounce(async (slug: string) => {
            if (!slug || !isPro) return;

            const formatCheck = validateFormat(slug);
            if (!formatCheck.valid) {
                setAvailable(false);
                setMessage(formatCheck.message);
                setChecking(false);
                return;
            }

            try {
                setChecking(true);
                const { data } = await api.pages.checkSlug(slug);

                if (data.data.available) {
                    setAvailable(true);
                    setMessage(ts.available);
                } else {
                    setAvailable(false);
                    setMessage(data.data.reason || ts.notAvailable);
                }
            } catch (error: any) {
                console.error('Error checking slug:', error);
                setAvailable(false);
                setMessage(ts.verifyError);
            } finally {
                setChecking(false);
            }
        }, 500),
        [isPro, ts]
    );

    useEffect(() => {
        if (touched && value && isPro) {
            setChecking(true);
            checkAvailability(value);
        } else if (!value) {
            setAvailable(null);
            setMessage('');
        }
    }, [value, touched, isPro, checkAvailability]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setTouched(true);
        onChange(newValue);
        setAvailable(null);
        setMessage('');
    };

    // 🆕 MODO FREE: Teaser emocional con FOMO
    if (!isPro) {
        return (
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    {ts.title}
                    <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold rounded-full inline-flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        PRO
                    </span>
                </label>

                {/* Comparación Visual: Antes vs Después */}
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
                    {/* Header con mensaje emocional */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-3 animate-pulse">
                            <Heart className="w-7 h-7 text-white fill-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {ts.wantNameInLink}
                        </h3>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                            <span className="font-semibold text-pink-600">{ts.firstImpressionBold}</span>{ts.firstImpressionRest}
                        </p>
                    </div>

                    {/* Comparación lado a lado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* URL Genérica (FREE) */}
                        <div className="relative">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                                <span className="px-2 py-0.5 bg-gray-400 text-white text-[10px] font-bold rounded-full">
                                    {ts.free}
                                </span>
                            </div>
                            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-xs text-gray-500 mb-2">{ts.genericUrl}</p>
                                <div className="bg-gray-100 rounded px-3 py-2 border border-gray-200">
                                    <p className="text-xs font-mono text-gray-500 break-all">
                                        lovepages.com/p/<span className="text-gray-400">xK9mP2nQ7z</span>
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{ts.hardToRemember}</p>
                            </div>
                        </div>

                        {/* URL Personalizada (PRO) */}
                        <div className="relative">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-bold rounded-full flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5" />
                                    PRO
                                </span>
                            </div>
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 rounded-lg p-4 text-center relative">
                                {/* Efecto de brillo */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />

                                <p className="text-xs text-pink-700 font-semibold mb-2">{ts.customUrlLabel}</p>
                                <div className="bg-white rounded px-3 py-2 border-2 border-pink-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-100/0 via-pink-100/50 to-pink-100/0" />
                                    <p className="text-xs font-mono text-pink-700 break-all relative">
                                        lovepages.com/p/<span className="font-bold text-pink-600">{suggestedSlug}</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    <Sparkles className="w-3 h-3 text-pink-500" />
                                    <p className="text-xs text-pink-600 font-semibold">{ts.memorableSpecial}</p>
                                    <Sparkles className="w-3 h-3 text-pink-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de beneficios */}
                    <div className="bg-white/60 backdrop-blur rounded-lg p-4 mb-6 border border-amber-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                            {[
                                ts.benefit1,
                                ts.benefit2,
                                ts.benefit3,
                                ts.benefit4
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Grande y llamativo */}
                    <Button
                        onClick={onUpgrade}
                        variant="gradient"
                        className="w-full gap-2 text-base font-bold py-6 group relative overflow-hidden"
                        size="lg"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Crown className="w-5 h-5 relative" />
                        <span className="relative">{ts.unlockCustomUrls}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
                    </Button>

                    {/* Footer con precio/urgencia */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-600">
                            <Zap className="w-3 h-3 inline text-amber-500" />
                            {' '}{ts.includedInProA}{' '}
                            <span className="font-semibold text-amber-700">{ts.includedInProB}</span>
                        </p>
                    </div>
                </div>

                {/* Testimonio social (opcional) */}
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs">
                    <p className="text-pink-900 italic">
                        💬 "{ts.testimonial}" <span className="font-semibold">- Andrea M.</span>
                    </p>
                </div>
            </div>
        );
    }

    // 🆕 MODO PRO: Funcionalidad completa
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {ts.titleOptional}
                <span className="ml-2 text-xs text-gray-500 font-normal">
                    {ts.preview} {baseUrl}
                    <span className="font-mono text-pink-600">{value || suggestedSlug}</span>
                </span>
            </label>

            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-500">
                    <LinkIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">/p/</span>
                </div>

                <Input
                    value={value}
                    onChange={handleChange}
                    placeholder={suggestedSlug}
                    maxLength={30}
                    className={`pl-16 pr-10 font-mono ${touched && value
                            ? available === true
                                ? 'border-green-500 focus:ring-green-500'
                                : available === false
                                    ? 'border-red-500 focus:ring-red-500'
                                    : ''
                            : ''
                        }`}
                />

                {/* Indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checking && (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                    {!checking && touched && value && available === true && (
                        <Check className="w-4 h-4 text-green-500" />
                    )}
                    {!checking && touched && value && available === false && (
                        <X className="w-4 h-4 text-red-500" />
                    )}
                </div>
            </div>

            {/* Sugerencia rápida */}
            {!value && recipientName && (
                <button
                    onClick={() => {
                        onChange(suggestedSlug);
                        setTouched(true);
                    }}
                    className="text-xs text-pink-600 hover:text-pink-700 flex items-center gap-1 transition-colors"
                >
                    <Sparkles className="w-3 h-3" />
                    {ts.suggestion} "{suggestedSlug}"
                </button>
            )}

            {/* Message */}
            {touched && value && message && (
                <div
                    className={`flex items-center gap-1.5 text-xs ${available === true
                            ? 'text-green-600'
                            : available === false
                                ? 'text-red-600'
                                : 'text-gray-600'
                        }`}
                >
                    {available === false && <AlertCircle className="w-3.5 h-3.5" />}
                    {available === true && <Check className="w-3.5 h-3.5" />}
                    {message}
                </div>
            )}

            <p className="text-xs text-gray-500 flex flex-col gap-0.5">
                <span>• {ts.rules}</span>
                <span>• {ts.charRange}</span>
                <span>• {ts.autoGenerate}</span>
            </p>

            {/* Preview mejorado */}
            {value && available === true && (
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm font-bold text-green-900">{ts.perfectUrl}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="font-mono text-sm text-green-700 break-all">
                            {baseUrl}<span className="font-bold">{value}</span>
                        </p>
                    </div>
                    <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {ts.easyToShare}
                    </p>
                </div>
            )}
        </div>
    );
}

// CSS para el efecto shimmer (agregar a globals.css o aquí como <style jsx>)
const shimmerKeyframes = `
@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}
`;