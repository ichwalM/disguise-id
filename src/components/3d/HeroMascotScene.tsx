"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface MascotTextureData {
  texture: THREE.CanvasTexture;
  aspect: number;
}

function useMascotTexture(): MascotTextureData | null {
  const [data, setData] = useState<MascotTextureData | null>(null);

  useEffect(() => {
    let disposed = false;
    const img = new window.Image();
    img.onload = () => {
      if (disposed) return;
      // HD: render pada resolusi tinggi supaya tetap tajam di layar retina.
      const maxSize = 2048;
      const scale = maxSize / Math.max(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Bersihkan canvas dengan background transparan penuh
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw MASKOT.png (yang sudah transparan) langsung tanpa manipulasi
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      setData({ texture, aspect: img.width / img.height });
    };
    img.src = "/images/MASKOT.png";
    return () => {
      disposed = true;
    };
  }, []);

  return data;
}

function useRimGlowTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, "rgba(0,86,179,0.32)");
      gradient.addColorStop(0.4, "rgba(230,33,41,0.08)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

// Maskot cuma gambar 2D di atas plane -- JANGAN diputar penuh di sumbu Y,
// karena begitu tampak dari samping bidangnya akan terlihat "gepeng" (tak
// terlihat sama sekali, cuma garis tipis). Cukup float + tilt kecil.
function MascotMesh({ texture, aspect }: { texture: THREE.CanvasTexture; aspect: number }) {
  const height = 3.7;
  const width = height * aspect;
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0}
        depthWrite={false}
        toneMapped={false}
        premultipliedAlpha={false}
      />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 260;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = ["#0056B3", "#E62129", "#FFC107", "#00d4ff"].map((c) => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 1;
      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Ring-ring ini simetris (torus), jadi aman diputar penuh -- selalu terlihat
// bagus dari sudut manapun, tidak akan pernah "gepeng" seperti bidang datar.
function OrbitRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1.current) ring1.current.rotation.z += delta * 0.35;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.25;
    if (ring3.current) ring3.current.rotation.z += delta * 0.18;
  });

  return (
    <group>
      <mesh ref={ring1} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.0, 0.016, 8, 100]} />
        <meshBasicMaterial color="#0056B3" transparent opacity={0.75} toneMapped={false} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.1, 0.3, 0]}>
        <torusGeometry args={[2.45, 0.013, 8, 100]} />
        <meshBasicMaterial color="#FFC107" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 2.5, -0.2, 0]}>
        <torusGeometry args={[2.85, 0.011, 8, 100]} />
        <meshBasicMaterial color="#E62129" transparent opacity={0.55} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ScanRadar() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 1.4;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 3) * 0.12;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.3, 0, 0]}>
      <ringGeometry args={[0, 2.0, 48, 1, 0, Math.PI / 3]} />
      <meshBasicMaterial color="#E62129" transparent opacity={0.3} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function SceneContent({ scrollY }: { scrollY: number }) {
  const ringsGroupRef = useRef<THREE.Group>(null);
  const mascotGroupRef = useRef<THREE.Group>(null);
  const autoRotateRef = useRef(0);
  const mascotData = useMascotTexture();
  const rimTexture = useRimGlowTexture();

  useFrame((state, delta) => {
    autoRotateRef.current += delta * 0.12;

    // Ring: boleh diputar penuh, bentuknya simetris jadi selalu enak dilihat.
    const targetRingY = autoRotateRef.current + state.pointer.x * 0.3 + scrollY * 0.0004;
    if (ringsGroupRef.current) {
      ringsGroupRef.current.rotation.y += (targetRingY - ringsGroupRef.current.rotation.y) * 0.05;
    }

    // Maskot: tanpa spin, cuma tilt kecil mengikuti pointer + efek "napas" & melayang.
    if (mascotGroupRef.current) {
      const targetTiltY = state.pointer.x * 0.12;
      const targetTiltX = -state.pointer.y * 0.08;
      mascotGroupRef.current.rotation.y += (targetTiltY - mascotGroupRef.current.rotation.y) * 0.06;
      mascotGroupRef.current.rotation.x += (targetTiltX - mascotGroupRef.current.rotation.x) * 0.06;
      mascotGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.15;
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
      mascotGroupRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <>
      <ParticleField />
      <Sparkles count={90} scale={7} size={2.5} speed={0.3} opacity={0.7} color="#7dd3fc" />

      <group ref={ringsGroupRef}>
        {/* Aura lembut di belakang seluruh karakter -- statis, tidak ikut turun ke kaki.
            Dibuat kecil & redup supaya cuma jadi halo tipis, bukan "kotak" yang
            menutupi seluruh frame saat kena Bloom. */}
        <mesh position={[0, 0.3, -0.6]}>
          <planeGeometry args={[3.6, 3.6]} />
          <meshBasicMaterial
            map={rimTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {/* Ring scan diposisikan di kaki -- seolah maskot berdiri di dalam zona
            pemindaian aktif, bukan menyilang di tengah badan/tangan device */}
        <group position={[0, -1.55, 0.15]} scale={0.8}>
          <OrbitRings />
          <ScanRadar />
        </group>
      </group>

      <group ref={mascotGroupRef}>{mascotData && <MascotMesh texture={mascotData.texture} aspect={mascotData.aspect} />}</group>
    </>
  );
}

interface HeroMascotSceneProps {
  scrollY?: number;
}

export default function HeroMascotScene({ scrollY = 0 }: HeroMascotSceneProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[-4, 3, 4]} color="#0056B3" intensity={4} />
        <pointLight position={[4, -2, 3]} color="#E62129" intensity={2.4} />
        <pointLight position={[0, 4, -3]} color="#FFC107" intensity={1.6} />

        <SceneContent scrollY={scrollY} />

        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.6} intensity={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
