🌐 UAS Perancangan Web Kelas TI24SE3

Nim:1124160189

Nama: Muhammad Raffi Ar-rosyid

📄 Open Payment Portal — Global Institute

Membuat sebuah SPA (Single Page Application) untuk Portal Pembayaran Tagihan Kuliah di Global Institute.
Aplikasi ini berjalan sepenuhnya di browser tanpa reload halaman, menggunakan HTML, JavaScript, dan TailwindCSS.

🎯 Fitur Utama

✅ Formulir pembayaran tagihan kuliah dengan validasi

✅ Pemilihan Bulan Pembayaran Yang Tidak Membuat Anda Keberatan

💳 Dukungan berbagai metode pembayaran:

Transfer Bank (Mandiri)

E-Wallet (Gopay, Bank Jago, Sea Bank)

Kartu Kredit

Pemerintah

Bayar Tunai

🎟️ Dukungan kode promo (diskon tetap dan persentase)

📊 Statistik real-time:

Jumlah transaksi

Total pendapatan

Rata-rata pembayaran

🌙 Toggle Dark Mode

📃 Riwayat transaksi lokal

✅ Modal konfirmasi pembayaran

🛠️ Teknologi yang Digunakan

HTML5

TailwindCSS v3 (via CDN)

JavaScript (Modular Vanilla JS)

SPA tanpa backend (data disimpan sementara di memori browser)

🚀 Cara Menjalankan (Versi Lokal)

Clone atau download proyek

Buka file payment.html di browser

Tidak membutuhkan server atau instalasi tambahan.

🐳 Docker Support

Aplikasi ini juga telah dipaketkan dalam container Docker menggunakan image nginx:alpine.

Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html

Menjalankan Container
docker run -d -p 8080:80 rafreaks06/payment-portal:latest


Akses aplikasi melalui:

http://localhost:8080/payment.html

Repository Docker Hub

Semua versi container dapat ditemukan di:

👉 https://hub.docker.com/repository/docker/rafreaks06/payment-portal/general
