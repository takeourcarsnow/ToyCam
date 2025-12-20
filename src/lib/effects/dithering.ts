// Color palettes for different systems
const PALETTES: Record<string, number[][]> = {
  none: [], // Uses quantization
  gameboy: [
    [15, 56, 15],    // Dark green
    [48, 98, 48],    // Medium green
    [139, 172, 15],  // Light green
    [155, 188, 15],  // Lightest green
  ],
  gameboyPocket: [
    [0, 0, 0],
    [85, 85, 85],
    [170, 170, 170],
    [255, 255, 255],
  ],
  sega: [
    [0, 0, 0],
    [0, 0, 168],
    [0, 168, 0],
    [0, 168, 168],
    [168, 0, 0],
    [168, 0, 168],
    [168, 84, 0],
    [168, 168, 168],
    [84, 84, 84],
    [84, 84, 252],
    [84, 252, 84],
    [84, 252, 252],
    [252, 84, 84],
    [252, 84, 252],
    [252, 252, 84],
    [252, 252, 252],
  ],
  atari: [
    [0, 0, 0],
    [68, 68, 0],
    [112, 40, 0],
    [132, 24, 0],
    [136, 0, 0],
    [120, 0, 92],
    [72, 0, 120],
    [20, 0, 132],
    [0, 0, 136],
    [0, 24, 124],
    [0, 44, 92],
    [0, 60, 44],
    [0, 60, 0],
  ],
  macos: [
    [255, 255, 255],
    [255, 255, 0],
    [255, 102, 0],
    [221, 0, 0],
    [255, 0, 153],
    [51, 0, 153],
    [0, 0, 211],
    [0, 153, 255],
    [0, 170, 0],
    [51, 102, 0],
    [102, 51, 0],
    [136, 136, 136],
    [85, 85, 85],
    [0, 0, 0],
  ],
  commodore64: [
    [0, 0, 0],
    [255, 255, 255],
    [136, 0, 0],
    [170, 255, 238],
    [204, 68, 204],
    [0, 204, 85],
    [0, 0, 170],
    [238, 238, 119],
    [221, 136, 85],
    [102, 68, 0],
    [255, 119, 119],
    [51, 51, 51],
    [119, 119, 119],
    [170, 255, 102],
    [0, 136, 255],
    [187, 187, 187],
  ],
  nes: [
    [124, 124, 124],
    [0, 0, 252],
    [0, 0, 188],
    [68, 40, 188],
    [148, 0, 132],
    [168, 0, 32],
    [168, 16, 0],
    [136, 20, 0],
    [80, 48, 0],
    [0, 120, 0],
    [0, 104, 0],
    [0, 88, 0],
    [0, 64, 88],
    [0, 0, 0],
  ],
  cga: [
    [0, 0, 0],
    [0, 0, 170],
    [0, 170, 0],
    [0, 170, 170],
    [170, 0, 0],
    [170, 0, 170],
    [170, 85, 0],
    [170, 170, 170],
    [85, 85, 85],
    [85, 85, 255],
    [85, 255, 85],
    [85, 255, 255],
    [255, 85, 85],
    [255, 85, 255],
    [255, 255, 85],
    [255, 255, 255],
  ],
};

