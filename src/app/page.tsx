'use client';

import dynamic from 'next/dynamic';

const CameraApp = dynamic(() => import("@/components/camera/CameraApp"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <CameraApp />
    </main>
  );
}
