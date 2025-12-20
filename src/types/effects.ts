export type EffectType = 
  | 'none'
  | 'filmGrain'
  | 'dithering'
  | 'ascii'
  | 'pixelate'
  | 'crt'
  | 'vintage'
  | 'sepia'
  | 'grayscale'
  | 'invert';

export interface EffectSettings {
  filmGrain: {
    intensity: number;
  };
  dithering: {
    colors: number;
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
  sepia: {
    intensity: number;
  };
  grayscale: {
    intensity: number;
  };
  invert: {
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
  },
  dithering: {
    colors: 8,
    method: 'floyd-steinberg',
    scale: 6,
    palette: 'none',
  },
  ascii: {
    fontSize: 8,
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
  sepia: {
    intensity: 1,
  },
  grayscale: {
    intensity: 1,
  },
  invert: {
    intensity: 1,
  },
};
