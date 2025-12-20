import { useState, useRef, useCallback, useEffect } from 'react';
import type { CameraState, AspectRatio } from '@/types/effects';

export function useCamera(aspectRatio: AspectRatio = '16:9') {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    facingMode: 'user',
    stream: null,
  });
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getConstraints = (facingMode: 'user' | 'environment', aspectRatio: AspectRatio) => {
    const aspectRatioValues = {
      '1:1': 1,
      '4:3': 4/3,
      '16:9': 16/9,
      '21:9': 21/9,
      '3:2': 3/2,
      '5:4': 5/4,
    };
    
    const videoConstraints: any = {
      facingMode,
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    };
    
    if (aspectRatio !== 'device') {
      videoConstraints.aspectRatio = { ideal: aspectRatioValues[aspectRatio] };
    }
    
    return {
      video: videoConstraints,
      audio: false,
    };
  };

  const startCamera = useCallback(async (facingMode: 'user' | 'environment' = 'user') => {
    try {
      setError(null);
      
      // Stop existing stream if any
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }

      const constraints = getConstraints(facingMode, aspectRatio);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays
        await videoRef.current.play().catch(e => console.error('Play error:', e));
      }

      setCameraState({
        isActive: true,
        facingMode,
        stream,
      });
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setCameraState((prev: CameraState) => ({ ...prev, isActive: false }));
    }
  }, [cameraState.stream, aspectRatio]);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraState({
      isActive: false,
      facingMode: cameraState.facingMode,
      stream: null,
    });
  }, [cameraState.stream, cameraState.facingMode]);

  const switchCamera = useCallback(() => {
    const newFacingMode = cameraState.facingMode === 'user' ? 'environment' : 'user';
    startCamera(newFacingMode);
  }, [cameraState.facingMode, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, [cameraState.stream]);

  return {
    videoRef,
    cameraState,
    error,
    startCamera,
    stopCamera,
    switchCamera,
  };
}
