import { useState, useRef, useCallback, useEffect } from 'react';
import type { CameraState } from '@/types/effects';

export function useCamera() {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    facingMode: 'user',
    stream: null,
  });
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async (facingMode: 'user' | 'environment' = 'user') => {
    try {
      setError(null);
      
      // Stop existing stream if any
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

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
  }, [cameraState.stream]);

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