function findClosestPaletteColor(r: number, g: number, b: number, palette: number[][]): number[] {
  if (!palette || palette.length === 0) {
    // Fallback to original color if no palette
    return [r, g, b];
  }
  
  let minDist = Infinity;
  let closest = palette[0];
  
  for (const color of palette) {
    const dist = Math.sqrt(
      Math.pow(r - color[0], 2) +
      Math.pow(g - color[1], 2) +
      Math.pow(b - color[2], 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closest = color;
    }
  }
  
  return closest;
}

export function applyDithering(
  imageData: ImageData,
  colors: number = 8,
  method: 'floyd-steinberg' | 'bayer' | 'atkinson' | 'ordered' | 'random' = 'floyd-steinberg',
  scale: number = 1,
  palette: string = 'none'
): ImageData {
  const paletteColors = PALETTES[palette] || null;
  
  switch (method) {
    case 'floyd-steinberg':
      return floydSteinbergDithering(imageData, colors, scale, paletteColors);
    case 'atkinson':
      return atkinsonDithering(imageData, colors, scale, paletteColors);
    case 'ordered':
      return orderedDithering(imageData, colors, scale, paletteColors, 8);
    case 'random':
      return randomDithering(imageData, colors, scale, paletteColors);
    case 'bayer':
    default:
      return bayerDithering(imageData, colors, scale, paletteColors);
  }
}

function floydSteinbergDithering(
  imageData: ImageData,
  colors: number,
  scale: number,
  palette: number[][] | null
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const step = Math.max(1, Math.floor(scale));
  
  // Create a copy to avoid modifying while reading
  const original = new Uint8ClampedArray(data);
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      
      let newR: number, newG: number, newB: number;
      
      if (palette) {
        // Use palette
        const closest = findClosestPaletteColor(original[idx], original[idx + 1], original[idx + 2], palette);
        [newR, newG, newB] = closest;
      } else {
        // Quantize each channel
        const quantize = (val: number) => Math.round((val / 255) * (colors - 1)) / (colors - 1) * 255;
        newR = quantize(original[idx]);
        newG = quantize(original[idx + 1]);
        newB = quantize(original[idx + 2]);
      }
      
      const errorR = original[idx] - newR;
      const errorG = original[idx + 1] - newG;
      const errorB = original[idx + 2] - newB;
      
      // Apply to block
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const blockIdx = ((y + dy) * width + (x + dx)) * 4;
          data[blockIdx] = newR;
          data[blockIdx + 1] = newG;
          data[blockIdx + 2] = newB;
        }
      }
      
      // Distribute error to neighboring blocks
      const nextX = x + step;
      const nextY = y + step;
      
      if (nextX < width) {
        const rightIdx = (y * width + nextX) * 4;
        original[rightIdx] = Math.max(0, Math.min(255, original[rightIdx] + errorR * 7 / 16));
        original[rightIdx + 1] = Math.max(0, Math.min(255, original[rightIdx + 1] + errorG * 7 / 16));
        original[rightIdx + 2] = Math.max(0, Math.min(255, original[rightIdx + 2] + errorB * 7 / 16));
      }
      if (nextY < height) {
        if (x >= step) {
          const blIdx = (nextY * width + (x - step)) * 4;
          original[blIdx] = Math.max(0, Math.min(255, original[blIdx] + errorR * 3 / 16));
          original[blIdx + 1] = Math.max(0, Math.min(255, original[blIdx + 1] + errorG * 3 / 16));
          original[blIdx + 2] = Math.max(0, Math.min(255, original[blIdx + 2] + errorB * 3 / 16));
        }
        const downIdx = (nextY * width + x) * 4;
        original[downIdx] = Math.max(0, Math.min(255, original[downIdx] + errorR * 5 / 16));
        original[downIdx + 1] = Math.max(0, Math.min(255, original[downIdx + 1] + errorG * 5 / 16));
        original[downIdx + 2] = Math.max(0, Math.min(255, original[downIdx + 2] + errorB * 5 / 16));
        if (nextX < width) {
          const brIdx = (nextY * width + nextX) * 4;
          original[brIdx] = Math.max(0, Math.min(255, original[brIdx] + errorR * 1 / 16));
          original[brIdx + 1] = Math.max(0, Math.min(255, original[brIdx + 1] + errorG * 1 / 16));
          original[brIdx + 2] = Math.max(0, Math.min(255, original[brIdx + 2] + errorB * 1 / 16));
        }
      }
    }
  }
  
  return imageData;
}

function bayerDithering(
  imageData: ImageData,
  colors: number,
  scale: number,
  palette: number[][] | null
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const step = Math.max(1, Math.floor(scale));
  
  const bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const threshold = (bayerMatrix[Math.floor(y / step) % 4][Math.floor(x / step) % 4] / 16 - 0.5);
      
      let newR: number, newG: number, newB: number;
      
      if (palette) {
        const adjustedR = Math.max(0, Math.min(255, data[idx] + threshold * 128));
        const adjustedG = Math.max(0, Math.min(255, data[idx + 1] + threshold * 128));
        const adjustedB = Math.max(0, Math.min(255, data[idx + 2] + threshold * 128));
        const closest = findClosestPaletteColor(adjustedR, adjustedG, adjustedB, palette);
        [newR, newG, newB] = closest;
      } else {
        const quantize = (val: number, thresh: number) => {
          const adjusted = val / 255 + thresh / (colors - 1);
          const colorLevel = Math.round(adjusted * (colors - 1));
          return Math.max(0, Math.min(255, (colorLevel / (colors - 1)) * 255));
        };
        newR = quantize(data[idx], threshold);
        newG = quantize(data[idx + 1], threshold);
        newB = quantize(data[idx + 2], threshold);
      }
      
      // Apply to block
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const blockIdx = ((y + dy) * width + (x + dx)) * 4;
          data[blockIdx] = newR;
          data[blockIdx + 1] = newG;
          data[blockIdx + 2] = newB;
        }
      }
    }
  }
  
  return imageData;
}

