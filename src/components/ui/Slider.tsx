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
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="text-xs text-white flex-shrink-0 min-w-0">
          {label}
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-gray-600 rounded appearance-none cursor-pointer slider"
        />
        <span className="text-xs text-white/80 flex-shrink-0 min-w-[2rem] text-right">
          {value.toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
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
