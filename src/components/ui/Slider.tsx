'use client';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function Slider({ label, value, onChange, min, max, step }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-white flex-shrink-0 min-w-0">
          {label}
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-sm text-white/80 flex-shrink-0 min-w-[3rem] text-right">
          {value.toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
