import { readingContent, readingSources } from './readingContent.js';

export const QUESTION_VERSION = 'asam-basa-v1';

export const lessons = [
  {
    id: 'kenali',
    number: '01',
    title: 'Kenali asam & basa',
    description: 'Teori, pasangan konjugasi, dan kesetimbangan ionisasi.',
    icon: 'flask',
    color: 'peach',
    check:
      'Jika larutan menghasilkan lebih banyak OH⁻ dibandingkan H₃O⁺ pada 25 °C, apakah sifat larutannya?',
    answer: 'Basa. Hubungkan klasifikasi dengan spesies, bukan hanya nama zat.',
  },
  {
    id: 'skala',
    number: '02',
    title: 'Membaca skala pH',
    description: 'Dari aktivitas ion hingga strategi perhitungan larutan.',
    icon: 'chart',
    color: 'sage',
    check: 'Konsentrasi H₃O⁺ berkurang sepuluh kali. Ke arah mana pH berubah?',
    answer: 'pH naik satu satuan pada pendekatan larutan ideal.',
  },
  {
    id: 'kehidupan',
    number: '03',
    title: 'Kimia di sekitar kita',
    description: 'Netralisasi, hidrolisis, penyangga, dan titrasi.',
    icon: 'leaf',
    color: 'lavender',
    check: 'Apakah setiap pencampuran asam dan basa pasti menghasilkan larutan netral?',
    answer: 'Tidak. Periksa mol pereaksi, ion garam, dan suhu sebelum menyimpulkan pH akhir.',
  },
].map((lesson) => ({ ...lesson, ...readingContent[lesson.id] }));

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

export const sources = readingSources;
