'use client';

import dynamic from 'next/dynamic';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect } from 'react';

// Lazy load 3D components
const AnimatedBackground = dynamic(
  () => import('@/components/3d/AnimatedBackground'),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-zinc-950" /> }
);

const Grid3D = dynamic(
  () => import('@/components/3d/Grid3D'),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-zinc-950" /> }
);

export default function LoginPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <main className="relative w-full h-screen bg-zinc-950 overflow-hidden">
      {/* 3D Background Layers */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="absolute inset-0 z-5">
        <Grid3D />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/30 to-zinc-950/80 z-8" />

      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center p-4">
        <LoginForm />
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 border border-emerald-500/10 pointer-events-none z-15" />

      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-5" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none z-5" />
    </main>
  );
}
