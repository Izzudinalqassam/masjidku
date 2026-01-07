"use client"

import { useState, useEffect } from "react"
import { 
    Clock, 
    Volume2, 
    VolumeX, 
    Bell, 
    BellOff, 
    MapPin,
    Settings,
    Sun,
    Moon,
    Sunrise,
    Sunset
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getPrayerTimesForDate, getTimeUntilPrayer, TodayPrayerTimes, PrayerTime } from "@/lib/prayer-times"

interface PrayerTimesWidgetProps {
    className?: string
    compact?: boolean
}

export function PrayerTimesWidget({ className, compact = false }: PrayerTimesWidgetProps) {
    const [prayerTimes, setPrayerTimes] = useState<TodayPrayerTimes | null>(null)
    const [loading, setLoading] = useState(true)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const [locationEnabled, setLocationEnabled] = useState(false)

    useEffect(() => {
        loadPrayerTimes()
        
        // Update every minute
        const interval = setInterval(loadPrayerTimes, 60000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }, [])

    const loadPrayerTimes = async () => {
        try {
            setLoading(true)
            const times = getPrayerTimesForDate(new Date())
            setPrayerTimes(times)
            
            // Check if next prayer is within 1 minute
            if (times.nextPrayer && soundEnabled) {
                const [hours, minutes] = times.nextPrayer.time.split(':').map(Number)
                const prayerTime = new Date()
                prayerTime.setHours(hours, minutes, 0, 0)
                
                const now = new Date()
                const diff = prayerTime.getTime() - now.getTime()
                
                if (diff > 0 && diff <= 60000) { // Within 1 minute
                    showPrayerNotification(times.nextPrayer)
                }
            }
        } catch (error) {
            console.error('Error loading prayer times:', error)
            toast.error('Gagal memuat jadwal sholat')
        } finally {
            setLoading(false)
        }
    }

    const showPrayerNotification = (prayer: PrayerTime) => {
        // Browser notification
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`Waktu Sholat ${prayer.name}`, {
                body: `Sekarang sudah masuk waktu sholat ${prayer.name}`,
                icon: '/favicon.ico',
                tag: `prayer-${prayer.name}`
            })
        }
        
        // Toast notification
        toast.success(`🕌 Waktu sholat ${prayer.name} telah tiba!`, {
            duration: 5000,
            icon: '🕌'
        })
        
        // Play sound (if implemented)
        if (soundEnabled) {
            // You can implement adhan sound here
            console.log(`Playing adhan for ${prayer.name}`)
        }
    }

    const toggleLocation = () => {
        setLocationEnabled(!locationEnabled)
        toast.info('Fitur lokasi dinonaktifkan sementara')
        loadPrayerTimes()
    }

    const getPrayerIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'subuh': return <Moon className="w-4 h-4" />
            case 'dzuhur': return <Sun className="w-4 h-4" />
            case 'ashar': return <Sunset className="w-4 h-4" />
            case 'maghrib': return <Sunset className="w-4 h-4" />
            case 'isya': return <Moon className="w-4 h-4" />
            default: return <Clock className="w-4 h-4" />
        }
    }

    if (loading) {
        return (
            <Card className={cn("bg-white/[0.03] backdrop-blur-xl border-white/10 p-6", className)}>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/10 rounded w-1/3"></div>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-8 bg-white/5 rounded"></div>
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

    if (!prayerTimes) {
        return (
            <Card className={cn("bg-white/[0.03] backdrop-blur-xl border-white/10 p-6", className)}>
                <div className="text-center text-white/60">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Gagal memuat jadwal sholat</p>
                    <Button onClick={loadPrayerTimes} variant="outline" size="sm" className="mt-3">
                        Coba Lagi
                    </Button>
                </div>
            </Card>
        )
    }

    if (compact) {
        return (
            <Card className={cn("bg-white/[0.03] backdrop-blur-xl border-white/10 p-4", className)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-white/60">Sholat Berikutnya</p>
                            <p className="text-sm font-bold text-white">
                                {prayerTimes.nextPrayer?.name} - {prayerTimes.nextPrayer?.time}
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {getTimeUntilPrayer(prayerTimes.nextPrayer?.time || '')}
                    </Badge>
                </div>
            </Card>
        )
    }

    return (
        <Card className={cn("bg-white/[0.03] backdrop-blur-xl border-white/10 overflow-hidden", className)}>
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-emerald-400" />
                            Jadwal Sholat
                        </h3>
                        <p className="text-sm text-white/60">{prayerTimes.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleLocation}
                            className={cn(
                                "h-8 px-3 rounded-full",
                                locationEnabled ? "text-emerald-400" : "text-white/60"
                            )}
                        >
                            <MapPin className="w-3 h-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={cn(
                                "h-8 px-3 rounded-full",
                                soundEnabled ? "text-emerald-400" : "text-white/60"
                            )}
                        >
                            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={cn(
                                "h-8 px-3 rounded-full",
                                notificationsEnabled ? "text-emerald-400" : "text-white/60"
                            )}
                        >
                            {notificationsEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                        </Button>
                    </div>
                </div>

                {/* Next Prayer Highlight */}
                {prayerTimes.nextPrayer && (
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-4 border border-emerald-500/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/30 rounded-full flex items-center justify-center">
                                    {getPrayerIcon(prayerTimes.nextPrayer.name)}
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-200">Sholat Berikutnya</p>
                                    <p className="text-lg font-bold text-white">
                                        {prayerTimes.nextPrayer.name}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                    {prayerTimes.nextPrayer.time}
                                </p>
                                <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30 text-xs">
                                    {getTimeUntilPrayer(prayerTimes.nextPrayer.time)}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Prayer Times List */}
            <div className="p-6 space-y-3">
                {prayerTimes.prayers.map((prayer, index) => (
                    <div
                        key={prayer.name}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                            prayer.next && "bg-emerald-500/10 border border-emerald-500/20",
                            prayer.elapsed && "opacity-50",
                            !prayer.next && !prayer.elapsed && "hover:bg-white/5"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-white",
                                prayer.next && "bg-emerald-500",
                                prayer.elapsed && "bg-white/10",
                                !prayer.next && !prayer.elapsed && "bg-emerald-500/20"
                            )}>
                                {getPrayerIcon(prayer.name)}
                            </div>
                            <div>
                                <p className={cn(
                                    "font-medium",
                                    prayer.next && "text-emerald-300",
                                    prayer.elapsed && "text-white/50",
                                    !prayer.next && !prayer.elapsed && "text-white"
                                )}>
                                    {prayer.name}
                                </p>
                                {prayer.elapsed && (
                                    <p className="text-xs text-white/40">Sudah berlalu</p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={cn(
                                "font-mono font-bold text-lg",
                                prayer.next && "text-emerald-300",
                                prayer.elapsed && "text-white/50",
                                !prayer.next && !prayer.elapsed && "text-white"
                            )}>
                                {prayer.time}
                            </p>
                            {prayer.next && (
                                <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30 text-xs mt-1">
                                    Berikutnya
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs text-white/40">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>
                            {locationEnabled ? 'Lokasi Aktual' : 'Jakarta (Default)'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                            <span>Adzan</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {notificationsEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                            <span>Notif</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
