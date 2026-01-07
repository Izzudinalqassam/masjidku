"use client"

import { cn } from "@/lib/utils"

interface AnimatedSunProps {
    className?: string
    size?: number
}

export function AnimatedSun({ className, size = 80 }: AnimatedSunProps) {
    return (
        <div 
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            {/* Glow effect */}
            <div 
                className="absolute rounded-full"
                style={{
                    width: size * 1.4,
                    height: size * 1.4,
                    background: 'radial-gradient(circle, rgba(255, 200, 50, 0.3) 0%, rgba(255, 150, 50, 0.1) 50%, transparent 70%)',
                    animation: 'pulse-glow 3s ease-in-out infinite'
                }}
            />

            {/* Outer rotating rays */}
            <svg
                className="absolute"
                width={size * 1.3}
                height={size * 1.3}
                viewBox="0 0 100 100"
                style={{ animation: 'rotate-slow 20s linear infinite' }}
            >
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180)
                    const x1 = 50 + Math.cos(angle) * 25
                    const y1 = 50 + Math.sin(angle) * 25
                    const x2 = 50 + Math.cos(angle) * 40
                    const y2 = 50 + Math.sin(angle) * 40
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="url(#sun-ray-gradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.6"
                        />
                    )
                })}
                <defs>
                    <linearGradient id="sun-ray-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Inner rotating rays */}
            <svg
                className="absolute"
                width={size * 1.1}
                height={size * 1.1}
                viewBox="0 0 100 100"
                style={{ animation: 'rotate 12s linear infinite reverse' }}
            >
                {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180)
                    const x1 = 50 + Math.cos(angle) * 20
                    const y1 = 50 + Math.sin(angle) * 20
                    const x2 = 50 + Math.cos(angle) * 32
                    const y2 = 50 + Math.sin(angle) * 32
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#FFA500"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    )
                })}
            </svg>

            {/* Main sun circle */}
            <div
                className="relative rounded-full shadow-2xl"
                style={{
                    width: size * 0.7,
                    height: size * 0.7,
                    background: 'linear-gradient(135deg, #FFE066 0%, #FFB347 50%, #FF8C00 100%)',
                    boxShadow: '0 0 30px rgba(255, 165, 0, 0.5), 0 0 60px rgba(255, 140, 0, 0.3), inset 0 -5px 15px rgba(255, 100, 0, 0.3)',
                    animation: 'pulse-sun 4s ease-in-out infinite'
                }}
            >
                {/* Inner shine effect */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)'
                    }}
                />
            </div>

            <style jsx>{`
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes pulse-sun {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </div>
    )
}
