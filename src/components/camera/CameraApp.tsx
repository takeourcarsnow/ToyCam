'use client';

import { useState, useRef } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useEffects } from '@/hooks/useEffects';
import type { EffectType, EffectSettings } from '@/types/effects';
import { defaultEffectSettings } from '@/types/effects';
import CameraView from './CameraView';
import EffectsPanel from './EffectsPanel';

export default function CameraApp() {
  const { videoRef, cameraState, error, startCamera, stopCamera, switchCamera } = useCamera();
  const [currentEffect, setCurrentEffect] = useState<EffectType>('none');
  const [settings, setSettings] = useState<EffectSettings>(defaultEffectSettings);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const { canvasRef } = useEffects(videoRef, currentEffect, settings);

  const handleEffectChange = (effect: EffectType) => {
    setCurrentEffect(effect);
  };

  const handleSettingChange = (
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
  };

  const handleCapture = () => {
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
  };

  const startRecording = () => {
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
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
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
  };

  const handleCancel = () => {
    setCapturedPhoto(null);
    setRecordedVideo(null);
    setIsPreviewMode(false);
    setIsRecording(false);
    
    // Clean up video URL
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
  };

  const toggleCaptureMode = () => {
    setCaptureMode(prev => prev === 'photo' ? 'video' : 'photo');
  };

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
        onToggleCamera={cameraState.isActive ? stopCamera : () => startCamera()}
        onSwitchCamera={switchCamera}
      />
    </div>
  );
}
