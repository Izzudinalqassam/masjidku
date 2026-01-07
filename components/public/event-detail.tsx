"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    Calendar,
    MapPin,
    Clock,
    Share2,
    ChevronLeft,
    Building2,
    Sparkles,
    Eye,
    Heart,
    Check,
    Copy,
    Facebook,
    Twitter
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { incrementEventLike, incrementEventView } from "@/lib/actions/events"

interface EventDetailProps {
    event: {
        id: string
        title: string
        description: string | null
        imageUrl: string | null
        startDate: Date
        endDate: Date | null
        location: string | null
        views: number
        likes: number
        mosque: {
            name: string
            address: string | null
        }
    }
}

export function EventDetail({ event }: EventDetailProps) {
    const [mounted, setMounted] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [likes, setLikes] = useState(event.likes || 0)
    const [views, setViews] = useState(event.views || 0)
    const [isLiked, setIsLiked] = useState(false)
    const [isLikeLoading, setIsLikeLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)

        // Increment view count on mount
        incrementEventView(event.id)

        // Check local storage for like status
        const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]')
        if (likedEvents.includes(event.id)) {
            setIsLiked(true)
        }

        return () => window.removeEventListener("scroll", handleScroll)
    }, [event.id])

    const handleLike = async () => {
        if (isLiked || isLikeLoading) return

        setIsLikeLoading(true)
        // Optimistic update
        setLikes(prev => prev + 1)
        setIsLiked(true)
        toast.success("Terima kasih atas dukungan Anda! ❤️")

        // Save to local storage
        const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]')
        localStorage.setItem('likedEvents', JSON.stringify([...likedEvents, event.id]))

        const result = await incrementEventLike(event.id)
        if (!result.success) {
            // Revert on failure
            setLikes(prev => prev - 1)
            setIsLiked(false)
            // Remove from local storage
            const newLikedEvents = likedEvents.filter((id: string) => id !== event.id)
            localStorage.setItem('likedEvents', JSON.stringify(newLikedEvents))
            toast.error("Gagal mengirim like")
        }
        setIsLikeLoading(false)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            toast.success("Link berhasil disalin!")
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            toast.error("Gagal menyalin link")
        }
    }

    const shareToSocial = (platform: string) => {
        const url = window.location.href
        const text = `${event.title} - ${event.mosque.name}`
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        }
        if (platform in urls) {
            window.open(urls[platform as keyof typeof urls], "_blank")
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div
                    className="absolute -top-[20%] -right-[10%] w-[70vh] h-[70vh] bg-emerald-500/5 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                <div
                    className="absolute top-[40%] -left-[10%] w-[50vh] h-[50vh] bg-teal-500/5 rounded-full blur-[100px] transition-transform duration-1000 ease-out"
                    style={{ transform: `translateY(${scrollY * -0.1}px)` }}
                />
            </div>

            {/* Sticky Header */}
            <header className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                scrollY > 50
                    ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-black/20"
                    : "bg-transparent py-6"
            )}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">Kembali</span>
                    </Link>

                    <div className={cn(
                        "flex items-center gap-3 transition-all duration-500",
                        scrollY > 300 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    )}>
                        <h2 className="text-sm font-bold text-white max-w-[200px] truncate">{event.title}</h2>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-xs font-medium text-emerald-400">{event.mosque.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm mr-2">
                            <Eye className="w-4 h-4 text-emerald-400/70" />
                            <span className="text-xs font-semibold text-emerald-100/70 tabular-nums">{views + 1}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyToClipboard}
                            className="rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full group overflow-hidden">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900" />
                        <Calendar className="w-32 h-32 text-white/5 relative z-10" />
                    </div>
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 to-transparent" />

                {/* Hero Content */}
                <div className="absolute bottom-0 inset-x-0 z-10 pb-16 pt-32 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl relative">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-200">Kegiatan Masjid</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                                {event.title}
                            </h1>

                            {/* Quick Info Bar */}
                            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-white/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-medium text-white/80">{event.mosque.name}</span>
                                </div>
                                <div className="w-px h-8 bg-white/10 hidden md:block" />
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-medium text-white/80">
                                        {format(new Date(event.startDate), "EEEE, d MMM yyyy", { locale: id })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 -mt-8 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Description */}
                    <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-8 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
                                <h2 className="text-2xl font-bold text-white">Deskripsi Lengkap</h2>
                            </div>
                            <div className="prose prose-lg prose-invert max-w-none">
                                <div className="text-slate-300 leading-relaxed space-y-6 whitespace-pre-wrap font-light text-lg">
                                    {event.description || "Tidak ada deskripsi untuk kegiatan ini."}
                                </div>
                            </div>
                        </div>

                        {/* Engagement Section Mobile */}
                        <div className="mt-8 flex md:hidden items-center justify-between gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-medium text-white">{views + 1} Dilihat</span>
                            </div>
                            <Button
                                onClick={handleLike}
                                disabled={isLiked}
                                className={cn(
                                    "rounded-xl px-6 transition-all duration-300",
                                    isLiked
                                        ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
                                {likes} Suka
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Info */}
                    <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">

                        {/* Action Card (Desktop) */}
                        <div className="hidden md:block bg-gradient-to-b from-emerald-900/20 to-slate-900/50 border border-emerald-500/10 rounded-[2rem] p-8 text-center backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Tertarik dengan kegiatan ini?</h3>
                            <p className="text-slate-400 text-sm mb-6 relative z-10">Berikan dukungan agar kami tahu antusiasme Anda!</p>

                            <div className="flex items-center justify-center gap-4 relative z-10">
                                <Button
                                    onClick={handleLike}
                                    disabled={isLiked}
                                    size="lg"
                                    className={cn(
                                        "rounded-xl px-8 h-12 transition-all duration-300 text-base font-semibold w-full",
                                        isLiked
                                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                                            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5"
                                    )}
                                >
                                    <Heart className={cn("w-5 h-5 mr-2 transition-transform", isLiked ? "fill-current scale-110" : "scale-100")} />
                                    {isLiked ? "Disukai" : "Suka Kegiatan"}
                                    <span className="ml-2 bg-black/20 px-2 py-0.5 rounded text-xs">
                                        {likes}
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Date & Time Card */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/10">
                                    <Calendar className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-100/40 uppercase tracking-wider mb-1">Waktu Pelaksanaan</h4>
                                    <p className="text-white font-medium text-lg">
                                        {format(new Date(event.startDate), "EEEE, d MMM yyyy", { locale: id })}
                                    </p>
                                    <p className="text-emerald-400/80 mt-1 font-mono text-sm flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {format(new Date(event.startDate), "HH:mm", { locale: id })} WIB
                                    </p>
                                </div>
                            </div>
                            {event.endDate && (
                                <div className="mt-4 pt-4 border-t border-white/5 pl-[64px]">
                                    <p className="text-xs text-white/40 mb-1">Sampai dengan</p>
                                    <p className="text-white/80 text-sm">
                                        {format(new Date(event.endDate), "EEEE, d MMM yyyy", { locale: id })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Location Card */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/10">
                                    <MapPin className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-100/40 uppercase tracking-wider mb-1">Lokasi</h4>
                                    <p className="text-white font-medium text-lg leading-snug">
                                        {event.location || event.mosque.name}
                                    </p>
                                    <p className="text-white/40 text-sm mt-2 leading-relaxed">
                                        {event.mosque.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Share Card */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6">
                            <h4 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Bagikan</h4>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline" size="icon"
                                    onClick={() => shareToSocial('facebook')}
                                    className="rounded-full border-white/10 bg-transparent hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30 text-white/60 transition-all"
                                >
                                    <Facebook className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline" size="icon"
                                    onClick={() => shareToSocial('twitter')}
                                    className="rounded-full border-white/10 bg-transparent hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30 text-white/60 transition-all"
                                >
                                    <Twitter className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline" size="icon"
                                    onClick={copyToClipboard}
                                    className="rounded-full border-white/10 bg-transparent hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 text-white/60 transition-all"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}
