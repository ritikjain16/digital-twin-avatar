import { Float, MeshDistortMaterial, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";

type DigitalHumanProps = {
  speaking?: boolean;
  emotion?: "neutral" | "focused" | "happy" | "thinking";
};

const Head = ({ speaking = false, emotion = "neutral" }: DigitalHumanProps) => {
  const head = useRef<Mesh>(null);
  const mouth = useRef<Mesh>(null);
  const color = useMemo(() => ({ neutral: "#8b5cf6", focused: "#06b6d4", happy: "#34d399", thinking: "#f59e0b" })[emotion], [emotion]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (head.current) {
      head.current.rotation.y = pointer.x * 0.18 + Math.sin(t * 0.8) * 0.05;
      head.current.rotation.x = -pointer.y * 0.12 + Math.sin(t * 0.6) * 0.03;
      head.current.position.y = Math.sin(t * 1.2) * 0.04;
    }
    if (mouth.current) {
      mouth.current.scale.y = speaking ? 0.35 + Math.abs(Math.sin(t * 12)) * 0.75 : 0.25;
    }
  });

  return (
    <group ref={head}>
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <MeshDistortMaterial color={color} distort={0.12} speed={1.7} roughness={0.18} metalness={0.22} />
      </mesh>
      <mesh position={[-0.38, 0.16, 1.02]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#ecfeff" emissive="#67e8f9" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.38, 0.16, 1.02]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#ecfeff" emissive="#67e8f9" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={mouth} position={[0, -0.34, 1.08]}>
        <boxGeometry args={[0.44, 0.08, 0.04]} />
        <meshStandardMaterial color="#020617" emissive="#f472b6" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <capsuleGeometry args={[0.74, 1.3, 12, 32]} />
        <meshStandardMaterial color="#111827" metalness={0.58} roughness={0.22} />
      </mesh>
    </group>
  );
};

export const DigitalHuman = (props: DigitalHumanProps) => (
  <div className="h-[420px] overflow-hidden rounded-lg border border-white/10 bg-black/30">
    <Canvas camera={{ position: [0, 0.2, 5], fov: 42 }}>
      <ambientLight intensity={0.75} />
      <pointLight position={[2, 3, 4]} intensity={2.4} color="#67e8f9" />
      <pointLight position={[-3, 2, 2]} intensity={1.3} color="#a78bfa" />
      <Stars radius={80} depth={40} count={1200} factor={4} fade speed={1.3} />
      <Float speed={2.2} rotationIntensity={0.12} floatIntensity={0.45}>
        <Head {...props} />
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.15} maxPolarAngle={1.9} />
    </Canvas>
  </div>
);
