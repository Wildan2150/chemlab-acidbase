# Firebase Auth dan manajemen akun

Fitur akun dikembangkan pada `feat/login-page` dari `main` commit `30505f7`, kemudian digabungkan ke `main` bersama materi, asesmen, dan aktivitas interaktif pada 10 November 2026 WIB. Penyedia yang dipilih pengajar adalah Firebase Auth. Konfigurasi proyek `chemlab-web`, provider Email/Password dan Google, serta domain `localhost`/`127.0.0.1` sudah terverifikasi melalui API produksi. Bukti: [pemeriksaan produksi](firestore-production-check.json).

## Fitur

Pratinjau: [halaman masuk](preview-login.png) dan [registrasi](preview-register.png).

- Login email/password; pilihan mempertahankan sesi pada perangkat, dengan default sesi browser.
- Tombol **Lanjutkan dengan Google** pada halaman masuk dan daftar memakai `GoogleAuthProvider` + `signInWithPopup`. Akun baru dibuat Firebase pada penggunaan pertama; kunjungan berikutnya menggunakan UID yang sama. Pilihan **Ingat saya** juga berlaku untuk Google, dengan default sesi browser.
- Registrasi nama tampilan, email, kata sandi dan konfirmasi. Kata sandi 12–128 karakter divalidasi sebelum dikirim.
- Verifikasi email, pemeriksaan status ulang, serta halaman untuk memproses tautan akun.
- Pemulihan password melalui email, pemeriksaan kode, dan pengaturan password baru.
- Ubah nama; ubah password dengan autentikasi ulang; ubah email melalui `verifyBeforeUpdateEmail`, sehingga alamat tidak langsung diganti sebelum verifikasi.
- Logout; penghapusan akun dengan persetujuan dan dialog konfirmasi, dilanjutkan autentikasi ulang melalui kata sandi atau pop-up Google sesuai provider akun.
- Akun khusus Google mengelola email/password melalui pengaturan Google; aplikasi tetap menyediakan perubahan nama dan penghapusan akun ChemLab. Tidak meminta kata sandi ChemLab yang belum dibuat. Menghapus akun ChemLab tidak menghapus akun Google.
- Progres tamu dan progres setiap UID dipisahkan di browser. Tidak ada pengambilan role guru atau hak admin dari form registrasi.

Layanan akun dipanggil melalui SDK resmi; tidak ada akun palsu atau kata sandi buatan yang disimpan di localStorage. Firebase SDK mengelola persistensi sesi. Data profil ditampilkan dari status provider, bukan diasumsikan dari keberhasilan form.

`initializeAuth` menggunakan urutan persistensi local/session yang sama dengan layanan masuk. Ini mempertahankan sesi **Ingat saya** ketika tab baru dibuka, tanpa migrasi ke penyimpanan default SDK yang berbeda. Sesi tanpa **Ingat saya** tetap terbatas pada tab; sesi yang diingat mengikuti sinkronisasi antar-tab Firebase.

## Menjalankan tanpa proyek produksi

```powershell
npm.cmd ci --ignore-scripts
npm.cmd run dev:emulator
```

Perintah tersebut menjalankan Auth Emulator pada `127.0.0.1:9099`, Firestore Emulator pada `127.0.0.1:8080`, serta Vite pada `127.0.0.1:5174`, dengan project ID khusus `demo-chemlab`. Firestore Emulator memerlukan Java 21+ pada `PATH`. Tidak menggunakan kredensial admin, billing, atau akun produksi. Tautan verifikasi/reset tersedia dari emulator dan terminal; email sungguhan tidak dikirim. Data emulator bersifat sementara selama proses berjalan.

Untuk mencoba Google, klik tombol Google lalu **Add new account** pada jendela pemilih milik emulator. Isi identitas fiktif, lalu lanjutkan. Pemilih tersebut mengemulasikan provider, tidak menghubungi Google atau meminta kata sandi Google sungguhan. Kode aplikasi menggunakan alur SDK yang sama seperti produksi.

