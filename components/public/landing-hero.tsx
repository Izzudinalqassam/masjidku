"use client"

import { MapPin } from "lucide-react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ANIMATION_DELAYS } from "@/lib/constants/landing-page"

interface LandingHeroProps {
    mosqueAddress: string | null
}

export function LandingHero({ mosqueAddress }: LandingHeroProps) {
    return (
        <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
            <BackgroundEffects />
            <CrescentMoon />
            <HeroContent mosqueAddress={mosqueAddress} />
            <GlobalStyles />
        </section>
    )
}

// Sub-components
function BackgroundEffects() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-64 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20" />
            <div className="absolute top-1/2 -right-64 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20" />
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
    )
}

function CrescentMoon() {
    return (
        <div className="absolute top-20 right-10 md:top-32 md:right-20 pointer-events-none animate-float" style={{ animationDelay: '0.5s' }}>
            <svg width="120" height="120" viewBox="0 0 120 120" className="text-emerald-400/30 dark:text-emerald-400/20">
                <path
                    d="M60 10 C85 10 100 35 100 60 C100 85 85 110 60 110 C40 110 25 85 25 60 C25 35 40 10 60 10 C55 10 50 15 50 25 C50 35 55 40 60 40 C65 40 70 35 70 25 C70 15 65 10 60 10 Z"
                    fill="currentColor"
                    className="animate-glow"
                />
            </svg>
        </div>
    )
}

function HeroContent({ mosqueAddress }: { mosqueAddress: string | null }) {
    return (
        <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
                <GreetingBadge />
                <MainHeading />
                <DecorativeOrnaments />
                <Bismillah />
                {mosqueAddress && <LocationBadge mosqueAddress={mosqueAddress} />}
            </div>
        </div>
    )
}

function GreetingBadge() {
    return (
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: ANIMATION_DELAYS.greeting }}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2.5 shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 tracking-wide">أهلاً وسهلاً</span>
                <span className="mx-2 text-emerald-400">|</span>
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Selamat Datang Jamaah</span>
            </div>
        </div>
    )
}

function MainHeading() {
    return (
        <div className="relative mb-6">
            <div className="absolute -top-8 -left-8 w-16 h-16 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-3xl" />
            <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b-2 border-r-2 border-emerald-500/30 rounded-br-3xl" />

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: ANIMATION_DELAYS.heading }}>
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
            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: ANIMATION_DELAYS.subtitle }}>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-500/50 to-emerald-500/50" />
                <span className="text-2xl md:text-3xl font-light text-emerald-600 dark:text-emerald-400">
                    المَسْجِد
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent via-emerald-500/50 to-emerald-500/50" />
            </div>

            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 animate-fade-in-up" style={{ animationDelay: ANIMATION_DELAYS.mainHeading }}>
                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent bg-300% animate-gradient">
                    Membangun Umat
                </span>
            </h3>
        </div>
    )
}

function DecorativeOrnaments() {
    return (
        <>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: ANIMATION_DELAYS.description }}>
                Pusat informasi kegiatan dan jadwal ibadah. Mari bersama-sama
                memakmurkan rumah Allah dengan berbagai aktivitas positif.
            </p>

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
        </>
    )
}

function Bismillah() {
    return (
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: ANIMATION_DELAYS.bismillah }}>
            <p className="text-emerald-600/60 dark:text-emerald-400/60 text-lg md:text-xl font-serif italic">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-emerald-500/80 dark:text-emerald-400/80 text-sm mt-2 font-medium">
                Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang
            </p>
        </div>
    )
}

function LocationBadge({ mosqueAddress }: { mosqueAddress: string }) {
    return (
        <div className="inline-flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-full px-6 py-3 animate-fade-in-up hover:bg-emerald-500/10 transition-colors" style={{ animationDelay: ANIMATION_DELAYS.location }}>
            <div className="p-2 bg-emerald-500/10 rounded-full">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-foreground">{mosqueAddress}</span>
        </div>
    )
}

function GlobalStyles() {
    return (
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
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
            .animate-draw { stroke-dasharray: 200; animation: draw 2s ease-out forwards; }
            .animate-glow { animation: glow 3s ease-in-out infinite; }
        `}</style>
    )
}
