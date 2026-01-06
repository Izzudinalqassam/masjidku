"use client"

import { useEffect, useState } from "react"
import { getActivityLogs } from "@/lib/actions/users"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { UserCircle, Shield, Clock, Globe, Laptop, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function ActivityLogs() {
    const [logs, setLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getActivityLogs()
                setLogs(data)
            } catch (error) {
                console.error("Failed to fetch logs:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLogs()
    }, [])

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
            </div>
        )
    }

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <Clock className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Belum ada aktivitas yang tercatat</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-gray-100">
                        <TableHead className="w-[250px] font-semibold text-gray-900 py-4">Pengguna</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">Aktivitas</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4">Informasi Sesi</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900 py-4">Waktu</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id} className="group hover:bg-emerald-50/30 transition-colors border-gray-50">
                            <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200/50 shadow-inner">
                                        {log.user?.fullName?.charAt(0).toUpperCase() || <UserCircle className="w-6 h-6 opacity-50" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 text-sm line-clamp-1">{log.user?.fullName || "Unknown User"}</span>
                                        <span className="text-xs text-gray-500 truncate max-w-[150px]">{log.user?.email || "-"}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                    {log.action === "LOGIN" ? (
                                        <>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[10px] px-2 py-0">
                                                {log.action}
                                            </Badge>
                                            <span className="text-sm font-medium text-gray-600 capitalize">Login Berhasil</span>
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="destructive" className="font-bold text-[10px] px-2 py-0">
                                                {log.action.replace("_", " ")}
                                            </Badge>
                                            <span className="text-sm font-medium text-red-600">Reset Data Transaksi</span>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                                    {log.action === "LOGIN" ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5 text-gray-400" />
                                                <span>IP: {log.ipAddress || "System"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Laptop className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="line-clamp-1 max-w-[200px]" title={log.userAgent}>
                                                    Chrome / Windows 11
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5" />
                                            <span className="text-red-500/80 italic">
                                                {log.newData?.description || "Seluruh data transaksi telah dihapus secara permanen."}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right py-4">
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {format(new Date(log.createdAt), "dd MMM yyyy", { locale: id })}
                                    </span>
                                    <span className="text-[11px] font-medium text-gray-400">
                                        {format(new Date(log.createdAt), "HH:mm:ss")} WIB
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