Pemasangan dan pengujian di Windows diverifikasi dengan `--ignore-scripts`; SDK Auth dan emulator ini memakai berkas JavaScript yang sudah dipaketkan. Cara ini tidak memerlukan kompilasi dependency native opsional milik fitur Firebase CLI lain.

Sambungan emulator dibatasi untuk mode development pada host loopback. Build produksi menolak konfigurasi emulator. Jangan memakai token emulator untuk mengakses layanan produksi.

## Menghubungkan proyek Firebase sendiri

1. Buat/pilih project dan daftarkan Web App melalui Firebase Console.
2. Aktifkan **Authentication → Sign-in method → Email/Password**. Sesuaikan kebijakan password server; rekomendasi proyek ini minimum 12 karakter.
3. Salin `.env.example` menjadi `.env.local` dan isi `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, serta `VITE_FIREBASE_APP_ID` dari konfigurasi Web App. Biarkan `VITE_FIREBASE_USE_EMULATOR=false`.
4. Atur **Authorized domains** untuk localhost/127.0.0.1 yang digunakan dan domain hosting yang dimiliki. Jangan menganggap localhost selalu otomatis diizinkan.
5. Pada **Authentication → Templates**, atur action URL ke URL root aplikasi milik sendiri jika ingin memakai halaman konfirmasi aplikasi, misalnya `https://domain-anda.example/chemlab/`. Firebase menambahkan `mode` dan `oobCode` melalui query. Aplikasi juga mendukung hash `#tindakan-akun?mode=...&oobCode=...` untuk pengujian.
6. Sesuaikan template pengirim, tautan, dan pengaturan email enumeration protection. Periksa verifikasi, reset, perubahan email, dan kode kedaluwarsa pada proyek tersebut.
7. Jalankan `npm run dev`; setelah konfigurasi benar, form menggunakan Firebase Auth. Atur variabel build yang sama pada hosting lalu uji ulang domain produksi.

### Mengaktifkan Google

1. Pada **Authentication → Sign-in method → Google**, aktifkan provider, isi nama publik proyek dan email dukungan, lalu simpan. Gunakan proyek yang sama dengan konfigurasi Web App di `.env.local`; tidak perlu menambahkan client secret ke frontend.
2. Pastikan domain aplikasi terdaftar di **Authentication → Settings → Authorized domains**. Gunakan `authDomain` bawaan Firebase untuk konfigurasi awal. Jika menggunakan domain autentikasi khusus, ikuti panduan resmi untuk menambahkan domain tersebut serta URI `https://<authDomain>/__/auth/handler` pada OAuth client proyek.
3. Jalankan ulang Vite setelah mengubah `.env.local`. Klik **Lanjutkan dengan Google** pada halaman masuk atau daftar. Izinkan pop-up situs bila diblokir browser. Setelah berhasil, periksa profil, muat ulang, logout, lalu masuk lagi untuk memastikan identitas/progres tetap sama.
4. Uji pada browser/perangkat dan domain hosting sebenarnya. Provider dan authorized domains lokal sudah diperiksa pada proyek produksi; pengujian emulator tidak memverifikasi OAuth consent screen, pembatasan browser ponsel, atau interaksi OAuth nyata pada domain hosting.

Pembatalan pop-up mengembalikan pengguna ke halaman masuk dan tombol dapat dicoba kembali. Kesalahan pop-up diblokir, domain belum diizinkan, provider belum aktif, dan konflik cara masuk memiliki pesan yang dapat ditindaklanjuti. Aplikasi tidak melakukan penggabungan kredensial sendiri atau menyimpan token OAuth di state/progres. Firebase menentukan identitas akun sesuai pengaturan provider proyek. Akun yang memiliki provider password tetap mempertahankan pengaturan password dan verifikasi email baru seperti sebelumnya.

