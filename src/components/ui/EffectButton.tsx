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
      className={`flex flex-col items-center justify-center rounded transition-colors ${
        compact
          ? `p-1 ${active ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`
          : `p-3 ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`
      }`}
      title={hideLabel ? label : undefined}
    >
      <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5 mb-1'}`} />
      {!hideLabel && <span className={`font-medium text-center ${compact ? 'text-xs' : 'text-xs'}`}>{label}</span>}
    </button>
  );
}
