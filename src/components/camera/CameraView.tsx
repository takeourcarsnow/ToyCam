'use client';

import React, { useState } from 'react';
import type { EffectType, EffectSettings, AspectRatio, OverlayType } from '@/types/effects';
import { Camera, AlertCircle, Download, X, Video, Image, CameraOff, SwitchCamera, HelpCircle, Settings } from 'lucide-react';
import { EFFECTS } from '@/lib/constants';
import SettingsPanel from '../settings/SettingsPanel';
import EffectButton from '../ui/EffectButton';
import Select from '../ui/Select';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraActive: boolean;
  error: string | null;
  currentEffect: EffectType;
  activeEffects: Set<EffectType>;
  settings: EffectSettings;
  onSettingChange: (
    effect: EffectType,
    key: string,
    value: any
  ) => void;
  onEffectChange: (effect: EffectType) => void;
  capturedPhoto: string | null;
  recordedVideo: string | null;
  isPreviewMode: boolean;
  isRecording: boolean;
  captureMode: 'photo' | 'video';
  onCapture: () => void;
  onDownload: () => void;
  onCancel: () => void;
  onToggleCaptureMode: () => void;
  onToggleCamera: () => void;
  onSwitchCamera: () => void;
  isLoading?: boolean;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  overlayType: OverlayType;
  onOverlayChange: (overlay: OverlayType) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
}

