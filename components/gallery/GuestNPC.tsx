"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import PersonModel from "./PersonModel";

export interface GuestData {
  id: string;
  name: string;
  message: string;
  position: [number, number, number];
  rotation: number;
  color: string;
}

export const guests: GuestData[] = [
  {
    id: "guest-1",
    name: "Visitor",
    message: "The MedEase project is really impressive! Love the clean UI.",
    position: [-1.5, 0, -6],
    rotation: Math.PI / 4,
    color: "#4a4a5a",
  },
  {
    id: "guest-2",
    name: "Curator",
    message: "Welcome to Hark Back gallery. Take your time exploring!",
    position: [1.2, 0, 2],
    rotation: -Math.PI / 3,
    color: "#5a4a4a",
  },
  {
    id: "guest-3",
    name: "Fellow Dev",
    message: "Nice tech stack choices. Have you tried Rust for the backend?",
    position: [-0.5, 0, 8],
    rotation: Math.PI / 6,
    color: "#3a4a5a",
  },
  {
    id: "guest-4",
    name: "Art Critic",
    message: "The gallery layout really makes each project stand out.",
    position: [2.0, 0, -2],
    rotation: -Math.PI / 2,
    color: "#5a3a4a",
  },
];

interface GuestNPCProps {
  guest: GuestData;
  isNearby: boolean;
}

export default function GuestNPC({ guest, isNearby }: GuestNPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const idlePhase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Subtle idle sway
    idlePhase.current += delta * 0.8;
    groupRef.current.rotation.y =
      guest.rotation + Math.sin(idlePhase.current) * 0.05;
  });

  return (
    <group
      ref={groupRef}
      position={guest.position}
      rotation={[0, guest.rotation, 0]}
    >
      <PersonModel color={guest.color} walkPhase={0} />

      {/* Nearby indicator - subtle glow under feet */}
      {isNearby && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial
            color="#c8a96e"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
