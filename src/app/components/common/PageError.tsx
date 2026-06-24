import { WifiOff, ServerCrash, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageErrorProps {
    message?: string;
    onRetry?: () => void;
}

function detectErrorType(message?: string): 'network' | 'backend' | 'unknown' {
    if (!message) return 'unknown';
    const m = message.toLowerCase();
    if (
        m.includes('network') ||
        m.includes('fetch') ||
        m.includes('failed to fetch') ||
        m.includes('net::') ||
        m.includes('networkerror') ||
        m.includes('no internet') ||
        m.includes('offline') ||
        m.includes('connect')
    ) return 'network';
    if (
        m.includes('500') ||
        m.includes('502') ||
        m.includes('503') ||
        m.includes('backend') ||
        m.includes('server') ||
        m.includes('database') ||
        m.includes('unexpected response') ||
        m.includes('endpoint not found') ||
        m.includes('http 4') ||
        m.includes('http 5')
    ) return 'backend';
    return 'unknown';
}

export function PageError({ message, onRetry }: PageErrorProps) {
    const type = detectErrorType(message);

    const config = {
        network: {
            Icon: WifiOff,
            title: 'No Internet Connection',
            subtitle: "We couldn't reach our servers.",
            detail: "Check your Wi-Fi or mobile data and try again.",
            color: '#D4A5B8',
        },
        backend: {
            Icon: ServerCrash,
            title: 'Server Error',
            subtitle: "Our servers ran into a problem.",
            detail: "This is on our end — please try again in a moment.",
            color: '#D4A5B8',
        },
        unknown: {
            Icon: ServerCrash,
            title: 'Something Went Wrong',
            subtitle: "An unexpected error occurred.",
            detail: "Please try again or go back to the home page.",
            color: '#D4A5B8',
        },
    }[type];

    const { Icon, title, subtitle, detail, color } = config;

    return (
        <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#FFF5F9] px-6">

            {/* Icon ring */}
            <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-[#F8C8DC]/20 blur-3xl scale-[2]" />
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[#F8C8DC]/20" />
                    <div className="absolute inset-2 rounded-full border border-[#F8C8DC]/15" />
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                        style={{ background: 'linear-gradient(135deg, #F8C8DC22, #D4A5B822)', border: '1.5px solid #F8C8DC55' }}>
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                </div>
            </div>

            {/* Text */}
            <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">{title}</h2>
            <p className="text-sm text-gray-500 text-center mb-1">{subtitle}</p>
            <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed mb-3">{detail}</p>

            {/* Raw error message (collapsible) — helps debugging */}
            {message && (
                <details className="mb-6 max-w-sm w-full">
                    <summary className="text-xs text-gray-400 cursor-pointer text-center hover:text-gray-600 transition-colors select-none">
                        Show error details
                    </summary>
                    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-500 font-mono break-all leading-relaxed">
                        {message}
                    </div>
                </details>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-7 py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                        style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                )}
                <Link
                    to="/"
                    className="flex items-center gap-2 px-7 py-3 rounded-full text-[#D4A5B8] font-semibold text-sm border border-[#F8C8DC]/50 hover:bg-[#FFF5F9] hover:border-[#D4A5B8] transition-all duration-200"
                >
                    <Home className="w-4 h-4" />
                    Home
                </Link>
            </div>
        </div>
    );
}
