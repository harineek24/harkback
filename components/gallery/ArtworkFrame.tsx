"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Folder } from "./projects";

interface ArtworkFrameProps {
  position: [number, number, number];
  rotation: [number, number, number];
  folder: Folder;
  isNearby: boolean;
}

export default function ArtworkFrame({
  position,
  rotation,
  folder,
  isNearby,
}: ArtworkFrameProps) {
  const canvasWidth = 1.8;
  const canvasHeight = 1.4;
  const frameThickness = 0.08;
  const frameDepth = 0.06;

  return (
    <group position={position} rotation={rotation}>
      {/* Frame border */}
      {/* Top */}
      <mesh position={[0, canvasHeight / 2 + frameThickness / 2, 0]}>
        <boxGeometry
          args={[
            canvasWidth + frameThickness * 2,
            frameThickness,
            frameDepth,
          ]}
        />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -canvasHeight / 2 - frameThickness / 2, 0]}>
        <boxGeometry
          args={[
            canvasWidth + frameThickness * 2,
            frameThickness,
            frameDepth,
          ]}
        />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Left */}
      <mesh position={[-canvasWidth / 2 - frameThickness / 2, 0, 0]}>
        <boxGeometry
          args={[
            frameThickness,
            canvasHeight + frameThickness * 2,
            frameDepth,
          ]}
        />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Right */}
      <mesh position={[canvasWidth / 2 + frameThickness / 2, 0, 0]}>
        <boxGeometry
          args={[
            frameThickness,
            canvasHeight + frameThickness * 2,
            frameDepth,
          ]}
        />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Canvas / painting surface */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[canvasWidth, canvasHeight]} />
        <meshStandardMaterial
          color={folder.color}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Folder icon (simple rectangle to represent a folder) */}
      <mesh position={[0, 0.15, 0.01]}>
        <planeGeometry args={[0.5, 0.4]} />
        <meshStandardMaterial
          color={new THREE.Color(folder.color).multiplyScalar(0.7)}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Folder tab */}
      <mesh position={[-0.1, 0.37, 0.01]}>
        <planeGeometry args={[0.2, 0.05]} />
        <meshStandardMaterial
          color={new THREE.Color(folder.color).multiplyScalar(0.7)}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Folder name text */}
      <Text
        position={[0, -0.25, 0.02]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {folder.name}
      </Text>

      {/* Project count */}
      <Text
        position={[0, -0.45, 0.02]}
        fontSize={0.08}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {folder.projects.length > 0
          ? `${folder.projects.length} project${folder.projects.length !== 1 ? "s" : ""}`
          : "Empty"}
      </Text>

      {/* Nearby glow indicator */}
      {isNearby && (
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry
            args={[canvasWidth + 0.2, canvasHeight + 0.2]}
          />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
    </group>
  );
}
