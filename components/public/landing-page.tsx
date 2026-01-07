"use client"

import { useEffect, useState, useMemo } from "react"
import { format } from "date-fns"
import { LandingHeader } from "./landing-header"
import { LandingHero } from "./landing-hero"
import { LandingPrayerTimes } from "./landing-prayer-times"
import { LandingStatistics } from "./landing-statistics"
import { LandingEvents } from "./landing-events"
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

export function LandingPage({ events, mosqueName, mosqueAddress }: LandingPageProps) {
    const [scrollY, setScrollY] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

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

    // Generate particles
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
        }
    }, [events])

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
            {/* Header */}
            <LandingHeader
                mosqueName={mosqueName}
                scrollY={scrollY}
                setMobileMenuOpen={setMobileMenuOpen}
                mobileMenuOpen={mobileMenuOpen}
            />

            {/* Animated Background with Particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

            {/* Hero Section */}
            <LandingHero mosqueAddress={mosqueAddress} />

            {/* Prayer Times Section */}
            <LandingPrayerTimes />

            {/* Statistics Section */}
            <LandingStatistics eventStats={eventStats} />

            {/* Events Section */}
            <LandingEvents events={events} />

            {/* Footer */}
            <Footer mosqueName={mosqueName} />

            {/* Particle Animation Styles */}
            <style>{`
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
                .animate-float-particle { animation: float-particle 5s ease-in-out infinite; }
            `}</style>
        </div>
    )
}

function Footer({ mosqueName }: { mosqueName: string }) {
    return (
        <footer className="py-10 border-t border-border bg-muted/20 text-center text-muted-foreground text-sm">
            <p className="mb-2 font-medium">© {mosqueName}</p>
            <p className="text-xs opacity-60">Dibuat dengan ikhlas untuk kemakmuran umat.</p>
        </footer>
    )
}
