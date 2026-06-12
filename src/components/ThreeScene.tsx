"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Box,
  Cylinder,
  Sphere,
  Torus,
  Stars,
} from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface CCTVPoleProps {
  scrollY: number;
}

function CCTVPole({ scrollY }: CCTVPoleProps) {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const radarRef = useRef<THREE.Mesh>(null);
  const solarGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Particle system
  const particles = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scroll = scrollY * 0.003; // normalize scroll to rotation

    // CCTV Camera pan based on scroll + sine wave
    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.y =
        Math.sin(t * 0.6) * 0.6 + scroll * 0.8;
    }

    // Orbiting tech rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.8;
      ring1Ref.current.rotation.z = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 1.2;
      ring2Ref.current.rotation.z = -t * 0.3;
    }

    // Radar sweep
    if (radarRef.current) {
      radarRef.current.rotation.z = t * 2;
      (radarRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.3 + Math.sin(t * 3) * 0.2;
    }

    // Solar panel subtle tilt
    if (solarGroupRef.current) {
      solarGroupRef.current.rotation.x =
        Math.PI / 6 + Math.sin(t * 0.3) * 0.05;
    }

    // Particles drift upward
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group>
      {/* Ambient particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#0056B3"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Main pole group */}
      <group position={[0, -3, 0]}>
        {/* Concrete base */}
        <Cylinder args={[0.6, 0.7, 0.3, 8]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.8} />
        </Cylinder>

        {/* LED Ring at base */}
        <Torus args={[0.65, 0.04, 8, 32]} position={[0, 0.3, 0]}>
          <meshStandardMaterial
            color="#0056B3"
            emissive="#0056B3"
            emissiveIntensity={2}
            metalness={1}
          />
        </Torus>

        {/* Main pole */}
        <Cylinder args={[0.07, 0.1, 7.5, 16]} position={[0, 4, 0]}>
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.15} />
        </Cylinder>

        {/* Pole segment markers */}
        {[2, 4, 6].map((y, i) => (
          <Torus key={i} args={[0.12, 0.03, 8, 16]} position={[0, y, 0]}>
            <meshStandardMaterial
              color="#FFC107"
              emissive="#FFC107"
              emissiveIntensity={0.8}
            />
          </Torus>
        ))}

        {/* Solar panel group */}
        <group position={[0, 7.6, 0]} ref={solarGroupRef}>
          {/* Support arm */}
          <Box args={[1.8, 0.08, 0.08]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 12]}>
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </Box>

          {/* Panel Left */}
          <group position={[-0.7, 0.05, 0]}>
            <Box args={[0.9, 0.05, 1.2]}>
              <meshStandardMaterial
                color="#003a7d"
                metalness={0.95}
                roughness={0.05}
                envMapIntensity={2}
              />
            </Box>
            {/* Solar cell grid lines */}
            {[-0.3, 0, 0.3].map((x, i) => (
              <Box key={i} args={[0.02, 0.06, 1.2]} position={[x, 0, 0]}>
                <meshStandardMaterial color="#0056B3" emissive="#0056B3" emissiveIntensity={0.5} />
              </Box>
            ))}
          </group>

          {/* Panel Right */}
          <group position={[0.7, 0.05, 0]}>
            <Box args={[0.9, 0.05, 1.2]}>
              <meshStandardMaterial
                color="#003a7d"
                metalness={0.95}
                roughness={0.05}
                envMapIntensity={2}
              />
            </Box>
            {[-0.3, 0, 0.3].map((x, i) => (
              <Box key={i} args={[0.02, 0.06, 1.2]} position={[x, 0, 0]}>
                <meshStandardMaterial color="#0056B3" emissive="#0056B3" emissiveIntensity={0.5} />
              </Box>
            ))}
          </group>
        </group>

        {/* CCTV Camera Head (scroll + auto rotating) */}
        <group position={[0.4, 6.8, 0]} ref={cameraGroupRef}>
          {/* Camera housing */}
          <Box args={[0.7, 0.28, 0.28]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
          </Box>
          {/* Lens barrel */}
          <Cylinder args={[0.11, 0.13, 0.32, 16]} position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
          </Cylinder>
          {/* Lens glass */}
          <Sphere args={[0.1, 16, 16]} position={[0.58, 0, 0]}>
            <meshStandardMaterial
              color="#E62129"
              emissive="#E62129"
              emissiveIntensity={3}
              transparent
              opacity={0.9}
            />
          </Sphere>
          {/* Infrared LEDs */}
          {[-0.06, 0, 0.06].map((z, i) => (
            <Sphere key={i} args={[0.025, 8, 8]} position={[0.38, 0.12, z]}>
              <meshStandardMaterial
                color="#FFC107"
                emissive="#FFC107"
                emissiveIntensity={2}
              />
            </Sphere>
          ))}
          {/* Radar scan plane */}
          <mesh ref={radarRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0, 1.2, 32, 1, 0, Math.PI / 4]} />
            <meshBasicMaterial color="#E62129" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Orbiting Web3 rings */}
        <mesh ref={ring1Ref} position={[0, 5.5, 0]}>
          <torusGeometry args={[1.2, 0.02, 8, 80]} />
          <meshBasicMaterial color="#0056B3" transparent opacity={0.7} />
        </mesh>
        <mesh ref={ring2Ref} position={[0, 5.5, 0]}>
          <torusGeometry args={[1.6, 0.015, 8, 80]} />
          <meshBasicMaterial color="#FFC107" transparent opacity={0.5} />
        </mesh>

        {/* Data stream lines (vertical glowing cylinders) */}
        {[0.8, -0.8, 1.2, -1.2].map((x, i) => (
          <Cylinder key={i} args={[0.005, 0.005, 8, 4]} position={[x, 3.5, 0]}>
            <meshStandardMaterial
              color="#0056B3"
              emissive="#0056B3"
              emissiveIntensity={1.5}
              transparent
              opacity={0.3}
            />
          </Cylinder>
        ))}
      </group>
    </group>
  );
}

function CameraScroll({ scrollY }: { scrollY: number }) {
  const { camera } = useThree();
  useFrame(() => {
    // Subtle camera Y tilt based on scroll
    const targetY = 2 - scrollY * 0.0008;
    camera.position.y += (targetY - camera.position.y) * 0.05;
  });
  return null;
}

interface ThreeSceneProps {
  scrollY?: number;
}

export default function ThreeScene({ scrollY = 0 }: ThreeSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [5, 2.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0a1a", 15, 30]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#0056B3" />
        <pointLight position={[5, 2, 5]} intensity={0.8} color="#FFC107" />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#E62129" />

        <Stars radius={50} depth={20} count={2000} factor={3} saturation={0.5} fade speed={0.5} />
        <Environment preset="night" />

        <CameraScroll scrollY={scrollY} />

        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
          <CCTVPole scrollY={scrollY} />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
