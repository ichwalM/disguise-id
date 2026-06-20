"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function MiniCCTVModel() {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const indicatorLightRef = useRef<THREE.PointLight>(null);
  const indicatorMeshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;

    // CCTV Camera Pan & Tilt animation
    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.6;
      cameraGroupRef.current.rotation.x = Math.sin(timeRef.current * 0.4) * 0.15;
    }

    // Indicator light blink animation
    if (indicatorLightRef.current && indicatorMeshRef.current) {
      const intensity = 0.5 + 0.5 * Math.sin(timeRef.current * 4);
      indicatorLightRef.current.intensity = intensity;
      const material = indicatorMeshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = intensity;
    }
  });

  return (
    <group>
      {/* CCTV Stand */}
      <group position={[0, -0.3, 0]}>
        {/* Base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshStandardMaterial color="#5a5a5a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Pole */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.5, 16]} />
          <meshStandardMaterial color="#6a6a6a" metalness={0.7} roughness={0.45} />
        </mesh>

        {/* Mounting bracket */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.06, 0.15]} />
          <meshStandardMaterial color="#5a5a5a" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* CCTV Camera Head (Pan/Tilt) */}
      <group ref={cameraGroupRef} position={[0, 0.55, 0]}>
        {/* Camera Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.18, 0.18]} />
          <meshStandardMaterial color="#7a7a7a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Lens Barrel */}
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.16, 16]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Lens Glass */}
        <mesh position={[0.32, 0, 0]} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a2a"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Indicator Light */}
        <mesh ref={indicatorMeshRef} position={[0.1, 0.1, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial
            color="#E62129"
            emissive="#E62129"
            emissiveIntensity={1}
          />
        </mesh>
        <pointLight
          ref={indicatorLightRef}
          position={[0.1, 0.1, 0]}
          color="#E62129"
          intensity={1}
          distance={0.3}
        />

        {/* IR LEDs */}
        {[-0.04, 0, 0.04].map((z, i) => (
          <mesh key={i} position={[0.16, 0.06, z]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial
              color="#FFC107"
              emissive="#FFC107"
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

interface MiniCCTVProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function MiniCCTV({ className = "", style = {} }: MiniCCTVProps) {
  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        minHeight: "300px",
        maxHeight: "500px",
        aspectRatio: "1/1",
        ...style,
      }}
    >
      <Canvas
        camera={{
          position: [1, 0.6, 1.2],
          fov: 45,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-2, 2, -1]} intensity={0.8} color="#0056B3" />

        <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.05}>
          <MiniCCTVModel />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
