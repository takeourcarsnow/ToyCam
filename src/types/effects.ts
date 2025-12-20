export type EffectType = 
  | 'none'
  | 'filmGrain'
  | 'dithering'
  | 'ascii'
  | 'pixelate'
  | 'crt'
  | 'vintage'
  | 'invert'
  | 'film';

export type AspectRatio = '1:1' | '4:3' | '16:9' | '21:9' | '3:2' | '5:4' | 'device';

export type OverlayType = 'none' | 'rule-of-thirds' | 'golden-ratio' | 'golden-spiral' | 'diagonal' | 'center-cross';

export interface EffectSettings {
  filmGrain: {
    intensity: number;
    grainSize: number;
  };
  dithering: {
    method: 'floyd-steinberg' | 'bayer' | 'atkinson' | 'ordered' | 'random';
    scale: number;
    palette: string;
  };
  ascii: {
    fontSize: number;
    characters: string;
    invert: boolean;
  };
  pixelate: {
    pixelSize: number;
  };
  crt: {
    scanlineIntensity: number;
    curvature: number;
  };
  vintage: {
    vignette: number;
    scratch: number;
  };
  invert: {
    intensity: number;
  };
  film: {
    mode: 'tmax' | 'portra' | 'ektar' | 'provia' | 'trix' | 'hp5';
    intensity: number;
  };
}

export interface CameraState {
  isActive: boolean;
  facingMode: 'user' | 'environment';
  stream: MediaStream | null;
}

export const defaultEffectSettings: EffectSettings = {
  filmGrain: {
    intensity: 0.15,
    grainSize: 1,
  },
  dithering: {
    method: 'floyd-steinberg',
    scale: 4,
    palette: 'gameboy',
  },
  ascii: {
    fontSize: 32,
    characters: '@%#*+=-:. ',
    invert: false,
  },
  pixelate: {
    pixelSize: 10,
  },
  crt: {
    scanlineIntensity: 0.3,
    curvature: 0.1,
  },
  vintage: {
    vignette: 0.5,
    scratch: 0.3,
  },
  invert: {
    intensity: 1,
  },
  film: {
    mode: 'portra',
    intensity: 1,
  },
};
