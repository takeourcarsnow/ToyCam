'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useEffects } from '@/hooks/useEffects';
import type { EffectType, EffectSettings } from '@/types/effects';
import { defaultEffectSettings } from '@/types/effects';
import CameraView from './CameraView';

export default function CameraApp() {
  const [resolution, setResolution] = useState<'low' | 'medium' | 'high'>('medium');
  const { videoRef, cameraState, error, startCamera, stopCamera, switchCamera } = useCamera(resolution);
  const [currentEffect, setCurrentEffect] = useState<EffectType>('none');
  const [settings, setSettings] = useState<EffectSettings>(defaultEffectSettings);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isLoading, setIsLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const { canvasRef } = useEffects(videoRef, currentEffect, settings);

  const handleEffectChange = useCallback((effect: EffectType) => {
    setCurrentEffect(effect);
  }, []);

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
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      setIsPreviewMode(true);
    } else {
      // Video recording
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  }, [captureMode, canvasRef, isRecording]);

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
    if (captureMode === 'photo' && capturedPhoto) {
      const link = document.createElement('a');
      link.href = capturedPhoto;
      link.download = `camera-effect-${currentEffect}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (captureMode === 'video' && recordedVideo) {
      const link = document.createElement('a');
      link.href = recordedVideo;
      link.download = `camera-effect-${currentEffect}-${Date.now()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [captureMode, capturedPhoto, recordedVideo, currentEffect]);

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
      />
    </div>
  );
}
