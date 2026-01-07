"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { format } from "date-fns"
import {
    Building2,
    Clock,
    Sun,
    Moon,
    Sparkles,
    Menu,
    X as Close,
    CalendarDays,
    Star,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LandingHeaderProps {
    mosqueName: string
    scrollY: number
    setMobileMenuOpen: (open: boolean) => void
    mobileMenuOpen: boolean
}

export function LandingHeader({ mosqueName, scrollY, setMobileMenuOpen, mobileMenuOpen }: LandingHeaderProps) {
    const { theme, setTheme } = useTheme()

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrollY > 10
                    ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-xl shadow-black/5"
                    : "bg-transparent border-transparent"
            )}
        >
            {/* Islamic Pattern Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-32 opacity-5">
                    <svg viewBox="0 0 80 128" className="text-emerald-500">
                        <path d="M40,0 L40,128 M20,64 L60,64 M10,32 L30,96 M50,96 L70,32" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-32 opacity-5 rotate-180">
                    <svg viewBox="0 0 80 128" className="text-emerald-500">
                        <path d="M40,0 L40,128 M20,64 L60,64 M10,32 L30,96 M50,96 L70,32" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between py-3 md:py-4">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div
                            className={cn(
                                "relative flex items-center justify-center transition-all duration-300",
                                scrollY > 10 ? "w-10 h-10" : "w-12 h-12"
                            )}
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity animate-pulse" />

                            {/* Main Logo */}
                            <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
                                <Building2
                                    className={cn(
                                        "text-white transition-all duration-300",
                                        scrollY > 10 ? "w-5 h-5" : "w-6 h-6"
                                    )}
                                />
                            </div>

                            {/* Animated Star Decoration */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-spin-slow opacity-80">
                                <Star fill="currentColor" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h1
                                className={cn(
                                    "font-bold tracking-tight text-foreground transition-all duration-300",
                                    scrollY > 10 ? "text-sm md:text-base" : "text-base md:text-lg"
                                )}
                            >
                                {mosqueName}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        "text-emerald-600 dark:text-emerald-400 font-serif italic transition-all duration-300",
                                        scrollY > 10 ? "text-[10px]" : "text-xs"
                                    )}
                                >
                                    المَسْجِد
                                </span>
                                <span className="text-muted-foreground/50 text-xs">|</span>
                                <p
                                    className={cn(
                                        "text-muted-foreground uppercase tracking-wider font-medium transition-all duration-300",
                                        scrollY > 10 ? "text-[8px] md:text-[10px]" : "text-[10px] md:text-xs"
                                    )}
                                >
                                    Portal Informasi
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Islamic Greeting Badge (Desktop) */}
                        <div
                            className={cn(
                                "hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 transition-all duration-300",
                                scrollY > 10 ? "opacity-100" : "opacity-90"
                            )}
                        >
                            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200">السَّلَامُ عَلَيْكُم</span>
                        </div>

                        {/* Live Clock */}
                        <div
                            className={cn(
                                "flex items-center gap-2 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 backdrop-blur-sm rounded-full transition-all duration-300 border",
                                scrollY > 10 ? "border-border px-3 py-1.5 shadow-sm" : "border-emerald-500/20 px-4 py-2"
                            )}
                        >
                            <Clock
                                className={cn(
                                    "text-emerald-600 dark:text-emerald-400 transition-all duration-300",
                                    scrollY > 10 ? "w-3.5 h-3.5" : "w-4 h-4"
                                )}
                            />
                            <span
                                className={cn(
                                    "font-mono font-bold text-foreground tabular-nums transition-all duration-300",
                                    scrollY > 10 ? "text-xs" : "text-sm"
                                )}
                            >
                                {/* Clock will be handled by parent */}
                                <ClockDisplay scrollY={scrollY} />
                            </span>
                        </div>

                        {/* Theme Toggle */}
                        <ThemeToggle scrollY={scrollY} theme={theme} setTheme={setTheme} />

                        {/* Mobile Menu Toggle */}
                        <MobileMenuToggle
                            scrollY={scrollY}
                            theme={theme}
                            mobileMenuOpen={mobileMenuOpen}
                            setMobileMenuOpen={setMobileMenuOpen}
                        />
                    </div>
                </div>

                <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            </div>

            {/* Navbar Animation Styles */}
            <style>{`
                @keyframes spin-slow {
                    0%, 100% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>
        </header>
    )
}

// Sub-components for better separation of concerns
function ClockDisplay({ scrollY }: { scrollY: number }) {
    const [time, setTime] = useState(() => new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    return format(time, "HH:mm:ss")
}

function ThemeToggle({ scrollY, theme, setTheme }: any) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button
                className={cn(
                    "relative flex items-center justify-center rounded-full transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200",
                    scrollY > 10 ? "opacity-100" : "opacity-90"
                )}
                style={{
                    width: scrollY > 10 ? "36px" : "42px",
                    height: scrollY > 10 ? "36px" : "42px",
                }}
                aria-label="Toggle theme"
            >
                <Sun className="h-5 w-5 text-amber-600 transition-all duration-500" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-300 bg-gradient-to-br",
                theme === "dark"
                    ? "from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600"
                    : "from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-300"
            )}
            style={{
                width: scrollY > 10 ? "36px" : "42px",
                height: scrollY > 10 ? "36px" : "42px",
            }}
            aria-label="Toggle theme"
        >
            <Sun
                className={cn(
                    "h-5 w-5 text-amber-600 dark:text-amber-400 transition-all duration-500",
                    theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                )}
            />
            <Moon
                className={cn(
                    "absolute h-5 w-5 text-blue-600 dark:text-blue-400 transition-all duration-500",
                    theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
                )}
            />
        </button>
    )
}

function MobileMenuToggle({ scrollY, theme, mobileMenuOpen, setMobileMenuOpen }: any) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button
                className={cn(
                    "md:hidden flex items-center justify-center rounded-full transition-all duration-300",
                    "bg-emerald-50 border border-emerald-200 text-emerald-700"
                )}
                style={{
                    width: scrollY > 10 ? "36px" : "42px",
                    height: scrollY > 10 ? "36px" : "42px",
                }}
                aria-label="Toggle menu"
            >
                <Menu className="w-4 h-4" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
                "md:hidden flex items-center justify-center rounded-full transition-all duration-300",
                theme === "dark"
                    ? "bg-slate-800 border border-slate-700 text-slate-300"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-700",
                mobileMenuOpen && "bg-emerald-600 border-emerald-600 text-white"
            )}
            style={{
                width: scrollY > 10 ? "36px" : "42px",
                height: scrollY > 10 ? "36px" : "42px",
            }}
            aria-label="Toggle menu"
        >
            {mobileMenuOpen ? <Close className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
    )
}

function MobileMenu({ mobileMenuOpen, setMobileMenuOpen }: any) {
    return (
        <div
            className={cn(
                "md:hidden overflow-hidden transition-all duration-300 border-t border-border/50",
                mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
            )}
        >
            <div className="pt-4 space-y-2">
                {/* Mobile Islamic Greeting */}
                <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">السَّلَامُ عَلَيْكُم</span>
                </div>

                {/* Mobile Quick Links */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => {
                            window.scrollTo({ top: 300, behavior: "smooth" })
                            setMobileMenuOpen(false)
                        }}
                        className="flex items-center justify-center gap-2 bg-secondary/50 border border-border rounded-xl px-4 py-3 hover:bg-secondary transition-colors"
                    >
                        <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium">Jadwal</span>
                    </button>
                    <button
                        onClick={() => {
                            window.scrollTo({ top: 800, behavior: "smooth" })
                            setMobileMenuOpen(false)
                        }}
                        className="flex items-center justify-center gap-2 bg-secondary/50 border border-border rounded-xl px-4 py-3 hover:bg-secondary transition-colors"
                    >
                        <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium">Kegiatan</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