`VITE_*` adalah konfigurasi client yang masuk bundle, bukan rahasia admin. `.env.local`, log Firebase, cache, data akun, dan token pengujian tidak dimasukkan Git. Jangan menaruh service account atau kredensial Firebase Admin pada frontend.

## Data dan batas akses

`chemlab:guest:v1` tetap menyimpan progres tamu. Akun menggunakan `chemlab:user:<UID>:v1`. Pergantian identitas me-remount state belajar dari key milik identitas baru sebelum menyimpan perubahan. Logout memulihkan progres tamu. Tidak ada penyalinan otomatis progres tamu ke akun lain.

Progres akun disinkronkan ke Firestore dengan antrean lokal dan pemulihan lintas perangkat. Profil nama/email pemilik disimpan pada `learnerProfiles/{UID}`. Menghapus akun meminta autentikasi ulang, mengosongkan payload cloud dan menghapus profil, lalu menghapus identitas Firebase serta cache akun pada browser yang dipakai. Salinan perangkat lain yang offline tidak dapat dihapus dari browser ini. Guru terverifikasi yang ditetapkan dapat membaca data siswa sesuai [TEACHER_PANEL.md](TEACHER_PANEL.md). Kontrak dan pemasangan Rules ada di [FIRESTORE_SETUP.md](FIRESTORE_SETUP.md).

Manajemen akun berarti pengelolaan akun sendiri. Administrasi seluruh pengguna, pengangkatan guru, dan pencabutan seluruh sesi dari server memerlukan backend/admin policy dan bukan bagian branch ini.

## Pengujian dan keamanan

`npm run test:e2e` menyalakan server baseline dan satu stack Auth/Firestore Emulator dengan aplikasi pada port 5175. Kredensial fixture bersifat fiktif dan unik per skenario. Pengujian memanggil SDK serta endpoint emulator sesungguhnya; tidak mengganti autentikasi atau penulisan database dengan mock keberhasilan.

Skenario mencakup registrasi, verifikasi, profil, password benar/salah, hapus/batal, pemulihan sekali pakai, perubahan email terverifikasi, pemisahan dua akun dan tamu, aksesibilitas, dan ponsel. Pengujian Google menambahkan masuk/daftar melalui pop-up emulator, UID/progres yang sama saat masuk ulang, persistensi antar-tab, sesi per tab, pembatalan, pop-up diblokir, penolakan identitas berbeda saat autentikasi ulang, serta penghapusan akun yang diperiksa melalui API emulator. Penutupan pop-up menunggu toleransi SDK terhadap hasil autentikasi yang masih diproses. Konfigurasi produksi sudah diperiksa melalui API; interaksi OAuth Google sebenarnya dan pengiriman email nyata belum diuji.

Audit dependency produksi tidak menemukan kerentanan saat pemeriksaan. Versi `@grpc/grpc-js` dinaikkan dalam rentang kompatibel lewat override untuk mengatasi advisory transitif. Firebase CLI tetap memiliki advisory tingkat moderate pada dependency alat development; CLI tidak masuk bundle browser. Tidak dilakukan downgrade lintas mayor atau perbaikan paksa yang belum diverifikasi.

## Rujukan resmi

- [Firebase password authentication](https://firebase.google.com/docs/auth/web/password-auth)
- [Firebase Google sign-in](https://firebase.google.com/docs/auth/web/google-signin)
- [Manage users](https://firebase.google.com/docs/auth/web/manage-users)
- [Auth persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [Custom Auth initialization](https://firebase.google.com/docs/auth/web/custom-dependencies)
- [Custom email action handlers](https://firebase.google.com/docs/auth/custom-email-handler)
- [Authentication Emulator](https://firebase.google.com/docs/emulator-suite/connect_auth)
- [Auth API reference](https://firebase.google.com/docs/reference/js/auth)
