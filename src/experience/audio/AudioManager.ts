export type AudioCue = 'activate' | 'navigate';

export interface AudioSnapshot {
  enabled: boolean;
  available: boolean;
  pending: boolean;
  volume: number;
  ambience: boolean;
  error: string | null;
}

export interface AudioDiagnostics {
  contextCreated: boolean;
  contextState: string;
  enabled: boolean;
  userActivated: boolean;
  ambientSources: number;
  cueSources: number;
}

interface SavedPreference {
  enabled: boolean;
  volume: number;
  ambience: boolean;
}

interface AudioManagerOptions {
  contextFactory?: () => AudioContext;
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  isVisible?: () => boolean;
  canActivate?: () => boolean;
}

interface CueVoice {
  oscillator: OscillatorNode;
  gain: GainNode;
}

const PREFERENCE_KEY = 'deep-code-audio-v1';
const DEFAULT_VOLUME = 0.28;
const clampVolume = (volume: number) => Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : DEFAULT_VOLUME;
const SERVER_SNAPSHOT: AudioSnapshot = {
  enabled: false, available: false, pending: false, volume: DEFAULT_VOLUME, ambience: true, error: null,
};

function browserStorage(): AudioManagerOptions['storage'] {
  try { return typeof window === 'undefined' ? null : window.localStorage; }
  catch { return null; }
}

function contextAvailable() {
  if (typeof window === 'undefined') return false;
  return typeof window.AudioContext === 'function'
    || typeof (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext === 'function';
}

function createBrowserContext() {
  const Constructor = window.AudioContext
    || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Constructor) throw new Error('Web Audio unavailable');
  return new Constructor({ latencyHint: 'interactive' });
}

function userGestureAllowed() {
  return typeof navigator !== 'undefined'
    && (navigator.userActivation ? navigator.userActivation.isActive : true);
}

