import { useState } from 'react';
import { activities, molecules } from '../data/activities.js';
import { Icon } from '../components/Visuals.jsx';
import ExternalResource from '../components/ExternalResource.jsx';
import CompoundSearch from '../components/CompoundSearch.jsx';

export default function Exploration({ activityId, progress, updateActivity, storageOk }) {
  const activity = activities.find((a) => a.id === activityId) || activities[0];
  const notes = progress.activityNotes?.[activity.id] || {};
  const [cid, setCid] = useState(notes.cid || 176);
  const molecule = molecules.find((m) => m.cid === cid) || molecules[2];
  function saveField(field, value) {
    updateActivity(activity.id, {
      [field]: value,
      completedAt: null,
      updatedAt: new Date().toISOString(),
    });
  }
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">PREDIKSI · AMATI · JELASKAN</span>
        <h1>
          Eksplorasi kimia<span className="greeting-dot">.</span>
        </h1>
        <p>Hubungkan konsep dengan hasil pengamatan dan data dari sumber ilmiah.</p>
      </div>
      <nav className="activity-navigation" aria-label="Aktivitas eksplorasi">
        {activities.map((a) => (
          <a
            key={a.id}
            href={`#eksplorasi/${a.id}`}
            aria-current={activity.id === a.id ? 'page' : undefined}
          >
            <Icon name={a.icon} size={21} />
            <span>{a.title}</span>
            <Icon name={progress.activityNotes?.[a.id]?.completedAt ? 'done' : 'next'} size={16} />
          </a>
        ))}
      </nav>
      <section className="activity-intro surface">
        <span className="eyebrow">TUJUAN PENGAMATAN</span>
        <h2>{activity.title}</h2>
        <p>{activity.goal}</p>
        <ol>
          {activity.instructions.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <div className="exploration-layout">
        <div className="activity-content">
          {activity.id === 'molecules' && (
            <section className="surface molecule-choice">
              <label htmlFor="molecule-cid">Molekul yang diamati</label>
              <select
                id="molecule-cid"
                value={cid}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setCid(value);
                  saveField('cid', value);
                }}
              >
                {molecules.map((m) => (
                  <option key={m.cid} value={m.cid}>
                    {m.name} · CID {m.cid}
                  </option>
                ))}
              </select>
              <div className="molecule-identity">
                <strong>{molecule.formula}</strong>
                <span>{molecule.structure}</span>
                <p>{molecule.meaning}</p>
                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`}
                  className="small-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Identitas {molecule.name} di PubChem
                  <Icon name="external" size={13} />
                </a>
              </div>
              <p className="caption">
                Model stick: karbon abu-abu, hidrogen putih, oksigen merah, nitrogen biru. Model
                statis; rotasi kamera tidak mengubah sudut ikatan.
              </p>
            </section>
          )}
          {activity.id === 'pubchem' ? (
            <CompoundSearch />
          ) : (
            <ExternalResource
              key={activity.id}
              title={
                activity.id === 'phet'
                  ? 'PhET · Acid-Base Solutions'
                  : `Model 3D · ${molecule.name}`
              }
              src={
                activity.embed ||
                `https://3dmol.org/viewer.html?cid=${cid}&style=stick&backgroundcolor=0xf8f9f6`
              }
              source={activity.source}
              attribution={activity.attribution}
              license={activity.license}
            />
          )}
          <details className="activity-fallback" open>
            <summary>Bacaan pendamping</summary>
            <p>{activity.fallback}</p>
            <a
              href={
                activity.id === 'pubchem' ? 'https://pubchem.ncbi.nlm.nih.gov/' : activity.source
              }
              target="_blank"
              rel="noreferrer"
            >
              Buka sumber pembelajaran
              <Icon name="external" size={13} />
            </a>
          </details>
        </div>
        <aside className="activity-notebook surface">
          <div className="section-heading">
            <h2>Catatan pengamatan</h2>
            <Icon name="book" size={20} />
          </div>
          <p className="caption">
            Tuliskan hasilmu di sini setelah mengamati. Catatan yang kamu isi menjadi bagian dari
            progres belajar.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateActivity(activity.id, {
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }}
          >
            <label htmlFor="prediction">
              <span>01 · Prediksi</span>
              <p>{activity.prediction}</p>
            </label>
            <textarea
              id="prediction"
              maxLength="2000"
              rows="4"
              required
              value={notes.prediction || ''}
              onChange={(e) => saveField('prediction', e.target.value)}
              placeholder="Dugaan awal dan alasanmu…"
            />
            <label htmlFor="observation">
              <span>02 · Pengamatan</span>
              <p>
                Catat dua kondisi yang kamu bandingkan beserta angka, satuan, atau ciri yang
                diamati.
              </p>
            </label>
            <textarea
              id="observation"
              maxLength="2000"
              rows="5"
              required
              value={notes.observation || ''}
              onChange={(e) => saveField('observation', e.target.value)}
              placeholder="Kondisi, perubahan, dan bukti…"
            />
            <label htmlFor="explanation">
              <span>03 · Penjelasan</span>
              <p>{activity.explanation}</p>
            </label>
            <textarea
              id="explanation"
              maxLength="2000"
              rows="5"
              required
              value={notes.explanation || ''}
              onChange={(e) => saveField('explanation', e.target.value)}
              placeholder="Hubungkan hasil dengan konsep…"
            />
            <button
              className="button primary full-width"
              disabled={
                !['prediction', 'observation', 'explanation'].every((field) => notes[field]?.trim())
              }
            >
              Simpan catatan lengkap
              <Icon name="check" size={16} />
            </button>
          </form>
          <p className="notebook-status" role="status">
            {!storageOk
              ? 'Catatan tersedia selama sesi ini. Ekspor progres untuk menyimpan salinan.'
              : notes.completedAt
                ? 'Catatan lengkap tersimpan di perangkat ini.'
                : 'Draf catatan tersimpan saat kamu mengetik.'}
          </p>
        </aside>
      </div>
      <div className="page-end-action">
        <a href="#laboratorium" className="text-button">
          <Icon name="back" size={16} />
          Kembali ke laboratorium pH
        </a>
        <a href="#progres" className="button outline">
          Lihat progres & ekspor catatan
          <Icon name="arrow" size={16} />
        </a>
      </div>
    </>
  );
}
