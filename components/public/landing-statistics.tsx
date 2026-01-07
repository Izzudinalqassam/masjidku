import { TrendingUp, CalendarDays } from "lucide-react"
import { CATEGORY_STATS } from "@/lib/constants/landing-page"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventStats {
    total: number
    byCategory: Record<string, number>
}

interface LandingStatisticsProps {
    eventStats: EventStats
}

export function LandingStatistics({ eventStats }: LandingStatisticsProps) {
    return (
        <section className="relative z-10 -mt-8 mb-20">
            <div className="container mx-auto px-6">
                <div className="bg-card rounded-3xl shadow-xl shadow-muted/50 border border-border p-6 md:p-8">
                    <StatisticsHeader />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <TotalEventsCard count={eventStats.total} />
                        {Object.entries(eventStats.byCategory).map(([category, count]) => (
                            <CategoryStatCard key={category} category={category} count={count} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function StatisticsHeader() {
    return (
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
    )
}

function TotalEventsCard({ count }: { count: number }) {
    return (
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-2xl p-4 border border-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{count}</p>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Total</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600/70 dark:text-emerald-400/70">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-medium">Semua Kegiatan</span>
            </div>
        </div>
    )
}

function CategoryStatCard({ category, count }: { category: string; count: number }) {
    const stat = CATEGORY_STATS[category] || CATEGORY_STATS.LAINNYA
    const Icon = stat.icon as LucideIcon

    return (
        <div
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
}
