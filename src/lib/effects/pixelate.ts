export function applyPixelate(
  imageData: ImageData,
  pixelSize: number = 10
): ImageData {
  if (pixelSize <= 1) return imageData;

  // Create temporary canvases for efficient scaling
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return imageData;

  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  tempCtx.putImageData(imageData, 0, 0);

  // Scale down to create pixelation effect
  const scaledWidth = Math.max(1, Math.ceil(imageData.width / pixelSize));
  const scaledHeight = Math.max(1, Math.ceil(imageData.height / pixelSize));

  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = scaledWidth;
  scaledCanvas.height = scaledHeight;
  const scaledCtx = scaledCanvas.getContext('2d');
  if (!scaledCtx) return imageData;

  scaledCtx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight);

  // Scale back up with nearest-neighbor interpolation for pixelation
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(scaledCanvas, 0, 0, imageData.width, imageData.height);

  return tempCtx.getImageData(0, 0, imageData.width, imageData.height);
}
