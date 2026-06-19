"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useMascotStore } from "@/store/useMascotStore";
import { useRef } from "react";
import * as THREE from "three";

function CyberScene() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgress = useMascotStore((state) => state.scrollProgress);

  useFrame(() => {
    if (groupRef.current) {
      // Parallax effect: Background moves very slowly (10% speed)
      // Moving up on Y axis as we scroll down
      groupRef.current.position.y = scrollProgress * 10;
      
      // Slow constant rotation
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Abstract Cyber Grid / Nodes */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ground Grid to give sense of depth */}
      <gridHelper 
        args={[200, 100, "#064e3b", "#022c22"]} 
        position={[0, -20, 0]} 
      />
    </group>
  );
}

export default function BackgroundCyber() {
  return (
    <div className="absolute inset-0 -z-30 h-full w-full bg-zinc-950">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <fog attach="fog" args={["#09090b", 20, 100]} />
        <ambientLight intensity={0.5} />
        <CyberScene />
      </Canvas>
      {/* Ambient gradient overlay to blend 3D with 2D */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none" />
    </div>
  );
}