function CameraView({
  videoRef,
  canvasRef,
  cameraActive,
  error,
  currentEffect,
  activeEffects,
  settings,
  onSettingChange,
  onEffectChange,
  capturedPhoto,
  recordedVideo,
  isPreviewMode,
  isRecording,
  captureMode,
  onCapture,
  onDownload,
  onCancel,
  onToggleCaptureMode,
  onToggleCamera,
  onSwitchCamera,
  isLoading = false,
  aspectRatio,
  onAspectRatioChange,
  overlayType,
  onOverlayChange,
  showSettings,
  onToggleSettings,
}: CameraViewProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
      {/* Camera controls overlay */}
      {!isPreviewMode && (
        <div className="absolute top-1 left-1 right-1 flex flex-wrap items-center gap-0.5 z-10 max-w-full sm:top-2 sm:left-2 sm:gap-1">
          <button
            onClick={() => setShowHelp(true)}
            className="bg-gray-800 text-white p-0.5 rounded hover:bg-gray-700 transition-colors text-xs sm:p-1"
            aria-label="Show keyboard shortcuts"
          >
            <HelpCircle className="w-3 h-3" />
          </button>

          {cameraActive && (
            <button
              onClick={onToggleSettings}
              className={`p-0.5 rounded hover:scale-105 transition-all text-xs ${
                showSettings ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              title={showSettings ? 'Hide settings' : 'Show settings'}
            >
              <Settings className="w-3 h-3" />
            </button>
          )}
          
          {cameraActive && (
            <>
              <button
                onClick={onSwitchCamera}
                className="bg-gray-800 text-white p-0.5 rounded hover:bg-gray-700 transition-colors text-xs sm:p-1"
                aria-label="Switch camera"
              >
                <SwitchCamera className="w-3 h-3" />
              </button>
              
              {/* Aspect ratio selector */}
              <div className="bg-gray-800 rounded px-0.5 py-0 sm:px-1">
                <Select
                  label=""
                  value={aspectRatio}
                  onChange={(value) => onAspectRatioChange(value as AspectRatio)}
                  options={[
                    { value: 'device', label: 'Device' },
                    { value: '1:1', label: '1:1' },
                    { value: '4:3', label: '4:3' },
                    { value: '16:9', label: '16:9' },
                    { value: '21:9', label: '21:9' },
                    { value: '3:2', label: '3:2' },
                    { value: '5:4', label: '5:4' },
                  ]}
                />
              </div>
              
              {/* Overlay selector */}
              <div className="bg-gray-800 rounded px-0.5 py-0 sm:px-1">
                <Select
                  label=""
                  value={overlayType}
                  onChange={(value) => onOverlayChange(value as OverlayType)}
                  options={[
                    { value: 'none', label: 'No Overlay' },
                    { value: 'rule-of-thirds', label: 'Rule of 3rds' },
                    { value: 'golden-ratio', label: 'Golden Ratio' },
                    { value: 'golden-spiral', label: 'Golden Spiral' },
                    { value: 'diagonal', label: 'Diagonal' },
                    { value: 'center-cross', label: 'Center Cross' },
                  ]}
                />
              </div>
            </>
          )}
          
          <button
            onClick={onToggleCamera}
            className={`p-0.5 rounded transition-colors text-xs ${
              cameraActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label={cameraActive ? 'Stop camera' : 'Start camera'}
          >
            {cameraActive ? (
              <CameraOff className="w-3 h-3" />
            ) : (
              <Camera className="w-3 h-3" />
            )}
          </button>
        </div>
      )}
      {/* Hidden video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          video.play().catch(err => console.error('Video play error:', err));
        }}
      />
      
      {/* Canvas for effects */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain ${
          cameraActive ? 'block' : 'hidden'
        }`}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
      
      {/* Captured photo/video preview */}
      {isPreviewMode && (capturedPhoto || recordedVideo) && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured photo"
              className="max-w-full max-h-full object-contain"
            />
          ) : recordedVideo ? (
            <video
              src={recordedVideo}
              controls
              className="max-w-full max-h-full object-contain"
            />
          ) : null}
        </div>
      )}
      
      {/* Effects buttons overlay */}
      {cameraActive && !isPreviewMode && showSettings && (
        <div className="absolute top-6 left-1 right-1 z-10 sm:left-2 sm:right-2">
          <div className="flex gap-0.5 overflow-x-auto pb-1 sm:gap-1">
            {EFFECTS.map((effect) => (
              <div key={effect.type} className="flex-shrink-0">
                <EffectButton
                  icon={effect.icon}
                  label={effect.label}
                  active={effect.type === 'none' ? activeEffects.size === 0 : activeEffects.has(effect.type)}
                  onClick={() => onEffectChange(effect.type)}
                  compact
                  hideLabel
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Placeholder when camera is off */}
      {!cameraActive && !error && (
        <div 
          className="text-center text-white p-4 cursor-pointer hover:text-gray-300 transition-colors"
          onClick={onToggleCamera}
        >
          {isLoading ? (
            <>
              <div className="w-12 h-12 mx-auto mb-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">Starting camera...</p>
            </>
          ) : (
            <>
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Camera off</p>
            </>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-center text-red-400 p-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm font-medium">Camera Error</p>
          <p className="text-xs mt-1 mb-2">{error}</p>
          <button
            onClick={onToggleCamera}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Settings overlay */}
      {cameraActive && activeEffects.size > 0 && !isPreviewMode && showSettings && (
        <div className="absolute bottom-16 left-0 right-0 bg-black/80 p-2 max-h-24 overflow-y-auto sm:bottom-12">
          <SettingsPanel
            currentEffect={currentEffect}
            activeEffects={activeEffects}
            settings={settings}
            onSettingChange={onSettingChange}
          />
        </div>
      )}
      
      {/* Capture mode toggle */}
      {cameraActive && !isPreviewMode && (
        <button
          onClick={onToggleCaptureMode}
          className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded hover:bg-gray-700 transition-colors text-xs z-10"
          title={`Switch to ${captureMode === 'photo' ? 'video' : 'photo'} mode`}
        >
          {captureMode === 'photo' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
        </button>
      )}

      {/* Capture button */}
      {cameraActive && !isPreviewMode && (
        <button
          onClick={onCapture}
          aria-label="Capture"
          className="absolute left-1/2 transform -translate-x-1/2 bottom-20 w-16 h-16 rounded-full bg-white border-2 border-gray-300 shadow-lg hover:scale-105 transition-all z-50 sm:bottom-8"
        >
          <div className="w-6 h-6 bg-gray-800 rounded-full mx-auto"></div>
        </button>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-20">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          Recording
        </div>
      )}

      {/* Photo/video preview controls */}
      {isPreviewMode && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1 z-20 sm:bottom-2 sm:gap-2">
          <button
            onClick={onDownload}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors sm:px-3"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors sm:px-3"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      )}

      {/* Help modal */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30" onClick={() => setShowHelp(false)}>
          <div className="bg-gray-800 text-white p-4 rounded max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Start/Stop Camera</span>
                <kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">C</kbd>
              </div>
              <div className="flex justify-between">
                <span>Capture</span>
                <kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span>Switch Mode</span>
                <kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">V</kbd>
              </div>
              <div className="flex justify-between">
                <span>Download</span>
                <kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Cancel</span>
                <kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">Esc</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-xs transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(CameraView);
