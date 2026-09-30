'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from '@/i18n';

interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type: string;
    icon: string;
    actionUrl: string | null;
    actionText: string | null;
    isRead: boolean;
    createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    promo: 'bg-purple-50 border-purple-200',
    update: 'bg-cyan-50 border-cyan-200',
    response: 'bg-pink-50 border-pink-200',
    system: 'bg-gray-50 border-gray-200',
};

export function NotificationBell() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { t, locale } = useTranslation();

    // Obtener contador de no leídas
    const fetchUnreadCount = useCallback(async () => {
        try {
            const { data } = await api.notifications.getUnreadCount();
            setUnreadCount(data.data.count);
        } catch (error) {
            // Silenciar errores de polling
        }
    }, []);

    // Obtener notificaciones recientes
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data } = await api.notifications.getAll({ page: 1, limit: 10 });
            setNotifications(data.data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Polling cada 30 segundos para el contador
    useEffect(() => {
        fetchUnreadCount();
        intervalRef.current = setInterval(fetchUnreadCount, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchUnreadCount]);

    // Al abrir el dropdown, cargar notificaciones
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await api.notifications.markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.notifications.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationClick = async (notification: NotificationItem) => {
        if (!notification.isRead) {
            await handleMarkAsRead(notification._id);
        }
        if (notification.actionUrl) {
            setIsOpen(false);
            router.push(notification.actionUrl);
        }
    };

    const timeAgo = (date: string) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true, locale: locale === 'en' ? enUS : es });
        } catch {
            return '';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={t.notifications.title}
            >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/80">
                        <h3 className="font-semibold text-gray-900 text-sm">
                            {t.notifications.title}
                            {unreadCount > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                {t.notifications.markAll}
                            </button>
                        )}
                    </div>

                    {/* Notification list */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <Bell className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">
                                    {t.notifications.noNotificationsShort}
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-pink-50/40' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div
                                            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border text-lg ${TYPE_COLORS[notification.type] || TYPE_COLORS.info
                                                }`}
                                        >
                                            {notification.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p
                                                    className={`text-sm leading-tight ${!notification.isRead
                                                            ? 'font-semibold text-gray-900'
                                                            : 'font-medium text-gray-700'
                                                        }`}
                                                >
                                                    {notification.title}
                                                </p>
                                                {!notification.isRead && (
                                                    <span className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-1.5">
                                                <span className="text-[11px] text-gray-400">
                                                    {timeAgo(notification.createdAt)}
                                                </span>
                                                {notification.actionUrl && notification.actionText && (
                                                    <span className="text-[11px] text-pink-500 font-medium flex items-center gap-0.5">
                                                        {notification.actionText}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t px-4 py-2.5 bg-gray-50/80">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/notifications');
                                }}
                                className="w-full text-center text-xs text-pink-600 hover:text-pink-700 font-medium"
                            >
                                {t.notifications.viewAll}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}