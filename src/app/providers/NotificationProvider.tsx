import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────────
export interface AppNotification {
    id: string;
    type: 'order' | 'payment' | 'low-stock' | 'info';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

interface NotificationSettings {
    desktopEnabled: boolean;
    soundEnabled: boolean;
    orderAlerts: boolean;
    lowStockAlerts: boolean;
    paymentAlerts: boolean;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    settings: NotificationSettings;
    addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllRead: () => void;
    clearAll: () => void;
    updateSettings: (updates: Partial<NotificationSettings>) => void;
    requestDesktopPermission: () => Promise<boolean>;
    permissionStatus: NotificationPermission | 'unsupported';
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIF_KEY = 'kb_notifications';
const NOTIF_SETTINGS_KEY = 'kb_notif_settings';

const defaultSettings: NotificationSettings = {
    desktopEnabled: false,
    soundEnabled: true,
    orderAlerts: true,
    lowStockAlerts: true,
    paymentAlerts: true,
};

// Notification sound – a simple base64 encoded chime
const CHIME_SRC = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f4CBgoOEhYaHiImJiouLjIyNjY2OjY2NjYyMi4uKiYmIh4aFhIOCgYB/fn59fHt6eXh4d3Z2dnV1dXV1dXV2dnd3eHl6e3x9fn+AgYKDhIWGh4iJiouMjI2Njo6Ojo6Ojo2NjYyMi4qJiIiHhoWEg4KBgH9+fXx7enl4eHd2dnZ1dXV1dXV1dnZ3d3h5ent8fX5/gIGCg4SFhoeIiYqLjIyNjY6Ojo6Ojo6NjY2MjIuKiYiIh4aFhIOCgYB/fn18e3p5eHh3dnZ2dXV1dXV1dXZ2d3d4eXp7fH1+f4CBgoOEhYaHiImKi4yMjY2Ojo6Ojo6OjY2NjIyLiomIiIeGhYSDgoGAf359fHt6eXh4d3Z2dnV1dXV1dXV2dnd3eHl6e3x9fn+AgYKDhIWGh4iJiouMjI2Njo6Ojo6Ojo2NjYyMi4qJiIiHhoWEg4KBgH9+fXx7enl4eHd2dnZ1dXV1dXV1dnd3d3h5ent8fX5/gIGCg4SFhoeIiYqLjIyNjY2Ojo6Ojo6NjY2MjIuKiYiIh4aFhIOCgYB/fn18e3p5eHh3d3Z2dXV1dXV1dXZ2d3d4eXp7fH1+f4CBgoOEhYaHiImKi4yMjY2Ojo6Ojo6OjY2NjIyLiomIiIeGhYSDgoGAf359fHt6eXh4d3Z2dnV1dXV1dXV2dnd3eHl6e3x9fn+AgYKDhIWGh4iJiouMjI2Njo6Ojo6Ojo2NjYyMi4qJiIeGhYWEg4KBgH9+fXx7enp5eHd3dnZ1dXV1dXV2dnd4eHl6e3x9fn+AgYKDhIWGh4iJiouMjI2Njo6Ojo+Pj46OjY2NjIyLiomIh4eGhYSDgoGAf359fHt6enl4d3d2dnV1dXV1dnZ3eHh5ent8fX5/gIGCg4SFhoeIiYqLjIyNjY6Ojo6Pj4+Ojo2NjYyMi4qJiIeHhoWEg4KBgH9+fXx7enp5eHd3dnZ1dXV1dXZ2d3h4eXp7fH1+f4CBgoOEhYaHiImKi4yMjY2Ojo6Oj4+Pjo6NjY2MjIuKiYiHh4aFhIOCgYB/fn18e3p6eXh3d3Z2dXV1dXV2dnd4eHl6e3x9fn+AgYKDhIWGh4iJiouMjI2Njo6Ojo+Pj46OjY2NjIyLiomIh4eGhYSDgoGAf359fHt6enl4d3d2dnV1dXV1dnZ3eHh5ent8fX5/gIGCg4SFhoeIiYqLjIyNjY6Ojo6Pj4+Ojo2NjYyMi4qJiIeHhoWEg4KBgH9+fXx7enp5eHd3dnZ1dXV1dXZ2d3h4eXp7fH1+f4CBgoOEhYaHiImKi4yMjY2Ojo6Oj4+Pjo6NjY2MjIuKiYiHh4aFhIOCgYB/fn18e3p6eXh3d3Z2dXV1dXR1dnZ3eHl5ent8fX5/gIGCg4SFhoeIiYqLjIyNjY6Pj4+Pj4+Ojo6NjYyMi4qKiYiHhoaFhIOCgYB/f359fHt6eXl4d3d2dnV1dXV1dnZ3eHh5ent8fX5/gIGCg4SFhoeIiYqLjI2Njo6Oj4+Pj4+Ojo2NjYyMi4qJiYiHhoWFhIOCgYCAf359fHt6eXl4d3d2dnV1dXR1dnZ3eHl5ent8fX5/gIGCg4SFhoeIiYqLjI2Njo6Oj4+Pj4+Ojo2NjYyMi4qKiYiHhoaFhIOCgYCAf359fHt6eXl4d3d2dnV1dHR1dXZ3eHl5ent8fX5/gIGCg4WFhoeIiYqLjI2Njo6Oj4+Pj4+Ojo2NjYyLi4qKiYiHhoaFhIOCgYB/f359fHt6eXl4d3d2dnV1dHR1dXZ3eHl5ent8fX5/gIGDg4WFhoeIiYqLjI2Njo6Oj4+Pj4+Ojo2NjYyLi4qKiYiHhoaFhIOCgYB/f359fHt6eXl4d3d2dXV1dHR1dnZ3eHl5ent8fX5/gIGDg4WFhoeIiYqLjI2Njo6Pj4+Pj4+Ojo2NjYyLi4qKiYiHhoaFhIOCgYB/f359fHt6eXl4d3d2dXV1dHV1dnZ3eHl5ent8fX5/gIGDg4WFhoeIiYqLjI2Njo6Pj4+Qj4+Ojo2NjYyLi4qKiYiHhoaFhIOCgYB/f359fHt6eXl4d3d2dXV0dHV1dnZ3eHl5ent8fX5/gIGDhIWFhoeIiYqLjI2Njo6Pj4+Qj4+Ojo2NjYyLi4qKiYiHhoaFhIOCgYB/fn18fHt6eXl4d3d2dXV0dHV1dnZ3eHl5ent8fX5/gIKDhIWGhoeIiYqLjI2Ojo6Pj4+Qj4+Ojo2NjYyLi4qKiYiHhoaFhIOCgYB/fn18';

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        try {
            const saved = localStorage.getItem(NOTIF_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [settings, setSettings] = useState<NotificationSettings>(() => {
        try {
            const saved = localStorage.getItem(NOTIF_SETTINGS_KEY);
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch { return defaultSettings; }
    });

    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(() => {
        if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
        return Notification.permission;
    });

    // Persist notifications
    useEffect(() => {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications.slice(0, 50))); // keep last 50
    }, [notifications]);

    // Persist settings
    useEffect(() => {
        localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
    }, [settings]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const playSound = useCallback(() => {
        if (!settings.soundEnabled) return;
        try {
            const audio = new Audio(CHIME_SRC);
            audio.volume = 0.5;
            audio.play().catch(() => {/* blocked by browser autoplay policy */ });
        } catch {/* ignore */ }
    }, [settings.soundEnabled]);

    const sendDesktopNotification = useCallback((title: string, body: string) => {
        if (!settings.desktopEnabled) return;
        if (permissionStatus !== 'granted') return;
        try {
            new Notification(title, {
                body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'kerubelle-order',
            });
        } catch {/* ignore */ }
    }, [settings.desktopEnabled, permissionStatus]);

    const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
        const newNotif: AppNotification = {
            ...notif,
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            time: new Date().toISOString(),
            read: false,
        };

        setNotifications(prev => [newNotif, ...prev]);
        playSound();
        sendDesktopNotification(notif.title, notif.message);
    }, [playSound, sendDesktopNotification]);

