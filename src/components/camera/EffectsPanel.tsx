'use client';

import type { EffectType } from '@/types/effects';
import EffectButton from '../ui/EffectButton';
import { 
  Sparkles, Grid3x3, Type, Square, Monitor, Film, 
  Palette, Droplet, Eye 
} from 'lucide-react';

interface EffectsPanelProps {
  currentEffect: EffectType;
  onEffectChange: (effect: EffectType) => void;
}

const effects: { type: EffectType; label: string; icon: any }[] = [
  { type: 'none', label: 'None', icon: Eye },
  { type: 'filmGrain', label: 'Film Grain', icon: Sparkles },
  { type: 'dithering', label: 'Dithering', icon: Grid3x3 },
  { type: 'ascii', label: 'ASCII', icon: Type },
  { type: 'pixelate', label: 'Pixelate', icon: Square },
  { type: 'crt', label: 'CRT', icon: Monitor },
  { type: 'vintage', label: 'Vintage', icon: Film },
  { type: 'sepia', label: 'Sepia', icon: Palette },
  { type: 'grayscale', label: 'B&W', icon: Droplet },
  { type: 'invert', label: 'Invert', icon: Palette },
];

export default function EffectsPanel({
  currentEffect,
  onEffectChange,
}: EffectsPanelProps) {
  return (
    <div className="w-full md:w-80 bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Effects</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 md:grid-cols-2 gap-2 p-4">
          {effects.map((effect) => (
            <EffectButton
              key={effect.type}
              icon={effect.icon}
              label={effect.label}
              active={currentEffect === effect.type}
              onClick={() => onEffectChange(effect.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
