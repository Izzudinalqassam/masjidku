"use client"

import { format, differenceInDays, addMinutes } from "date-fns"
import { id } from "date-fns/locale"
import {
    Calendar,
    MapPin,
    ArrowLeft,
    Clock,
    Share2,
    ChevronLeft,
    Building2,
    Sparkles,
    Users,
    Bookmark,
    Heart,
    Send,
    Bell,
    Globe,
    Download,
    Copy,
    Check,
    ExternalLink,
    Timer,
    Map,
    Phone,
    Mail,
    Camera,
    Video,
    Mic,
    CalendarDays
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface EventDetailProps {
    event: {
        id: string
        title: string
        description: string | null
        imageUrl: string | null
        startDate: Date
        endDate: Date | null
        location: string | null
        mosque: {
            name: string
            address: string | null
        }
    }
}

export function EventDetail({ event }: EventDetailProps) {
    const [mounted, setMounted] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [copied, setCopied] = useState(false)
    const [timeLeft, setTimeLeft] = useState("")
    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const eventDate = new Date(event.startDate)
            const diff = eventDate.getTime() - now.getTime()

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)

                if (days > 0) {
                    setTimeLeft(`${days} hari ${hours} jam ${minutes} menit`)
                } else if (hours > 0) {
                    setTimeLeft(`${hours} jam ${minutes} menit ${seconds} detik`)
                } else if (minutes > 0) {
                    setTimeLeft(`${minutes} menit ${seconds} detik`)
                } else {
                    setTimeLeft(`${seconds} detik`)
                }
            } else {
                setTimeLeft("Sedang berlangsung")
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [event.startDate])

    const handleShare = async () => {
        const url = window.location.href
        const text = `${event.title} - ${event.mosque.name}`
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: text,
                    text: event.description || "",
                    url: url
                })
                toast.success("Berhasil dibagikan!")
            } catch (error) {
                console.log("Share cancelled")
            }
        } else {
            await copyToClipboard(url)
        }
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success("Link berhasil disalin!")
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            toast.error("Gagal menyalin link")
        }
    }

    const addToCalendar = () => {
        const startDate = new Date(event.startDate)
        const endDate = event.endDate ? new Date(event.endDate) : addMinutes(startDate, 120)
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${endDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.location || event.mosque.address || "")}`
        
        window.open(googleCalendarUrl, "_blank")
        toast.success("Membuka kalender...")
    }

    if (!mounted) return null

    const isUpcoming = new Date(event.startDate) > new Date()
    const isOngoing = new Date(event.startDate) <= new Date() && (!event.endDate || new Date(event.endDate) >= new Date())
    const isPast = event.endDate && new Date(event.endDate) < new Date()

    const gridPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white pb-20">
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 rounded-full blur-[150px]"
                    style={{ transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.05}deg)` }}
                />
                <div
                    className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[120px]"
                    style={{ transform: `translateY(${scrollY * -0.2}px) rotate(${-scrollY * 0.03}deg)` }}
                />
                <div
                    className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-gradient-to-tl from-rose-500/10 via-pink-500/10 to-orange-500/10 rounded-full blur-[100px]"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                {/* Geometric Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
            </div>

            {/* Enhanced Sticky Header */}
            <header className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b backdrop-blur-xl",
                scrollY > 50
                    ? "bg-slate-900/90 border-white/10 shadow-lg py-3"
                    : "bg-transparent border-transparent py-6"
            )}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-3 text-white/70 hover:text-white transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Kembali</span>
                    </Link>

                    <div className={cn(
                        "flex items-center gap-3 transition-all duration-500",
                        scrollY > 150 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                    )}>
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-sm font-bold truncate max-w-[180px]">{event.mosque.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className="rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-300"
                        >
                            <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current text-yellow-400")} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            className="rounded-full bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-300"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section with Parallax */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden mt-0">
                {event.imageUrl ? (
                    <div className="relative w-full h-full">
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className={cn(
                                "w-full h-full object-cover transition-all duration-1000",
                                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                            )}
                            onLoad={() => setImageLoaded(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center">
                                <Camera className="w-16 h-16 text-white/20 animate-pulse" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-teal-900/50" style={{ backgroundImage: `url('${gridPattern}')` }}></div>
                        <CalendarDays className="w-24 h-24 text-white/10 animate-pulse relative z-10" />
                    </div>
                )}

                {/* Enhanced Floating Content */}
                <div className="absolute bottom-0 inset-x-0">
                    <div className="container mx-auto px-6 pb-16">
                        <div className="max-w-5xl animate-in slide-in-from-bottom-10 duration-1000">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className={cn(
                                    "inline-flex items-center gap-2 backdrop-blur-md border rounded-full px-4 py-2",
                                    isUpcoming && "bg-amber-500/20 border-amber-500/30",
                                    isOngoing && "bg-emerald-500/20 border-emerald-500/30",
                                    isPast && "bg-gray-500/20 border-gray-500/30"
                                )}>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full animate-pulse",
                                        isUpcoming && "bg-amber-400",
                                        isOngoing && "bg-emerald-400",
                                        isPast && "bg-gray-400"
                                    )} />
                                    <span className={cn(
                                        "text-xs font-bold tracking-wider uppercase",
                                        isUpcoming && "text-amber-200",
                                        isOngoing && "text-emerald-200",
                                        isPast && "text-gray-200"
                                    )}>
                                        {isUpcoming && "Akan Datang"}
                                        {isOngoing && "Sedang Berlangsung"}
                                        {isPast && "Telah Selesai"}
                                    </span>
                                </div>
                                
                                {isUpcoming && timeLeft && (
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-full px-4 py-2">
                                        <Timer className="w-3 h-3 text-emerald-400" />
                                        <span className="text-xs font-bold text-emerald-300">{timeLeft}</span>
                                    </div>
                                )}
                            </div>

                            {/* Title with Enhanced Typography */}
                            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-tight bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                                {event.title}
                            </h1>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    onClick={addToCalendar}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-full px-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Tambah ke Kalender
                                </Button>
                                <Button
                                    onClick={() => setIsLiked(!isLiked)}
                                    variant="outline"
                                    className="border-white/20 hover:bg-white/10 hover:border-white/30 rounded-full px-6 gap-2 transition-all duration-300"
                                >
                                    <Heart className={cn("w-4 h-4", isLiked && "fill-current text-red-400")} />
                                    {isLiked ? "Suka" : "Sukai"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Main Content */}
            <main className="container mx-auto px-6 -mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Enhanced Description */}
                    <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        {/* Description Card */}
                        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-white/5 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                    <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
                                    Deskripsi Kegiatan
                                </h2>
                                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                                    <Download className="w-4 h-4 mr-2" />
                                    Unduh Info
                                </Button>
                            </div>
                            <div className="prose prose-invert prose-emerald max-w-none text-white/80 leading-relaxed">
                                <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl p-6 border border-emerald-500/10">
                                    {event.description ? (
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {event.description}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Sparkles className="w-12 h-12 mx-auto text-white/20 mb-4" />
                                            <p className="text-white/40 italic">Deskripsi kegiatan akan segera tersedia.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
                                <Video className="w-8 h-8 text-blue-400 mb-3" />
                                <h3 className="font-bold text-white mb-2">Live Streaming</h3>
                                <p className="text-xs text-white/60">Saksikan langsung kegiatan</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
                                <Mic className="w-8 h-8 text-purple-400 mb-3" />
                                <h3 className="font-bold text-white mb-2">Recording</h3>
                                <p className="text-xs text-white/60">Dokumentasi kegiatan tersedia</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
                                <Users className="w-8 h-8 text-amber-400 mb-3" />
                                <h3 className="font-bold text-white mb-2">Komunitas</h3>
                                <p className="text-xs text-white/60">Bergabung dengan jamaah</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Enhanced Sidebar */}
                    <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
                        {/* Time Card with Countdown */}
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-white/10 transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                                    <Clock className="w-7 h-7 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2 text-white">Waktu & Tanggal</h3>
                                    <div className="space-y-2">
                                        <p className="text-white/80 text-sm font-medium">
                                            {format(new Date(event.startDate), "EEEE, d MMMM yyyy", { locale: id })}
                                        </p>
                                        <p className="text-white/60 text-sm">
                                            {format(new Date(event.startDate), "HH:mm")} WIB
                                        </p>
                                        {event.endDate && (
                                            <div className="pt-2 border-t border-white/10">
                                                <p className="text-white/60 text-xs">Selesai:</p>
                                                <p className="text-white/80 text-sm font-medium">
                                                    {format(new Date(event.endDate), "EEEE, d MMMM yyyy", { locale: id })}
                                                </p>
                                                <p className="text-white/60 text-sm">
                                                    {format(new Date(event.endDate), "HH:mm")} WIB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Card with Map */}
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-white/10 transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                                    <MapPin className="w-7 h-7 text-teal-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2 text-white">Lokasi</h3>
                                    <p className="text-white/80 text-sm leading-relaxed mb-3">
                                        {event.location || "Masjid"}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-teal-500/30 hover:bg-teal-500/10 text-teal-400 rounded-full"
                                    >
                                        <Map className="w-3 h-3 mr-2" />
                                        Buka Peta
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Mosque Info */}
                        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h4 className="font-bold text-white">Penyelenggara</h4>
                                </div>
                                <ExternalLink className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-white">{event.mosque.name}</p>
                                    <p className="text-xs text-white/60 mt-1">{event.mosque.address}</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-emerald-400 hover:text-emerald-300">
                                        <Phone className="w-3 h-3 mr-1" />
                                        Telepon
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-emerald-400 hover:text-emerald-300">
                                        <Mail className="w-3 h-3 mr-1" />
                                        Email
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Share & Actions */}
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                            <h4 className="font-bold text-white mb-4">Bagikan Kegiatan</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(window.location.href)}
                                    className="border-white/20 hover:bg-white/10 rounded-full text-xs"
                                >
                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    {copied ? "Tersalin!" : "Salin Link"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white/20 hover:bg-white/10 rounded-full text-xs"
                                >
                                    <Globe className="w-3 h-3" />
                                    WhatsApp
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white/20 hover:bg-white/10 rounded-full text-xs"
                                >
                                    <Send className="w-3 h-3" />
                                    Telegram
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white/20 hover:bg-white/10 rounded-full text-xs"
                                >
                                    <Bell className="w-3 h-3" />
                                    Notifikasi
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
