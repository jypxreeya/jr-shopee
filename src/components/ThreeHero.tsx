'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function ElegantShapes() {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Adjust scale based on viewport width (mobile screens are generally narrower)
  const isMobile = viewport.width < 5;
  const scale = isMobile ? 0.6 : 1;
  const positionY = isMobile ? 1 : 0; // Move up slightly on mobile

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={group} scale={scale} position={[0, positionY, 0]}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-1, 0.5, 1]} castShadow>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshPhysicalMaterial 
            color="#FFC0CB" 
            roughness={0.1} 
            metalness={0.1} 
            transmission={0.8} 
            thickness={1} 
            envMapIntensity={1}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[1, -0.5, -0.5]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <torusGeometry args={[0.6, 0.25, 32, 64]} />
          <meshStandardMaterial 
            color="#FFF0F5" 
            roughness={0.3} 
            metalness={0.2}
          />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh position={[0, 1.5, -1]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <octahedronGeometry args={[0.5]} />
          <meshPhysicalMaterial 
            color="#FFD1DC" 
            roughness={0.2} 
            metalness={0.5} 
            clearcoat={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeHero() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ touchAction: 'auto' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        <PresentationControls 
          rotation={[0, 0.1, 0]} 
          polar={[-0.1, 0.2]} 
          azimuth={[-0.2, 0.2]} 
          snap
          cursor={false}
        >
          <ElegantShapes />
        </PresentationControls>
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#FFB6C1" />
      </Canvas>
    </div>
  );
}
