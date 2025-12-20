import type { EffectType, EffectSettings } from '@/types/effects';
import { applyFilmGrain } from './filmGrain';
import { applyDithering } from './dithering';
import { applyAscii } from './ascii';
import { applyPixelate } from './pixelate';
import { applyCRT } from './crt';
import { applyVintage } from './vintage';
import { applyGrayscale, applyInvert } from './colorFilters';
import { applyTMax, applyPortra, applyEktar, applyProvia, applyTriX, applyHP5 } from './filmFilters';
import { applyLightLeak } from './lightLeak';
import { applyFrame } from './frame';

export interface EffectFunction {
  apply: (imageData: ImageData, settings: any, canvas?: HTMLCanvasElement) => ImageData | void;
  usesCanvas?: boolean;
}

export const EFFECT_FUNCTIONS: Record<Exclude<EffectType, 'none'>, EffectFunction> = {
  filmGrain: {
    apply: (imageData, settings) => {
      return applyFilmGrain(imageData, settings.intensity, settings.grainSize);
    },
  },
  dithering: {
    apply: (imageData, settings) => {
      return applyDithering(
        imageData,
        settings.method,
        settings.scale,
        settings.palette
      );
    },
  },
  ascii: {
    apply: (imageData, settings, canvas) => {
      if (canvas) {
        applyAscii(canvas, imageData, settings.fontSize, settings.characters, settings.invert);
      }
    },
    usesCanvas: true,
  },
  pixelate: {
    apply: (imageData, settings) => {
      return applyPixelate(imageData, settings.pixelSize);
    },
  },
  crt: {
    apply: (imageData, settings, canvas) => {
      if (canvas) {
        applyCRT(canvas, imageData, settings.scanlineIntensity, settings.curvature);
      }
    },
    usesCanvas: true,
  },
  vintage: {
    apply: (imageData, settings, canvas) => {
      if (canvas) {
        applyVintage(canvas, imageData, settings.vignette, settings.scratch);
      }
    },
    usesCanvas: true,
  },
  invert: {
    apply: (imageData, settings) => {
      return applyInvert(imageData, settings.intensity);
    },
  },
  film: {
    apply: (imageData, settings) => {
      const { mode, intensity } = settings;
      switch (mode) {
        case 'tmax':
          return applyTMax(imageData, intensity);
        case 'portra':
          return applyPortra(imageData, intensity);
        case 'ektar':
          return applyEktar(imageData, intensity);
        case 'provia':
          return applyProvia(imageData, intensity);
        case 'trix':
          return applyTriX(imageData, intensity);
        case 'hp5':
          return applyHP5(imageData, intensity);
        default:
          return imageData;
      }
    },
  },
  lightLeak: {
    apply: (imageData, settings) => {
      return applyLightLeak(imageData, settings.intensity, settings.color, settings.position);
    },
  },
  frame: {
    apply: (imageData, settings, canvas) => {
      if (canvas) {
        applyFrame(canvas, imageData, settings.thickness, settings.color);
      }
    },
    usesCanvas: true,
  },
};