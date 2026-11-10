import { emptyProgress, accountProgressKey, saveProgress } from './storage.js';
import { decodeProgressDocument, progressSyncError, progressSyncKey } from './progressDocument.js';
import { mergeProgress, sameProgress } from './progressMerge.js';

export class ProgressSession {
  constructor({
    uid,
    initial,
    storage,
    adapter,
    onProgress,
    onStatus,
    online = () => true,
    delay = 700,
  }) {
    Object.assign(this, { uid, storage, adapter, onProgress, onStatus, online, delay });
    this.progress = initial;
    this.initial = initial;
    this.base = null;
    this.dirty = false;
    this.resetId = null;
    this.version = 0;
    this.loaded = false;
    this.disposed = false;
    this.suspended = false;
    this.backoff = 2000;
    try {
      const cached = JSON.parse(storage?.getItem(progressSyncKey(uid)) || 'null');
      if (cached?.version === 1) {
        const decode = (data) =>
          decodeProgressDocument({
            version: 1,
            revision: 1,
            resetId: 'cache',
            deleted: false,
            payload: JSON.stringify(data),
          }).data;
        this.base = cached.base ? { ...cached.base, data: decode(cached.base.data) } : null;
        if (cached.initial) this.initial = decode(cached.initial);
        if (cached.dirty) {
          this.progress = decode(cached.progress);
          this.dirty = true;
          this.resetId = typeof cached.resetId === 'string' ? cached.resetId : null;
        }
      }
    } catch {
      /* A damaged sync cache must not erase the regular local progress. */
    }
  }

  status(state, message = '') {
    if (!this.disposed) this.onStatus({ state, message, ready: this.loaded });
  }

  persist() {
    try {
      saveProgress(this.storage, this.progress, accountProgressKey(this.uid));
      this.storage?.setItem(
        progressSyncKey(this.uid),
        JSON.stringify({
          version: 1,
          base: this.base,
          initial: this.initial,
          progress: this.progress,
          dirty: this.dirty,
          resetId: this.resetId,
        }),
      );
    } catch {
      /* The UI still offers export when browser storage is unavailable. */
    }
  }

  publish() {
    this.persist();
    if (!this.disposed) this.onProgress(this.progress);
  }

  start() {
    if (this.disposed || this.suspended) return;
    this.unsubscribe?.();
    clearTimeout(this.readTimer);
    this.status(this.online() ? 'loading' : 'offline');
    this.readTimer = setTimeout(() => {
      if (!this.loaded)
        this.status(
          'offline',
          'Penyimpanan akun belum dapat dihubungi. Kamu dapat melanjutkan belajar dan mencoba sinkronisasi kembali.',
        );
    }, 8000);
    this.unsubscribe = this.adapter.watch(
      this.uid,
      (remote) => this.receive(remote),
      (error) => this.fail(error),
      () => {
        if (this.loaded || !this.online()) this.status('offline');
      },
    );
  }

  receive(remote) {
    if (this.disposed || this.suspended) return;
    clearTimeout(this.readTimer);
    if (remote?.deleted) {
      this.suspended = true;
      clearTimeout(this.timer);
      this.progress = emptyProgress();
      this.dirty = false;
      this.base = null;
      this.onProgress(this.progress);
      try {
        this.storage?.removeItem(progressSyncKey(this.uid));
        this.storage?.removeItem(accountProgressKey(this.uid));
      } catch {
        /* Browser storage may be denied. */
      }
      this.status(
        'deleted',
        'Catatan akun telah dihapus. Keluar dari akun untuk melanjutkan sebagai tamu.',
      );
      return;
    }
    if (this.loaded && remote && this.base && remote.revision <= this.base.revision) return;
    this.loaded = true;
    const remoteReset =
      this.base && remote && this.base.resetId !== remote.resetId && !this.resetId;
    if (remoteReset) {
      this.progress = remote.data;
      this.dirty = false;
      this.version++;
    } else if (remote) {
      this.progress =
        this.dirty && !this.resetId
          ? mergeProgress(
              this.base?.data || this.initial || this.progress,
              this.progress,
              remote.data,
            )
          : this.dirty
            ? this.progress
            : remote.data;
    } else {
      this.dirty = true;
    }
    this.base = remote;
    this.publish();
    this.status(this.dirty ? 'pending' : 'synced');
    if (this.dirty) this.schedule();
  }

