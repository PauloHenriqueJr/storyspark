import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const AICore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      meshRef.current.rotation.y = time * 0.3;
      
      // Pulsing glow effect
      const scale = 1 + Math.sin(time * 2) * 0.05;
      glowRef.current.scale.setScalar(scale * 1.2);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.1} />
      </Sphere>
      
      {/* Core sphere */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff3300"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </Sphere>

      {/* Inner core */}
      <Sphere args={[0.7, 32, 32]}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.8} 
        />
      </Sphere>
    </group>
  );
};

const SimpleAI3D = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} color="#ff6b35" intensity={0.6} />

        <AICore />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};

export default SimpleAI3D;