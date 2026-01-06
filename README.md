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

## 📄 Image

<img width="1919" height="925" alt="image" src="https://github.com/user-attachments/assets/e03025af-4e1e-40d1-a243-175490e0b4d7" />
<img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/18fc2943-3bf8-468e-b34b-7d717d983ac4" />
<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/fb2979b5-b393-4e20-b821-ce3e89de81be" />
<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/a637bb6c-c894-4fbc-9573-14acc86fdaac" />
<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/68727909-a753-4d4a-8eb3-211f6af9d8d7" />
<img width="1919" height="931" alt="image" src="https://github.com/user-attachments/assets/dc6442a1-534f-48ca-80bc-b573fcd47050" />
<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/e00a4dba-d816-431c-bcfc-353bd3624cb2" />
<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/a713327e-97de-4a22-b0ef-d2f02bbf0bfb" />





---
Dikembangkan dengan ❤️ untuk kemajuan manajemen masjid di Indonesia.
