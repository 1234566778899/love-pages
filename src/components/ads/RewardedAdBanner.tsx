'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Crown, Play, Gift, X, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const AD_CLIENT = 'ca-pub-1738334012076528';
const AD_SLOT = '7225251146';
const COUNTDOWN_SECONDS = 15;
const MAX_DAILY_ADS = 3;

const isDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

interface RewardedAdBannerProps {
    context: 'dashboard' | 'create';
    onRewardEarned?: () => void;
    compact?: boolean;
}

export function RewardedAdBanner({
    context,
    onRewardEarned,
    compact = false,
}: RewardedAdBannerProps) {
    const { user, setUser } = useAuthStore();

    const [showingAd, setShowingAd] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [rewardEarned, setRewardEarned] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [adLoaded, setAdLoaded] = useState(false);
    const [rewardToken, setRewardToken] = useState<string | null>(null);

    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const adContainerRef = useRef<HTMLDivElement>(null);

    // ── helpers (stable refs) ──────────────────────────────────
    const startCountdown = useCallback(() => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // ── ALL useEffects BEFORE any early return ─────────────────

    // Load AdSense ad when modal opens
    useEffect(() => {
        if (!showModal || isDev) return;

        const timer = setTimeout(() => {
            try {
                const container = adContainerRef.current;
                if (!container) return;

                // Clear previous content safely
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                const ins = document.createElement('ins');
                ins.className = 'adsbygoogle';
                ins.style.display = 'block';
                ins.style.width = '100%';
                ins.style.minHeight = '250px';
                ins.setAttribute('data-ad-client', AD_CLIENT);
                ins.setAttribute('data-ad-slot', AD_SLOT);
                ins.setAttribute('data-ad-format', 'auto');
                ins.setAttribute('data-full-width-responsive', 'true');

                container.appendChild(ins);

                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});

                setAdLoaded(true);
                startCountdown();
            } catch (error) {
                console.error('Error cargando anuncio:', error);
                setAdLoaded(true);
                startCountdown();
            }
        }, 500);

        // ★ KEY FIX: clean up AdSense DOM *before* React unmounts
        return () => {
            clearTimeout(timer);
            const container = adContainerRef.current;
            if (container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }
        };
    }, [showModal, startCountdown]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    // ── Early returns (AFTER all hooks) ────────────────────────
    if (!user || user.isPro || user.canCreatePage || dismissed) return null;

    const dailyAdViews = user.dailyAdViews || 0;

    if (dailyAdViews >= MAX_DAILY_ADS && !rewardEarned) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">
                    Ya usaste tus {MAX_DAILY_ADS} recompensas de hoy. Vuelve mañana o{' '}
                    <a href="/upgrade" className="text-amber-600 font-semibold hover:underline">
                        pasa a PRO
                    </a>{' '}
                    para páginas ilimitadas.
                </p>
            </div>
        );
    }

    // ── Handlers ───────────────────────────────────────────────
    const handleWatchAd = async () => {
        setShowingAd(true);
        try {
            if (isDev) {
                const confirmed = window.confirm(
                    '🎬 [SIMULACIÓN]\n\nEn producción se mostraría un anuncio de AdSense con countdown de 15 seg.\n\n¿Simular que completaste el anuncio?'
                );
                if (confirmed) {
                    const { data } = await api.rewards.requestReward();
                    const token = data.data.token;
                    const { data: rewardData } = await api.rewards.confirmReward(token);
                    setUser(rewardData.data.user);
                    setRewardEarned(true);
                    toast.success('🎉 ¡Ganaste 1 página extra!', { duration: 4000 });
                    onRewardEarned?.();
                }
                setShowingAd(false);
                return;
            }

            const { data } = await api.rewards.requestReward();
            const token = data.data.token;
            setRewardToken(token);
            setCountdown(COUNTDOWN_SECONDS);
            setAdLoaded(false);
            setShowModal(true);
        } catch (error: any) {
            console.error('Error al solicitar recompensa:', error);
            toast.error(error.response?.data?.message || 'Error al procesar recompensa');
            setShowingAd(false);
        }
    };

    const handleClaimReward = async () => {
        if (!rewardToken) return;
        try {
            const { data: rewardData } = await api.rewards.confirmReward(rewardToken);
            setUser(rewardData.data.user);
            setRewardEarned(true);
            setShowModal(false);
            setShowingAd(false);
            setRewardToken(null);
            toast.success('🎉 ¡Ganaste 1 página extra!', { duration: 4000 });
            onRewardEarned?.();
        } catch (error: any) {
            console.error('Error al confirmar recompensa:', error);
            toast.error(error.response?.data?.message || 'Error al confirmar recompensa');
        }
    };

    const handleCloseModal = () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        // Clean AdSense DOM before React removes the modal
        const container = adContainerRef.current;
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
        setShowModal(false);
        setShowingAd(false);
        setRewardToken(null);
        toast('No se completó el anuncio. No se otorgó recompensa.', { icon: '⏭️' });
    };

    // ── Render: reward already earned ──────────────────────────
    if (rewardEarned) {
        return (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-bold text-green-800">¡Página extra desbloqueada!</p>
                <p className="text-sm text-green-600 mt-1">Ya puedes crear una nueva página</p>
            </div>
        );
    }
    const viewer = localStorage.getItem('viewer');
    if (!viewer) {
        return <></>
    }
    // ── Render: banner + modal ─────────────────────────────────
    return (
        <>
            {compact ? (
                <div className="relative bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 flex items-center gap-3">
                    <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Gift className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">¿Quieres otra página gratis?</p>
                        <p className="text-xs text-gray-600">
                            Mira un breve anuncio y gana 1 página extra ({MAX_DAILY_ADS - dailyAdViews} restantes hoy)
                        </p>
                    </div>
                    <Button onClick={handleWatchAd} disabled={showingAd} size="sm" className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white gap-1">
                        <Play className="w-3.5 h-3.5" />
                        {showingAd ? 'Cargando...' : 'Ver anuncio'}
                    </Button>
                </div>
            ) : (
                <div className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-300 rounded-2xl p-6 sm:p-8 text-center overflow-hidden">
                    <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Gana una página extra gratis! 🎁</h3>
                        <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                            Has usado tu página gratuita. Mira un breve anuncio y desbloquea <strong>1 página adicional</strong> al instante.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <Button onClick={handleWatchAd} disabled={showingAd} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 px-6 py-3 text-base shadow-lg shadow-purple-500/20">
                                <Play className="w-5 h-5" />
                                {showingAd ? 'Cargando anuncio...' : 'Ver anuncio (~15 seg)'}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">{MAX_DAILY_ADS - dailyAdViews} de {MAX_DAILY_ADS} recompensas disponibles hoy</p>
                        <div className="mt-5 pt-5 border-t border-purple-200">
                            <p className="text-xs text-gray-500 mb-2">¿Prefieres no ver anuncios?</p>
                            <a href="/upgrade" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700">
                                <Crown className="w-4 h-4" />
                                Pasa a PRO — $3.99/año, páginas ilimitadas
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal with ad + countdown ── */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Gift className="w-5 h-5" />
                                    <span className="font-semibold">Mira el anuncio para ganar 1 página</span>
                                </div>
                                <button onClick={handleCloseModal} className="text-white/70 hover:text-white transition-colors" title="Cerrar (perderás la recompensa)">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* ★ KEY FIX: suppressHydrationWarning + ref-only container */}
                        <div className="p-4 sm:p-6">
                            <div className="relative w-full min-h-[250px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden">
                                {/* Contenedor imperativo para AdSense — SIN hijos React */}
                                <div ref={adContainerRef} className="w-full min-h-[250px]" />

                                {/* Overlay de carga — gestionado por React, fuera del ref */}
                                {!adLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                                            <span className="text-sm">Cargando anuncio...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            {countdown > 0 ? (
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Timer className="w-5 h-5 text-purple-600 animate-pulse" />
                                        <span className="text-2xl font-bold text-gray-900">{countdown}s</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Espera {countdown} segundos para reclamar tu recompensa</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-3">
                                    <div className="text-3xl">🎉</div>
                                    <p className="font-semibold text-gray-900">¡Anuncio completado!</p>
                                    <Button onClick={handleClaimReward} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-2 py-3 text-base shadow-lg">
                                        <Gift className="w-5 h-5" />
                                        Reclamar 1 página extra
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}