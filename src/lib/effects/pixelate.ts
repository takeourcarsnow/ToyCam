export function applyPixelate(
  imageData: ImageData,
  pixelSize: number = 10
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // Calculate average color for this block
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;
      
      for (let py = 0; py < pixelSize && y + py < height; py++) {
        for (let px = 0; px < pixelSize && x + px < width; px++) {
          const idx = ((y + py) * width + (x + px)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
      }
      
      r /= count;
      g /= count;
      b /= count;
      a /= count;
      
      // Apply average color to all pixels in block
      for (let py = 0; py < pixelSize && y + py < height; py++) {
        for (let px = 0; px < pixelSize && x + px < width; px++) {
          const idx = ((y + py) * width + (x + px)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = a;
        }
      }
    }
  }
  
  return imageData;
}
