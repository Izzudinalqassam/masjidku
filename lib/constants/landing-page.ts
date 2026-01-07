// Landing Page Constants
import { Layers, Users, Award, Target, Zap } from "lucide-react"
import { Moon, Sun, Sunset } from "lucide-react"

// Prayer Times Data
export const PRAYER_TIMES = [
    { name: "Subuh", time: "04:45", icon: Moon },
    { name: "Dzuhur", time: "12:15", icon: Sun },
    { name: "Ashar", time: "15:30", icon: Sun },
    { name: "Maghrib", time: "18:15", icon: Sunset },
    { name: "Isya", time: "19:30", icon: Moon },
] as const

// Categories Data
export const CATEGORIES = [
    { id: "ALL", label: "Semua" },
    { id: "KAJIAN", label: "Kajian" },
    { id: "SOSIAL", label: "Sosial" },
    { id: "PHBI", label: "PHBI" },
    { id: "LOMBA", label: "Lomba" },
    { id: "LAINNYA", label: "Lainnya" },
] as const

// Category Colors
export const CATEGORY_COLORS: Record<string, string> = {
    KAJIAN: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    SOSIAL: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    PHBI: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    LOMBA: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    LAINNYA: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
}

// Category Statistics Configuration
export const CATEGORY_STATS: Record<string, { label: string; icon: any; color: string; bgGradient: string }> = {
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

// Animation Delays
export const ANIMATION_DELAYS = {
    greeting: '100ms',
    heading: '200ms',
    subtitle: '300ms',
    mainHeading: '400ms',
    description: '500ms',
    bismillah: '600ms',
    location: '700ms',
}
