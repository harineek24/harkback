"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { KeyState } from "./useKeyboardControls";
import { ArtworkPosition } from "./projects";

interface CharacterProps {
  keys: React.RefObject<KeyState>;
  artworkPositions: ArtworkPosition[];
  onNearbyChange: (folderId: string | null) => void;
  onEnterPress: () => void;
  onEscapePress: () => void;
  menuOpen: boolean;
  detailOpen: boolean;
}

export default function Character({
  keys,
  artworkPositions,
  onNearbyChange,
  onEnterPress,
  onEscapePress,
  menuOpen,
  detailOpen,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const moveSpeed = 0.07;
  const rotSpeed = 0.04;
  const nearbyThreshold = 3.0;

  // Bounds
  const minX = -3.2;
  const maxX = 3.2;
  const minZ = -13.5;
  const maxZ = 13.5;

  useFrame(() => {
    if (!groupRef.current || !keys.current) return;

    const k = keys.current;

    // Handle escape press
    if (k.escape) {
      k.escape = false;
      onEscapePress();
    }

    // Handle enter press
    if (k.enter) {
      k.enter = false;
      onEnterPress();
    }

    // Don't move if menu or detail modal is open
    if (menuOpen || detailOpen) return;

    // Rotation
    if (k.left) {
      groupRef.current.rotation.y += rotSpeed;
    }
    if (k.right) {
      groupRef.current.rotation.y -= rotSpeed;
    }

    // Movement in facing direction
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(groupRef.current.quaternion);

    if (k.forward) {
      const newX = groupRef.current.position.x + direction.x * moveSpeed;
      const newZ = groupRef.current.position.z + direction.z * moveSpeed;
      if (newX >= minX && newX <= maxX) groupRef.current.position.x = newX;
      if (newZ >= minZ && newZ <= maxZ) groupRef.current.position.z = newZ;
    }
    if (k.backward) {
      const newX = groupRef.current.position.x - direction.x * moveSpeed;
      const newZ = groupRef.current.position.z - direction.z * moveSpeed;
      if (newX >= minX && newX <= maxX) groupRef.current.position.x = newX;
      if (newZ >= minZ && newZ <= maxZ) groupRef.current.position.z = newZ;
    }

    // Camera follow (third-person, behind and above)
    const charPos = groupRef.current.position.clone();
    const cameraOffset = new THREE.Vector3(0, 2.5, 4);
    cameraOffset.applyQuaternion(groupRef.current.quaternion);
    const targetCamPos = charPos.clone().add(cameraOffset);

    camera.position.lerp(targetCamPos, 0.08);
    const lookTarget = charPos.clone().add(new THREE.Vector3(0, 1, 0));
    camera.lookAt(lookTarget);

    // Proximity detection
    let nearestId: string | null = null;
    let nearestDist = Infinity;

    for (const art of artworkPositions) {
      const artPos = new THREE.Vector3(...art.position);
      const dist = charPos.distanceTo(artPos);
      if (dist < nearbyThreshold && dist < nearestDist) {
        nearestDist = dist;
        nearestId = art.folder.id;
      }
    }

    onNearbyChange(nearestId);
  });

  return (
    <group ref={groupRef} position={[0, 0, 10]}>
      {/* Body - cylinder */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.6, 8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Head - sphere */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}
