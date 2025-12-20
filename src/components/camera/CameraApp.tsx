'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useEffects } from '@/hooks/useEffects';
import type { EffectType, EffectSettings, AspectRatio, OverlayType } from '@/types/effects';
import { defaultEffectSettings } from '@/types/effects';
import CameraView from './CameraView';

export default function CameraApp() {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [overlayType, setOverlayType] = useState<OverlayType>('none');
  const { videoRef, cameraState, error, startCamera, stopCamera, switchCamera } = useCamera(aspectRatio);
  const [currentEffect, setCurrentEffect] = useState<EffectType>('none');
  const [activeEffects, setActiveEffects] = useState<Set<EffectType>>(new Set());
  const [settings, setSettings] = useState<EffectSettings>(defaultEffectSettings);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isLoading, setIsLoading] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const { canvasRef } = useEffects(videoRef, activeEffects, settings, aspectRatio, overlayType);

  const handleEffectChange = useCallback((effect: EffectType) => {
    setActiveEffects(prev => {
      if (effect === 'none') {
        // Clicking "none" clears all effects
        return new Set();
      }
      
      const newSet = new Set(prev);
      if (newSet.has(effect)) {
        newSet.delete(effect);
      } else {
        newSet.add(effect);
      }
      return newSet;
    });
  }, []);

  const handleAspectRatioChange = useCallback(async (ratio: AspectRatio) => {
    const wasActive = cameraState.isActive;
    const facingMode = cameraState.facingMode;
    
    setAspectRatio(ratio);
    
    // If camera was active, restart it with new aspect ratio
    if (wasActive) {
      stopCamera();
      // Small delay to ensure camera is fully stopped
      setTimeout(() => {
        startCamera(facingMode);
      }, 100);
    }
  }, [cameraState.isActive, cameraState.facingMode, startCamera, stopCamera]);

  const handleOverlayChange = useCallback((overlay: OverlayType) => {
    setOverlayType(overlay);
  }, []);

  // Remove the separate useEffect for aspect ratio changes

  const handleSettingChange = useCallback((
    effect: EffectType,
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [effect]: {
        ...(prev as any)[effect],
        [key]: value,
      },
    }));
  }, []);

  const handleCapture = useCallback(() => {
    if (captureMode === 'photo') {
      if (rawMode) {
        // Capture raw photo directly from video
        const video = videoRef.current;
        if (video) {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            setCapturedPhoto(dataUrl);
            setIsPreviewMode(true);
          }
        }
      } else {
        // Capture with effects from canvas
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedPhoto(dataUrl);
        setIsPreviewMode(true);
      }
    } else {
      // Video recording
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  }, [captureMode, rawMode, canvasRef, videoRef, isRecording]);

  const startRecording = useCallback(() => {
    if (!canvasRef.current || !cameraState.stream) return;

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30); // 30 FPS

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);
      setIsPreviewMode(true);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  }, [canvasRef, cameraState.stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleDownload = useCallback(() => {
    const effectNames = Array.from(activeEffects).join('-') || 'none';
    if (captureMode === 'photo' && capturedPhoto) {
      const link = document.createElement('a');
      link.href = capturedPhoto;
      link.download = `camera-${rawMode ? 'raw' : 'effect'}-${effectNames}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (captureMode === 'video' && recordedVideo) {
      const link = document.createElement('a');
      link.href = recordedVideo;
      link.download = `camera-effect-${effectNames}-${Date.now()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [captureMode, capturedPhoto, recordedVideo, activeEffects, rawMode]);

  const handleCancel = useCallback(() => {
    setCapturedPhoto(null);
    setRecordedVideo(null);
    setIsPreviewMode(false);
    setIsRecording(false);
    
    // Clean up video URL
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
  }, [recordedVideo]);

  const toggleCaptureMode = useCallback(() => {
    setCaptureMode(prev => prev === 'photo' ? 'video' : 'photo');
  }, []);

  const toggleRawMode = useCallback(() => {
    setRawMode(prev => !prev);
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleToggleCamera = useCallback(async () => {
    if (cameraState.isActive) {
      stopCamera();
    } else {
      setIsLoading(true);
      try {
        await startCamera();
      } finally {
        setIsLoading(false);
      }
    }
  }, [cameraState.isActive, startCamera, stopCamera]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (!isPreviewMode) {
            handleCapture();
          }
          break;
        case 'KeyC':
          event.preventDefault();
          handleToggleCamera();
          break;
        case 'KeyV':
          event.preventDefault();
          toggleCaptureMode();
          break;
        case 'Escape':
          event.preventDefault();
          if (isPreviewMode) {
            handleCancel();
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (isPreviewMode) {
            handleDownload();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCapture, handleToggleCamera, toggleCaptureMode, handleCancel, handleDownload, isPreviewMode]);

  return (
    <div className="flex flex-col h-screen">
      <CameraView
        videoRef={videoRef}
        canvasRef={canvasRef}
        cameraActive={cameraState.isActive}
        error={error}
        currentEffect={currentEffect}
        activeEffects={activeEffects}
        settings={settings}
        onSettingChange={handleSettingChange}
        onEffectChange={handleEffectChange}
        capturedPhoto={capturedPhoto}
        recordedVideo={recordedVideo}
        isPreviewMode={isPreviewMode}
        isRecording={isRecording}
        captureMode={captureMode}
        onCapture={handleCapture}
        onDownload={handleDownload}
        onCancel={handleCancel}
        onToggleCaptureMode={toggleCaptureMode}
        onToggleCamera={handleToggleCamera}
        onSwitchCamera={switchCamera}
        isLoading={isLoading}
        aspectRatio={aspectRatio}
        onAspectRatioChange={handleAspectRatioChange}
        overlayType={overlayType}
        onOverlayChange={handleOverlayChange}
        rawMode={rawMode}
        onToggleRawMode={toggleRawMode}
        showSettings={showSettings}
        onToggleSettings={toggleSettings}
      />
    </div>
  );
}
