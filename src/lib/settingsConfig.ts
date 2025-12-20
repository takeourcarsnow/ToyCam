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
    {
      type: 'slider',
      label: 'Grain Size',
      key: 'grainSize',
      min: 1,
      max: 10,
      step: 1,
    },
  ],
  dithering: [
    {
      type: 'buttons',
      label: 'Palette',
      key: 'palette',
      options: [
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
      label: 'Resolution',
      key: 'scale',
      min: 4,
      max: 10,
      step: 1,
    },
  ],
  ascii: [
    {
      type: 'slider',
      label: 'Font Size',
      key: 'fontSize',
      min: 12,
      max: 128,
      step: 1,
    },
    {
      type: 'buttons',
      label: 'Charset',
      key: 'characters',
      options: [
        { value: '@%#*+=-:. ', label: 'Classic' },
        { value: '█▓▒░ ', label: 'Blocks' },
        { value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', label: 'Alphanumeric' },
        { value: '█▉▊▋▌▍▎▏ ', label: 'Shades' },
        { value: '⣿⣷⣶⣤⣄⣀ ', label: 'Braille' },
        { value: '■□▪▫ ', label: 'Geometric' },
      ],
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
  film: [
    {
      type: 'buttons',
      label: 'Film Type',
      key: 'mode',
      options: [
        { value: 'portra', label: 'Portra' },
        { value: 'tmax', label: 'T-MAX' },
        { value: 'ektar', label: 'Ektar' },
        { value: 'provia', label: 'Provia' },
        { value: 'trix', label: 'Tri-X' },
        { value: 'hp5', label: 'HP5' },
      ],
    },
    {
      type: 'slider',
      label: 'Intensity',
      key: 'intensity',
      min: 0,
      max: 1,
      step: 0.05,
    },
  ],
  lightLeak: [
    {
      type: 'slider',
      label: 'Intensity',
      key: 'intensity',
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      type: 'buttons',
      label: 'Color',
      key: 'color',
      options: [
        { value: 'orange', label: 'Orange' },
        { value: 'purple', label: 'Purple' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'pink', label: 'Pink' },
      ],
    },
    {
      type: 'buttons',
      label: 'Position',
      key: 'position',
      options: [
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-right', label: 'Bottom Right' },
        { value: 'center', label: 'Center' },
      ],
    },
  ],
  frame: [
    {
      type: 'slider',
      label: 'Thickness',
      key: 'thickness',
      min: 5,
      max: 50,
      step: 1,
    },
    {
      type: 'select',
      label: 'Color',
      key: 'color',
      options: [
        { value: '#ffffff', label: 'White' },
        { value: '#000000', label: 'Black' },
        { value: '#8B4513', label: 'Brown' },
        { value: '#DAA520', label: 'Gold' },
        { value: '#C0C0C0', label: 'Silver' },
        { value: '#FF6B6B', label: 'Red' },
        { value: '#4ECDC4', label: 'Teal' },
      ],
    },
  ],
};