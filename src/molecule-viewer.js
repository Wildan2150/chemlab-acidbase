import { molecules } from './data/molecules.js';

const cid = Number(new URLSearchParams(location.search).get('cid'));
const molecule = molecules.find((item) => item.cid === cid);
const container = document.querySelector('#molecule');
const message = document.querySelector('#message');
let viewer;
let ready = false;
let initialView;
let fittedWidth = 0;
let fittedHeight = 0;

function fitToContainer() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height || (width === fittedWidth && height === fittedHeight)) return;
  fittedWidth = width;
  fittedHeight = height;
  viewer.resize();
  viewer.zoomTo();
  // zoomTo fits the vertical field of view; a narrow portrait canvas needs extra distance.
  viewer.zoom(Math.min(1, width / height) * 0.9);
  const fitted = viewer.getView();
  initialView = initialView ? [...fitted.slice(0, 4), ...initialView.slice(4)] : fitted;
  viewer.render();
}

function report(state, detail = {}) {
  window.parent.postMessage({ type: 'chemlab:molecule', cid, state, ...detail }, location.origin);
}

function fail(reason) {
  ready = false;
  container.style.visibility = 'hidden';
  message.hidden = false;
  message.textContent = reason;
  report('error', { message: reason });
}

try {
  if (!molecule) throw new Error('Molekul yang dipilih tidak tersedia.');
  const module = await import('3dmol/build/3Dmol.js');
  const $3Dmol = module.default || module;
  try {
    viewer = $3Dmol.createViewer(container, { backgroundColor: '#f8f9f6', antialias: true });
    if (!viewer) throw new Error('WebGL unavailable');
  } catch {
    throw new Error('WebGL tidak tersedia. Aktifkan akselerasi grafis atau gunakan browser lain.');
  }
  const graphics = viewer.getRenderer().getContext();
  graphics.canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    fail('Tampilan 3D terhenti. Muat ulang model untuk melanjutkan pengamatan.');
  });
  const response = await fetch(`./molecules/${cid}.sdf`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Berkas struktur belum dapat dimuat. Coba muat ulang model.');
  const sdf = await response.text();
  if (!sdf.includes('V2000') || !sdf.includes('M  END') || Number(sdf.split('\n')[0]) !== cid)
    throw new Error('Berkas struktur tidak sesuai dengan molekul yang dipilih.');
  const model = viewer.addModel(sdf, 'sdf', { keepH: true });
  const atoms = model.selectedAtoms({});
  const composition = Object.fromEntries(
    [...new Set(atoms.map((atom) => atom.elem))].map((elem) => [
      elem,
      atoms.filter((atom) => atom.elem === elem).length,
    ]),
  );
  if (
    atoms.length !== molecule.atomCount ||
    atoms.some((atom) => ![atom.x, atom.y, atom.z].every(Number.isFinite)) ||
    Object.keys({ ...composition, ...molecule.elements }).some(
      (elem) => composition[elem] !== molecule.elements[elem],
    )
  )
    throw new Error('Struktur molekul tidak lengkap. Coba muat ulang model.');

  viewer.setStyle(
    {},
    {
      stick: { radius: 0.17, colorscheme: 'Jmol' },
      sphere: { scale: 0.28, colorscheme: 'Jmol' },
    },
  );
  fitToContainer();
  if (graphics.isContextLost())
    throw new Error('Tampilan 3D terhenti. Muat ulang model untuk melanjutkan pengamatan.');
  viewer.getCanvas().setAttribute('aria-hidden', 'true');
  container.setAttribute(
    'aria-label',
    `Model 3D ${molecule.name}, ${atoms.length} atom. ${molecule.structure}.`,
  );
  document.title = `Model 3D ${molecule.name} · ChemLab`;
  message.hidden = true;
  ready = true;
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => {
      if (ready) fitToContainer();
    }).observe(container);
  } else {
    window.addEventListener('resize', () => {
      if (ready) fitToContainer();
    });
  }
  report('ready', { atoms: atoms.length });
} catch (error) {
  fail(
    error.message?.startsWith('Failed to fetch') || error.name === 'TimeoutError'
      ? 'Model belum dapat dimuat. Periksa koneksi lalu coba muat ulang.'
      : error.message || 'Model 3D belum dapat ditampilkan. Coba muat ulang.',
  );
}

window.addEventListener('message', (event) => {
  if (
    event.origin !== location.origin ||
    event.source !== window.parent ||
    event.data?.type !== 'chemlab:molecule-control' ||
    !ready
  )
    return;
  const actions = {
    left: () => viewer.rotate(-15, 'y'),
    right: () => viewer.rotate(15, 'y'),
    up: () => viewer.rotate(-15, 'x'),
    down: () => viewer.rotate(15, 'x'),
    in: () => viewer.zoom(1.2),
    out: () => viewer.zoom(1 / 1.2),
    reset: () => {
      viewer.setView(initialView);
    },
  };
  actions[event.data.action]?.();
  viewer.render();
});
