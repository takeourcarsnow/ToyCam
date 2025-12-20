export function applyCRT(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  scanlineIntensity: number = 0.3,
  curvature: number = 0.1
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Create a temporary canvas for the curved effect
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Draw the original image to temp canvas
  tempCtx.putImageData(imageData, 0, 0);

  // Clear main canvas
  ctx.clearRect(0, 0, width, height);

  // Apply curvature distortion
  if (curvature > 0) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

    // Create curved image data
    const curvedImageData = ctx.createImageData(width, height);
    const curvedData = curvedImageData.data;
    const sourceData = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply barrel distortion
        const distortion = 1 + (distance / maxRadius) * curvature;
        const sourceX = Math.round(centerX + dx / distortion);
        const sourceY = Math.round(centerY + dy / distortion);

        // Check bounds
        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          const targetIndex = (y * width + x) * 4;

          curvedData[targetIndex] = sourceData[sourceIndex];     // R
          curvedData[targetIndex + 1] = sourceData[sourceIndex + 1]; // G
          curvedData[targetIndex + 2] = sourceData[sourceIndex + 2]; // B
          curvedData[targetIndex + 3] = sourceData[sourceIndex + 3]; // A
        }
      }
    }

    ctx.putImageData(curvedImageData, 0, 0);
  } else {
    // No curvature, just draw original
    ctx.putImageData(imageData, 0, 0);
  }

  // Apply scanlines
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';

  for (let y = 0; y < height; y += 2) {
    ctx.globalAlpha = scanlineIntensity;
    ctx.fillRect(0, y, width, 1);
  }

  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // Add slight RGB separation for CRT effect
  const finalImageData = ctx.getImageData(0, 0, width, height);
  const data = finalImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (i > 8) {
      data[i] = data[i - 8]; // Shift red channel
    }
    if (i < data.length - 8) {
      data[i + 2] = data[i + 10]; // Shift blue channel
    }
  }

  ctx.putImageData(finalImageData, 0, 0);
}
