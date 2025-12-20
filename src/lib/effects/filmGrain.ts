export function applyFilmGrain(
  imageData: ImageData,
  intensity: number = 0.15
): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }
  
  return imageData;
}
