import type { EffectType, EffectSettings } from '@/types/effects';
import { applyFilmGrain } from './filmGrain';
import { applyDithering } from './dithering';
import { applyAscii } from './ascii';
import { applyPixelate } from './pixelate';
import { applyCRT } from './crt';
import { applyVintage } from './vintage';
import { applySepia, applyGrayscale, applyInvert } from './colorFilters';

export interface EffectFunction {
  apply: (imageData: ImageData, settings: any, canvas?: HTMLCanvasElement) => ImageData | void;
  usesCanvas?: boolean;
}

export const EFFECT_FUNCTIONS: Record<Exclude<EffectType, 'none'>, EffectFunction> = {
  filmGrain: {
    apply: (imageData, settings) => {
      return applyFilmGrain(imageData, settings.intensity);
    },
  },
  dithering: {
    apply: (imageData, settings) => {
      return applyDithering(
        imageData,
        settings.colors,
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
  sepia: {
    apply: (imageData, settings) => {
      return applySepia(imageData, settings.intensity);
    },
  },
  grayscale: {
    apply: (imageData, settings) => {
      return applyGrayscale(imageData, settings.intensity);
    },
  },
  invert: {
    apply: (imageData, settings) => {
      return applyInvert(imageData, settings.intensity);
    },
  },
};