/** Own synthesized sound only. No context, source, listener or network request at import time. */
export class AudioManager {
  private readonly storage: AudioManagerOptions['storage'];
  private readonly contextFactory: () => AudioContext;
  private readonly isVisible: () => boolean;
  private readonly canActivate: () => boolean;
  private readonly subscribers = new Set<() => void>();
  private snapshot: AudioSnapshot;
  private preference: SavedPreference;
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private readonly ambientSources = new Set<AudioScheduledSourceNode>();
  private readonly ambientNodes = new Set<AudioNode>();
  private readonly cues = new Set<CueVoice>();
  private owners = 0;
  private generation = 0;
  private activated = false;
  private suspendTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: AudioManagerOptions = {}) {
    this.storage = options.storage === undefined ? browserStorage() : options.storage;
    this.contextFactory = options.contextFactory || createBrowserContext;
    this.isVisible = options.isVisible || (() => typeof document === 'undefined' || !document.hidden);
    this.canActivate = options.canActivate || userGestureAllowed;
    this.preference = { enabled: false, volume: DEFAULT_VOLUME, ambience: true };
    try {
      const stored: unknown = JSON.parse(this.storage?.getItem(PREFERENCE_KEY) || 'null');
      if (stored && typeof stored === 'object') {
        const saved = stored as Partial<SavedPreference>;
        this.preference = {
          enabled: saved.enabled === true,
          volume: typeof saved.volume === 'number' ? clampVolume(saved.volume) : DEFAULT_VOLUME,
          ambience: saved.ambience !== false,
        };
      }
    } catch { /* A denied or old storage entry must never affect navigation. */ }
    this.snapshot = {
      // Remembering an enabled preference never grants permission to autoplay.
      enabled: false, pending: false,
      available: !!options.contextFactory || contextAvailable(),
      volume: this.preference.volume, ambience: this.preference.ambience, error: null,
    };
  }

  getSnapshot = () => this.snapshot;
  getServerSnapshot = () => SERVER_SNAPSHOT;

  getDiagnostics = (): AudioDiagnostics => ({
    contextCreated: this.context !== null,
    contextState: this.context?.state || 'not-created',
    enabled: this.snapshot.enabled,
    userActivated: this.activated,
    ambientSources: this.ambientSources.size,
    cueSources: this.cues.size,
  });

  subscribe = (listener: () => void) => {
    this.subscribers.add(listener);
    return () => { this.subscribers.delete(listener); };
  };

  mount = () => {
    this.owners += 1;
    if (this.owners === 1 && typeof document !== 'undefined')
      document.addEventListener('visibilitychange', this.syncVisibility);
    return () => {
      this.owners = Math.max(0, this.owners - 1);
      if (this.owners === 0) this.dispose();
    };
  };

  private update(patch: Partial<AudioSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.subscribers.forEach(listener => listener());
  }

  private persist() {
    try { this.storage?.setItem(PREFERENCE_KEY, JSON.stringify(this.preference)); }
    catch { /* Sound remains usable if local storage is unavailable. */ }
  }

  private clearSuspendTimer() {
    if (this.suspendTimer !== null) clearTimeout(this.suspendTimer);
    this.suspendTimer = null;
  }

  private targetMaster(value: number) {
    if (!this.context || !this.master) return;
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(value, this.context.currentTime, 0.018);
  }

  /** Call synchronously from a click/key activation. Never called from an effect. */
  async enableFromGesture() {
    if (this.snapshot.enabled || this.snapshot.pending) return;
    if (!this.canActivate()) {
      this.update({ error: 'Use o controle de som para ativar o áudio.' });
      return;
    }
    const generation = ++this.generation;
    this.clearSuspendTimer();
    this.update({ pending: true, error: null });
    try {
      // Construction happens before the first await, inside the user activation.
      if (!this.context) {
        this.context = this.contextFactory();
        this.master = this.context.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.context.destination);
        this.buildAmbience();
      }
      const context = this.context;
      await context.resume();
      if (generation !== this.generation || this.context !== context) {
        // A mute can happen while resume is pending. Do not leave its graph running silently,
        // and do not interrupt a newer activation using this same context.
        if (this.context === context && !this.snapshot.enabled && !this.snapshot.pending)
          await context.suspend();
        return;
      }
      this.activated = true;
      this.preference.enabled = true;
      this.persist();
      this.update({ enabled: true, pending: false, available: true });
      if (this.isVisible()) {
        this.targetMaster(this.snapshot.volume);
        this.cue('activate');
      } else await context.suspend();
    } catch {
      if (generation !== this.generation) return;
      this.update({ enabled: false, pending: false, error: 'O áudio não pôde iniciar. Tente novamente.' });
      this.releaseAudio();
    }
  }

  disable() {
    ++this.generation;
    this.clearSuspendTimer();
    this.preference.enabled = false;
    this.persist();
    this.update({ enabled: false, pending: false, error: null });
    this.cancelCues();
    this.targetMaster(0);
    const context = this.context;
    if (context?.state === 'running') {
      this.suspendTimer = setTimeout(() => {
        this.suspendTimer = null;
        if (this.context === context && !this.snapshot.enabled)
          void context.suspend().catch(() => undefined);
      }, 90);
    }
  }

  setVolume(volume: number) {
    const next = clampVolume(volume);
    this.preference.volume = next;
    this.persist();
    this.update({ volume: next });
    if (this.snapshot.enabled && this.isVisible()) this.targetMaster(next);
  }

  setAmbience(enabled: boolean) {
    this.preference.ambience = enabled;
    this.persist();
    this.update({ ambience: enabled });
    if (this.context && this.ambienceGain)
      this.ambienceGain.gain.setTargetAtTime(enabled ? 0.38 : 0, this.context.currentTime, 0.22);
  }

  syncVisibility = async () => {
    const context = this.context;
    if (!context) return;
    this.clearSuspendTimer();
    if (!this.isVisible()) {
      this.cancelCues();
      this.targetMaster(0);
      try { await context.suspend(); } catch { /* Closing context can race a visibility event. */ }
      return;
    }
    if (!this.activated || !this.snapshot.enabled) return;
    const generation = this.generation;
    try {
      await context.resume();
      if (generation === this.generation && this.context === context && this.isVisible())
        this.targetMaster(this.snapshot.volume);
    } catch {
      if (this.context === context)
        this.update({ enabled: false, error: 'Use o controle de som para retomar o áudio.' });
    }
  };

  private buildAmbience() {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;
    const bus = context.createGain();
    bus.gain.value = this.preference.ambience ? 0.38 : 0;
    bus.connect(master);
    this.ambienceGain = bus;
    this.ambientNodes.add(bus);

    // A restrained harmonic bed, created here rather than loaded from an audio asset.
    for (const [frequency, level] of [[55, 0.1], [82.5, 0.027], [110, 0.016]]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = level;
      oscillator.connect(gain);
      gain.connect(bus);
      oscillator.start();
      this.ambientSources.add(oscillator);
      this.ambientNodes.add(gain);
    }

    const noise = context.createBufferSource();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const samples = buffer.getChannelData(0);
    let seed = 117;
    for (let i = 0; i < samples.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      samples[i] = ((seed >>> 0) / 4294967296) * 2 - 1;
    }
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 310;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.035;
    noise.buffer = buffer;
    noise.loop = true;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(bus);
    noise.start();
    this.ambientSources.add(noise);
    this.ambientNodes.add(filter);
    this.ambientNodes.add(noiseGain);
  }

  cue(type: AudioCue) {
    const context = this.context;
    const master = this.master;
    if (!this.snapshot.enabled || !this.activated || !this.isVisible() || context?.state !== 'running' || !master) return;
    this.cancelCues();
    const now = context.currentTime;
    const duration = type === 'activate' ? 0.16 : 0.22;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(type === 'activate' ? 660 : 330, now);
    oscillator.frequency.exponentialRampToValueAtTime(type === 'activate' ? 880 : 440, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.065, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(master);
    const voice = { oscillator, gain };
    this.cues.add(voice);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      this.cues.delete(voice);
    };
    oscillator.start(now);
    oscillator.stop(now + duration + 0.015);
  }

  private cancelCues() {
    const context = this.context;
    for (const voice of this.cues) {
      if (context) {
        voice.gain.gain.cancelScheduledValues(context.currentTime);
        voice.gain.gain.setTargetAtTime(0, context.currentTime, 0.007);
      }
      try { voice.oscillator.stop((context?.currentTime || 0) + 0.025); } catch { /* Already stopped. */ }
    }
  }

  private releaseAudio() {
    this.clearSuspendTimer();
    for (const { oscillator, gain } of this.cues) {
      oscillator.onended = null;
      try { oscillator.stop(); } catch { /* Already stopped. */ }
      oscillator.disconnect();
      gain.disconnect();
    }
    this.cues.clear();
    for (const source of this.ambientSources) {
      try { source.stop(); } catch { /* Already stopped. */ }
      source.disconnect();
    }
    this.ambientSources.clear();
    this.ambientNodes.forEach(node => node.disconnect());
    this.ambientNodes.clear();
    this.master?.disconnect();
    const context = this.context;
    this.context = null;
    this.master = null;
    this.ambienceGain = null;
    if (context && context.state !== 'closed') void context.close().catch(() => undefined);
  }

  dispose() {
    ++this.generation;
    this.activated = false;
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', this.syncVisibility);
    this.releaseAudio();
    this.update({ enabled: false, pending: false, error: null });
  }
}

let manager: AudioManager | null = null;
export function getAudioManager() {
  manager ||= new AudioManager();
  return manager;
}

/** No manager or context is created for a silent interaction. */
export function playCue(type: AudioCue) {
  manager?.cue(type);
}
