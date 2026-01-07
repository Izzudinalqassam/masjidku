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
} from "lucide-react"
import Link from "next/link"
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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                scrollY > 10 ? "bg-background/80 backdrop-blur-md border-border shadow-sm" : "bg-transparent border-transparent"
            )}>
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold tracking-tight text-foreground">{mosqueName}</h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Portal Informasi</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </button>

                        {/* Live Clock */}
                        <div className="hidden sm:flex items-center gap-2 bg-secondary/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-mono font-bold text-foreground">
                                {mounted ? format(currentTime, "HH:mm:ss") : "--:--:--"}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Selamat Datang Jamaah</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Memakmurkan Masjid,<br />
                            <span className="text-emerald-600 dark:text-emerald-400">Membangun Umat</span>
                        </h2>

                        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            Pusat informasi kegiatan dan jadwal ibadah. Mari bersama-sama
                            memakmurkan rumah Allah dengan berbagai aktivitas positif.
                        </p>

                        {mosqueAddress && (
                            <div className="inline-flex items-center gap-2 text-muted-foreground animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-medium">{mosqueAddress}</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

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
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
