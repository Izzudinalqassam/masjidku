"use client"

import { useState, useEffect } from "react"
import { AnimatedSun } from "./animated-sun"
import { AnimatedMoon } from "./animated-moon"
import { cn } from "@/lib/utils"

interface DayNightIndicatorProps {
    className?: string
    size?: number
}

export function DayNightIndicator({ className, size = 80 }: DayNightIndicatorProps) {
    const [isDay, setIsDay] = useState(true)

    useEffect(() => {
        const checkTime = () => {
            const now = new Date()
            const hour = now.getHours()
            
            // Define day time: 6 AM (06:00) to 6 PM (18:00)
            // Night time: 6 PM (18:00) to 6 AM (06:00)
            const dayTime = hour >= 6 && hour < 18
            setIsDay(dayTime)
        }

        // Check immediately
        checkTime()

        // Update every minute
        const interval = setInterval(checkTime, 60000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            {isDay ? (
                <AnimatedSun size={size} />
            ) : (
                <AnimatedMoon size={size} />
            )}
            <p className={cn(
                "text-sm font-medium transition-colors duration-500",
                isDay ? "text-amber-400" : "text-blue-300"
            )}>
                {isDay ? "Siang" : "Malam"}
            </p>
        </div>
    )
}

// Hook to use day/night state in other components
export function useDayNight() {
    const [isDay, setIsDay] = useState(true)
    const [timePeriod, setTimePeriod] = useState<'pagi' | 'siang' | 'sore' | 'malam'>('pagi')

    useEffect(() => {
        const checkTime = () => {
            const now = new Date()
            const hour = now.getHours()

            // Define time periods
            if (hour >= 5 && hour < 11) {
                setTimePeriod('pagi')
                setIsDay(true)
            } else if (hour >= 11 && hour < 15) {
                setTimePeriod('siang')
                setIsDay(true)
            } else if (hour >= 15 && hour < 18) {
                setTimePeriod('sore')
                setIsDay(true)
            } else {
                setTimePeriod('malam')
                setIsDay(false)
            }
        }

        checkTime()
        const interval = setInterval(checkTime, 60000)
        return () => clearInterval(interval)
    }, [])

    return { isDay, timePeriod }
}
