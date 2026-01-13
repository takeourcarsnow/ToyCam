'use client';

import { LucideIcon } from 'lucide-react';

interface EffectButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
  hideLabel?: boolean;
}

export default function EffectButton({ icon: Icon, label, active, onClick, compact = false, hideLabel = false }: EffectButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl transition-all ${
        compact
          ? `p-2 ${active ? 'bg-blue-500 text-white shadow-lg' : 'bg-black/50 backdrop-blur-sm text-white/80 hover:bg-black/70'}`
          : `p-4 ${active ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`
      }`}
      title={hideLabel ? label : undefined}
    >
      <Icon className={`${compact ? 'w-5 h-5' : 'w-6 h-6 mb-2'}`} />
      {!hideLabel && <span className={`font-medium text-center ${compact ? 'text-xs' : 'text-xs'}`}>{label}</span>}
    </button>
  );
}
