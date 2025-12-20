export function applyFrame(canvas: HTMLCanvasElement, imageData: ImageData, thickness: number, color: string): void {
  const ctx = canvas.getContext('2d')!;
  const width = imageData.width;
  const height = imageData.height;

  // Draw original image
  ctx.putImageData(imageData, 0, 0);

  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  // Simple rectangular frame
  ctx.strokeRect(thickness / 2, thickness / 2, width - thickness, height - thickness);
}