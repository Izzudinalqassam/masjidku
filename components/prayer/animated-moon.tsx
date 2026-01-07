"use client"

import { cn } from "@/lib/utils"

interface AnimatedMoonProps {
    className?: string
    size?: number
}

export function AnimatedMoon({ className, size = 80 }: AnimatedMoonProps) {
    return (
        <div 
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            {/* Outer glow effect */}
            <div 
                className="absolute rounded-full"
                style={{
                    width: size * 1.4,
                    height: size * 1.4,
                    background: 'radial-gradient(circle, rgba(200, 220, 255, 0.2) 0%, rgba(150, 180, 255, 0.1) 40%, transparent 70%)',
                    animation: 'pulse-glow-moon 4s ease-in-out infinite'
                }}
            />

            {/* Twinkling stars */}
            <div className="absolute" style={{ width: size * 1.6, height: size * 1.6 }}>
                {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180)
                    const distance = 0.45
                    const x = 50 + Math.cos(angle) * (distance * 100)
                    const y = 50 + Math.sin(angle) * (distance * 100)
                    const delay = i * 0.3
                    return (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                width: '3px',
                                height: '3px',
                                transform: 'translate(-50%, -50%)',
                                animation: `twinkle 2s ease-in-out infinite ${delay}s`,
                                opacity: 0
                            }}
                        />
                    )
                })}
            </div>

            {/* Small stars */}
            <div className="absolute" style={{ width: size * 1.8, height: size * 1.8 }}>
                {[...Array(6)].map((_, i) => {
                    const angle = (i * 60 + 30) * (Math.PI / 180)
                    const distance = 0.55
                    const x = 50 + Math.cos(angle) * (distance * 100)
                    const y = 50 + Math.sin(angle) * (distance * 100)
                    const delay = i * 0.4 + 0.5
                    return (
                        <div
                            key={i}
                            className="absolute rounded-full bg-blue-200"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                width: '2px',
                                height: '2px',
                                transform: 'translate(-50%, -50%)',
                                animation: `twinkle 3s ease-in-out infinite ${delay}s`,
                                opacity: 0
                            }}
                        />
                    )
                })}
            </div>

            {/* Moon glow ring */}
            <div
                className="absolute rounded-full"
                style={{
                    width: size * 1.15,
                    height: size * 1.15,
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                    animation: 'ring-pulse 5s ease-in-out infinite'
                }}
            />

            {/* Main moon circle */}
            <div
                className="relative rounded-full shadow-2xl"
                style={{
                    width: size * 0.7,
                    height: size * 0.7,
                    background: 'linear-gradient(135deg, #E8E8FF 0%, #C8D8FF 30%, #B0C4DE 70%, #A0B8D8 100%)',
                    boxShadow: '0 0 25px rgba(200, 220, 255, 0.4), 0 0 50px rgba(180, 200, 255, 0.2), inset 0 -8px 20px rgba(100, 130, 180, 0.3)',
                    animation: 'moon-float 6s ease-in-out infinite'
                }}
            >
                {/* Craters */}
                <div
                    className="absolute rounded-full opacity-20"
                    style={{
                        width: '20%',
                        height: '20%',
                        left: '25%',
                        top: '30%',
                        background: 'radial-gradient(circle, rgba(100, 130, 180, 0.4) 0%, transparent 70%)'
                    }}
                />
                <div
                    className="absolute rounded-full opacity-15"
                    style={{
                        width: '15%',
                        height: '15%',
                        left: '55%',
                        top: '45%',
                        background: 'radial-gradient(circle, rgba(100, 130, 180, 0.4) 0%, transparent 70%)'
                    }}
                />
                <div
                    className="absolute rounded-full opacity-10"
                    style={{
                        width: '10%',
                        height: '10%',
                        left: '65%',
                        top: '25%',
                        background: 'radial-gradient(circle, rgba(100, 130, 180, 0.4) 0%, transparent 70%)'
                    }}
                />

                {/* Inner shine effect */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.5) 0%, transparent 50%)'
                    }}
                />
            </div>

            <style jsx>{`
                @keyframes pulse-glow-moon {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.08); opacity: 0.7; }
                }
                @keyframes ring-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 0.3; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes moon-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    )
}
