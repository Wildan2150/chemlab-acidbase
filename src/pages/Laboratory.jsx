import { useState } from 'react';
import { phInfo, hclPh } from '../lib/chemistry.js';
import { BeakerDrawing, Icon, PhScale } from '../components/Visuals.jsx';

const samples = [
  { name: 'Sari lemon', ph: 2, description: 'Contoh asam' },
  { name: 'Kopi hitam', ph: 5, description: 'Contoh asam' },
  { name: 'Air murni', ph: 7, description: 'Netral pada 25 °C' },
  { name: 'Larutan sabun', ph: 10, description: 'Contoh basa' },
];
const decimal = (n) =>
  n.toLocaleString('id-ID', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
function Power({ exponent }) {
  return (
    <>
      10<sup>−{decimal(exponent)}</sup>
    </>
  );
}

export default function Laboratory({ progress, setPh, markLab }) {
  const [concentration, setConcentration] = useState(0.01);
  const info = phInfo(progress.ph);
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">BELAJAR LEWAT EKSPLORASI</span>
        <h1>
          Laboratorium pH<span className="greeting-dot">.</span>
        </h1>
        <p>Ubah satu nilai. Temukan hubungan yang sebelumnya tak terlihat.</p>
      </div>
      <div className="lab-layout">
        <section className="surface experiment">
          <div className="experiment-top">
            <span className="tag">
              <span className="tiny-dot" /> Simulasi interaktif
            </span>
            <span className="subtle">Suhu tetap · 25 °C</span>
          </div>
          <div className="experiment-stage">
            <div className="stage-formula">
              H₃O⁺ <span>⇌</span> OH⁻
            </div>
            <BeakerDrawing
              color={info.color}
              label={`Ilustrasi indikator: pH ${info.ph}, bersifat ${info.label}`}
            />
            <div className="stage-readout">
              <span>pH LARUTAN</span>
              <strong>{decimal(info.ph)}</strong>
              <span className="type-pill">{info.label}</span>
            </div>
          </div>
          <div className="experiment-controls">
            <div className="range-heading">
              <label htmlFor="lab-ph">Atur pH larutan</label>
              <output htmlFor="lab-ph">{decimal(info.ph)}</output>
            </div>
            <input
              className="ph-range"
              id="lab-ph"
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={info.ph}
              onChange={(e) => setPh(Number(e.target.value))}
            />
            <PhScale ph={info.ph} />
            <p className="control-hint">Geser penanda atau gunakan tombol panah pada keyboard.</p>
          </div>
          <div className="sample-heading">ATAU, JELAJAHI CONTOH SEKITARMU</div>
          <div className="sample-grid">
            {samples.map((s) => (
              <button
                key={s.name}
                className={`sample ${info.ph === s.ph ? 'selected' : ''}`}
                onClick={() => setPh(s.ph)}
              >
                <span>{s.name}</span>
                <strong>pH ≈ {s.ph}</strong>
                <small>{s.description}</small>
              </button>
            ))}
          </div>
          <p className="caption">
            Nilai bahan sehari-hari bersifat ilustratif dan dapat bervariasi. Warna menggambarkan
            indikator universal secara skematis.
          </p>
        </section>
        <aside className="lab-observations">
          <section className="surface">
            <span className="eyebrow">APA YANG TERJADI?</span>
            <h2>Di balik angka pH</h2>
            <div className="ion-stat">
              <span>[H₃O⁺] ≈</span>
              <strong>
                <Power exponent={info.ph} />
              </strong>
              <small>mol/L</small>
            </div>
            <div className="ion-stat">
              <span>[OH⁻] ≈</span>
              <strong>
                <Power exponent={info.poh} />
              </strong>
              <small>mol/L</small>
            </div>
            <div className="poh-row">
              <span>pOH</span>
              <strong>{decimal(info.poh)}</strong>
            </div>
            <p className="observation-text">
              {info.ph < 7
                ? 'H₃O⁺ lebih banyak daripada OH⁻. Larutan bersifat asam.'
                : info.ph > 7
                  ? 'OH⁻ lebih banyak daripada H₃O⁺. Larutan bersifat basa.'
                  : 'Konsentrasi H₃O⁺ dan OH⁻ sama. Larutan bersifat netral.'}
            </p>
            <p className="caption">
              Pendekatan larutan ideal encer pada 25 °C. pH ≈ −log₁₀[H₃O⁺]; pH + pOH ≈ 14.
            </p>
          </section>
          <div className="lab-challenge">
            <Icon name="bulb" size={24} />
            <h3>Tantangan kecil</h3>
            <p>
              Ubah pH 3 menjadi 5. Apakah konsentrasi H₃O⁺ bertambah atau berkurang? Berapa kali?
            </p>
            <details>
              <summary>Lihat penjelasan</summary>
              <p>Berkurang 100 kali: dari 10⁻³ menjadi 10⁻⁵ mol/L. Skala pH bersifat logaritmik.</p>
            </details>
          </div>
        </aside>
      </div>
      <section className="surface hcl-experiment">
        <div>
          <span className="eyebrow">MODEL TERBATAS · ASAM KUAT</span>
          <h2>Dari konsentrasi HCl ke pH</h2>
          <p>Pilih konsentrasi, lalu cocokkan dengan perhitunganmu.</p>
          <div className="concentration-options">
            {[0.1, 0.01, 0.001].map((c, i) => (
              <button
                key={c}
                aria-pressed={concentration === c}
                className={concentration === c ? 'selected' : ''}
                onClick={() => {
                  setConcentration(c);
                  markLab();
                }}
              >
                10<sup>−{i + 1}</sup> mol/L
              </button>
            ))}
          </div>
        </div>
        <div className="hcl-result">
          <span>pH ≈ −log₁₀({concentration.toLocaleString('id-ID')})</span>
          <strong>{hclPh(concentration)}</strong>
        </div>
        <p className="caption hcl-assumption">
          Model HCl terdisosiasi sempurna pada 25 °C; aktivitas didekati konsentrasi dan kontribusi
          air diabaikan pada rentang 10⁻¹–10⁻³ mol/L. Model ini tidak berlaku untuk seluruh asam
          atau larutan sangat encer.
        </p>
      </section>
      <div className="page-end-action">
        <p>Siap menghubungkan hasil eksplorasi dengan konsep?</p>
        <a href="#kuis" className="button primary">
          Ke kuis diagnostik
          <Icon name="arrow" size={17} />
        </a>
      </div>
    </>
  );
}
