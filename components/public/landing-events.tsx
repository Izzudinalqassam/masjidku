"use client"

import { useState, createElement } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    CalendarDays,
    Clock,
    MapPin,
    ChevronRight,
    Search,
    X,
    LucideIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants/landing-page"

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

interface LandingEventsProps {
    events: Event[]
}

export function LandingEvents({ events }: LandingEventsProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ALL")

    const filteredEvents = events.filter(event => {
        const matchesCategory = selectedCategory === "ALL" || event.category === selectedCategory
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        return matchesCategory && matchesSearch
    })

    return (
        <section className="relative z-10 py-20 bg-background">
            <div className="container mx-auto px-6">
                <EventsHeader />
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                {filteredEvents.length === 0 ? (
                    <EmptyState searchQuery={searchQuery} onReset={() => { setSearchQuery(""); setSelectedCategory("ALL") }} />
                ) : (
                    <EventsGrid events={filteredEvents} />
                )}
            </div>
        </section>
    )
}

function EventsHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Kegiatan Mendatang</h3>
                <p className="text-muted-foreground">Jadwal kegiatan & kajian masjid</p>
            </div>
        </div>
    )
}

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
    return (
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
    )
}

function CategoryFilter({ selectedCategory, setSelectedCategory }: { selectedCategory: string; setSelectedCategory: (cat: string) => void }) {
    return (
        <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
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
    )
}

function EmptyState({ searchQuery, onReset }: { searchQuery: string; onReset: () => void }) {
    return (
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
                    onClick={onReset}
                    className="mt-4 text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-semibold"
                >
                    Reset pencarian
                </button>
            )}
        </div>
    )
}

function EventsGrid({ events }: { events: Event[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
            ))}
        </div>
    )
}

function EventCard({ event, index }: { event: Event; index: number }) {
    return (
        <Link href={`/events/${event.id}`} className="block group h-full">
            <article
                className="relative h-full flex flex-col bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <EventImage event={event} />
                <EventContent event={event} />
            </article>
        </Link>
    )
}

function EventImage({ event }: { event: Event }) {
    const categoryLabel = CATEGORIES.find(c => c.id === event.category)?.label || event.category

    return (
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

            <DateBadge startDate={event.startDate} />
            <CategoryBadge category={event.category} label={categoryLabel} />
        </div>
    )
}

function DateBadge({ startDate }: { startDate: Date }) {
    return (
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-border/50 text-center min-w-[60px]">
            <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
                {format(new Date(startDate), "MMM", { locale: id })}
            </div>
            <div className="text-xl font-bold text-foreground leading-none mt-0.5">
                {format(new Date(startDate), "dd")}
            </div>
        </div>
    )
}

function CategoryBadge({ category, label }: { category: string; label: string }) {
    return (
        <div className="absolute top-4 right-4">
            <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border",
                CATEGORY_COLORS[category] || CATEGORY_COLORS.LAINNYA
            )}>
                {label}
            </span>
        </div>
    )
}

function EventContent({ event }: { event: Event }) {
    return (
        <div className="p-6 flex flex-col flex-grow">
            <h4 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {event.title}
            </h4>

            <div className="space-y-3 mb-6 flex-grow border-t border-border pt-4 mt-2">
                <EventMeta type="time" value={format(new Date(event.startDate), "EEEE, HH:mm", { locale: id }) + " WIB"} />
                {event.location && <EventMeta type="location" value={event.location} />}
            </div>

            <div className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                Lihat Detail <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </div>
    )
}

function EventMeta({ type, value }: { type: "time" | "location"; value: string }) {
    const icon = type === "time" ? Clock : MapPin
    const colorClass = type === "time" 
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"

    return (
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <div className={cn("p-1.5 rounded-lg", colorClass)}>
                {createElement(icon, { className: "w-3.5 h-3.5" })}
            </div>
            <span className="truncate">{value}</span>
        </div>
    )
}
