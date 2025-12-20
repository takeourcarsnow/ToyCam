'use client';

import { Camera, CameraOff, SwitchCamera, Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface HeaderProps {
  onToggleCamera: () => void;
  onSwitchCamera: () => void;
  cameraActive: boolean;
}

export default function Header({ onToggleCamera, onSwitchCamera, cameraActive }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          ToyCam
        </h1>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          
          {cameraActive && (
            <button
              onClick={onSwitchCamera}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Switch camera"
            >
              <SwitchCamera className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          
          <button
            onClick={onToggleCamera}
            className={`p-2 rounded-full transition-colors ${
              cameraActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            aria-label={cameraActive ? 'Stop camera' : 'Start camera'}
          >
            {cameraActive ? (
              <CameraOff className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
