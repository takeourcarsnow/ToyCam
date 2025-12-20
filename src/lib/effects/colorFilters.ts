type ColorTransform = (r: number, g: number, b: number) => { r: number; g: number; b: number };

export function applyColorTransform(
  imageData: ImageData,
  transform: ColorTransform,
  intensity: number = 1
): ImageData {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const transformed = transform(r, g, b);

    data[i] = r + (transformed.r - r) * intensity;
    data[i + 1] = g + (transformed.g - g) * intensity;
    data[i + 2] = b + (transformed.b - b) * intensity;
  }

  return imageData;
}

export function applySepia(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => ({
    r: Math.min(255, r * 0.393 + g * 0.769 + b * 0.189),
    g: Math.min(255, r * 0.349 + g * 0.686 + b * 0.168),
    b: Math.min(255, r * 0.272 + g * 0.534 + b * 0.131),
  }), intensity);
}

export function applyGrayscale(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => {
    const gray = r * 0.299 + g * 0.587 + b * 0.114;
    return { r: gray, g: gray, b: gray };
  }, intensity);
}

export function applyInvert(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => ({
    r: 255 - r,
    g: 255 - g,
    b: 255 - b,
  }), intensity);
}
