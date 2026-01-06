"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { addDays, format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d)
}

export function ReportFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: fromParam ? parseLocalDate(fromParam) : startOfMonth(new Date()),
        to: toParam ? parseLocalDate(toParam) : endOfMonth(new Date()),
    })

    // Sync state with URL changes
    React.useEffect(() => {
        if (fromParam && toParam) {
            setDate({
                from: parseLocalDate(fromParam),
                to: parseLocalDate(toParam),
            })
        }
    }, [fromParam, toParam])

    const onRangeSelect = (range: DateRange | undefined) => {
        setDate(range)
        if (range?.from && range?.to) {
            const params = new URLSearchParams(searchParams)
            params.set("from", format(range.from, "yyyy-MM-dd"))
            params.set("to", format(range.to, "yyyy-MM-dd"))
            router.replace(`?${params.toString()}`, { scroll: false })
        }
    }

    const setPreset = (preset: string) => {
        const now = new Date()
        let range: DateRange = { from: now, to: now }

        switch (preset) {
            case "today":
                range = { from: startOfDay(now), to: endOfDay(now) }
                break
            case "this-week":
                range = { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) }
                break
            case "this-month":
                range = { from: startOfMonth(now), to: endOfMonth(now) }
                break
            case "last-month":
                const lastMonth = subMonths(now, 1)
                range = { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
                break
            case "this-year":
                range = { from: startOfYear(now), to: endOfYear(now) }
                break
        }

        onRangeSelect(range)
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                            Preset Periode
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => setPreset("today")}>Hari Ini</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreset("this-week")}>Minggu Ini</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreset("this-month")}>Bulan Ini</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreset("last-month")}>Bulan Lalu</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreset("this-year")}>Tahun Ini</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className={cn("grid gap-2")}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                size="sm"
                                className={cn(
                                    "w-[260px] justify-start text-left font-normal h-9",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "dd MMM yyyy", { locale: id })} -{" "}
                                            {format(date.to, "dd MMM yyyy", { locale: id })}
                                        </>
                                    ) : (
                                        format(date.from, "dd MMM yyyy", { locale: id })
                                    )
                                ) : (
                                    <span>Pilih rentang tanggal</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={onRangeSelect}
                                numberOfMonths={2}
                                locale={id}
                                weekStartsOn={1}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}
