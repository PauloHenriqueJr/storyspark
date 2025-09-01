import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text, Html, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

interface ScreenProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

const ModernScreen = ({ position, rotation, scale, delay = 0 }: ScreenProps & { delay?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const contentRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + delay) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + delay) * 0.2;
    }
    
    if (screenRef.current) {
      const intensity = 0.4 + Math.sin(state.clock.elapsedTime * 3 + delay) * 0.2;
      (screenRef.current.material as THREE.MeshBasicMaterial).color.setHSL(0.07, 1, intensity);
    }

    if (glowRef.current) {
      const glowIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.05;
      glowRef.current.scale.setScalar(1 + glowIntensity);
    }

    // Animate content elements
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.position.y = Math.sin(state.clock.elapsedTime * 2 + index * 0.5 + delay) * 0.05;
      }
    });
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Outer glow */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[3.5, 2.3]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main screen frame */}
      <RoundedBox args={[3, 2, 0.08]} radius={0.08} smoothness={12}>
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#ff6b35"
          emissiveIntensity={0.03}
        />
      </RoundedBox>

      {/* Screen surface */}
      <mesh ref={screenRef} position={[0, 0, 0.041]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.9}
        />
      </mesh>

      {/* Content simulation - animated bars and elements */}
      <group position={[0, 0, 0.042]}>
        {/* Header bar */}
        <mesh 
          ref={el => el && (contentRefs.current[0] = el)}
          position={[0, 0.7, 0]}
        >
          <planeGeometry args={[2.6, 0.2]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
        </mesh>

        {/* Content blocks */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh 
            key={i}
            ref={el => el && (contentRefs.current[i + 1] = el)}
            position={[-0.8 + i * 0.6, 0.2 - i * 0.3, 0]}
          >
            <planeGeometry args={[0.4, 0.15]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#333333" : "#ff6b35"} 
              transparent 
              opacity={0.9} 
            />
          </mesh>
        ))}

        {/* Floating text simulation */}
        <Html
          position={[0, -0.3, 0]}
          transform
          occlude
          style={{
            color: 'white',
            fontSize: '8px',
            textAlign: 'center',
            pointerEvents: 'none',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 0 10px rgba(255, 107, 53, 0.5)'
          }}
        >
          <div style={{ opacity: 0.8 }}>
            StorySpark IA
            <br />
            <span style={{ color: '#ff6b35', fontSize: '6px' }}>
              Criando conteúdo...
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
};

const AINetworkVisualization = () => {
  const networkRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  
  const networkNodes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ] as [number, number, number],
      delay: i * 0.3
    }));
  }, []);

  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }

    nodesRef.current.forEach((node, index) => {
      if (node) {
        const delay = networkNodes[index].delay;
        node.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.3);
        
        // Pulsing glow effect
        const material = node.material as THREE.MeshBasicMaterial;
        const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + delay) * 0.2;
        material.color.setHSL(0.07, 1, intensity);
      }
    });
  });

  return (
    <group ref={networkRef}>
      {networkNodes.map((node, index) => (
        <Float
          key={index}
          speed={1 + index * 0.1}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <mesh 
            ref={el => el && (nodesRef.current[index] = el)}
            position={node.position}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial 
              color="#ff6b35" 
              transparent 
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}

      {/* Connection lines between nodes */}
      {networkNodes.slice(0, -1).map((node, index) => {
        const nextNode = networkNodes[index + 1];
        const distance = Math.sqrt(
          Math.pow(nextNode.position[0] - node.position[0], 2) +
          Math.pow(nextNode.position[1] - node.position[1], 2) +
          Math.pow(nextNode.position[2] - node.position[2], 2)
        );
        
        return (
          <mesh 
            key={`connection-${index}`}
            position={[
              (node.position[0] + nextNode.position[0]) / 2,
              (node.position[1] + nextNode.position[1]) / 2,
              (node.position[2] + nextNode.position[2]) / 2
            ]}
          >
            <cylinderGeometry args={[0.01, 0.01, distance]} />
            <meshBasicMaterial 
              color="#ff6b35" 
              transparent 
              opacity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const DataFlowParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
      
      // Update particle positions for flow effect
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#ff6b35" 
        transparent 
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

const Platform3DMockup = () => {
  return (
    <div className="w-full h-[600px] md:h-[700px] lg:h-[900px] relative">
      <Canvas 
        camera={{ position: [6, 3, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: 'transparent' }}
      >
        {/* Enhanced dramatic lighting setup */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[15, 15, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -8]} color="#ff6b35" intensity={2.5} />
        <pointLight position={[10, 10, 8]} color="#ffffff" intensity={1.5} />
        <spotLight 
          position={[0, 15, 0]} 
          angle={0.4} 
          penumbra={0.8} 
          intensity={3} 
          color="#ff6b35"
          castShadow
        />
        
        {/* Rim lighting for depth */}
        <pointLight position={[5, 0, -10]} color="#4a90e2" intensity={0.8} />
        <pointLight position={[-5, 0, -10]} color="#ff6b35" intensity={1.2} />

        {/* Main central screen - hero with improved composition */}
        <ModernScreen
          position={[0, 0, 2]}
          rotation={[0, 0, 0]}
          scale={[1.8, 1.8, 1.8]}
          delay={0}
        />

        {/* Surrounding screens in dynamic formation */}
        <ModernScreen
          position={[-6, 2, -2]}
          rotation={[0.1, Math.PI / 3, 0]}
          scale={[1.2, 1.2, 1.2]}
          delay={0.5}
        />
        
        <ModernScreen
          position={[6, -1.5, -2]}
          rotation={[-0.1, -Math.PI / 3, 0]}
          scale={[1.2, 1.2, 1.2]}
          delay={1}
        />
        
        <ModernScreen
          position={[0, 4, -5]}
          rotation={[0.4, 0, 0]}
          scale={[1, 1, 1]}
          delay={1.5}
        />
        
        <ModernScreen
          position={[-4, -3, -6]}
          rotation={[-0.3, Math.PI / 4, 0]}
          scale={[0.9, 0.9, 0.9]}
          delay={2}
        />
        
        <ModernScreen
          position={[4, 3, -6]}
          rotation={[0.2, -Math.PI / 4, 0]}
          scale={[0.9, 0.9, 0.9]}
          delay={2.5}
        />
        
        {/* Additional background screens for depth */}
        <ModernScreen
          position={[-2, 0, -8]}
          rotation={[0, Math.PI / 6, 0]}
          scale={[0.6, 0.6, 0.6]}
          delay={3}
        />
        
        <ModernScreen
          position={[2, 1, -8]}
          rotation={[0, -Math.PI / 6, 0]}
          scale={[0.6, 0.6, 0.6]}
          delay={3.5}
        />

        {/* AI Network Visualization */}
        <AINetworkVisualization />
        
        {/* Data flow particles */}
        <DataFlowParticles />

        {/* Central floating sphere representing AI core */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <Sphere args={[0.3, 32, 32]} position={[0, -1, 2]}>
            <MeshDistortMaterial 
              color="#ff6b35"
              transparent
              opacity={0.4}
              distort={0.4}
              speed={2}
              roughness={0}
            />
          </Sphere>
        </Float>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={8}
          maxDistance={20}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
      
      {/* Enhanced gradient overlays for perfect integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default Platform3DMockup;