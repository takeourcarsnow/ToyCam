'use client';

import type { EffectType, EffectSettings } from '@/types/effects';
import { EFFECT_SETTINGS_CONFIG } from '@/lib/settingsConfig';
import Slider from '../ui/Slider';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';

interface SettingsPanelProps {
  currentEffect: EffectType;
  activeEffects: Set<EffectType>;
  settings: EffectSettings;
  onSettingChange: (
    effect: EffectType,
    key: string,
    value: any
  ) => void;
}

export default function SettingsPanel({
  currentEffect,
  activeEffects,
  settings,
  onSettingChange,
}: SettingsPanelProps) {
  const effectsToShow = activeEffects.size > 0 ? Array.from(activeEffects) : ['none' as EffectType];

  return (
    <div className="space-y-2 max-h-full overflow-y-auto">
      {effectsToShow.map((effect: EffectType) => {
        if (effect === 'none') return null;

        const config = EFFECT_SETTINGS_CONFIG[effect];
        if (!config) return null;

        return (
          <div key={effect} className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wide">
              {effect.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {config.map((setting) => {
                const currentSettings = (settings as any)[effect];

                switch (setting.type) {
                  case 'slider':
                    return (
                      <div key={setting.key} className="space-y-1">
                        <label className="text-xs text-white">{setting.label}</label>
                        <Slider
                          label=""
                          value={currentSettings[setting.key]}
                          onChange={(v) => onSettingChange(effect, setting.key, v)}
                          min={setting.min!}
                          max={setting.max!}
                          step={setting.step!}
                        />
                      </div>
                    );
                  case 'select':
                    return (
                      <div key={setting.key} className="space-y-1">
                        <label className="text-xs text-white">{setting.label}</label>
                        <Select
                          label=""
                          value={currentSettings[setting.key]}
                          onChange={(v) => onSettingChange(effect, setting.key, v)}
                          options={setting.options || []}
                        />
                      </div>
                    );
                  case 'toggle':
                    return (
                      <Toggle
                        key={setting.key}
                        label={setting.label}
                        value={currentSettings[setting.key]}
                        onChange={(v) => onSettingChange(effect, setting.key, v)}
                      />
                    );
                  case 'buttons':
                    return (
                      <div key={setting.key} className="space-y-1">
                        <label className="text-xs text-white">{setting.label}</label>
                        <div className="flex flex-wrap gap-1">
                          {setting.options?.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => onSettingChange(effect, setting.key, option.value)}
                              className={`px-2 py-0.5 text-xs rounded transition-colors ${
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
          </div>
        );
      })}
    </div>
  );
}
