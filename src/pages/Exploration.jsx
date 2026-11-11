import { useEffect, useRef, useState } from 'react';
import { activities, molecules } from '../data/activities.js';
import { Icon } from '../components/Visuals.jsx';
import ExternalResource from '../components/ExternalResource.jsx';
import CompoundSearch from '../components/CompoundSearch.jsx';
import MoleculeViewer from '../components/MoleculeViewer.jsx';
import MoleculeChooser from '../components/MoleculeChooser.jsx';
import ContextualHint from '../components/ContextualHint.jsx';
import { useContextualHelp } from '../contexts/ContextualHelpContext.jsx';

export default function Exploration({
  activityId,
  progress,
  updateActivity,
  storageOk,
  onboardingReady,
}) {
  const help = useContextualHelp();
  const helpButtonRef = useRef(null);
  const fallbackRef = useRef(null);
  const activity = activities.find((a) => a.id === activityId) || activities[0];
  const notes = progress.activityNotes?.[activity.id] || {};
  const [cid, setCid] = useState(notes.cid || 176);
  const molecule = molecules.find((m) => m.cid === cid) || molecules[2];
  const helpTopic =
    activity.id === 'phet'
      ? 'phet-start'
      : activity.id === 'molecules'
        ? 'molecule-start'
        : 'pubchem-start';
  useEffect(() => {
    if (onboardingReady) help.signal(helpTopic, undefined, { entry: true });
  }, [onboardingReady, helpTopic, help.signal]);
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
            data-help={`exploration-${a.id}`}
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
        <button className="button outline" ref={helpButtonRef} onClick={() => help.show(helpTopic)}>
          <Icon name="help" size={18} />
          Petunjuk fitur ini
        </button>
      </section>
      <div className="exploration-layout">
        <div className="activity-content">
          {onboardingReady && (
            <ContextualHint
              topic={helpTopic}
              onAction={
                activity.id === 'pubchem'
                  ? () => document.getElementById('compound-query')?.focus()
                  : () => document.getElementById('prediction')?.focus()
              }
              onReturnFocus={() => helpButtonRef.current?.focus()}
            />
          )}
          {onboardingReady && activity.id === 'pubchem' && (
            <ContextualHint
              topic="pubchem-search"
              onReturnFocus={() => document.getElementById('compound-query')?.focus()}
            />
          )}
          {onboardingReady && activity.id === 'phet' && (
            <ContextualHint
              topic="phet-retry"
              onAction={() => {
                fallbackRef.current.open = true;
                fallbackRef.current.focus();
              }}
              onReturnFocus={() => helpButtonRef.current?.focus()}
            />
          )}
          {activity.id === 'molecules' && (
            <section className="surface molecule-choice">
              <MoleculeChooser
                cid={cid}
                onChange={(value) => {
                  setCid(value);
                  saveField('cid', value);
                }}
              />
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
                Model bola dan batang: karbon abu-abu, hidrogen putih, oksigen merah, nitrogen biru,
                sulfur kuning, fosfor jingga, klor hijau. Rotasi kamera tidak mengubah sudut ikatan.
                Model menunjukkan satu molekul, bukan seluruh spesies dalam larutan.
              </p>
            </section>
          )}
          {activity.id === 'pubchem' ? (
            <CompoundSearch />
          ) : activity.id === 'molecules' ? (
            <MoleculeViewer
              molecule={molecule}
              source={activity.source}
              attribution={activity.attribution}
            />
          ) : (
            <ExternalResource
              key={activity.id}
              title="PhET · Acid-Base Solutions"
              src={activity.embed}
              source={activity.source}
              attribution={activity.attribution}
              license={activity.license}
            />
          )}
          <details className="activity-fallback" ref={fallbackRef} tabIndex={-1} open>
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
