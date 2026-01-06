"use client"

import { useEffect, useState } from "react"
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
    Sparkles
} from "lucide-react"
import Link from "next/link"

interface Event {
    id: string
    title: string
    description: string | null
    imageUrl: string | null
    startDate: Date
    endDate: Date | null
    location: string | null
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

export function LandingPage({ events, mosqueName, mosqueAddress }: LandingPageProps) {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [scrollY, setScrollY] = useState(0)
    const [mounted, setMounted] = useState(false)

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                <div
                    className="absolute top-1/2 -right-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl"
                    style={{ transform: `translateY(${scrollY * -0.15}px)` }}
                />
                <div
                    className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
                    style={{ transform: `translateY(${scrollY * 0.08}px)` }}
                />
                {/* Geometric Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="0.5" />
                            <circle cx="30" cy="30" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
                </svg>
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5">
                <div className="container mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">{mosqueName}</h1>
                            <p className="text-xs text-white/50">Portal Informasi Masjid</p>
                        </div>
                    </div>

                    {/* Live Clock */}
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-mono">
                            {mounted ? format(currentTime, "HH:mm:ss") : "--:--:--"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 py-20 md:py-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-emerald-300">Selamat Datang</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                            Memakmurkan Masjid,<br />Membangun Umat
                        </h2>

                        <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
                            Pusat informasi kegiatan dan jadwal ibadah. Mari bersama-sama
                            memakmurkan rumah Allah dengan berbagai aktivitas positif.
                        </p>

                        {mosqueAddress && (
                            <div className="inline-flex items-center gap-2 text-white/50">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{mosqueAddress}</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Prayer Times Section */}
            <section className="relative z-10 py-12 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                        {prayerTimes.map((prayer, index) => (
                            <div
                                key={prayer.name}
                                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-default"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <prayer.icon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-xs text-white/50">{prayer.name}</p>
                                    <p className="text-lg font-semibold font-mono">{prayer.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="relative z-10 py-20">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">Kegiatan Mendatang</h3>
                            <p className="text-white/50">Jadwal kegiatan & kajian masjid</p>
                        </div>
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                            <CalendarDays className="w-16 h-16 mx-auto text-white/20 mb-4" />
                            <h4 className="text-xl font-semibold text-white/80 mb-2">Belum Ada Kegiatan</h4>
                            <p className="text-white/40">Kegiatan akan ditampilkan di sini setelah dipublikasikan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event, index) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="block group"
                                >
                                    <article
                                        className="relative bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-emerald-500/30 overflow-hidden transition-all duration-500 hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            {event.imageUrl ? (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-emerald-900/50 to-teal-900/50 flex items-center justify-center">
                                                    <CalendarDays className="w-12 h-12 text-white/20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                                            {/* Date Badge */}
                                            <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                                                {format(new Date(event.startDate), "dd MMM", { locale: id })}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h4 className="text-lg font-bold mb-2 group-hover:text-emerald-300 transition-colors line-clamp-2">
                                                {event.title}
                                            </h4>

                                            {event.description && (
                                                <p className="text-sm text-white/50 mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-sm">
                                                {event.location && (
                                                    <div className="flex items-center gap-1.5 text-white/40">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="truncate max-w-[150px]">{event.location}</span>
                                                    </div>
                                                )}
                                                <ChevronRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* About Section */}
            <section className="relative z-10 py-20 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 rotate-12">
                            <Building2 className="w-10 h-10 text-white -rotate-12" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold mb-6">{mosqueName}</h3>

                        <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
                            Masjid merupakan rumah Allah yang menjadi pusat ibadah dan kegiatan
                            umat Islam. Kami berkomitmen untuk menjadikan masjid sebagai tempat
                            yang nyaman untuk beribadah dan menimba ilmu.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-white/40">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Kajian Rutin</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/40">
                                <div className="w-2 h-2 rounded-full bg-teal-500" />
                                <span>TPQ Anak-anak</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/40">
                                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                <span>Kegiatan Sosial</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
                        <p>© {mounted ? new Date().getFullYear() : ""} {mosqueName}. Hak cipta dilindungi.</p>
                        <p>Dibuat dengan ❤️ untuk umat</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
