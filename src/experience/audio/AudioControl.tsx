import { useEffect, useId, useMemo, useSyncExternalStore } from 'react';
import { getAudioManager, type AudioDiagnostics } from './AudioManager';

declare global {
  interface Window {
    __deepCodeAudio?: () => AudioDiagnostics;
  }
}

interface AudioControlProps {
  reducedMotion?: boolean;
}

export default function AudioControl({ reducedMotion = false }: AudioControlProps) {
  const manager = useMemo(getAudioManager, []);
  const state = useSyncExternalStore(manager.subscribe, manager.getSnapshot, manager.getServerSnapshot);
  const volumeID = useId();

  useEffect(() => {
    const unmount = manager.mount();
    const diagnostics = manager.getDiagnostics;
    window.__deepCodeAudio = diagnostics;
    return () => {
      if (window.__deepCodeAudio === diagnostics) delete window.__deepCodeAudio;
      unmount();
    };
  }, [manager]);

  return (
    <div className="audio-control" data-audio-enabled={state.enabled} data-reduced-motion={reducedMotion}>
      <button
        type="button"
        className="audio-toggle"
        aria-pressed={state.enabled}
        aria-label={state.enabled ? 'Desativar som' : 'Ativar som'}
        disabled={!state.available || state.pending}
        title={!state.available ? 'Áudio indisponível neste navegador' : state.enabled ? 'Desativar áudio ambiente e efeitos' : 'Ativar áudio ambiente e efeitos'}
        onClick={() => { if (state.enabled) manager.disable(); else void manager.enableFromGesture(); }}
      >
        <svg className="audio-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 6h3l3-3v10l-3-3H2V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          {state.enabled
            ? <path d="M10 5.5c1 .8 1 4.2 0 5M12 3.5c2 2 2 7 0 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            : <path d="m11 6 3 4m0-4-3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />}
        </svg>
        <span>{state.pending ? 'ATIVANDO' : state.enabled ? 'SOM LIGADO' : 'SOM DESLIGADO'}</span>
      </button>
      <details className="audio-options">
        <summary aria-label="Ajustes de som" title="Ajustes de som">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 3h10M2 7h10M2 11h10" stroke="currentColor" />
            <path d="M5 1v4M9 5v4M5 9v4" stroke="currentColor" strokeWidth="2" />
          </svg>
        </summary>
        <div className="audio-settings-panel">
          <label htmlFor={volumeID}>
            <span>Volume <output>{Math.round(state.volume * 100)}%</output></span>
          </label>
          <input
            id={volumeID}
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(state.volume * 100)}
            onChange={event => manager.setVolume(Number(event.target.value) / 100)}
          />
          <label className="audio-ambience-label">
            <input type="checkbox" checked={state.ambience} onChange={event => manager.setAmbience(event.target.checked)} />
            Ambiente espacial
          </label>
        </div>
      </details>
      {state.error && <span className="audio-feedback" role="status">{state.error}</span>}
    </div>
  );
}

export { playCue } from './AudioManager';
