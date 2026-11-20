# Desain Teknis Ringan — ChemLab

Isian DESAIN_TEKNIS mengikuti Lampiran A. Kebutuhan pada [PRD](PRD.md) diterjemahkan menjadi berkas, navigasi, aliran data, dan perilaku di bawah; urutan tindakannya ada di [USER_FLOW.md](USER_FLOW.md).

## Struktur berkas aktual

| Isian pada handout | Penerapan pada ChemLab |
| --- | --- |
| Komponen beranda | `src/pages/Home.jsx`; dihubungkan oleh `src/App.jsx` |
| Komponen materi/detail | `src/pages/Materials.jsx`; metadata `src/data/chemData.js`, isi/sumber `src/data/readingContent.js` |
| Komponen kuis/pembahasan | `src/pages/Quiz.jsx`; soal pada `chemData.js`, penilaian `src/lib/chemistry.js` |
| Data lokal/fallback | `src/lib/storage.js` untuk validasi/simpan progres; `src/lib/activityNotes.js` untuk catatan; materi dan hitungan tidak bergantung pada fetch layanan luar |
| Layanan autentikasi, penyimpanan hasil, antrean, dan panel guru | `src/services/firebaseClient.js`, `account.js`, `firestoreProgress.js`, `teacherData.js`; controller `src/lib/progressSession.js`, hook `src/hooks/useLearningProgress.js`; laporan `src/lib/teacherReport.js` |
| Gaya/CSS | `src/styles.css`, `src/styles-pages.css`; CSS Variables untuk tema/tinggi header; ikon Lucide, font Plus Jakarta Sans, SVG lokal |

Berkas fitur khas: `src/pages/Laboratory.jsx` untuk lab; `src/pages/ChapterAssessment.jsx` dan `src/lib/chapterAssessment.js` untuk asesmen; `src/pages/Exploration.jsx` untuk PhET/molekul/PubChem. Instrumen/aktivitas/katalog tetap terpisah di `src/data/`. Komponen reusable, dialog, viewer, tur, dan bantuan berada di `src/components/`.

Contoh yang dapat ditelusuri: PRD meminta siswa membandingkan konsentrasi pada skala pH → `Laboratory.jsx` menangani input → `phInfo` pada `chemistry.js` menghitung `10 ** -ph` → angka dan klasifikasi diperbarui → q2 pada `chemData.js` memeriksa penalaran → panel guru menggunakan jawaban q2 untuk rekap. Ini penerapan pemisahan data, tampilan, dan logika pada handout.

## Navigasi

- Model: **hash routing** melalui `src/App.jsx`; tidak memasang router tambahan untuk contoh ini.
- ID Modul 1: satu materi Asam–Basa dan pH, dengan ID bacaan `kenali`, `skala`, dan `kehidupan`.
- Pemetaan ID ke halaman/data: `#materi/kenali`, `#materi/skala`, `#materi/kehidupan` membuka data bacaan yang bersesuaian; `#laboratorium`, `#kuis`, `#asesmen`, `#eksplorasi`, dan `#progres` membuka aktivitas.
- Akun/guru: `#masuk`, `#daftar`, `#akun`, dan `#guru`; pemeriksaan UI dan Rules tetap diperlukan meskipun rute dapat diketik langsung.
- Kebutuhan rewrite host: tidak memerlukan rewrite history untuk rute hash; tetap uji buka langsung/refresh pada URL rilis.
- Build: Vite memakai `base: './'` dan entry `index.html` serta `molecule-viewer.html`. Dokumen viewer dan aset struktur harus ikut pada hosting.

## Alur data

- Konten/soal: `src/data` → halaman/komponen. Diagnostik memakai `QUESTION_VERSION = asam-basa-v1`; asesmen mempunyai versi/snapshot instrumen sendiri.
- Jawaban: input siswa → state React → draf/riwayat lokal identitas aktif. Pada akun, perubahan masuk antrean UID → baca server → transaksi Firestore → konfirmasi.
- Hasil diterima: `learningProgress/{UID}` dan `learnerProfiles/{UID}` → normalisasi laporan → riwayat siswa/panel guru → interpretasi/tindak lanjut.
- Namespace penyimpanan: `chemlab:guest:v1` untuk tamu, `chemlab:user:<UID>:v1` untuk salinan akun, dan `chemlab:sync:<UID>:v1` untuk antrean/base sinkronisasi. Aktivitas dibedakan dalam payload, bukan key terpisah per soal.
- Draf/progres lintas perangkat: keputusan ChemLab menyinkronkan seluruh progres akun, termasuk draf, asesmen, dan catatan; tamu tetap lokal. Saat UID berubah, sesi belajar di-remount sebelum memuat/menulis progres identitas baru.
- Profil/email/password: operasi akun lewat Firebase SDK. Password tidak masuk objek progres; nama/email pemilik disimpan pada profil Firestore untuk laporan guru.

