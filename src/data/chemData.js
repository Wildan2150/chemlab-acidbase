export const QUESTION_VERSION = 'asam-basa-v1';

export const lessons = [
  {
    id: 'kenali',
    number: '01',
    title: 'Kenali asam & basa',
    duration: '4 menit',
    description: 'Dua sifat larutan yang dekat dengan keseharian kita.',
    icon: 'flask',
    color: 'peach',
    objective: 'Membedakan asam dan basa berdasarkan ion yang dihasilkan dalam air.',
    sections: [
      {
        title: 'Mulai dari partikel',
        body: 'Dalam pengertian Arrhenius, asam meningkatkan konsentrasi ion hidronium (H₃O⁺) di dalam air. Basa meningkatkan konsentrasi ion hidroksida (OH⁻). Ion H⁺ dalam persamaan sederhana merupakan singkatan untuk proton yang terhidrasi dalam air.',
        formula: 'HCl + H₂O → H₃O⁺ + Cl⁻',
      },
      {
        title: 'Lalu, bagaimana dengan basa?',
        body: 'Natrium hidroksida terdisosiasi menjadi ion Na⁺ dan OH⁻ dalam air. Keberadaan OH⁻ menjelaskan sifat basa larutannya.',
        formula: 'NaOH → Na⁺ + OH⁻',
      },
      {
        title: 'Kuat tidak sama dengan pekat',
        body: 'Kekuatan asam berkaitan dengan derajat ionisasi pada kondisi tertentu. Konsentrasi menyatakan banyaknya zat per volume larutan. Asam kuat dapat dibuat encer; asam lemah dapat dibuat lebih pekat.',
        callout:
          'HCl adalah asam kuat, sedangkan CH₃COOH adalah asam lemah. Nilai pH keduanya tetap bergantung pada konsentrasi serta kesetimbangannya.',
      },
    ],
    check:
      'Jika larutan menghasilkan lebih banyak OH⁻ dibandingkan H₃O⁺, apakah larutan itu bersifat asam atau basa?',
    answer: 'Basa. Pada 25 °C, larutan ini mempunyai pH di atas 7.',
  },
  {
    id: 'skala',
    number: '02',
    title: 'Membaca skala pH',
    duration: '6 menit',
    description: 'Pahami mengapa satu angka bisa berarti sepuluh kali.',
    icon: 'chart',
    color: 'sage',
    objective:
      'Menghubungkan pH dengan konsentrasi H₃O⁺ menggunakan pendekatan larutan ideal encer.',
    sections: [
      {
        title: 'Sebuah skala logaritmik',
        body: 'pH didefinisikan dari aktivitas ion hidrogen. Untuk larutan ideal encer, aktivitas dapat didekati dengan konsentrasi relatif terhadap keadaan standar 1 mol/L. Pada pendekatan ini kita memakai persamaan berikut, dengan [H₃O⁺] dinyatakan dalam mol/L.',
        formula: 'pH ≈ −log₁₀[H₃O⁺]',
      },
      {
        title: 'Selisih satu, berbeda sepuluh kali',
        body: 'Larutan dengan pH 3 mempunyai konsentrasi H₃O⁺ sekitar 100 kali larutan dengan pH 5 pada pendekatan ideal. Selisih dua satuan berarti 10², bukan dua kali.',
        formula: '10⁻³ / 10⁻⁵ = 10² = 100',
      },
      {
        title: 'Titik netral dan suhu',
        body: 'Pada 25 °C, larutan netral memiliki [H₃O⁺] = [OH⁻] dan pH sekitar 7. Larutan asam memiliki pH di bawah 7, sedangkan basa di atas 7. pH netral berubah dengan suhu.',
        formula: 'pH + pOH ≈ 14,00  (25 °C)',
        callout:
          'Rentang 0–14 adalah rentang belajar yang umum. Nilai pH nyata dapat berada di luar rentang ini. Warna indikator merupakan ilustrasi.',
      },
    ],
    check: 'Konsentrasi H₃O⁺ berkurang sepuluh kali. Ke arah mana pH berubah?',
    answer:
      'pH naik satu satuan pada pendekatan larutan ideal. Contohnya, 10⁻² menjadi 10⁻³ mol/L: pH 2 menjadi pH 3.',
  },
  {
    id: 'kehidupan',
    number: '03',
    title: 'Kimia di sekitar kita',
    duration: '5 menit',
    description: 'Hubungkan konsep, contoh, dan reaksi netralisasi.',
    icon: 'leaf',
    color: 'lavender',
    objective:
      'Menafsirkan contoh larutan dan netralisasi tanpa menyamakan pH dengan kekuatan asam.',
    sections: [
      {
        title: 'Contoh yang mudah dikenali',
        body: 'Sari lemon cenderung asam, sedangkan larutan sabun tertentu bersifat basa. Nilai pH bahan sehari-hari bergantung pada komposisi, konsentrasi, dan kondisi pengukuran. Contoh pH di laboratorium virtual merupakan nilai ilustratif.',
      },
      {
        title: 'Ketika asam bertemu basa',
        body: 'Ion hidronium bereaksi dengan ion hidroksida membentuk air. Pencampuran jumlah mol yang sama dari HCl dan NaOH pada 25 °C menghasilkan larutan NaCl dengan pH mendekati 7 dalam pendekatan ideal.',
        formula: 'H₃O⁺ + OH⁻ → 2H₂O',
      },
      {
        title: 'Jangan buru-buru menyimpulkan',
        body: 'Tidak semua pencampuran asam dan basa menghasilkan pH 7. Pereaksi yang berlebih, kekuatan asam/basa, dan hidrolisis ion garam dapat memengaruhi pH akhir.',
        callout:
          'Gunakan indikator atau alat ukur untuk mengenali sifat larutan. Jangan mengecap atau menyentuh bahan untuk menguji sifat asam–basanya.',
      },
    ],
    check: 'Apakah setiap pencampuran asam dan basa pasti menghasilkan larutan netral?',
    answer:
      'Tidak. Contoh netral dalam materi ini dibatasi pada HCl dan NaOH dengan jumlah mol yang sama pada 25 °C.',
  },
];

