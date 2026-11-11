# TugasKu

**kuliah tebal tebal.**

TugasKu adalah aplikasi web untuk mencatat tugas kuliah beserta deadline-nya. Aplikasi menandai tugas secara otomatis sebagai **Urgent** (deadline kurang dari 24 jam) atau **Terlambat** (deadline sudah lewat), sehingga mahasiswa langsung tahu mana yang harus dikerjakan lebih dulu.

Dibuat untuk **Informatics Study Club Champion Class** dengan tema *Inovasi Digital Kampus*.

🔗 **Demo:** https://tugasku-sage.vercel.app/

---

## 🎯 Latar Belakang Masalah

Mahasiswa sering menerima banyak tugas dari berbagai mata kuliah dengan deadline berbeda-beda. Catatan yang tersebar di chat, kertas, atau grup kelas membuat deadline mudah terlewat. TugasKu mengumpulkan semuanya di satu tempat dan memberi penanda visual otomatis untuk tugas yang mendesak.

## ✨ Fitur

- **CRUD tugas lengkap:** tambah, lihat, ubah status, dan hapus tugas.
- **Label otomatis:** 🔥 Urgent (sisa waktu < 24 jam), Terlambat (deadline lewat), dan ✔ Selesai.
- **Pengurutan otomatis** berdasarkan deadline terdekat.
- **Ringkasan statistik:** total, urgent, terlambat, dan selesai.
- **Tampilan responsif** untuk laptop maupun HP.

## 🛠️ Teknologi

| Bagian | Teknologi |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon) |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| Deploy | Vercel |

## 🚀 Menjalankan di Komputer Lokal

**Prasyarat:** Node.js dan akun [Neon](https://neon.tech).

1. Clone repository
   ```bash
   git clone https://github.com/tanfelicia14/tugasku.git
   cd tugasku
   ```
2. Install dependency
   ```bash
   npm install
   ```
3. Buat tabel di Neon (lewat **SQL Editor**):
   ```sql
   CREATE TABLE tugas (
     id SERIAL PRIMARY KEY,
     mata_kuliah VARCHAR(100) NOT NULL,
     judul VARCHAR(200) NOT NULL,
     deadline TIMESTAMPTZ NOT NULL,
     status VARCHAR(20) NOT NULL DEFAULT 'belum',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
4. Buat file `.env` di root project:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   ```
5. Jalankan server
   ```bash
   npm run dev
   ```
6. Buka **http://localhost:3000**

## 🔮 Rencana Pengembangan

- [ ] Autentikasi (register dan login) agar setiap mahasiswa punya daftar tugas pribadi
- [ ] Fitur edit tugas
- [ ] Filter berdasarkan mata kuliah
- [ ] Notifikasi pengingat (email atau WhatsApp)
- [ ] Mode gelap

## 👩‍💻 Pembuat

**Felicia**, Mahasiswa Teknik Informatika, Universitas Pamulang
Peserta Informatics Study Club Champion Class
