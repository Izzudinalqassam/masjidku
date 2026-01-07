"use client"

import { useEffect, useState, useMemo } from "react"
import { useTheme } from "next-themes"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    Building2,
    CalendarDays,
    MapPin,
    Clock,
    ChevronRight,
    Sun,
    Sunset,
    Moon,
    Sparkles,
    Search,
    X,
    TrendingUp,
    Users,
    Layers,
    Target,
    Award,
    Zap,
    Star,
    Menu,
    X as Close,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Event {
    id: string
    title: string
    description: string | null
    imageUrl: string | null
    startDate: Date
    endDate: Date | null
    location: string | null
    category: string
}

interface LandingPageProps {
    events: Event[]
    mosqueName: string
    mosqueAddress: string
}

// Simulated prayer times (in production, use API like aladhan.com)
const prayerTimes = [
    { name: "Subuh", time: "04:45", icon: Moon },
    { name: "Dzuhur", time: "12:15", icon: Sun },
    { name: "Ashar", time: "15:30", icon: Sun },
    { name: "Maghrib", time: "18:15", icon: Sunset },
    { name: "Isya", time: "19:30", icon: Moon },
]

const categories = [
    { id: "ALL", label: "Semua" },
    { id: "KAJIAN", label: "Kajian" },
    { id: "SOSIAL", label: "Sosial" },
    { id: "PHBI", label: "PHBI" },
    { id: "LOMBA", label: "Lomba" },
    { id: "LAINNYA", label: "Lainnya" },
]

const categoryColors: Record<string, string> = {
    KAJIAN: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    SOSIAL: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    PHBI: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    LOMBA: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    LAINNYA: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
}

const categoryStats: Record<string, { label: string; icon: any; color: string; bgGradient: string }> = {
    KAJIAN: {
        label: "Kajian",
        icon: Layers,
        color: "text-purple-600 dark:text-purple-400",
        bgGradient: "from-purple-500/10 to-purple-600/5"
    },
    SOSIAL: {
        label: "Sosial",
        icon: Users,
        color: "text-blue-600 dark:text-blue-400",
        bgGradient: "from-blue-500/10 to-blue-600/5"
    },
    PHBI: {
        label: "PHBI",
        icon: Award,
        color: "text-emerald-600 dark:text-emerald-400",
        bgGradient: "from-emerald-500/10 to-emerald-600/5"
    },
    LOMBA: {
        label: "Lomba",
        icon: Target,
        color: "text-amber-600 dark:text-amber-400",
        bgGradient: "from-amber-500/10 to-amber-600/5"
    },
    LAINNYA: {
        label: "Lainnya",
        icon: Zap,
        color: "text-gray-600 dark:text-gray-400",
        bgGradient: "from-gray-500/10 to-gray-600/5"
    },
}

