"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CyberParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particles within a sphere
  const { positions, colors } = useMemo(() => {
    const count = 300; // Limit particles for performance
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Theme colors: Blue and Red
    const colorA = new THREE.Color("#0056B3");
    const colorB = new THREE.Color("#E62129");

    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 15; // Spread them wide
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Randomly assign red or blue color
      const mixedColor = Math.random() > 0.5 ? colorA : colorB;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      // Slow rotation for a relaxing background effect
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      {/* 
        AdditiveBlending creates a glow effect when particles overlap.
        Size determines particle size in world space.
      */}
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function GlobalBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0, // Behind everything
        pointerEvents: "none", // Prevent blocking clicks on the UI
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: false, alpha: true }} // alpha: true to show HTML background
        dpr={[1, 1.5]} // Limit pixel ratio for better performance globally
      >
        <CyberParticles />
      </Canvas>
    </div>
  );
}