export const questions = [
  {
    id: 'q1',
    concept: 'Konsep Arrhenius',
    objective: 'Mengenali ion penentu sifat asam.',
    text: 'Saat HCl dilarutkan dalam air, ion manakah yang peningkatannya menjelaskan sifat asam larutan?',
    options: ['OH⁻', 'H₃O⁺', 'Na⁺', 'Cl⁻ saja'],
    correct: 1,
    explanation:
      'HCl memberikan proton kepada H₂O sehingga terbentuk H₃O⁺. Peningkatan H₃O⁺ menjelaskan sifat asam larutan.',
    followUp: 'Tinjau persamaan ionisasi HCl dan identifikasi ion hidronium.',
  },
  {
    id: 'q2',
    concept: 'Skala logaritmik',
    objective: 'Membandingkan konsentrasi H₃O⁺ dari dua pH.',
    text: 'Pada pendekatan ideal, [H₃O⁺] larutan berpH 3 dibandingkan larutan berpH 5 adalah…',
    options: ['2 kali lebih besar', '100 kali lebih kecil', '100 kali lebih besar', 'Sama besar'],
    correct: 2,
    explanation:
      'Perbandingannya 10⁻³ / 10⁻⁵ = 10² = 100. pH yang lebih rendah menunjukkan konsentrasi H₃O⁺ yang lebih tinggi.',
    followUp: 'Bandingkan pH 3 dan 5 di laboratorium; perhatikan perubahan pangkat sepuluh.',
  },
  {
    id: 'q3',
    concept: 'Perhitungan pH',
    objective: 'Menghitung pH asam kuat pada model terbatas.',
    text: 'HCl 0,001 mol/L terdisosiasi sempurna pada 25 °C. Dengan aktivitas didekati konsentrasi dan kontribusi air diabaikan, pH-nya sekitar…',
    options: ['3', '1', '11', '0,001'],
    correct: 0,
    explanation:
      '[H₃O⁺] ≈ 10⁻³ mol/L, sehingga pH ≈ −log₁₀(10⁻³) = 3. Pendekatan ini sesuai untuk rentang model HCl pada soal.',
    followUp: 'Coba model HCl pada tiga konsentrasi: 10⁻¹, 10⁻², dan 10⁻³ mol/L.',
  },
  {
    id: 'q4',
    concept: 'Kekuatan & konsentrasi',
    objective: 'Membedakan derajat ionisasi dari konsentrasi.',
    text: 'Pernyataan manakah yang tepat tentang asam kuat dan asam lemah?',
    options: [
      'Asam kuat selalu lebih pekat',
      'Asam lemah tidak menghasilkan H₃O⁺',
      'Semua asam kuat selalu memiliki pH 1',
      'Kekuatan berkaitan dengan ionisasi, sedangkan konsentrasi dengan banyaknya zat per volume',
    ],
    correct: 3,
    explanation:
      'Kuat/lemah menjelaskan perilaku ionisasi, sedangkan pekat/encer menjelaskan konsentrasi. Keduanya merupakan konsep yang berbeda.',
    followUp:
      'Kembali ke bagian “Kuat tidak sama dengan pekat” dan buat satu contoh asam kuat yang encer.',
  },
  {
    id: 'q5',
    concept: 'Netralisasi',
    objective: 'Menafsirkan netralisasi dengan asumsi yang jelas.',
    text: 'HCl dan NaOH dicampur dengan jumlah mol yang sama pada 25 °C. Pada pendekatan ideal, sifat larutan akhirnya adalah…',
    options: [
      'Asam karena HCl adalah asam kuat',
      'Basa karena NaOH adalah basa kuat',
      'Mendekati netral karena H₃O⁺ dan OH⁻ bereaksi membentuk air',
      'Selalu berpH 14',
    ],
    correct: 2,
    explanation:
      'Jumlah mol H₃O⁺ dan OH⁻ setara dan saling bereaksi. NaCl yang terbentuk tidak mengalami hidrolisis bermakna; pada 25 °C pH mendekati 7.',
    followUp: 'Tulis reaksi ionik neto lalu periksa apakah ada pereaksi berlebih.',
  },
];

