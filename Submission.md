# Pengantar

Selamat!telah menyelesaikan setengah perjalanan di kelas ini. Sejauh ini, telah belajar hal-hal berikut:

- Merancang aksesibilitas yang sesuai dengan standar Web Content Accessibility Guidelines (WCAG).
- Merancang transisi halaman yang halus dan sesuai dengan konteks pengguna.
- Mengembangkan akses hardware terkait media, seperti kamera dan mikrofon.
- Merancang aplikasi peta digital yang memanfaatkan perangkat global positioning system (GPS).

Semua materi di atas menjadi bekal untuk para web developer yang sedang menciptakan aplikasi web dengan kombinasi berbagai Web API yang proporsional. Masih ada beberapa materi ke depan untuk dipelajari yang sedang menunggu Anda. Sebelum itu, kami perlu menguji pengetahuan-pengetahuan Anda melalui asesmen dengan membangun sebuah aplikasi web. Nantinya, reviewer kami akan memeriksa pekerjaan Anda dan memberikan hasil reviu pada proyek yang dibuat.

---

# Tujuan Akhir

Submission ini menugaskan Anda membuat aplikasi dengan pilihan tema dari kami: berbagi cerita, jualan online, dan katalog film. Tugas tersebut menjadi salah satu syarat untuk lulus dari kelas ini. Kami mengedepankan kreativitas Anda dalam membangun aplikasi, tetapi pastikan aplikasi yang dibuat memenuhi kriteria berikut.

## Kriteria Wajib

### 1. Memanfaatkan Satu API sebagai Sumber Data

Anda WAJIB mengambil satu API sebagai sumber datanya. Pemilihan ini juga akan menentukan topik aplikasi yang akan Anda kembangkan. Silakan manfaatkan API yang telah kami sediakan:

- **Story API**: API untuk berbagi story seputar Dicoding, mirip seperti post Instagram namun khusus untuk Dicoding.
  - **Endpoint:** https://story-api.dicoding.dev/v1
  - **Fitur API:**
    - Register
    - Login
    - Add New Story
    - Get All Stories
    - Detail Story
    - Push Notification (Web Push)
    - Subscribe & Unsubscribe Notification

### 2. Menggunakan Arsitektur Single-Page Application

Aplikasi yang Anda buat harus mengadopsi arsitektur Single-Page Application (SPA) dengan ketentuan berikut:

- Menggunakan teknik hash (#) dalam menangani routing di browser.
- Menerapkan pola Model-View-Presenter (MVP) dalam pengelolaan data ke user interface.

### 3. Menampilkan Data

Aplikasi memiliki halaman yang menampilkan data dari API dengan ketentuan berikut:

- Data ditampilkan dalam bentuk daftar dan bersumber dari API pilihan Anda.
- Setiap item daftar menampilkan minimal satu data gambar dan tiga data teks.
- Tambahkan peta digital untuk menunjukkan lokasi data.
- Pastikan peta memiliki marker dan menampilkan popup saat diklik.

### 4. Memiliki Fitur Tambah Data Baru

Aplikasi WAJIB memiliki kemampuan menambahkan data baru ke API dengan fitur berikut:

- Mengambil data gambar dengan kamera.
- Gunakan peta digital dan event klik untuk mengambil data latitude dan longitude.

### 5. Menerapkan Aksesibilitas sesuai dengan Standar

- Menerapkan skip to content.
- Memiliki teks alternatif pada konten gambar esensial.
- Pastikan setiap form control memiliki asosiasi dengan `<label>`.
- Menggunakan semantic element dalam menyusun struktur halaman.

### 6. Merancang Transisi Halaman yang Halus

Aplikasi WAJIB mengimplementasikan gaya transisi halaman secara halus menggunakan View Transition API.

### 7. Memiliki Tampilan yang Menarik

- Pemilihan warna yang cocok.
- Tata letak elemen yang rapi.
- Gaya font yang mudah dibaca.
- Penerapan padding dan margin yang sesuai.
- Penggunaan ikon untuk memperkaya tampilan.

### 8. Mobile Friendly

Aplikasi harus responsif dan mudah diakses di berbagai perangkat.

### 9. Kustomisasi Transisi Halaman dengan Animation API

Memanfaatkan Animation API untuk membuat transisi halaman lebih menarik.

### 10. Memiliki Beragam Gaya Peta dalam Layer Control

- Menyediakan kontrol layer dengan dua atau lebih tile layer.
- Memanfaatkan layanan map seperti MapTiler, Leaflet, atau lainnya.

---

## Larangan

- Perangkat kamera atau mikrofon tidak boleh tetap menyala akibat MediaStream yang belum dihentikan.
- Tidak diperbolehkan menggunakan framework JavaScript seperti React, Angular, atau Vue dalam membangun UI.

---

## Catatan Penting

- Jika aplikasi menggunakan API key dari map service, sertakan dalam `STUDENT.txt`.
- Jika `STUDENT.txt` belum ada, buat baru dalam root project.
- Map Service gunakan Leaflet Library dan openstreet.