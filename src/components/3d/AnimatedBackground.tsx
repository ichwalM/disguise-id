'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  particleCount?: number;
}

function ParticleField({ particleCount = 5000 }: AnimatedBackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!pointsRef.current) return;

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    positionsRef.current = positions;

    const geometry = pointsRef.current.geometry as THREE.BufferGeometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current || !positionsRef.current) return;

    const positions = positionsRef.current;
    const geometry = pointsRef.current.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.01;

      if (positions[i + 1] < -50) {
        positions[i + 1] = 50;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        className="w-full h-full"
        dpr={[1, 2]}
      >
        <ParticleField particleCount={5000} />
      </Canvas>
    </div>
  );
}
