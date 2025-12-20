import { useRef, useCallback, useEffect } from 'react';
import type { EffectType, EffectSettings, AspectRatio, OverlayType } from '@/types/effects';
import { EFFECT_FUNCTIONS } from '@/lib/effects';

export function useEffects(
  videoRef: React.RefObject<HTMLVideoElement>,
  activeEffects: Set<EffectType>,
  settings: EffectSettings,
  aspectRatio: AspectRatio,
  overlayType: OverlayType
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const frameCount = useRef(0);

  const drawOverlay = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, overlayType: OverlayType) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

    switch (overlayType) {
      case 'rule-of-thirds':
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, height / 3);
        ctx.lineTo(width, height / 3);
        ctx.moveTo(0, (height * 2) / 3);
        ctx.lineTo(width, (height * 2) / 3);
        // Vertical lines
        ctx.moveTo(width / 3, 0);
        ctx.lineTo(width / 3, height);
        ctx.moveTo((width * 2) / 3, 0);
        ctx.lineTo((width * 2) / 3, height);
        ctx.stroke();
        break;

      case 'golden-ratio':
        const goldenHeight = height / phi;
        const goldenWidth = width / phi;
        
        ctx.beginPath();
        // Horizontal lines
        ctx.moveTo(0, goldenHeight);
        ctx.lineTo(width, goldenHeight);
        ctx.moveTo(0, height - goldenHeight);
        ctx.lineTo(width, height - goldenHeight);
        // Vertical lines
        ctx.moveTo(goldenWidth, 0);
        ctx.lineTo(goldenWidth, height);
        ctx.moveTo(width - goldenWidth, 0);
        ctx.lineTo(width - goldenWidth, height);
        ctx.stroke();
        break;

      case 'golden-spiral':
        // Golden spiral like classic photo overlays:
        // 1) Fit a golden rectangle inside the canvas
        // 2) Subdivide it into Fibonacci-like squares
        // 3) Draw quarter-circle arcs through those squares
        ctx.setLineDash([]);

        // Fit a golden rectangle (ratio = phi) inside the canvas
        let gx = 0;
        let gy = 0;
        let gw = width;
        let gh = height;

        const canvasRatio = width / height;
        if (canvasRatio >= phi) {
          // Canvas is wider than (or equal to) golden rectangle
          gh = height;
          gw = height * phi;
          gx = (width - gw) / 2;
          gy = 0;
        } else {
          // Canvas is taller than golden rectangle
          gw = width;
          gh = width / phi;
          gx = 0;
          gy = (height - gh) / 2;
        }

        // Draw the outer golden rectangle
        ctx.beginPath();
        ctx.rect(gx, gy, gw, gh);
        ctx.stroke();

        // Subdivide into squares and build the spiral
        let rx = gx;
        let ry = gy;
        let rw = gw;
        let rh = gh;

        // Direction cycle places the next square on:
        // 0 = right, 1 = bottom, 2 = left, 3 = top
        let dir: 0 | 1 | 2 | 3 = 0;

        // Draw square boundaries (like the reference) + arc spiral
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const s = dir % 2 === 0 ? rh : rw;
          if (s < 6 || rw < 6 || rh < 6) break;

          let sx = rx;
          let sy = ry;

          if (dir === 0) {
            // Right
            sx = rx + rw - s;
            sy = ry;
          } else if (dir === 1) {
            // Bottom
            sx = rx;
            sy = ry + rh - s;
          } else if (dir === 2) {
            // Left
            sx = rx;
            sy = ry;
          } else {
            // Top
            sx = rx;
            sy = ry;
          }

          // Square outline
          ctx.strokeRect(sx, sy, s, s);

          // Quarter-circle arc inside the square
          let cx = sx;
          let cy = sy;
          let start = 0;
          let end = 0;

          if (dir === 0) {
            // Square on the right: center at bottom-right
            cx = sx + s;
            cy = sy + s;
            start = Math.PI;
            end = Math.PI * 1.5;
          } else if (dir === 1) {
            // Square on the bottom: center at bottom-left
            cx = sx;
            cy = sy + s;
            start = Math.PI * 1.5;
            end = 0;
          } else if (dir === 2) {
            // Square on the left: center at top-left
            cx = sx;
            cy = sy;
            start = 0;
            end = Math.PI * 0.5;
          } else {
            // Square on the top: center at top-right
            cx = sx + s;
            cy = sy;
            start = Math.PI * 0.5;
            end = Math.PI;
          }

          // Avoid connecting line segments between arcs
          ctx.moveTo(cx + s * Math.cos(start), cy + s * Math.sin(start));
          ctx.arc(cx, cy, s, start, end);

          // Update remaining rectangle
          if (dir === 0) {
            rw -= s;
          } else if (dir === 1) {
            rh -= s;
          } else if (dir === 2) {
            rx += s;
            rw -= s;
          } else {
            ry += s;
            rh -= s;
          }

          dir = ((dir + 1) % 4) as 0 | 1 | 2 | 3;
        }

        ctx.stroke();
        break;

      case 'diagonal':
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height);
        ctx.moveTo(width, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
        break;

      case 'center-cross':
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }, []);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState < 2 || video.paused || video.videoWidth === 0) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Calculate target dimensions based on aspect ratio
    const aspectRatioValues = {
      '1:1': 1,
      '4:3': 4/3,
      '16:9': 16/9,
      '21:9': 21/9,
      '3:2': 3/2,
      '5:4': 5/4,
    };
    
    let sourceX = 0, sourceY = 0, sourceWidth = video.videoWidth, sourceHeight = video.videoHeight;
    let canvasWidth, canvasHeight;
    
    if (aspectRatio === 'device') {
      // No cropping - use device dimensions
      canvasWidth = video.videoWidth;
      canvasHeight = video.videoHeight;
    } else {
      const targetRatio = aspectRatioValues[aspectRatio];
      const videoRatio = video.videoWidth / video.videoHeight;
      
      if (videoRatio > targetRatio) {
        // Video is wider than target - crop sides
        canvasHeight = video.videoHeight;
        canvasWidth = video.videoHeight * targetRatio;
        sourceWidth = canvasWidth;
        sourceX = (video.videoWidth - sourceWidth) / 2;
      } else {
        // Video is taller than target - crop top/bottom
        canvasWidth = video.videoWidth;
        canvasHeight = video.videoWidth / targetRatio;
        sourceHeight = canvasHeight;
        sourceY = (video.videoHeight - sourceHeight) / 2;
      }
    }

    // Set canvas size to target dimensions
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    frameCount.current++;

    // Draw the cropped video frame
    ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvasWidth, canvasHeight);

    // Apply effects in sequence if any are active
    if (activeEffects.size > 0) {
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for (const effect of Array.from(activeEffects)) {
        if (effect === 'none') continue;
        
        const effectFunction = EFFECT_FUNCTIONS[effect];
        const result = effectFunction.apply(imageData, (settings as any)[effect], canvas);

        if (!effectFunction.usesCanvas && result) {
          imageData = result;
        }
      }

      // Apply the final result back to canvas if we have non-canvas effects
      const hasNonCanvasEffects = Array.from(activeEffects).some(effect => 
        effect !== 'none' && !EFFECT_FUNCTIONS[effect].usesCanvas
      );
      if (hasNonCanvasEffects) {
        ctx.putImageData(imageData, 0, 0);
      }
    }

    // Draw overlay if active
    if (overlayType !== 'none') {
      drawOverlay(ctx, canvas.width, canvas.height, overlayType);
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoRef, activeEffects, settings, aspectRatio, overlayType, drawOverlay]);

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