```text
materi/soal lokal -> komponen -> jawaban -> state -> storage tamu/UID
                                                     |
                                    akun: antrean UID -> transaksi
                                                           |
                                                    progres Firestore
                                                           |
                                      riwayat siswa <-+-> panel guru
```

## Perilaku yang dijaga

- Aturan hitung skor dan arti selesai: diagnostik lengkap lima butir, skor jumlah benar × 20; asesmen jumlah benar/15 × 100 dibulatkan, dengan toleransi angka ±0,03. Persentase progres menghitung tiga bacaan, satu lab, dan satu kuis; bukan penguasaan konsep.
- Pembacaan progres saat halaman dibuka: validasi lokal; untuk akun, baca server sebelum menulis. ID percobaan stabil, hasil terkumpul terpisah dari draf/ulang, dan antrean tidak berpindah UID.
- Reset dan batal reset: batal menjaga data; konfirmasi hanya mengubah identitas aktif. Tamu lokal, akun juga mengirim reset cloud dengan generasi baru; data lama dari perangkat offline tidak menghidupkan hasil sebelum reset.
- Loading/kosong/gagal/fallback: status cloud membedakan memuat/menunggu/tersimpan/gagal; panel kosong tidak diisi hasil fiktif. Storage gagal mempunyai penjelasan/ekspor; sumber luar mempunyai alternatif.
- Akses keyboard dan struktur heading: HTML semantik, radio/range native, fokus terlihat, dialog dengan Escape/pengembalian fokus, label/angka mendampingi warna, materi/tabel tetap terbaca pada ponsel.
- Akun guru: email terverifikasi yang ditetapkan pada UI dan token Rules; guru membaca siswa tanpa menulis hasilnya. Sesi pembacaan kelas memakai cache memori terpisah yang dibuang saat panel ditutup.
- Tur/bantuan: preferensi `chemlab:onboarding:v1` dan `chemlab:contextual-help:v1` terpisah dari data belajar. Petunjuk pertama tiap tab menunggu sambutan, bukan kuota kendala; ulang petunjuk tidak mereset progres. Detail pada [ONBOARDING.md](docs/ONBOARDING.md).

## Keputusan dan risiko

| Pilihan | Alasan | Bukti/hasil uji | Keterbatasan |
| --- | --- | --- | --- |
| React/Vite, JavaScript dan CSS biasa | Mengikuti stack handout dan memudahkan menemukan data, komponen, state/event | Build dan uji logika tercatat pada TESTING | Tidak mengharuskan arsitektur tambahan pada proyek pemula |
| Hash dan aset lokal | Memudahkan hosting statis serta mengurangi ketergantungan viewer pada CDN | Preview/rute langsung dan katalog diperiksa | PhET, PubChem dan Firebase tetap memakai layanan luar |
| Snapshot progres per UID | Memulihkan seluruh pekerjaan akun dan menggabungkan perubahan perangkat | Suite Firestore memeriksa baca sebelum tulis, offline, penggabungan/reset | Payload 850.000 byte; belum ada arsip riwayat tanpa batas atau validasi skor server |
| Satu guru untuk seluruh akun siswa aplikasi | Memperlihatkan alur siswa–guru tanpa panel administrasi banyak kelas | Suite akses guru/siswa/tamu lulus | Belum ada daftar anggota kelas; profil juga memuat email |
| Snapshot instrumen asesmen | Menjaga penafsiran hasil akhir bab setelah bank berubah | Uji pemulihan/penilaian dari snapshot lulus | Diagnostik masih memerlukan rancangan arsip/migrasi sebelum versi diganti |
| Model pH ideal pada 25 °C | Membatasi perhitungan agar asumsi dapat dijelaskan | pH, HCl dan contoh hitung acuan diuji | pH 0–14 rentang eksplorasi; bukan batas mutlak. HCl hanya 0,1/0,01/0,001 mol/L; bukan model asam lemah/sangat encer |
| Tur dan viewer terpisah | Menjaga bantuan dan WebGL tidak mengubah progres atau membebani pembukaan awal viewer | Riwayat uji onboarding, struktur tergambar, dan ponsel tersedia | Efektivitas bantuan tetap memerlukan uji pengguna |

Target awal JavaScript ≤200 KB gzip perlu dievaluasi terhadap entry utama 301,45 KB gzip pada build 20 November; chunk 3Dmol terpisah 164,02 KB gzip dan CSS 22,02 KB gzip. Target LCP p75 ≤2.500 ms, INP p75 ≤200 ms, CLS p75 ≤0,1, serta Lighthouse aksesibilitas ≥95/performa ≥90 belum diukur sebagai hasil lapangan. Pemeriksaan otomatis WCAG bukan sertifikasi penuh; validasi manusia dan ponsel fisik tetap tercatat terpisah pada [TESTING.md](TESTING.md).
