"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { KeyState } from "./useKeyboardControls";
import { ArtworkPosition } from "./projects";
import { GuestData } from "./GuestNPC";
import PersonModel from "./PersonModel";

interface CharacterProps {
  keys: React.RefObject<KeyState>;
  artworkPositions: ArtworkPosition[];
  guests: GuestData[];
  onNearbyChange: (folderId: string | null) => void;
  onNearbyGuestChange: (guestId: string | null) => void;
  onEnterPress: () => void;
  onEscapePress: () => void;
  menuOpen: boolean;
  detailOpen: boolean;
}

export default function Character({
  keys,
  artworkPositions,
  guests,
  onNearbyChange,
  onNearbyGuestChange,
  onEnterPress,
  onEscapePress,
  menuOpen,
  detailOpen,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const walkPhaseRef = useRef(0);
  const isMovingRef = useRef(false);

  const moveSpeed = 0.07;
  const rotSpeed = 0.04;
  const nearbyThreshold = 3.0;
  const guestThreshold = 2.0;

  // Bounds
  const minX = -3.2;
  const maxX = 3.2;
  const minZ = -13.5;
  const maxZ = 13.5;

  useFrame((_, delta) => {
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
    if (menuOpen || detailOpen) {
      isMovingRef.current = false;
      return;
    }

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

    let moved = false;

    if (k.forward) {
      const newX = groupRef.current.position.x + direction.x * moveSpeed;
      const newZ = groupRef.current.position.z + direction.z * moveSpeed;
      if (newX >= minX && newX <= maxX) groupRef.current.position.x = newX;
      if (newZ >= minZ && newZ <= maxZ) groupRef.current.position.z = newZ;
      moved = true;
    }
    if (k.backward) {
      const newX = groupRef.current.position.x - direction.x * moveSpeed;
      const newZ = groupRef.current.position.z - direction.z * moveSpeed;
      if (newX >= minX && newX <= maxX) groupRef.current.position.x = newX;
      if (newZ >= minZ && newZ <= maxZ) groupRef.current.position.z = newZ;
      moved = true;
    }

    isMovingRef.current = moved;
    if (moved) {
      walkPhaseRef.current += delta * 8;
    } else {
      // Smoothly return to idle
      walkPhaseRef.current *= 0.9;
    }

    // Camera follow (third-person, behind and above)
    const charPos = groupRef.current.position.clone();
    const cameraOffset = new THREE.Vector3(0, 2.5, 4);
    cameraOffset.applyQuaternion(groupRef.current.quaternion);
    const targetCamPos = charPos.clone().add(cameraOffset);

    camera.position.lerp(targetCamPos, 0.08);
    const lookTarget = charPos.clone().add(new THREE.Vector3(0, 1, 0));
    camera.lookAt(lookTarget);

    // Proximity detection - artwork
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

    // Proximity detection - guests
    let nearestGuestId: string | null = null;
    let nearestGuestDist = Infinity;

    for (const guest of guests) {
      const guestPos = new THREE.Vector3(...guest.position);
      const dist = charPos.distanceTo(guestPos);
      if (dist < guestThreshold && dist < nearestGuestDist) {
        nearestGuestDist = dist;
        nearestGuestId = guest.id;
      }
    }
    onNearbyGuestChange(nearestGuestId);
  });

  return (
    <group ref={groupRef} position={[0, 0, 10]}>
      <PersonModel color="#1a1a2e" walkPhase={walkPhaseRef.current} />
    </group>
  );
}
