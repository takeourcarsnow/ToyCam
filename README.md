# ToyCam

A real-time camera effects application built with Next.js and TypeScript. Apply various effects to your live camera feed including film grain, dithering, ASCII art, and pixelization.

## Features

- **Real-time Camera Effects**: Apply effects to live video feed
  - Film Grain
  - Dithering (Floyd-Steinberg, Bayer)
  - ASCII Art Conversion
  - Pixelization
  - CRT Screen Effect
  - Vintage Film Effect
  - Color Adjustments (Sepia, Grayscale, Invert)

- **Adjustable Settings**: Fine-tune each effect with intuitive controls
- **Light/Dark Themes**: Toggle between themes for comfortable viewing
- **Mobile-Friendly**: iOS-inspired design optimized for mobile devices
- **Performance Optimized**: Efficient canvas-based processing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Allow Camera Access

When prompted, allow camera access in your browser to use the app.

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first styling
- **Canvas API**: Real-time video processing
- **Lucide Icons**: Beautiful icon library

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── camera/      # Camera-specific components
│   ├── settings/    # Settings controls
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and effect processors
│   └── effects/     # Individual effect implementations
└── types/           # TypeScript type definitions
```

## Future Plans

- Deploy to Vercel
- Integrate Supabase for user profiles and saved presets
- Add more effects and filters
- Photo/video capture with effects applied
- Share functionality

## Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## License

MIT
