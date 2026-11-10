import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.pid) continue;
    if (process.platform === 'win32')
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
        windowsHide: true,
        stdio: 'ignore',
      });
    else child.kill('SIGTERM');
  }
  process.exit(code);
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
function start(file, args, env = {}) {
  const child = spawn(process.execPath, [file, ...args], {
    cwd: project,
    stdio: 'inherit',
    windowsHide: true,
    env: { ...process.env, ...env },
  });
  children.push(child);
  child.on('error', (error) => {
    process.stderr.write(`${error.message}\n`);
    stop(1);
  });
  child.on('exit', (code) => {
    if (!stopping) stop(code || 0);
  });
  return child;
}
const cli = resolve(dirname(require.resolve('firebase-tools/package.json')), 'lib/bin/firebase.js');
start(
  cli,
  [
    'emulators:start',
    '--only',
    'auth,firestore',
    '--project',
    'demo-chemlab',
    '--config',
    'firebase.json',
  ],
  { FIREBASE_CLI_DISABLE_UPDATE_CHECK: 'true' },
);
const deadline = Date.now() + 110000;
let online = false;
while (Date.now() < deadline) {
  try {
    await fetch('http://127.0.0.1:9099/', { signal: AbortSignal.timeout(700) });
    await fetch('http://127.0.0.1:8080/', { signal: AbortSignal.timeout(700) });
    online = true;
    break;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}
if (!online) {
  process.stderr.write(
    'Auth/Firestore Emulator tidak tersedia. Periksa Java 21+ dan port 9099/8080.\n',
  );
  stop(1);
}
const vite = resolve(dirname(require.resolve('vite/package.json')), 'bin/vite.js');
start(
  vite,
  ['--host', '127.0.0.1', '--port', process.env.AUTH_APP_PORT || '5174', '--strictPort'],
  {
    VITE_FIREBASE_API_KEY: 'fake-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'demo-chemlab.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'demo-chemlab',
    VITE_FIREBASE_APP_ID: '1:123456789:web:chemlab',
    VITE_FIREBASE_USE_EMULATOR: 'true',
    VITE_FIRESTORE_DATABASE_ID: '(default)',
  },
);
