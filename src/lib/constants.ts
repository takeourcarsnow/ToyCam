import type { EffectType } from '@/types/effects';
import {
  Sparkles, Grid3x3, Type, Square, Monitor, Film,
  Palette, Eye, Camera, Aperture, Circle, Sun, Frame
} from 'lucide-react';

export interface EffectDefinition {
  type: EffectType;
  label: string;
  icon: any;
}

export const EFFECTS: EffectDefinition[] = [
  { type: 'none', label: 'None', icon: Eye },
  { type: 'film', label: 'Film', icon: Film },
  { type: 'filmGrain', label: 'Film Grain', icon: Sparkles },
  { type: 'dithering', label: 'Dithering', icon: Grid3x3 },
  { type: 'ascii', label: 'ASCII', icon: Type },
  { type: 'pixelate', label: 'Pixelate', icon: Square },
  { type: 'crt', label: 'CRT', icon: Monitor },
  { type: 'vintage', label: 'Vintage', icon: Film },
  { type: 'invert', label: 'Invert', icon: Palette },
  { type: 'lightLeak', label: 'Light Leak', icon: Sun },
  { type: 'frame', label: 'Frame', icon: Frame },
];