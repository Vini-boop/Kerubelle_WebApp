import { useState } from 'react';
import { Store, CreditCard, Bell, Palette, Save, Monitor, Volume2, Moon, Sun } from 'lucide-react';
import { useNotifications } from '../../../providers/NotificationProvider';
import { useTheme } from '../../../providers/ThemeProvider';

export function AdminSettings() {
    const { settings: notifSettings, updateSettings: updateNotifSettings, requestDesktopPermission, permissionStatus } = useNotifications();
    const { theme, setTheme } = useTheme();
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        storeName: 'KeruBelle',
        ownerName: 'Dinah Kerubo',
        email: 'hello@kerubelle.co.ke',
        phone: '+254712345678',
        mpesaPaybill: '123456',
        mpesaTillNumber: '7654321',
        cardEnabled: true,
        mpesaEnabled: true,
        primaryColor: '#F8C8DC',
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDesktopToggle = async (enabled: boolean) => {
        if (enabled) {
            const granted = await requestDesktopPermission();
            if (!granted) {
                // Permission denied — don't enable
                return;
            }
        }
        updateNotifSettings({ desktopEnabled: enabled });
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your store settings.</p>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#F8C8DC]/20 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#D4A5B8]" /> Business Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                        <input
                            value={settings.storeName} onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                        <input
                            value={settings.ownerName} onChange={e => setSettings({ ...settings, ownerName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                        />
                    </div>
                </div>
            </div>

            {/* Payment Config */}
            <div className="bg-white rounded-2xl p-6 border border-[#F8C8DC]/20 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#D4A5B8]" /> Payment Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Paybill</label>
                        <input
                            value={settings.mpesaPaybill} onChange={e => setSettings({ ...settings, mpesaPaybill: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Till Number</label>
                        <input
                            value={settings.mpesaTillNumber} onChange={e => setSettings({ ...settings, mpesaTillNumber: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/40"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox" checked={settings.mpesaEnabled}
                            onChange={e => setSettings({ ...settings, mpesaEnabled: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-[#F8C8DC] focus:ring-[#F8C8DC]"
                        />
                        <span className="text-sm text-gray-700">Enable M-Pesa Payments</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox" checked={settings.cardEnabled}
                            onChange={e => setSettings({ ...settings, cardEnabled: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-[#F8C8DC] focus:ring-[#F8C8DC]"
                        />
                        <span className="text-sm text-gray-700">Enable Card Payments</span>
                    </label>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 border border-[#F8C8DC]/20 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#D4A5B8]" /> Notifications
                </h3>

                {/* Desktop Notifications */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF5F9] to-white border border-[#F8C8DC]/10">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <Monitor className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Desktop Notifications</p>
                                <p className="text-xs text-gray-400">
                                    {permissionStatus === 'granted' ? '✅ Browser permission granted' :
                                        permissionStatus === 'denied' ? '❌ Browser permission denied — enable in browser settings' :
                                            permissionStatus === 'unsupported' ? '⚠️ Not supported in this browser' :
                                                'Click to enable browser notifications'}
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={notifSettings.desktopEnabled}
                                onChange={e => handleDesktopToggle(e.target.checked)}
                                disabled={permissionStatus === 'denied' || permissionStatus === 'unsupported'}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#F8C8DC] rounded-full transition-colors peer-disabled:opacity-50" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-5" />
                        </div>
                    </label>
                </div>

                {/* Sound Alerts */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF5F9] to-white border border-[#F8C8DC]/10">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                <Volume2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Sound Alerts</p>
                                <p className="text-xs text-gray-400">Play a chime when new orders arrive</p>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={notifSettings.soundEnabled}
                                onChange={e => updateNotifSettings({ soundEnabled: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#F8C8DC] rounded-full transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform peer-checked:translate-x-5" />
                        </div>
                    </label>
                </div>

                {/* Alert Types */}
                <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1 mb-2">Alert Types</p>
                    {[
                        { key: 'orderAlerts' as const, label: 'New Order Alerts', desc: 'Get notified when customers place orders' },
                        { key: 'lowStockAlerts' as const, label: 'Low Stock Alerts', desc: 'Get notified when products are running low' },
                    ].map(({ key, label, desc }) => (
                        <label key={key} className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-[#FDF8FA] transition-colors">
                            <div>
                                <p className="text-sm text-gray-700">{label}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifSettings[key]}
                                onChange={e => updateNotifSettings({ [key]: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-[#F8C8DC] focus:ring-[#F8C8DC]"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Theme */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#F8C8DC]/20 dark:border-gray-700 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[#D4A5B8]" /> Theme
                </h3>

                {/* Light / Dark toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#FFF5F9] dark:from-gray-700 to-white dark:to-gray-700 border border-[#F8C8DC]/10 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                            {theme === 'dark' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Appearance</p>
                            <p className="text-xs text-gray-400 dark:text-gray-400">Switch between light and dark mode</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-600 rounded-full p-1">
                        <button onClick={() => setTheme('light')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${theme === 'light' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700'
                                }`}>
                            <Sun className="w-3.5 h-3.5" /> Light
                        </button>
                        <button onClick={() => setTheme('dark')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${theme === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700'
                                }`}>
                            <Moon className="w-3.5 h-3.5" /> Dark
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Color</label>
                    <input type="color" value={settings.primaryColor}
                        onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{settings.primaryColor}</span>
                </div>
            </div>

            {/* Save */}
            <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Settings'}
            </button>
        </div>
    );
}
