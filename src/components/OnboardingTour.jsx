import { useState } from 'react';
import Dialog from './Dialog.jsx';
import { Icon } from './Visuals.jsx';

const steps = [
  {
    label: 'Selamat datang',
    title: 'Kenali ruang belajarmu.',
    description:
      'Pelajari asam, basa, dan pH lewat bacaan, percobaan, dan latihan. Kenali fitur ChemLab melalui tur singkat, lalu pilih jalur belajarmu sendiri.',
    features: [
      { icon: 'book', title: 'Pahami', text: 'Hubungkan konsep dengan contoh di sekitarmu.' },
      { icon: 'flask', title: 'Coba', text: 'Ubah pH dan amati apa yang terjadi.' },
      {
        icon: 'chart',
        title: 'Refleksikan',
        text: 'Gunakan hasil latihan untuk menentukan langkah berikutnya.',
      },
    ],
    tip: 'Kamu bisa langsung belajar tanpa membuat akun.',
  },
  {
    label: 'Materi belajar',
    target: '[data-tour="materi"]',
    title: 'Mulai dari konsep.',
    description:
      'Buka Materi belajar untuk membaca tiga bagian asam–basa, contoh hitung, dan refleksi. Tandai bagian yang sudah kamu pelajari agar mudah dilanjutkan.',
    tip: 'Bacaan bisa dibuka dalam urutan apa pun. Gunakan daftar isi untuk menuju konsep tertentu.',
  },
  {
    label: 'Laboratorium pH',
    target: '[data-tour="laboratorium"]',
    title: 'Ubah pH, amati ionnya.',
    description:
      'Di Laboratorium pH, geser nilai pH atau pilih contoh larutan. Bandingkan angka pH dengan konsentrasi ion H₃O⁺ dan OH⁻.',
    tip: 'Angka dan klasifikasi larutan mendampingi perubahan warna. Perhatikan juga asumsi modelnya.',
  },
  {
    label: 'Eksplorasi kimia',
    target: '[data-tour="eksplorasi"]',
    title: 'Coba simulasi dan model.',
    description:
      'Buka Eksplorasi kimia untuk mencoba simulasi PhET, memutar model molekul 3D, dan menelusuri data senyawa di PubChem.',
    tip: 'Tekan Buka aktivitas untuk memulai simulasi. Petunjuk fitur ini membantumu mencoba kontrol dan menulis catatan pengamatan.',
  },
  {
    label: 'Kuis diagnostik',
    target: '[data-tour="kuis"]',
    title: 'Kenali pemahaman awalmu.',
    description:
      'Kuis diagnostik · sebelum belajar: jawab lima soal dengan pemahamanmu saat ini. Pembahasan tersedia setelah seluruh jawaban dikumpulkan.',
    tip: 'Hasil diagnostik awal tetap tersimpan saat kamu memulai latihan ulang.',
  },
  {
    label: 'Asesmen akhir bab',
    target: '[data-tour="asesmen"]',
    title: 'Tinjau pemahaman setelah belajar.',
    description:
      'Asesmen akhir bab · setelah belajar: kerjakan lima belas soal, tinjau hasil per konsep, lalu pilih materi yang perlu dipelajari kembali.',
    tip: 'Jawaban yang belum dikumpulkan disimpan sebagai draf agar bisa dilanjutkan.',
  },
  {
    label: 'Progres saya',
    target: '[data-tour="progres"]',
    title: 'Perjalananmu tercatat.',
    description:
      'Buka Progres saya untuk melihat materi yang sudah dipelajari, riwayat latihan, dan hasil asesmen. Gunakan Ekspor progres untuk menyimpan salinan catatan.',
  },
];

export default function OnboardingTour({ onDismiss, returnFocusRef, signedIn, storageOk }) {
  const [position, setPosition] = useState(0);
  const step = steps[position];
  const last = position === steps.length - 1;

  return (
    <Dialog
      title={step.title}
      className="onboarding-dialog"
      onClose={() => onDismiss('skipped')}
      focusTitle
      returnFocusRef={returnFocusRef}
      spotlight={step.target || null}
    >
      <div className="onboarding-progress">
        <p>
          Tur fitur <span>·</span> Langkah {position + 1} dari {steps.length}
        </p>
        <div className="onboarding-segments" aria-hidden="true">
          {steps.map((item, index) => (
            <span key={item.label} className={index <= position ? 'is-complete' : ''} />
          ))}
        </div>
      </div>
      <p className="onboarding-description">{step.description}</p>
      {step.features && (
        <ul className="onboarding-features">
          {step.features.map((feature) => (
            <li key={feature.title}>
              <span className="onboarding-feature-icon">
                <Icon name={feature.icon} size={23} />
              </span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="onboarding-tip">
        <Icon name="bulb" size={19} />
        <p>
          {!storageOk
            ? 'Penyimpanan browser tidak tersedia. Catatan hanya bertahan selama sesi ini; ekspor progres sebelum menutup aplikasi.'
            : last
              ? signedIn
                ? 'Progres akun disinkronkan saat terhubung. Periksa status simpan sebelum berganti perangkat.'
                : 'Progres tamu tersimpan di browser ini. Masuk untuk belajar dengan progres akun di perangkat lain; catatan tamu tetap terpisah.'
              : step.tip}
        </p>
      </div>
      <p className="onboarding-replay-hint">
        Tur ini bisa dibuka lagi lewat tombol “Tur fitur” di bagian atas.
      </p>
      <div className="onboarding-actions">
        <button className="onboarding-skip" onClick={() => onDismiss('skipped')}>
          Lewati tur
        </button>
        <div>
          {position > 0 && (
            <button className="button outline" onClick={() => setPosition(position - 1)}>
              <Icon name="back" size={16} />
              Kembali
            </button>
          )}
          <button
            className="button primary"
            onClick={() => (last ? onDismiss('completed') : setPosition(position + 1))}
          >
            {last ? 'Siap bereksplorasi' : 'Lanjut'}
            <Icon name={last ? 'check' : 'arrow'} size={17} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}
