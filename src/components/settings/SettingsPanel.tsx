'use client';

import type { EffectType, EffectSettings } from '@/types/effects';
import { EFFECT_SETTINGS_CONFIG } from '@/lib/settingsConfig';
import Slider from '../ui/Slider';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';

interface SettingsPanelProps {
  currentEffect: EffectType;
  settings: EffectSettings;
  onSettingChange: (
    effect: EffectType,
    key: string,
    value: any
  ) => void;
}

export default function SettingsPanel({
  currentEffect,
  settings,
  onSettingChange,
}: SettingsPanelProps) {
  if (currentEffect === 'none') return null;

  const config = EFFECT_SETTINGS_CONFIG[currentEffect];

  return (
    <div className="space-y-3">
      {config.map((setting) => {
        const currentSettings = (settings as any)[currentEffect];

        switch (setting.type) {
          case 'slider':
            return (
              <Slider
                key={setting.key}
                label={setting.label}
                value={currentSettings[setting.key]}
                onChange={(v) => onSettingChange(currentEffect, setting.key, v)}
                min={setting.min!}
                max={setting.max!}
                step={setting.step!}
              />
            );
          case 'select':
            return (
              <Select
                key={setting.key}
                label={setting.label}
                value={currentSettings[setting.key]}
                onChange={(v) => onSettingChange(currentEffect, setting.key, v)}
                options={setting.options || []}
              />
            );
          case 'toggle':
            return (
              <Toggle
                key={setting.key}
                label={setting.label}
                value={currentSettings[setting.key]}
                onChange={(v) => onSettingChange(currentEffect, setting.key, v)}
              />
            );
          case 'buttons':
            return (
              <div key={setting.key} className="space-y-2">
                <label className="text-sm font-medium text-white">
                  {setting.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {setting.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSettingChange(currentEffect, setting.key, option.value)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        currentSettings[setting.key] === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
