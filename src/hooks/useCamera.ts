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
    
    // Use an object with `ideal` for facingMode to improve cross-browser compatibility
    const videoConstraints: any = {
      facingMode: { ideal: facingMode },
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

      // Try with an `ideal` facingMode first (more compatible across browsers)
      let constraints = getConstraints(facingMode, aspectRatio);
      let stream: MediaStream | null = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        console.warn('getUserMedia with ideal facingMode failed:', e);
        // Some mobile browsers (notably iOS Safari) require `exact: 'environment'` for the rear camera
        if (facingMode === 'environment') {
          try {
            constraints = {
              video: { facingMode: { exact: 'environment' }, width: { min: 640, ideal: 1280, max: 1920 }, height: { min: 480, ideal: 720, max: 1080 } },
              audio: false,
            };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
          } catch (err2) {
            console.warn('getUserMedia with exact environment failed:', err2);
          }
        }
      }

      if (!stream) {
        throw new Error('Unable to acquire requested camera');
      }

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
      setError('Unable to access camera. Please check permissions or try switching cameras.');
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
