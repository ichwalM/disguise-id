'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GridLineProps {
  count?: number;
}

function GridLine({ count = 12 }: GridLineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const lines = useMemo(() => {
    const lineArray: THREE.Line[] = [];
    const material = new THREE.LineBasicMaterial({
      color: '#10b981',
      opacity: 0.3,
      transparent: true,
      linewidth: 1,
    });

    // Horizontal lines
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BufferGeometry();
      const points: number[] = [];

      const y = (i - count / 2) * 5;
      points.push(-count * 2.5, y, 0);
      points.push(count * 2.5, y, 0);

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(points), 3)
      );

      const line = new THREE.Line(geometry, material);
      lineArray.push(line);
    }

    // Vertical lines
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BufferGeometry();
      const points: number[] = [];

      const x = (i - count / 2) * 5;
      points.push(x, -count * 2.5, 0);
      points.push(x, count * 2.5, 0);

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(points), 3)
      );

      const line = new THREE.Line(geometry, material);
      lineArray.push(line);
    }

    return lineArray;
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.z += 0.0001;

    const camera = state.camera as THREE.Camera;
    camera.position.x += (mousePosition.x - camera.position.x) * 0.01;
    camera.position.y += (mousePosition.y - camera.position.y) * 0.01;
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 10 - 5,
        y: -(e.clientY / window.innerHeight) * 10 + 5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <group ref={groupRef}>
      {lines.map((line, idx) => (
        <primitive key={idx} object={line} />
      ))}
    </group>
  );
}

export default function Grid3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        className="w-full h-full"
        dpr={[1, 2]}
      >
        <GridLine count={20} />
      </Canvas>
    </div>
  );
}
