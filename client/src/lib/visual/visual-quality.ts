export type VisualQuality = 'low' | 'medium' | 'high' | 'auto';

export type VisualSignals = {
  width: number;
  devicePixelRatio: number;
  reducedMotion: boolean;
  saveData: boolean;
  hardwareConcurrency: number;
  webgl: boolean;
};

export const resolveVisualQuality = (requested: VisualQuality, signals: VisualSignals): Exclude<VisualQuality, 'auto'> => {
  if (requested !== 'auto') return requested;
  if (!signals.webgl || signals.reducedMotion || signals.saveData || signals.width < 520 || signals.hardwareConcurrency <= 2) return 'low';
  if (signals.width < 1024 || signals.devicePixelRatio > 2 || signals.hardwareConcurrency <= 6) return 'medium';
  return 'high';
};

export const visualQualitySettings = {
  low: { pixelRatio: 1, simulationResolution: 0.25, continuous: false },
  medium: { pixelRatio: 1.5, simulationResolution: 0.4, continuous: true },
  high: { pixelRatio: 2, simulationResolution: 0.5, continuous: true },
} as const;
