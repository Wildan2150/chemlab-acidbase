export const contextualHelp = {
  search: {
    threshold: 2,
    title: 'Coba kata kunci yang lebih singkat',
    reason: 'Dua pencarian belum menemukan materi.',
    steps: [
      'Gunakan satu konsep, misalnya pH, asam, atau netralisasi.',
      'Pencarian ini mencari materi ChemLab. Data senyawa tersedia di Eksplorasi kimia.',
    ],
    action: 'Coba kata “pH”',
  },
  quiz: {
    threshold: 2,
    title: 'Gunakan peta pertanyaan',
    reason: 'Kuis belum dapat dikumpulkan karena ada jawaban yang kosong.',
    steps: [
      'Pilih nomor bertanda “belum dijawab” pada peta pertanyaan.',
      'Pilih satu jawaban untuk tiap soal, lalu tekan Selesaikan kuis. Pembahasan terbuka setelah dikumpulkan.',
    ],
    action: 'Ke jawaban yang belum diisi',
  },
  assessment: {
    threshold: 2,
    title: 'Lengkapi jawaban lewat ringkasan',
    reason: 'Asesmen belum dapat dikumpulkan karena ada jawaban yang perlu dilengkapi.',
    steps: [
      'Gunakan peta soal atau Ringkasan jawaban untuk menemukan bagian yang kosong.',
      'Untuk jawaban angka, masukkan nilai pH tanpa satuan. Koma dan titik dapat dipakai sebagai tanda desimal.',
    ],
    action: 'Ke jawaban yang perlu dilengkapi',
  },
  'phet-start': {
    target: '[data-help="phet-controls"]',
    entryTarget: '[data-help="exploration-phet"]',
    threshold: 1,
    firstUse: true,
    title: 'Mulai pengamatan di simulasi PhET',
    reason: 'Kenali cara menggunakan aktivitas asam–basa ini.',
    steps: [
      'Tekan Buka aktivitas untuk memuat simulasi. Pada layar Introduction, bandingkan Strong Acid dan Weak Acid pada konsentrasi yang sama.',
      'Gunakan alat ukur pH dan amati partikel. Setelah itu, coba ubah konsentrasi pada layar My Solution.',
      'Catat dua kondisi yang dibandingkan di Catatan pengamatan. Gunakan Buka di tab baru jika ruang simulasi terlalu sempit.',
    ],
    action: 'Tulis prediksi pengamatan',
  },
  'phet-retry': {
    target: '[data-help="phet-retry"]',
    threshold: 2,
    title: 'Simulasi belum nyaman digunakan?',
    reason: 'Aktivitas sudah dimuat ulang beberapa kali.',
    steps: [
      'Coba Buka di tab baru untuk ruang tampilan yang lebih luas.',
      'Jika tampilan tetap tidak tersedia, lanjutkan dengan Bacaan pendamping. Muat ulang memulai simulasi lagi; catatan di ChemLab tetap ada.',
    ],
    action: 'Lihat bacaan pendamping',
  },
  'molecule-start': {
    target: '[data-help="molecule-controls"]',
    entryTarget: '[data-help="exploration-molecules"]',
    threshold: 1,
    firstUse: true,
    title: 'Amati model dari beberapa sisi',
    reason: 'Kenali cara menggunakan aktivitas model molekul ini.',
    steps: [
      'Pilih molekul, lalu tekan Buka aktivitas. Seret model untuk memutar; gunakan roda mouse atau cubit dua jari untuk memperbesar.',
      'Tombol Putar dan Perbesar di bawah model juga bisa digunakan dengan keyboard.',
      'Cocokkan atom dengan legenda warna. Bentuk satu molekul belum cukup untuk menentukan pH larutan.',
    ],
    action: 'Tulis prediksi pengamatan',
  },
  'pubchem-start': {
    target: '#compound-query',
    entryTarget: '[data-help="exploration-pubchem"]',
    threshold: 1,
    firstUse: true,
    title: 'Temukan dan periksa data senyawa',
    reason: 'Kenali cara menggunakan penelusuran PubChem.',
    steps: [
      'Masukkan nama senyawa berbahasa Inggris pada Nama senyawa, lalu tekan Cari senyawa. Kamu juga bisa memilih contoh Asam asetat, Amonia, atau Etanol.',
      'Cocokkan nama, CID, rumus, dan massa molar pada hasil pencarian. Gunakan tautan sumber untuk memeriksa identitasnya.',
      'Tuliskan temuan di Catatan pengamatan. Rumus dan massa molar saja belum menentukan pH larutan.',
    ],
    action: 'Mulai mencari senyawa',
  },
  'pubchem-search': {
    threshold: 2,
    title: 'Coba nama senyawa yang dikenal PubChem',
    reason: 'Pencarian data senyawa belum berhasil beberapa kali.',
    steps: [
      'Gunakan contoh yang tersedia, misalnya acetic acid, ammonia, atau ethanol.',
      'Periksa koneksi dan pesan pencarian. Bacaan pendamping tetap tersedia jika sumber data belum dapat dihubungi.',
    ],
  },
};
