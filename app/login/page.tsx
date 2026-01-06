"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Eye, EyeOff, Loader2, KeyRound, Mail, ArrowRight } from "lucide-react"

import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                // Map specific error codes to user-friendly messages
                console.log("Login Error:", result.error) // Debugging

                if (result.error.includes("CredentialsSignin")) {
                    setError("Email atau password salah. Silakan periksa kembali.")
                } else if (result.error.includes("Network") || result.error.includes("fetch")) {
                    setError("Gagal terhubung ke server. Periksa koneksi internet Anda.")
                } else if (result.error === "Configuration") {
                    setError("Terdapat masalah konfigurasi sistem. Hubungi Admin.")
                } else if (result.error === "AccessDenied") {
                    setError("Akses ditolak. Akun Anda mungkin dinonaktifkan.")
                } else {
                    setError("Terjadi kesalahan sistem (" + result.error + "). Coba beberapa saat lagi.")
                }
            } else if (result?.ok) {
                toast.success("Login berhasil! Selamat datang kembali.")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            setError("Gagal menghubungi server. Pastikan server aktif.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative z-10 transition-all duration-500 ease-in-out">

                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-emerald-900">FinMas</h2>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2 font-serif">
                            Selamat Datang
                        </h1>
                        <p className="text-lg text-gray-600">
                            Silakan masuk untuk mengelola keuangan <br />
                            <span className="font-semibold text-emerald-700">Masjid Miftahul Huda</span>
                        </p>
                    </div>

                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-backwards">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="p-1 bg-red-100 rounded-full shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-red-800">Gagal Masuk</h3>
                                        <p className="text-sm text-red-600 mt-0.5 leading-relaxed">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@masjid.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all rounded-xl"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all rounded-xl"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-600 cursor-pointer transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Masuk Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-10">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Demo Access</span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-500 text-center">
                                <div className="p-2 rounded bg-gray-50 border border-gray-100 select-all cursor-pointer hover:bg-gray-100 transition-colors">
                                    admin@masjid.com<br />admin123
                                </div>
                                <div className="p-2 rounded bg-gray-50 border border-gray-100 select-all cursor-pointer hover:bg-gray-100 transition-colors">
                                    bendahara@masjid.com<br />bendahara123
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Unique Hero Section */}
            <div className="hidden lg:block relative flex-1 bg-emerald-900 overflow-hidden">
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full text-emerald-100" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Abstract Islamic Geometric Pattern Simulation */}
                        <path d="M0 0h100v100H0z" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        <rect x="30" y="30" width="40" height="40" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(45 50 50)" />
                        <rect x="30" y="30" width="40" height="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        <path d="M50 0 L100 50 L50 100 L0 50 Z" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
                        {/* Repeating pattern dots */}
                        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" className="text-emerald-500" fill="currentColor" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#dots)" opacity="0.4" />
                    </svg>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 mix-blend-multiply" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white z-20">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl shadow-emerald-900/50 animate-in zoom-in duration-1000">
                        <Building2 className="w-12 h-12 text-emerald-100" />
                    </div>

                    <h2 className="text-5xl font-extrabold tracking-tight mb-6 font-serif leading-tight text-transparent bg-clip-text bg-gradient-to-br from-emerald-50 via-white to-emerald-200 animate-in slide-in-from-bottom-5 duration-1000 delay-200">
                        Masjid <br /> Miftahul Huda
                    </h2>

                    <p className="text-emerald-100/80 text-lg max-w-md mx-auto leading-relaxed animate-in slide-in-from-bottom-5 duration-1000 delay-300">
                        "Kelola dana umat dengan transparan, amanah, dan modern demi kemaslahatan bersama."
                    </p>

                    {/* Floating Cards Decoration */}
                    <div className="absolute bottom-20 left-10 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 w-48 animate-pulse delay-700 hidden xl:block">
                        <div className="h-2 w-12 bg-emerald-500/50 rounded mb-2" />
                        <div className="h-2 w-24 bg-white/20 rounded" />
                    </div>
                    <div className="absolute top-20 right-10 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 w-48 animate-bounce delay-1000 duration-[3000ms] hidden xl:block">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-400/30" />
                            <div className="space-y-1">
                                <div className="h-2 w-16 bg-white/30 rounded" />
                                <div className="h-2 w-10 bg-white/10 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