  update(action) {
    if (this.suspended || this.disposed) return;
    const next = typeof action === 'function' ? action(this.progress) : action;
    if (sameProgress(next, this.progress)) return;
    this.progress = next;
    this.dirty = true;
    this.version++;
    this.publish();
    this.status(this.online() ? 'pending' : 'offline');
    this.schedule();
  }

  reset() {
    this.resetId = crypto.randomUUID();
    this.update(emptyProgress());
  }

  schedule(wait = this.delay) {
    clearTimeout(this.timer);
    if (!this.loaded || this.disposed || this.suspended || !this.online() || this.inFlight) return;
    this.timer = setTimeout(() => {
      void this.flush();
    }, wait);
  }

  fail(error) {
    if (this.disposed || this.suspended) return;
    this.status(this.online() ? 'error' : 'offline', progressSyncError(error));
    if (['unavailable', 'deadline-exceeded', 'aborted'].includes(error?.code)) {
      clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(() => this.retry(), this.backoff);
      this.backoff = Math.min(this.backoff * 2, 30000);
    }
  }

  async flush() {
    clearTimeout(this.timer);
    if (this.inFlight) return this.inFlight;
    if (!this.loaded || !this.dirty || this.disposed || this.suspended || !this.online())
      return false;
    const version = this.version;
    const sent = this.progress;
    const resetId = this.resetId;
    let succeeded = false;
    this.status('saving');
    this.inFlight = this.adapter
      .commit(this.uid, { base: this.base, progress: sent, resetId })
      .then((confirmed) => {
        if (this.disposed || this.suspended) return false;
        if (confirmed.deleted) {
          this.receive(confirmed);
          return false;
        }
        succeeded = true;
        if (this.base && confirmed.revision < this.base.revision) {
          if (this.version === version) {
            this.dirty = false;
            this.resetId = null;
          }
          this.publish();
          this.status(this.dirty ? 'pending' : 'synced');
          return true;
        }
        const resetByAnotherDevice =
          this.base && confirmed.resetId !== this.base.resetId && !resetId;
        if (this.version === version || resetByAnotherDevice) {
          this.progress = confirmed.data;
          this.dirty = false;
          this.resetId = null;
        } else if (this.resetId === resetId) {
          this.progress = mergeProgress(sent, this.progress, confirmed.data);
        }
        this.base = confirmed;
        this.backoff = 2000;
        this.publish();
        this.status(this.dirty ? 'pending' : 'synced');
        return true;
      })
      .catch((error) => {
        this.fail(error);
        return false;
      })
      .finally(() => {
        this.inFlight = null;
        if (this.dirty && succeeded) this.schedule();
      });
    return this.inFlight;
  }

  retry() {
    if (this.disposed || this.suspended) return;
    clearTimeout(this.retryTimer);
    this.start();
    if (this.loaded && this.dirty) this.schedule(0);
  }

  async pause() {
    this.suspended = true;
    clearTimeout(this.timer);
    await this.inFlight;
  }

  resume() {
    this.suspended = false;
    this.retry();
  }

  dispose() {
    this.disposed = true;
    clearTimeout(this.timer);
    clearTimeout(this.retryTimer);
    clearTimeout(this.readTimer);
    this.unsubscribe?.();
  }
}

let activeSession = null;
export function registerProgressSession(session) {
  activeSession = session;
  return () => {
    if (activeSession === session) activeSession = null;
  };
}
export async function flushActiveProgress() {
  if (!activeSession) return;
  let timeout;
  try {
    await Promise.race([
      activeSession.flush(),
      new Promise((resolve) => {
        timeout = setTimeout(resolve, 1800);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
export const pauseActiveProgress = () => activeSession?.pause();
export const resumeActiveProgress = () => activeSession?.resume();
