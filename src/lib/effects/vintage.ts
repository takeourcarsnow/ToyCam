export function applyVintage(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  vignette: number = 0.5,
  scratch: number = 0.3
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
  
  // Apply sepia tone and vignette
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Sepia tone
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      data[idx] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[idx + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[idx + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      
      // Vignette
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const vignetteAmount = 1 - (dist / maxDist) * vignette;
      
      data[idx] *= vignetteAmount;
      data[idx + 1] *= vignetteAmount;
      data[idx + 2] *= vignetteAmount;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add random scratches
  if (Math.random() < scratch) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const x = Math.random() * width;
    const y1 = Math.random() * height;
    const y2 = y1 + Math.random() * 100 - 50;
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
