# MasjidKu - Sistem Manajemen Keuangan Masjid Modern

MasjidKu adalah platform manajemen keuangan masjid yang dirancang untuk memberikan transparansi, efisiensi, dan kemudahan bagi pengurus masjid (Takmir/Bendahara) dalam mengelola dana umat.

## ✨ Fitur Utama

- **Dashboard Real-time**: Visualisasi ringkasan saldo, pemasukan, dan pengeluaran harian/bulanan dengan grafik interaktif.
- **Transaction Hub Modern**: 
  - Input transaksi cepat melalui side-sheet.
  - Riwayat transaksi terpisah untuk Pemasukan dan Pengeluaran.
  - **Independent Pagination**: Navigasi halaman pemasukan tidak mengganggu posisi halaman pengeluaran.
- **Filtering Lanjutan**: Filter data berdasarkan rentang tanggal kustom atau preset (Hari ini, Minggu ini, Bulan lalu, dsb).
- **Manajemen Kategori**: Pengorganisasian transaksi dengan kategori yang dapat disesuaikan (Infaq, Shodaqoh, Operasional, Pembangunan, dll).
- **Laporan & Ekspor**:
  - Download laporan dalam format **PDF** dan **Excel**.
  - Laporan disesuaikan otomatis dengan filter tanggal yang dipilih.
- **Multi-user & Keamanan**: Dukungan peran Admin dan Bendahara dengan sistem autentikasi yang aman.
- **Sepenuhnya Responsif**: Tampilan optimal baik di desktop maupun perangkat mobile.

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS / Vanilla CSS
- **Components**: Radix UI / Shadcn UI
- **Auth**: NextAuth.js (v5 Beta)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form

## 🛠️ Instalasi & Persiapan Lokal

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Izzudinalqassam/masjidku.git
   cd masjidku
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Buat file `.env` di root direktori dan isi dengan variabel berikut:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/masjidku?schema=public"
   AUTH_SECRET="your-generated-secret"
   ```

4. **Persiapan Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed # Untuk data awal (User Admin & Kategori)
   ```

5. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 👥 Kontribusi

Kontribusi selalu terbuka! Silakan lakukan pull request atau buka issue untuk saran dan perbaikan.

## 📄 Lisensi

Proyek ini berada di bawah lisensi MIT.

---
Dikembangkan dengan ❤️ untuk kemajuan manajemen masjid di Indonesia.
