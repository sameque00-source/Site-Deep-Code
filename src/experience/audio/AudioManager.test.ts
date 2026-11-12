import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioManager } from './AudioManager';

class FakeParam {
  value = 0;
  cancelScheduledValues = vi.fn();
  setTargetAtTime = vi.fn();
  setValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class FakeNode {
  gain = new FakeParam();
  frequency = new FakeParam();
  type = 'sine';
  loop = false;
  buffer: unknown;
  onended: (() => void) | null = null;
  connect = vi.fn((destination: unknown) => destination);
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}

class FakeContext {
  state = 'suspended';
  currentTime = 0;
  sampleRate = 100;
  destination = new FakeNode();
  sources: FakeNode[] = [];
  bufferCount = 0;
  resume = vi.fn(async () => { this.state = 'running'; });
  suspend = vi.fn(async () => { this.state = 'suspended'; });
  close = vi.fn(async () => { this.state = 'closed'; });
  createGain = () => new FakeNode();
  createBiquadFilter = () => new FakeNode();
  createOscillator = () => {
    const source = new FakeNode(); this.sources.push(source); return source;
  };
  createBufferSource = () => {
    const source = new FakeNode(); this.sources.push(source); return source;
  };
  createBuffer = (_channels: number, frames: number) => {
    this.bufferCount++;
    return { getChannelData: () => new Float32Array(frames) };
  };
}

const managers: AudioManager[] = [];
afterEach(() => { managers.forEach(manager => manager.dispose()); managers.length = 0; vi.useRealTimers(); });

function setup(preference?: object) {
  const context = new FakeContext();
  const entries = new Map<string, string>();
  if (preference) entries.set('deep-code-audio-v1', JSON.stringify(preference));
  const storage = {
    getItem: vi.fn((key: string) => entries.get(key) || null),
    setItem: vi.fn((key: string, value: string) => { entries.set(key, value); }),
  };
  const factory = vi.fn(() => context as unknown as AudioContext);
  const conditions = { gesture: true, visible: true };
  const manager = new AudioManager({ contextFactory: factory, storage,
    canActivate: () => conditions.gesture, isVisible: () => conditions.visible });
  managers.push(manager);
  return { context, storage, factory, conditions, manager };
}

describe('AudioManager lifecycle', () => {
  it('restores preferences without creating a context or autoplaying', () => {
    const { manager, factory } = setup({ enabled: true, volume: 0.45, ambience: false });
    expect(manager.getSnapshot()).toMatchObject({ enabled: false, volume: 0.45, ambience: false });
    manager.cue('navigate');
    expect(factory).not.toHaveBeenCalled();
  });

  it('rejects activation outside user gesture and can recover on a later gesture', async () => {
    const { manager, factory, conditions } = setup();
    conditions.gesture = false;
    await manager.enableFromGesture();
    expect(factory).not.toHaveBeenCalled();
    expect(manager.getSnapshot().error).toBeTruthy();
    conditions.gesture = true;
    await manager.enableFromGesture();
    expect(factory).toHaveBeenCalledTimes(1);
    expect(manager.getSnapshot()).toMatchObject({ enabled: true, error: null, pending: false });
  });

  it('reuses ambient sources after mute/re-enable and persists the user preference', async () => {
    vi.useFakeTimers();
    const { manager, context, factory, storage } = setup();
    await manager.enableFromGesture();
    await manager.enableFromGesture();
    expect(context.bufferCount).toBe(1);
    manager.disable();
    await vi.advanceTimersByTimeAsync(100);
    expect(context.state).toBe('suspended');
    expect(JSON.parse(storage.setItem.mock.calls.at(-1)?.[1] || '{}').enabled).toBe(false);
    await manager.enableFromGesture();
    expect(context.bufferCount).toBe(1);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(context.state).toBe('running');
  });

  it('suspends while hidden and resumes the same graph without retriggering sources', async () => {
    const { manager, context, conditions } = setup();
    await manager.enableFromGesture();
    const sourceCount = context.sources.length;
    conditions.visible = false;
    await manager.syncVisibility();
    expect(context.state).toBe('suspended');
    manager.cue('navigate');
    expect(context.sources).toHaveLength(sourceCount);
    conditions.visible = true;
    await manager.syncVisibility();
    expect(context.state).toBe('running');
    expect(context.sources).toHaveLength(sourceCount);
  });

  it('stops and disconnects every created source when disposed', async () => {
    const { manager, context } = setup();
    await manager.enableFromGesture();
    manager.cue('navigate');
    manager.cue('activate');
    manager.dispose();
    for (const source of context.sources) {
      expect(source.stop).toHaveBeenCalled();
      expect(source.disconnect).toHaveBeenCalled();
    }
    expect(context.close).toHaveBeenCalledTimes(1);
    expect(manager.getSnapshot().enabled).toBe(false);
  });

  it('cannot resurrect a disposed graph when a pending resume resolves', async () => {
    const { manager, context } = setup();
    let resume: () => void = () => undefined;
    context.resume = vi.fn(() => new Promise<void>(resolve => { resume = resolve; }));
    const pending = manager.enableFromGesture();
    expect(manager.getSnapshot().pending).toBe(true);
    manager.dispose();
    resume();
    await pending;
    expect(manager.getSnapshot()).toMatchObject({ enabled: false, pending: false });
    expect(context.close).toHaveBeenCalledTimes(1);
  });

  it('does not leave the context running if muted while activation is pending', async () => {
    const { manager, context } = setup();
    let resume: () => void = () => undefined;
    context.resume = vi.fn(() => new Promise<void>(resolve => {
      resume = () => { context.state = 'running'; resolve(); };
    }));
    const pending = manager.enableFromGesture();
    manager.disable();
    resume();
    await pending;
    expect(manager.getSnapshot()).toMatchObject({ enabled: false, pending: false });
    expect(context.state).toBe('suspended');
  });
});
