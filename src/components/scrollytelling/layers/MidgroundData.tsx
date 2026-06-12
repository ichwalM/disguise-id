"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMascotStore } from "@/store/useMascotStore";
import { useRef } from "react";
import * as THREE from "three";
import { Ring } from "@react-three/drei";

function MidgroundScene() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  
  const scrollProgress = useMascotStore((state) => state.scrollProgress);
  const currentState = useMascotStore((state) => state.currentState);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Parallax effect: Midground moves medium speed (30% speed)
      groupRef.current.position.y = scrollProgress * 30;
    }

    if (ring1Ref.current && ring2Ref.current) {
      // Rings rotate depending on state
      const rotationSpeed = currentState === 'SCANNING' || currentState === 'RECONSTRUCTING' ? 2 : 0.5;
      
      ring1Ref.current.rotation.x = Math.sin(time * 0.5) * 0.5;
      ring1Ref.current.rotation.y += 0.01 * rotationSpeed;
      
      ring2Ref.current.rotation.x = Math.cos(time * 0.5) * 0.5;
      ring2Ref.current.rotation.y -= 0.015 * rotationSpeed;
    }
  });

  // State-based coloring
  const ringColor = currentState === 'MATCH_FOUND' ? "#ef4444" : 
                   currentState === 'SCANNING' ? "#3b82f6" : 
                   "#10b981";

  return (
    <group ref={groupRef}>
      <group position={[0, 0, 0]}>
        {/* Outer Ring */}
        <Ring ref={ring1Ref} args={[12, 12.1, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={ringColor} transparent opacity={0.3} side={THREE.DoubleSide} />
        </Ring>
        {/* Inner Ring */}
        <Ring ref={ring2Ref} args={[10, 10.2, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={ringColor} transparent opacity={0.5} side={THREE.DoubleSide} />
        </Ring>
      </group>
    </group>
  );
}

export default function MidgroundData() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-20 h-full w-full">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <ambientLight intensity={1} />
        <MidgroundScene />
      </Canvas>
    </div>
  );
}
