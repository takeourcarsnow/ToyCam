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
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          <button
            onClick={() => setShowHelp(true)}
            className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 active:scale-95 transition-all"
            aria-label="Show keyboard shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {cameraActive && (
            <button
              onClick={onToggleSettings}
              className={`p-2 rounded-full hover:scale-110 active:scale-95 transition-all ${
                showSettings ? 'bg-blue-500 text-white' : 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/70'
              }`}
              title={showSettings ? 'Hide settings' : 'Show settings'}
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          
          {cameraActive && (
            <>
              <button
                onClick={onSwitchCamera}
                className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 active:scale-95 transition-all"
                aria-label="Switch camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
              
              {/* Aspect ratio selector */}
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
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
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
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
            className={`p-2 rounded-full transition-all active:scale-95 ${
              cameraActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            aria-label={cameraActive ? 'Stop camera' : 'Start camera'}
          >
            {cameraActive ? (
              <CameraOff className="w-4 h-4" />
            ) : (
              <Camera className="w-4 h-4" />
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
        <div className="absolute top-12 left-4 right-4 z-10">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
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
          className="text-center text-white/60 p-8 cursor-pointer hover:text-white/80 transition-colors"
          onClick={onToggleCamera}
        >
          {isLoading ? (
            <>
              <div className="w-24 h-24 mx-auto mb-4 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-lg">Starting camera...</p>
              <p className="text-sm mt-2">Please allow camera access</p>
            </>
          ) : (
            <>
              <Camera className="w-24 h-24 mx-auto mb-4 opacity-30 hover:opacity-50 transition-opacity" />
              <p className="text-lg">Camera is off</p>
              <p className="text-sm mt-2">Tap here or press 'C' to start</p>
            </>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-center text-red-400 p-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-medium">Camera Error</p>
          <p className="text-sm mt-2 mb-4">{error}</p>
          <button
            onClick={onToggleCamera}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Settings overlay */}
      {cameraActive && activeEffects.size > 0 && !isPreviewMode && showSettings && (
        <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 h-32 overflow-y-auto">
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
          className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 active:scale-95 transition-all z-10"
          title={`Switch to ${captureMode === 'photo' ? 'video' : 'photo'} mode`}
        >
          {captureMode === 'photo' ? <Video className="w-4 h-4" /> : <Image className="w-4 h-4" />}
        </button>
      )}

      {/* Capture button */}
      {cameraActive && !isPreviewMode && (
        <button
          onClick={onCapture}
          aria-label="Capture"
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
          className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 shadow-lg hover:scale-110 active:scale-95 transition-all z-50 ${
            captureMode === 'photo'
              ? 'bg-white border-white/20'
              : isRecording
                ? 'bg-red-500 border-red-600 animate-pulse'
                : 'bg-white border-white/20'
          }`}
        >
          {captureMode === 'photo' ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-800 rounded-full mx-auto"></div>
          ) : (
            <div className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-sm ${
              isRecording ? 'bg-white' : 'bg-red-500'
            }`}></div>
          )}
        </button>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 z-20">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Recording
        </div>
      )}

      {/* Photo/video preview controls */}
      {isPreviewMode && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
          <button
            onClick={onDownload}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      )}

      {/* Help modal */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30" onClick={() => setShowHelp(false)}>
          <div className="bg-gray-900 text-white p-6 rounded-lg max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Start/Stop Camera</span>
                <kbd className="bg-gray-700 px-2 py-1 rounded">C</kbd>
              </div>
              <div className="flex justify-between">
                <span>Capture Photo/Video</span>
                <kbd className="bg-gray-700 px-2 py-1 rounded">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span>Switch Photo/Video</span>
                <kbd className="bg-gray-700 px-2 py-1 rounded">V</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle Settings</span>
                <span className="text-xs text-gray-400">Settings icon</span>
              </div>
              <div className="flex justify-between">
                <span>Clear All Effects</span>
                <span className="text-xs text-gray-400">Click "None"</span>
              </div>
              <div className="flex justify-between">
                <span>Download (in preview)</span>
                <kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Cancel (in preview)</span>
                <kbd className="bg-gray-700 px-2 py-1 rounded">Esc</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2 rounded-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(CameraView);
