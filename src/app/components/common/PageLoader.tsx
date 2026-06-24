export function PageLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#FFF5F9]">
            {/* Outer glow */}
            <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-[#F8C8DC]/20 blur-3xl scale-[2]" />

                {/* Rings */}
                <div className="relative flex items-center justify-center w-28 h-28">
                    {/* Faint outer ring */}
                    <div className="absolute inset-0 rounded-full border border-[#F8C8DC]/20" />
                    {/* Mid static ring */}
                    <div className="absolute inset-2 rounded-full border border-[#F8C8DC]/15" />
                    {/* Spinning arc */}
                    <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-[#D4A5B8] border-r-[#F8C8DC]/60 animate-spin" />

                    {/* Centre icon */}
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Brand name */}
            <p
                className="text-2xl font-bold bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] bg-clip-text text-transparent mb-1 tracking-wide"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}
            >
                KeruBelle
            </p>

            {/* Bouncing dots */}
            <div className="flex items-center gap-1.5 mt-3">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#D4A5B8]"
                        style={{ animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes dotBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
                    40%           { transform: translateY(-6px); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
