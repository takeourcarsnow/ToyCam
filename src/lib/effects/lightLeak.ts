export function applyLightLeak(imageData: ImageData, intensity: number, color: string, position: string): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  // Draw original image
  ctx.putImageData(imageData, 0, 0);

  // Create light leak overlay
  const overlayCanvas = document.createElement('canvas');
  const overlayCtx = overlayCanvas.getContext('2d')!;
  overlayCanvas.width = imageData.width;
  overlayCanvas.height = imageData.height;

  // Define gradient colors based on selected color
  const colorMap: Record<string, { start: string; end: string }> = {
    orange: { start: 'rgba(255, 165, 0, 0)', end: 'rgba(255, 140, 0, 0.8)' },
    purple: { start: 'rgba(128, 0, 128, 0)', end: 'rgba(75, 0, 130, 0.8)' },
    blue: { start: 'rgba(0, 191, 255, 0)', end: 'rgba(0, 0, 255, 0.8)' },
    green: { start: 'rgba(0, 255, 0, 0)', end: 'rgba(0, 128, 0, 0.8)' },
    pink: { start: 'rgba(255, 192, 203, 0)', end: 'rgba(255, 20, 147, 0.8)' },
  };

  const gradientColors = colorMap[color] || colorMap.orange;

  // Calculate gradient center based on position
  let centerX: number, centerY: number;
  const width = imageData.width;
  const height = imageData.height;

  switch (position) {
    case 'top-left':
      centerX = width * 0.2;
      centerY = height * 0.2;
      break;
    case 'top-right':
      centerX = width * 0.8;
      centerY = height * 0.2;
      break;
    case 'bottom-left':
      centerX = width * 0.2;
      centerY = height * 0.8;
      break;
    case 'bottom-right':
      centerX = width * 0.8;
      centerY = height * 0.8;
      break;
    case 'center':
    default:
      centerX = width * 0.5;
      centerY = height * 0.5;
      break;
  }

  // Create radial gradient
  const gradient = overlayCtx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, Math.max(width, height) * 0.7
  );

  gradient.addColorStop(0, gradientColors.start);
  gradient.addColorStop(1, gradientColors.end);

  overlayCtx.fillStyle = gradient;
  overlayCtx.fillRect(0, 0, width, height);

  // Apply intensity
  overlayCtx.globalAlpha = intensity;

  // Composite the overlay
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(overlayCanvas, 0, 0);

  return ctx.getImageData(0, 0, imageData.width, imageData.height);
}