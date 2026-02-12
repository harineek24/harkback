"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PersonModelProps {
  color?: string;
  walkPhase?: number;
}

/** Reusable human silhouette built from primitives.
 *  walkPhase drives a simple leg/arm swing animation (0 = still). */
export default function PersonModel({
  color = "#2a2a2a",
  walkPhase = 0,
}: PersonModelProps) {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const swing = Math.sin(walkPhase) * 0.4;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.6;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.6;
  });

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.42, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.26, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.08, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.45, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.36, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.2, 1.15, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.28, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.37, 0]}>
          <cylinderGeometry args={[0.03, 0.025, 0.22, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.2, 1.15, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.28, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.37, 0]}>
          <cylinderGeometry args={[0.03, 0.025, 0.22, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Hips */}
      <mesh position={[0, 0.73, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.22, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.08, 0.7, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.35, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.3, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.66, 0.03]}>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.08, 0.7, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.35, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.3, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.66, 0.03]}>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}