export function LandingPage({ events, mosqueName, mosqueAddress }: LandingPageProps) {
    const { theme, setTheme } = useTheme()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [scrollY, setScrollY] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ALL")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Filter events
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesCategory = selectedCategory === "ALL" || event.category === selectedCategory
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
            return matchesCategory && matchesSearch
        })
    }, [events, selectedCategory, searchQuery])

    // Calculate statistics
    const eventStats = useMemo(() => {
        const total = events.length
        const categoryCounts = events.reduce((acc, event) => {
            acc[event.category] = (acc[event.category] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        return {
            total,
            byCategory: categoryCounts
        }
    }, [events])

    // Generate particles once to avoid hydration mismatch
    const particles = useMemo(() => {
        return [...Array(50)].map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            width: 1 + Math.random() * 3,
            height: 1 + Math.random() * 3,
            opacity: 0.1 + Math.random() * 0.2,
            animationDelay: Math.random() * 5,
            animationDuration: 3 + Math.random() * 4
        }))
    }, [])

    // Debug: Log events data when mounted
    useEffect(() => {
        if (events.length > 0) {
            console.log("=== EVENTS DATA DEBUG ===")
            events.forEach((event, idx) => {
                console.log(`Event ${idx + 1}:`, {
                    id: event.id,
                    title: event.title,
                    imageUrl: event.imageUrl,
                    imageUrlType: typeof event.imageUrl,
                    imageUrlLength: event.imageUrl?.length
                })
            })
            console.log("==========================")
        } else {
            console.log("No events found")
        }
    }, [events])

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
            {/* Animated Background Elements (Subtle) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 -left-64 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                <div
                    className="absolute top-1/2 -right-64 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20"
                    style={{ transform: `translateY(${scrollY * - 0.15}px)` }}
                />
                {/* Geometric Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
                </svg>
            </div>

            {/* Header */}
            <header className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrollY > 10 
                    ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-xl shadow-black/5" 
                    : "bg-transparent border-transparent"
            )}>
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
                            <div className={cn(
                                "relative flex items-center justify-center transition-all duration-300",
                                scrollY > 10 ? "w-10 h-10" : "w-12 h-12"
                            )}>
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity animate-pulse" />
                                
                                {/* Main Logo */}
                                <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
                                    <Building2 className={cn(
                                        "text-white transition-all duration-300",
                                        scrollY > 10 ? "w-5 h-5" : "w-6 h-6"
                                    )} />
                                </div>

                                {/* Animated Star Decoration */}
                                <div className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-spin-slow opacity-80">
                                    <Star fill="currentColor" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <h1 className={cn(
                                    "font-bold tracking-tight text-foreground transition-all duration-300",
                                    scrollY > 10 ? "text-sm md:text-base" : "text-base md:text-lg"
                                )}>
                                    {mosqueName}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-emerald-600 dark:text-emerald-400 font-serif italic transition-all duration-300",
                                        scrollY > 10 ? "text-[10px]" : "text-xs"
                                    )}>
                                        المَسْجِد
                                    </span>
                                    <span className="text-muted-foreground/50 text-xs">|</span>
                                    <p className={cn(
                                        "text-muted-foreground uppercase tracking-wider font-medium transition-all duration-300",
                                        scrollY > 10 ? "text-[8px] md:text-[10px]" : "text-[10px] md:text-xs"
                                    )}>
                                        Portal Informasi
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Right Section */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Islamic Greeting Badge (Desktop) */}
                            <div className={cn(
                                "hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 transition-all duration-300",
                                scrollY > 10 ? "opacity-100" : "opacity-90"
                            )}>
                                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200">السَّلَامُ عَلَيْكُم</span>
                            </div>

                            {/* Live Clock */}
                            <div className={cn(
                                "flex items-center gap-2 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 backdrop-blur-sm rounded-full transition-all duration-300 border",
                                scrollY > 10 
                                    ? "border-border px-3 py-1.5 shadow-sm" 
                                    : "border-emerald-500/20 px-4 py-2"
                            )}>
                                <Clock className={cn(
                                    "text-emerald-600 dark:text-emerald-400 transition-all duration-300",
                                    scrollY > 10 ? "w-3.5 h-3.5" : "w-4 h-4"
                                )} />
                                <span className={cn(
                                    "font-mono font-bold text-foreground tabular-nums transition-all duration-300",
                                    scrollY > 10 ? "text-xs" : "text-sm"
                                )}>
                                    {mounted ? format(currentTime, "HH:mm:ss") : "--:--:--"}
                                </span>
                            </div>

                            {/* Theme Toggle */}
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
                                    height: scrollY > 10 ? "36px" : "42px"
                                }}
                                aria-label="Toggle theme"
                            >
                                <Sun className={cn(
                                    "h-5 w-5 text-amber-600 dark:text-amber-400 transition-all duration-500",
                                    theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                                )} />
                                <Moon className={cn(
                                    "absolute h-5 w-5 text-blue-600 dark:text-blue-400 transition-all duration-500",
                                    theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
                                )} />
                            </button>

                            {/* Mobile Menu Toggle */}
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
                                height: scrollY > 10 ? "36px" : "42px"
                            }}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <Close className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={cn(
                        "md:hidden overflow-hidden transition-all duration-300 border-t border-border/50",
                        mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
                    )}>
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
                                        window.scrollTo({ top: 300, behavior: 'smooth' })
                                        setMobileMenuOpen(false)
                                    }}
                                    className="flex items-center justify-center gap-2 bg-secondary/50 border border-border rounded-xl px-4 py-3 hover:bg-secondary transition-colors"
                                >
                                    <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-sm font-medium">Jadwal</span>
                                </button>
                                <button
                                    onClick={() => {
                                        window.scrollTo({ top: 800, behavior: 'smooth' })
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
                </div>
            </header>

            {/* Navbar Animation Styles */}
            <style>{`
                @keyframes spin-slow {
                    0%, 100% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Subtle Particle Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {mounted && particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute rounded-full animate-float-particle"
                            style={{
                                top: `${particle.top}%`,
                                left: `${particle.left}%`,
                                width: `${particle.width}px`,
                                height: `${particle.height}px`,
                                background: `rgba(16, 185, 129, ${particle.opacity})`,
                                animationDelay: `${particle.animationDelay}s`,
                                animationDuration: `${particle.animationDuration}s`
                            }}
                        />
                    ))}
                </div>

                {/* Animated Crescent Moon */}
                <div className="absolute top-20 right-10 md:top-32 md:right-20 pointer-events-none animate-float" style={{ animationDelay: '0.5s' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" className="text-emerald-400/30 dark:text-emerald-400/20">
                        <path
                            d="M60 10 C85 10 100 35 100 60 C100 85 85 110 60 110 C40 110 25 85 25 60 C25 35 40 10 60 10 C55 10 50 15 50 25 C50 35 55 40 60 40 C65 40 70 35 70 25 C70 15 65 10 60 10 Z"
                            fill="currentColor"
                            className="animate-glow"
                        />
                    </svg>
                </div>

                <div className="container mx-auto px-6 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Islamic Greeting with Arabic-Style Typography */}
                        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2.5 shadow-lg shadow-emerald-500/10">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 tracking-wide">أهلاً وسهلاً</span>
                                <span className="mx-2 text-emerald-400">|</span>
                                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Selamat Datang Jamaah</span>
                            </div>
                        </div>

                        {/* Main Heading with Arabic-Calligraphy Style */}
                        <div className="relative mb-6">
                            <div className="absolute -top-8 -left-8 w-16 h-16 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-3xl" />
                            <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b-2 border-r-2 border-emerald-500/30 rounded-br-3xl" />
                            
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <span className="inline-block bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent bg-300% animate-gradient">
                                    Memakmurkan
                                </span>
                                <br />
                                <span className="inline-block relative">
                                    <span className="relative z-10 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent bg-300% animate-gradient">
                                        Masjid
                                    </span>
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/50" viewBox="0 0 200 10" preserveAspectRatio="none">
                                        <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" className="animate-draw" />
                                    </svg>
                                </span>
                            </h2>

                            {/* Subtitle with Ornament */}
                            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-500/50 to-emerald-500/50" />
                                <span className="text-2xl md:text-3xl font-light text-emerald-600 dark:text-emerald-400">
                                    المَسْجِد
                                </span>
                                <div className="h-px w-16 bg-gradient-to-l from-transparent via-emerald-500/50 to-emerald-500/50" />
                            </div>

                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent bg-300% animate-gradient">
                                    Membangun Umat
                                </span>
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                            Pusat informasi kegiatan dan jadwal ibadah. Mari bersama-sama
                            memakmurkan rumah Allah dengan berbagai aktivitas positif.
                        </p>

                        {/* Bismillah */}
                        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                            <p className="text-emerald-600/60 dark:text-emerald-400/60 text-lg md:text-xl font-serif italic">
                                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                            </p>
                            <p className="text-emerald-500/80 dark:text-emerald-400/80 text-sm mt-2 font-medium">
                                Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang
                            </p>
                        </div>

                        {/* Location */}
                        {mosqueAddress && (
                            <div className="inline-flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-full px-6 py-3 animate-fade-in-up hover:bg-emerald-500/10 transition-colors" style={{ animationDelay: '700ms' }}>
                                <div className="p-2 bg-emerald-500/10 rounded-full">
                                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-sm font-semibold text-foreground">{mosqueAddress}</span>
                            </div>
                        )}

                        {/* Decorative Ornaments */}
                        <div className="absolute top-1/2 left-4 md:left-10 -translate-y-1/2 pointer-events-none opacity-20">
                            <svg width="60" height="200" viewBox="0 0 60 200" className="text-emerald-500">
                                <path d="M30,0 L30,200 M0,100 L60,100 M15,50 L45,150 M15,150 L45,50" stroke="currentColor" strokeWidth="1" className="animate-pulse" />
                            </svg>
                        </div>
                        <div className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 pointer-events-none opacity-20">
                            <svg width="60" height="200" viewBox="0 0 60 200" className="text-emerald-500">
                                <path d="M30,0 L30,200 M0,100 L60,100 M15,50 L45,150 M15,150 L45,50" stroke="currentColor" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }} />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Animations (Global) */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes draw {
                    0% { stroke-dashoffset: 200; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes glow {
                    0%, 100% { filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3)); }
                    50% { filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.6)); }
                }
                @keyframes float-particle {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px); 
                        opacity: 0;
                    }
                    25% {
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(-30px) translateX(10px);
                        opacity: 0.8;
                    }
                    75% {
                        opacity: 1;
                    }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
                .animate-draw { stroke-dasharray: 200; animation: draw 2s ease-out forwards; }
                .animate-glow { animation: glow 3s ease-in-out infinite; }
                .animate-float-particle { animation: float-particle 5s ease-in-out infinite; }
            `}</style>

            {/* Prayer Times Section */}
            <section className="relative z-10 -mt-8 mb-20">
                <div className="container mx-auto px-6">
                    <div className="bg-card rounded-3xl shadow-xl shadow-muted/50 border border-border p-6 md:p-8">
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
                            {prayerTimes.map((prayer, index) => (
                                <div
                                    key={prayer.name}
                                    className="group flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-emerald-500/5 transition-colors duration-300 min-w-[100px]"
                                >
                                    <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                        <prayer.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{prayer.name}</p>
                                        <p className="text-xl font-bold text-foreground font-mono">{prayer.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="relative z-10 -mt-8 mb-20">
                <div className="container mx-auto px-6">
                    <div className="bg-card rounded-3xl shadow-xl shadow-muted/50 border border-border p-6 md:p-8">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-foreground">Statistik Kegiatan</h3>
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Live Update</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">Ringkasan aktivitas kegiatan masjid</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {/* Total Events Card */}
                            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-2xl p-4 border border-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105 group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <CalendarDays className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{eventStats.total}</p>
                                        <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Total</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-600/70 dark:text-emerald-400/70">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-[10px] font-medium">Semua Kegiatan</span>
                                </div>
                            </div>

                            {/* Category Stat Cards */}
                            {Object.entries(eventStats.byCategory).map(([category, count], index) => {
                                const stat = categoryStats[category] || categoryStats.LAINNYA
                                const Icon = stat.icon
                                return (
                                    <div
                                        key={category}
                                        className={cn(
                                            "rounded-2xl p-4 border hover:border-opacity-40 transition-all duration-300 hover:scale-105 group",
                                            `bg-gradient-to-br ${stat.bgGradient}`,
                                            `border-${stat.color.split('-')[1]}-500/20`
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={cn(
                                                    "p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300",
                                                    stat.color.replace('text-', 'bg-')
                                                )}
                                            >
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn("text-3xl font-bold truncate", stat.color)}>{count}</p>
                                                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider truncate">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cn("flex items-center gap-1.5 text-[10px] font-medium opacity-70", stat.color)}>
                                            <TrendingUp className="w-3 h-3" />
                                            <span>{count === 1 ? 'Kegiatan' : 'Kegiatan'}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="relative z-10 py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Kegiatan Mendatang</h3>
                            <p className="text-muted-foreground">Jadwal kegiatan & kajian masjid</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-card border border-input rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                                    selectedCategory === cat.id
                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                        : "bg-card border-border text-muted-foreground hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
                            <div className="w-16 h-16 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center mx-auto mb-4">
                                <CalendarDays className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h4 className="text-xl font-bold text-foreground mb-2">
                                {searchQuery ? "Tidak ditemukan" : "Belum Ada Kegiatan"}
                            </h4>
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? `Tidak ada kegiatan yang cocok dengan "${searchQuery}"`
                                    : "Kegiatan akan ditampilkan di sini setelah dipublikasikan."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("ALL") }}
                                    className="mt-4 text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-semibold"
                                >
                                    Reset pencarian
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event, index) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="block group h-full"
                                >
                                    <article
                                        className="relative h-full flex flex-col bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 100} ms` }}
                                    >
                                        {/* Image */}
                                        <div className="relative h-52 overflow-hidden bg-muted">
                                            {event.imageUrl ? (
                                                <Image
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    width={400}
                                                    height={208}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                                    <CalendarDays className="w-12 h-12 text-muted-foreground/50" />
                                                </div>
                                            )}

                                            {/* Date Badge */}
                                            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-border/50 text-center min-w-[60px]">
                                                <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
                                                    {format(new Date(event.startDate), "MMM", { locale: id })}
                                                </div>
                                                <div className="text-xl font-bold text-foreground leading-none mt-0.5">
                                                    {format(new Date(event.startDate), "dd")}
                                                </div>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border",
                                                    categoryColors[event.category] || categoryColors.LAINNYA
                                                )}>
                                                    {categories.find(c => c.id === event.category)?.label || event.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h4 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {event.title}
                                            </h4>

                                            <div className="space-y-3 mb-6 flex-grow border-t border-border pt-4 mt-2">
                                                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                                                    <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="font-medium">
                                                        {format(new Date(event.startDate), "EEEE, HH:mm", { locale: id })} WIB
                                                    </span>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                                                        <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                                                Lihat Detail <ChevronRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer Simple */}
            <footer className="py-10 border-t border-border bg-muted/20 text-center text-muted-foreground text-sm">
                <p className="mb-2 font-medium">© {mounted ? new Date().getFullYear() : ""} {mosqueName}</p>
                <p className="text-xs opacity-60">Dibuat dengan ikhlas untuk kemakmuran umat.</p>
            </footer>
        </div>
    )
}
