import { PRAYER_TIMES } from "@/lib/constants/landing-page"
import { type LucideIcon } from "lucide-react"

export function LandingPrayerTimes() {
    return (
        <section className="relative z-10 -mt-8 mb-20">
            <div className="container mx-auto px-6">
                <div className="bg-card rounded-3xl shadow-xl shadow-muted/50 border border-border p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
                        {PRAYER_TIMES.map((prayer, index) => (
                            <PrayerTimeCard key={prayer.name} prayer={prayer} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function PrayerTimeCard({ prayer, index }: { prayer: typeof PRAYER_TIMES[number]; index: number }) {
    const Icon = prayer.icon as LucideIcon

    return (
        <div
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-emerald-500/5 transition-colors duration-300 min-w-[100px]"
        >
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{prayer.name}</p>
                <p className="text-xl font-bold text-foreground font-mono">{prayer.time}</p>
            </div>
        </div>
    )
}