    // Listen for custom order events from StoreProvider
    useEffect(() => {
        const handleNewOrder = (e: CustomEvent) => {
            if (!settings.orderAlerts) return;
            const { orderId, customerName, total } = e.detail;
            addNotification({
                type: 'order',
                title: '🛍️ New Order!',
                message: `${customerName} placed order ${orderId} — KES ${total.toLocaleString()}`,
            });
        };

        const handleLowStock = (e: CustomEvent) => {
            if (!settings.lowStockAlerts) return;
            const { productName, stock } = e.detail;
            addNotification({
                type: 'low-stock',
                title: '⚠️ Low Stock Alert',
                message: `${productName} is running low — only ${stock} left`,
            });
        };

        const handlePayment = (e: CustomEvent) => {
            if (!settings.paymentAlerts) return;
            const { orderId, customerName, amount, method } = e.detail;
            addNotification({
                type: 'payment',
                title: '💳 Payment Received!',
                message: `${customerName} paid KES ${amount.toLocaleString()} via ${method} for order ${orderId}`,
            });
        };

        window.addEventListener('kerubelle:new-order', handleNewOrder as EventListener);
        window.addEventListener('kerubelle:low-stock', handleLowStock as EventListener);
        window.addEventListener('kerubelle:payment-received', handlePayment as EventListener);

        return () => {
            window.removeEventListener('kerubelle:new-order', handleNewOrder as EventListener);
            window.removeEventListener('kerubelle:low-stock', handleLowStock as EventListener);
            window.removeEventListener('kerubelle:payment-received', handlePayment as EventListener);
        };
    }, [addNotification, settings.orderAlerts, settings.lowStockAlerts]);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    const requestDesktopPermission = useCallback(async (): Promise<boolean> => {
        if (!('Notification' in window)) {
            setPermissionStatus('unsupported');
            return false;
        }
        try {
            const result = await Notification.requestPermission();
            setPermissionStatus(result);
            if (result === 'granted') {
                updateSettings({ desktopEnabled: true });
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }, [updateSettings]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                settings,
                addNotification,
                markAsRead,
                markAllRead,
                clearAll,
                updateSettings,
                requestDesktopPermission,
                permissionStatus,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
}
