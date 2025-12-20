export function applyAscii(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  fontSize: number = 8,
  characters: string = '@%#*+=-:. ',
  invert: boolean = false
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Clear canvas with background
  const isDark = document.documentElement.classList.contains('dark');
  ctx.fillStyle = isDark ? '#000000' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Set text properties
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const charWidth = fontSize * 0.6;
  const charHeight = fontSize;
  
  for (let y = 0; y < height; y += charHeight) {
    for (let x = 0; x < width; x += charWidth) {
      const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
      
      // Calculate brightness
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (r + g + b) / 3;
      
      // Map brightness to character (invert if needed)
      const normalizedBrightness = invert ? (255 - brightness) / 255 : brightness / 255;
      const charIndex = Math.floor(normalizedBrightness * (characters.length - 1));
      const char = characters[charIndex];
      
      // Set color
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillText(char, x + charWidth / 2, y + charHeight / 2);
    }
  }
}
