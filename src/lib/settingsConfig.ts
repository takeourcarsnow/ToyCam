import type { EffectType } from '@/types/effects';

export interface SettingConfig {
  type: 'slider' | 'select' | 'toggle' | 'buttons';
  label: string;
  key: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export const EFFECT_SETTINGS_CONFIG: Record<Exclude<EffectType, 'none'>, SettingConfig[]> = {
  filmGrain: [
    {
      type: 'slider',
      label: 'Intensity',
      key: 'intensity',
      min: 0,
      max: 0.5,
      step: 0.01,
    },
  ],
  dithering: [
    {
      type: 'buttons',
      label: 'Palette',
      key: 'palette',
      options: [
        { value: 'none', label: 'Quantized' },
        { value: 'gameboy', label: 'Game Boy' },
        { value: 'gameboyPocket', label: 'Game Boy Pocket' },
        { value: 'sega', label: 'Sega Genesis' },
        { value: 'atari', label: 'Atari 2600' },
        { value: 'macos', label: 'Mac OS Classic' },
        { value: 'commodore64', label: 'Commodore 64' },
        { value: 'nes', label: 'NES' },
        { value: 'cga', label: 'CGA' },
      ],
    },
    {
      type: 'buttons',
      label: 'Method',
      key: 'method',
      options: [
        { value: 'floyd-steinberg', label: 'Floyd-Steinberg' },
        { value: 'atkinson', label: 'Atkinson' },
        { value: 'bayer', label: 'Bayer 4x4' },
        { value: 'ordered', label: 'Ordered 8x8' },
        { value: 'random', label: 'Random' },
      ],
    },
    {
      type: 'slider',
      label: 'Color Levels',
      key: 'colors',
      min: 2,
      max: 32,
      step: 1,
    },
    {
      type: 'slider',
      label: 'Resolution',
      key: 'scale',
      min: 1,
      max: 10,
      step: 1,
    },
  ],
  ascii: [
    {
      type: 'slider',
      label: 'Font Size',
      key: 'fontSize',
      min: 4,
      max: 32,
      step: 1,
    },
    {
      type: 'toggle',
      label: 'Invert Colors',
      key: 'invert',
    },
  ],
  pixelate: [
    {
      type: 'slider',
      label: 'Pixel Size',
      key: 'pixelSize',
      min: 2,
      max: 30,
      step: 1,
    },
  ],
  crt: [
    {
      type: 'slider',
      label: 'Scanline Intensity',
      key: 'scanlineIntensity',
      min: 0,
      max: 0.8,
      step: 0.05,
    },
    {
      type: 'slider',
      label: 'Curvature',
      key: 'curvature',
      min: 0,
      max: 0.5,
      step: 0.05,
    },
  ],
  vintage: [
    {
      type: 'slider',
      label: 'Vignette',
      key: 'vignette',
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      type: 'slider',
      label: 'Scratch Amount',
      key: 'scratch',
      min: 0,
      max: 1,
      step: 0.05,
    },
  ],
  sepia: [
    {
      type: 'slider',
      label: 'Intensity',
      key: 'intensity',
      min: 0,
      max: 1,
      step: 0.05,
    },
  ],
  grayscale: [
    {
      type: 'slider',
      label: 'Intensity',
      key: 'intensity',
      min: 0,
      max: 1,
      step: 0.05,
    },
  ],
  invert: [
    {
      type: 'slider',
      label: 'Intensity',
      key: 'intensity',
      min: 0,
      max: 1,
      step: 0.05,
    },
  ],
};