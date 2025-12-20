export function applyFilmGrain(
  imageData: ImageData,
  intensity: number = 0.15,
  grainSize: number = 1
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // If grain size is 1, apply per-pixel noise for fine grain
  if (grainSize <= 1) {
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 255;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
    return imageData;
  }

  // For larger grain sizes, create noise blocks
  const blockSize = Math.max(1, Math.floor(grainSize));
  const noiseMap: number[][] = [];

  // Generate noise for each block
  for (let by = 0; by < Math.ceil(height / blockSize); by++) {
    noiseMap[by] = [];
    for (let bx = 0; bx < Math.ceil(width / blockSize); bx++) {
      noiseMap[by][bx] = (Math.random() - 0.5) * intensity * 255;
    }
  }

  // Apply noise to pixels based on their block
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const bx = Math.floor(x / blockSize);
      const by = Math.floor(y / blockSize);
      const noise = noiseMap[by][bx];

      const idx = (y * width + x) * 4;
      data[idx] = Math.max(0, Math.min(255, data[idx] + noise));     // R
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + noise)); // G
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + noise)); // B
    }
  }

  return imageData;
}
