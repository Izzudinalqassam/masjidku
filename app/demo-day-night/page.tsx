"use client"

import { AnimatedSun } from "@/components/prayer/animated-sun"
import { AnimatedMoon } from "@/components/prayer/animated-moon"
import { DayNightIndicator } from "@/components/prayer/day-night-indicator"

export default function DemoDayNightPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white text-center mb-4">
                    Demo Animasi Siang & Malam
                </h1>
                <p className="text-slate-400 text-center mb-12">
                    Animasi matahari dan bulan yang berubah berdasarkan waktu
                </p>

                {/* Auto Day/Night Indicator */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-white text-center mb-8">
                        Indikator Otomatis (Berdasarkan Waktu Saat Ini)
                    </h2>
                    <div className="bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/10 p-12 flex flex-col items-center justify-center">
                        <DayNightIndicator size={120} className="mb-6" />
                        <p className="text-slate-300 text-lg">
                            Animasi di atas berubah otomatis sesuai waktu sistem
                        </p>
                        <div className="mt-4 flex gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                Pagi (05:00 - 11:00)
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                                Siang (11:00 - 15:00)
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                Sore (15:00 - 18:00)
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                                Malam (18:00 - 05:00)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Manual Sun Demo */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-white text-center mb-8">
                        Demo Matahari (Siang)
                    </h2>
                    <div className="bg-gradient-to-b from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-12 flex flex-col items-center justify-center">
                        <AnimatedSun size={150} className="mb-6" />
                        <p className="text-amber-200 text-lg">
                            Matahari dengan sinar yang berputar dan efek glow
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-amber-300/70">
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="font-semibold mb-2">Fitur Matahari:</p>
                                <ul className="space-y-1">
                                    <li>• Sinar berputar dua arah</li>
                                    <li>• Efek glow berdenyut</li>
                                    <li>• Gradient kuning-oranye</li>
                                    <li>• Efek kilau di permukaan</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="font-semibold mb-2">Animasi:</p>
                                <ul className="space-y-1">
                                    <li>• Rotasi lambat (20 detik)</li>
                                    <li>• Rotasi normal (12 detik)</li>
                                    <li>• Pulse glow (3 detik)</li>
                                    <li>• Pulse sun (4 detik)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manual Moon Demo */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-white text-center mb-8">
                        Demo Bulan (Malam)
                    </h2>
                    <div className="bg-gradient-to-b from-blue-500/10 to-indigo-500/10 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-12 flex flex-col items-center justify-center">
                        <AnimatedMoon size={150} className="mb-6" />
                        <p className="text-blue-200 text-lg">
                            Bulan dengan bintang berkelap-kelip dan kawah
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-blue-300/70">
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="font-semibold mb-2">Fitur Bulan:</p>
                                <ul className="space-y-1">
                                    <li>• Bintang berkelap-kelip</li>
                                    <li>• Efek glow halus</li>
                                    <li>• Gradient biru-putih</li>
                                    <li>• Detail kawah di permukaan</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="font-semibold mb-2">Animasi:</p>
                                <ul className="space-y-1">
                                    <li>• Twinkle bintang (2-3 detik)</li>
                                    <li>• Pulse glow (4 detik)</li>
                                    <li>• Ring pulse (5 detik)</li>
                                    <li>• Float naik-turun (6 detik)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Size Variants */}
                <div>
                    <h2 className="text-2xl font-semibold text-white text-center mb-8">
                        Variasi Ukuran
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 p-8 flex flex-col items-center">
                            <AnimatedSun size={60} />
                            <p className="text-slate-300 mt-4">Kecil (60px)</p>
                        </div>
                        <div className="bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 p-8 flex flex-col items-center">
                            <AnimatedMoon size={80} />
                            <p className="text-slate-300 mt-4">Sedang (80px)</p>
                        </div>
                        <div className="bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 p-8 flex flex-col items-center">
                            <AnimatedSun size={100} />
                            <p className="text-slate-300 mt-4">Besar (100px)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
