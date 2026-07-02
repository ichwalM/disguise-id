'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      
      if (hovered) {
        meshRef.current.rotation.z += 0.002;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[3, 3, 3]} />
      <meshPhongMaterial
        color="#10b981"
        emissive="#0d8659"
        shininess={100}
        wireframe={false}
      />
      <meshNormalMaterial wireframe={true} opacity={0.1} transparent />
    </mesh>
  );
}

function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Center Cube */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial
          color="#06b6d4"
          emissive="#0891b2"
          shininess={100}
        />
      </mesh>

      {/* Orbiting Spheres */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI * 2) / 3) * 5, 0, Math.sin((i * Math.PI * 2) / 3) * 5]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshPhongMaterial
            color={`hsl(${180 + i * 40}, 100%, 50%)`}
            emissive={`hsl(${180 + i * 40}, 100%, 35%)`}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Cube3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        className="w-full h-full"
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        
        <FloatingGeometry />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}