// Seluruh identitas dan hasil berikut fiktif. Satu percobaan awal per siswa.
export const demoStudents = [
  { code: 'KIM-01', name: 'Siswa 01', answers: { q1: 1, q2: 0, q3: 0, q4: 3, q5: 2 } },
  { code: 'KIM-02', name: 'Siswa 02', answers: { q1: 1, q2: 2, q3: 0, q4: 0, q5: 2 } },
  { code: 'KIM-03', name: 'Siswa 03', answers: { q1: 0, q2: 0, q3: 2, q4: 3, q5: 2 } },
  { code: 'KIM-04', name: 'Siswa 04', answers: { q1: 1, q2: 2, q3: 0, q4: 3, q5: 2 } },
  { code: 'KIM-05', name: 'Siswa 05', answers: { q1: 1, q2: 1, q3: 0, q4: 0, q5: 0 } },
  { code: 'KIM-06', name: 'Siswa 06', answers: { q1: 1, q2: 2, q3: 0, q4: 3, q5: 0 } },
];

export const sources = [
  {
    title: 'OpenStax Chemistry 2e · 14.1 Brønsted–Lowry Acids and Bases',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-1-bronsted-lowry-acids-and-bases',
  },
  {
    title: 'OpenStax Chemistry 2e · 14.2 pH and pOH',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh',
  },
  {
    title: 'OpenStax Chemistry 2e · 14.3 Relative Strengths of Acids and Bases',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases',
  },
];
