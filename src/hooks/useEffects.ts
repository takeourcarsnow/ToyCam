import { useRef, useCallback, useEffect } from 'react';
import type { EffectType, EffectSettings } from '@/types/effects';
import { EFFECT_FUNCTIONS } from '@/lib/effects';

export function useEffects(
  videoRef: React.RefObject<HTMLVideoElement>,
  currentEffect: EffectType,
  settings: EffectSettings
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const frameCount = useRef(0);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState < 2 || video.paused || video.videoWidth === 0) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    frameCount.current++;

    // Always draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply effect if active
    if (currentEffect !== 'none') {
      const effectFunction = EFFECT_FUNCTIONS[currentEffect];
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const result = effectFunction.apply(imageData, (settings as any)[currentEffect], canvas);

      if (!effectFunction.usesCanvas && result) {
        ctx.putImageData(result, 0, 0);
      }
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoRef, currentEffect, settings]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [processFrame]);

  return { canvasRef };
}
