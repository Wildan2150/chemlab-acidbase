# Firebase Auth dan manajemen akun

Branch `feat/login-page` berangkat dari `main` commit `30505f7`, tanpa menggabungkan branch materi maupun interaktif. Penyedia yang dipilih pengajar adalah Firebase Auth; konfigurasi proyek produksi menyusul.

## Fitur

Pratinjau: [halaman masuk](preview-login.png) dan [registrasi](preview-register.png).

- Login email/password; pilihan mempertahankan sesi pada perangkat, dengan default sesi browser.
- Registrasi nama tampilan, email, kata sandi dan konfirmasi. Kata sandi 12–128 karakter divalidasi sebelum dikirim.
- Verifikasi email, pemeriksaan status ulang, serta halaman untuk memproses tautan akun.
- Pemulihan password melalui email, pemeriksaan kode, dan pengaturan password baru.
- Ubah nama; ubah password dengan autentikasi ulang; ubah email melalui `verifyBeforeUpdateEmail`, sehingga alamat tidak langsung diganti sebelum verifikasi.
- Logout; penghapusan akun dengan kata sandi, persetujuan, dan dialog konfirmasi.
- Progres tamu dan progres setiap UID dipisahkan di browser. Tidak ada pengambilan role guru atau hak admin dari form registrasi.

Layanan akun dipanggil melalui SDK resmi; tidak ada akun palsu atau kata sandi buatan yang disimpan di localStorage. Firebase SDK mengelola persistensi sesi. Data profil ditampilkan dari status provider, bukan diasumsikan dari keberhasilan form.

## Menjalankan tanpa proyek produksi

```powershell
npm.cmd ci --ignore-scripts
npm.cmd run dev:emulator
```

Perintah tersebut menjalankan Auth Emulator pada `127.0.0.1:9099` dengan project ID khusus `demo-chemlab` dan Vite pada `127.0.0.1:5174`. Tidak menggunakan kredensial admin, billing, atau akun pada proyek produksi. Tautan verifikasi/reset tersedia dari emulator dan terminal; email sungguhan tidak dikirim. Data akun emulator berada di memori selama proses berjalan.

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

`VITE_*` adalah konfigurasi client yang masuk bundle, bukan rahasia admin. `.env.local`, log Firebase, cache, data akun, dan token pengujian tidak dimasukkan Git. Jangan menaruh service account atau kredensial Firebase Admin pada frontend.

## Data dan batas akses

`chemlab:guest:v1` tetap menyimpan progres tamu. Akun menggunakan `chemlab:user:<UID>:v1`. Pergantian identitas me-remount state belajar dari key milik identitas baru sebelum menyimpan perubahan. Logout memulihkan progres tamu. Tidak ada penyalinan otomatis progres tamu ke akun lain.

Menghapus akun menghapus identitas di Firebase serta key progres akun pada browser yang dipakai. Catatan pada browser/perangkat lain tidak dapat dihapus dari browser ini. Fitur ini belum menambahkan Firestore, sinkronisasi progres, antrean kirim, atau pembacaan hasil nyata oleh guru. Panel guru baseline tetap memakai data latihan fiktif.

Manajemen akun berarti pengelolaan akun sendiri. Administrasi seluruh pengguna, pengangkatan guru, dan pencabutan seluruh sesi dari server memerlukan backend/admin policy dan bukan bagian branch ini.

## Pengujian dan keamanan

`npm run test:e2e` menyalakan server baseline dan satu stack khusus emulator pada port 5175. Kredensial fixture bersifat fiktif dan unik per skenario. Pengujian memanggil SDK serta endpoint Auth Emulator sesungguhnya; tidak mengganti autentikasi dengan localStorage atau mock keberhasilan form.

Skenario mencakup registrasi, verifikasi, profil, password benar/salah, hapus/batal, pemulihan sekali pakai, perubahan email terverifikasi, pemisahan dua akun dan tamu, aksesibilitas, dan ponsel. Konfigurasi produksi serta pengiriman email nyata belum diuji karena proyek produksi belum diberikan.

Audit dependency produksi tidak menemukan kerentanan saat pemeriksaan. Versi `@grpc/grpc-js` dinaikkan dalam rentang kompatibel lewat override untuk mengatasi advisory transitif. Firebase CLI tetap memiliki advisory tingkat moderate pada dependency alat development; CLI tidak masuk bundle browser. Tidak dilakukan downgrade lintas mayor atau perbaikan paksa yang belum diverifikasi.

## Rujukan resmi

- [Firebase password authentication](https://firebase.google.com/docs/auth/web/password-auth)
- [Manage users](https://firebase.google.com/docs/auth/web/manage-users)
- [Auth persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [Custom email action handlers](https://firebase.google.com/docs/auth/custom-email-handler)
- [Authentication Emulator](https://firebase.google.com/docs/emulator-suite/connect_auth)
- [Auth API reference](https://firebase.google.com/docs/reference/js/auth)
