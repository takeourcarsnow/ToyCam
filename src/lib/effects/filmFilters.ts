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

// Kodak T-MAX 400 - High contrast black and white film
export function applyTMax(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => {
    // Convert to grayscale with T-MAX characteristics (emphasizes blue and green)
    const gray = r * 0.2 + g * 0.7 + b * 0.1;

    // Apply high contrast curve typical of T-MAX 400
    let newGray = gray;
    if (newGray < 32) newGray = newGray * 0.5; // Very deep shadows
    else if (newGray < 96) newGray = 16 + (newGray - 32) * 1.5;
    else if (newGray < 160) newGray = 96 + (newGray - 96) * 1.2;
    else if (newGray < 224) newGray = 160 + (newGray - 160) * 1.1;
    else newGray = 224 + (newGray - 224) * 0.8; // Soft highlights

    // Slight cool tone by reducing red channel slightly
    const coolFactor = 0.98;
    newGray = Math.max(0, Math.min(255, newGray * coolFactor));

    return {
      r: newGray,
      g: newGray,
      b: newGray
    };
  }, intensity);
}

// Kodak Portra 400 - Warm, natural skin tones, rich colors
export function applyPortra(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => {
    // Warm tone with natural color reproduction
    const warmth = 1.1;
    const saturation = 1.05;

    let newR = r * warmth * saturation;
    let newG = g * 1.02 * saturation;
    let newB = b * 0.95 * saturation;

    // Slight S-curve for better contrast
    newR = newR > 128 ? 128 + (newR - 128) * 1.1 : 128 - (128 - newR) * 1.1;
    newG = newG > 128 ? 128 + (newG - 128) * 1.05 : 128 - (128 - newG) * 1.05;
    newB = newB > 128 ? 128 + (newB - 128) * 1.05 : 128 - (128 - newB) * 1.05;

    return {
      r: Math.max(0, Math.min(255, newR)),
      g: Math.max(0, Math.min(255, newG)),
      b: Math.max(0, Math.min(255, newB))
    };
  }, intensity);
}

// Kodak Ektar 100 - Ultra-fine grain, vibrant colors, high sharpness
export function applyEktar(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => {
    // High saturation and contrast
    const saturation = 1.15;
    const contrast = 1.1;

    let newR = (r - 128) * contrast + 128;
    let newG = (g - 128) * contrast + 128;
    let newB = (b - 128) * contrast + 128;

    // Vibrant color boost
    newR = newR * saturation;
    newG = newG * saturation * 1.05; // Slight green boost
    newB = newB * saturation * 1.1; // Blue boost for sky/clouds

    return {
      r: Math.max(0, Math.min(255, newR)),
      g: Math.max(0, Math.min(255, newG)),
      b: Math.max(0, Math.min(255, newB))
    };
  }, intensity);
}

// Fujifilm Provia 100F - Natural colors, fine grain, balanced contrast
export function applyProvia(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => {
    // Natural color reproduction with slight warmth
    const warmth = 1.05;
    const saturation = 1.08;

    let newR = r * warmth * saturation;
    let newG = g * saturation;
    let newB = b * 0.98 * saturation;

    // Subtle contrast enhancement
    newR = newR > 128 ? 128 + (newR - 128) * 1.05 : 128 - (128 - newR) * 1.05;
    newG = newG > 128 ? 128 + (newG - 128) * 1.02 : 128 - (128 - newG) * 1.02;
    newB = newB > 128 ? 128 + (newB - 128) * 1.02 : 128 - (128 - newB) * 1.02;

    return {
      r: Math.max(0, Math.min(255, newR)),
      g: Math.max(0, Math.min(255, newG)),
      b: Math.max(0, Math.min(255, newB))
    };
  }, intensity);
}

// Kodak Tri-X 400 - Classic black and white with silver-rich emulsion
export function applyTriX(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => {
    // Classic B&W conversion with Tri-X characteristics
    const gray = r * 0.25 + g * 0.65 + b * 0.1; // Emphasize green channel

    // Add slight warmth and contrast
    let newGray = (gray - 128) * 1.15 + 128;
    newGray = newGray * 1.02; // Slight brightness boost

    return {
      r: Math.max(0, Math.min(255, newGray)),
      g: Math.max(0, Math.min(255, newGray)),
      b: Math.max(0, Math.min(255, newGray))
    };
  }, intensity);
}

// Ilford HP5 Plus - High contrast B&W with rich shadows
export function applyHP5(imageData: ImageData, intensity: number = 1): ImageData {
  return applyColorTransform(imageData, (r, g, b) => {
    // High contrast B&W with emphasis on shadows
    const gray = r * 0.3 + g * 0.59 + b * 0.11;

    // Strong contrast curve
    let newGray = gray;
    if (newGray < 64) newGray = newGray * 0.8; // Deepen shadows
    else if (newGray < 128) newGray = 64 + (newGray - 64) * 1.2;
    else if (newGray < 192) newGray = 128 + (newGray - 128) * 1.1;
    else newGray = 192 + (newGray - 192) * 0.9; // Soften highlights

    return {
      r: Math.max(0, Math.min(255, newGray)),
      g: Math.max(0, Math.min(255, newGray)),
      b: Math.max(0, Math.min(255, newGray))
    };
  }, intensity);
}