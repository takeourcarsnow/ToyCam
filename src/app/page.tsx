'use client';

import dynamic from 'next/dynamic';

const CameraApp = dynamic(() => import("@/components/camera/CameraApp"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-full bg-black">
      <CameraApp />
    </main>
  );
}