function atkinsonDithering(
  imageData: ImageData,
  colors: number,
  scale: number,
  palette: number[][] | null
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const step = Math.max(1, Math.floor(scale));
  const original = new Uint8ClampedArray(data);
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      
      let newR: number, newG: number, newB: number;
      
      if (palette) {
        const closest = findClosestPaletteColor(original[idx], original[idx + 1], original[idx + 2], palette);
        [newR, newG, newB] = closest;
      } else {
        const quantize = (val: number) => Math.round((val / 255) * (colors - 1)) / (colors - 1) * 255;
        newR = quantize(original[idx]);
        newG = quantize(original[idx + 1]);
        newB = quantize(original[idx + 2]);
      }
      
      const errorR = original[idx] - newR;
      const errorG = original[idx + 1] - newG;
      const errorB = original[idx + 2] - newB;
      
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const blockIdx = ((y + dy) * width + (x + dx)) * 4;
          data[blockIdx] = newR;
          data[blockIdx + 1] = newG;
          data[blockIdx + 2] = newB;
        }
      }
      
      // Atkinson diffusion pattern (1/8 each)
      const distribute = (dx: number, dy: number) => {
        const nx = x + dx * step;
        const ny = y + dy * step;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const i = (ny * width + nx) * 4;
          original[i] = Math.max(0, Math.min(255, original[i] + errorR / 8));
          original[i + 1] = Math.max(0, Math.min(255, original[i + 1] + errorG / 8));
          original[i + 2] = Math.max(0, Math.min(255, original[i + 2] + errorB / 8));
        }
      };
      
      distribute(1, 0);
      distribute(2, 0);
      distribute(-1, 1);
      distribute(0, 1);
      distribute(1, 1);
      distribute(0, 2);
    }
  }
  
  return imageData;
}

function orderedDithering(
  imageData: ImageData,
  colors: number,
  scale: number,
  palette: number[][] | null,
  matrixSize: number = 8
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const step = Math.max(1, Math.floor(scale));
  
  // 8x8 Bayer matrix
  const matrix8x8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const threshold = (matrix8x8[Math.floor(y / step) % 8][Math.floor(x / step) % 8] / 64 - 0.5);
      
      let newR: number, newG: number, newB: number;
      
      if (palette) {
        const adjustedR = Math.max(0, Math.min(255, data[idx] + threshold * 128));
        const adjustedG = Math.max(0, Math.min(255, data[idx + 1] + threshold * 128));
        const adjustedB = Math.max(0, Math.min(255, data[idx + 2] + threshold * 128));
        const closest = findClosestPaletteColor(adjustedR, adjustedG, adjustedB, palette);
        [newR, newG, newB] = closest;
      } else {
        const quantize = (val: number, thresh: number) => {
          const adjusted = val / 255 + thresh / (colors - 1);
          const colorLevel = Math.round(adjusted * (colors - 1));
          return Math.max(0, Math.min(255, (colorLevel / (colors - 1)) * 255));
        };
        newR = quantize(data[idx], threshold);
        newG = quantize(data[idx + 1], threshold);
        newB = quantize(data[idx + 2], threshold);
      }
      
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const blockIdx = ((y + dy) * width + (x + dx)) * 4;
          data[blockIdx] = newR;
          data[blockIdx + 1] = newG;
          data[blockIdx + 2] = newB;
        }
      }
    }
  }
  
  return imageData;
}

function randomDithering(
  imageData: ImageData,
  colors: number,
  scale: number,
  palette: number[][] | null
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const step = Math.max(1, Math.floor(scale));
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const noise = (Math.random() - 0.5) * 0.5;
      
      let newR: number, newG: number, newB: number;
      
      if (palette) {
        const adjustedR = Math.max(0, Math.min(255, data[idx] + noise * 128));
        const adjustedG = Math.max(0, Math.min(255, data[idx + 1] + noise * 128));
        const adjustedB = Math.max(0, Math.min(255, data[idx + 2] + noise * 128));
        const closest = findClosestPaletteColor(adjustedR, adjustedG, adjustedB, palette);
        [newR, newG, newB] = closest;
      } else {
        const quantize = (val: number) => {
          const adjusted = val / 255 + noise / (colors - 1);
          const colorLevel = Math.round(adjusted * (colors - 1));
          return Math.max(0, Math.min(255, (colorLevel / (colors - 1)) * 255));
        };
        newR = quantize(data[idx]);
        newG = quantize(data[idx + 1]);
        newB = quantize(data[idx + 2]);
      }
      
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const blockIdx = ((y + dy) * width + (x + dx)) * 4;
          data[blockIdx] = newR;
          data[blockIdx + 1] = newG;
          data[blockIdx + 2] = newB;
        }
      }
    }
  }
  
  return imageData;
}
