"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver" // Use native blob saving or file-saver if installed? 
// Checking dependencies... file-saver not in list. using native link download method.

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getExportData } from "@/lib/actions/reports"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface ExportButtonProps {
    startDate: Date
    endDate: Date
}

export function ExportButton({ startDate, endDate }: ExportButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const getData = async () => {
        setIsLoading(true)
        try {
            const data = await getExportData(startDate, endDate)
            if (data.length === 0) {
                toast.error("Tidak ada data untuk diexport pada periode ini.")
                return null
            }
            return data
        } catch (error) {
            toast.error("Gagal mengambil data export")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const handleExportPDF = async () => {
        const data = await getData()
        if (!data) return

        const doc = new jsPDF()

        // Title
        doc.setFontSize(18)
        doc.text("Laporan Keuangan Masjid Al-Ikhlas", 14, 20)

        doc.setFontSize(12)
        doc.text(`Periode: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`, 14, 30)
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 36)

        const tableData = data.map(item => [
            item.formattedDate,
            item.category,
            item.description,
            item.type === "INCOME" ? "Masuk" : "Keluar",
            `Rp ${item.amount.toLocaleString('id-ID')}`
        ])

        // Calculate totals
        const totalIncome = data
            .filter(d => d.type === "INCOME")
            .reduce((sum, d) => sum + d.amount, 0)
        const totalExpense = data
            .filter(d => d.type === "EXPENSE")
            .reduce((sum, d) => sum + d.amount, 0)
        const balance = totalIncome - totalExpense

        autoTable(doc, {
            startY: 45,
            head: [['Tanggal', 'Kategori', 'Keterangan', 'Jenis', 'Nominal']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }, // Emerald color
        })

        // Summary at bottom
        const finalY = (doc as any).lastAutoTable.finalY + 10
        doc.text(`Total Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')}`, 14, finalY)
        doc.text(`Total Pengeluaran: Rp ${totalExpense.toLocaleString('id-ID')}`, 14, finalY + 7)
        doc.setFont(undefined as any, 'bold')
        doc.text(`Saldo Akhir: Rp ${balance.toLocaleString('id-ID')}`, 14, finalY + 14)

        doc.save(`Laporan_Keuangan_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.pdf`)
        toast.success("Laporan PDF berhasil didownload")
    }

    const handleExportExcel = async () => {
        const data = await getData()
        if (!data) return

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Laporan')

        worksheet.columns = [
            { header: 'Tanggal', key: 'date', width: 15 },
            { header: 'Kategori', key: 'category', width: 20 },
            { header: 'Keterangan', key: 'desc', width: 30 },
            { header: 'Tipe', key: 'type', width: 10 },
            { header: 'Pemasukan', key: 'income', width: 15 },
            { header: 'Pengeluaran', key: 'expense', width: 15 },
            { header: 'User', key: 'user', width: 15 },
        ]

        data.forEach(item => {
            worksheet.addRow({
                date: item.formattedDate,
                category: item.category,
                desc: item.description,
                type: item.type === "INCOME" ? "Masuk" : "Keluar",
                income: item.type === "INCOME" ? item.amount : 0,
                expense: item.type === "EXPENSE" ? item.amount : 0,
                user: item.user
            })
        })

        // Style header
        worksheet.getRow(1).font = { bold: true }

        // Write file
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

        // Create link to download
        const url = window.URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `Laporan_Keuangan_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.xlsx`
        anchor.click()
        window.URL.revokeObjectURL(url)

        toast.success("Laporan Excel berhasil didownload")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>
                    <FileText className="mr-2 h-4 w-4 text-red-600" />
                    Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                    Export to Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
