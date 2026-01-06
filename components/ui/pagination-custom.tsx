"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomPaginationProps {
    totalPages: number
    currentPage: number
    paramKey?: string
}

export function CustomPagination({ totalPages, currentPage, paramKey = "page" }: CustomPaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const onPageChange = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set(paramKey, page.toString())
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 py-6">
            <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-lg border-gray-200"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
            </Button>

            <div className="flex items-center gap-1 mx-2">
                <span className="text-sm font-medium text-gray-700">Halaman</span>
                <span className="flex items-center justify-center h-8 min-w-[32px] px-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
                    {currentPage}
                </span>
                <span className="text-sm font-medium text-gray-700">dari</span>
                <span className="text-sm font-medium text-gray-700">{totalPages}</span>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-lg border-gray-200"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    )
}
