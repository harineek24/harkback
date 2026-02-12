"use client";

import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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
  const frameThickness = 0.1;
  const frameDepth = 0.08;
  const glowRef = useRef<THREE.Mesh>(null);

  const baseColor = new THREE.Color(folder.color);
  const darkerColor = baseColor.clone().multiplyScalar(0.35);
  const lighterColor = baseColor.clone().lerp(new THREE.Color("#ffffff"), 0.3);
  const midColor = baseColor.clone().multiplyScalar(0.6);

  // Subtle glow pulse when nearby
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      if (isNearby) {
        mat.opacity = 0.08 + Math.sin(clock.elapsedTime * 3) * 0.05;
      } else {
        mat.opacity = 0;
      }
    }
  });

  const projectCount = folder.projects.length;
  const hasProjects = projectCount > 0;

  return (
    <group position={position} rotation={rotation}>
      {/* Ornate frame - outer border (gold/bronze feel) */}
      {/* Top */}
      <mesh position={[0, canvasHeight / 2 + frameThickness / 2, 0]}>
        <boxGeometry args={[canvasWidth + frameThickness * 2, frameThickness, frameDepth]} />
        <meshStandardMaterial color="#2a2420" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -canvasHeight / 2 - frameThickness / 2, 0]}>
        <boxGeometry args={[canvasWidth + frameThickness * 2, frameThickness, frameDepth]} />
        <meshStandardMaterial color="#2a2420" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Left */}
      <mesh position={[-canvasWidth / 2 - frameThickness / 2, 0, 0]}>
        <boxGeometry args={[frameThickness, canvasHeight + frameThickness * 2, frameDepth]} />
        <meshStandardMaterial color="#2a2420" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Right */}
      <mesh position={[canvasWidth / 2 + frameThickness / 2, 0, 0]}>
        <boxGeometry args={[frameThickness, canvasHeight + frameThickness * 2, frameDepth]} />
        <meshStandardMaterial color="#2a2420" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Inner frame accent line */}
      {/* Top */}
      <mesh position={[0, canvasHeight / 2 - 0.01, 0.005]}>
        <boxGeometry args={[canvasWidth, 0.02, 0.01]} />
        <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.2} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -canvasHeight / 2 + 0.01, 0.005]}>
        <boxGeometry args={[canvasWidth, 0.02, 0.01]} />
        <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.2} />
      </mesh>
      {/* Left */}
      <mesh position={[-canvasWidth / 2 + 0.01, 0, 0.005]}>
        <boxGeometry args={[0.02, canvasHeight, 0.01]} />
        <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.2} />
      </mesh>
      {/* Right */}
      <mesh position={[canvasWidth / 2 - 0.01, 0, 0.005]}>
        <boxGeometry args={[0.02, canvasHeight, 0.01]} />
        <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.2} />
      </mesh>

      {/* Canvas background - gradient feel using layered planes */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[canvasWidth, canvasHeight]} />
        <meshStandardMaterial color={darkerColor} side={THREE.FrontSide} />
      </mesh>

      {/* Decorative diagonal lines (art texture) */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((offset, i) => (
        <mesh key={`line-${i}`} position={[offset, 0, -0.005]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.01, 2.0]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.06}
            side={THREE.FrontSide}
          />
        </mesh>
      ))}

      {/* Large folder icon */}
      {/* Folder body */}
      <mesh position={[0, 0.12, 0.01]}>
        <planeGeometry args={[0.7, 0.52]} />
        <meshStandardMaterial color={midColor} side={THREE.FrontSide} />
      </mesh>
      {/* Folder tab */}
      <mesh position={[-0.12, 0.4, 0.01]}>
        <planeGeometry args={[0.26, 0.08]} />
        <meshStandardMaterial color={midColor} side={THREE.FrontSide} />
      </mesh>
      {/* Folder highlight strip */}
      <mesh position={[0, 0.35, 0.015]}>
        <planeGeometry args={[0.68, 0.02]} />
        <meshStandardMaterial color={lighterColor} side={THREE.FrontSide} />
      </mesh>

      {/* Document icons inside folder (if has projects) */}
      {hasProjects && (
        <>
          {/* Doc 1 */}
          <mesh position={[-0.15, 0.1, 0.02]}>
            <planeGeometry args={[0.18, 0.24]} />
            <meshStandardMaterial color="#e8e4df" side={THREE.FrontSide} />
          </mesh>
          {/* Doc 1 lines */}
          {[0.04, 0, -0.04].map((y, i) => (
            <mesh key={`doc1-line-${i}`} position={[-0.15, 0.1 + y, 0.025]}>
              <planeGeometry args={[0.12, 0.015]} />
              <meshBasicMaterial color={baseColor} transparent opacity={0.4} side={THREE.FrontSide} />
            </mesh>
          ))}

          {/* Doc 2 (offset, slightly tilted) */}
          <mesh position={[0.08, 0.08, 0.018]} rotation={[0, 0, 0.05]}>
            <planeGeometry args={[0.18, 0.24]} />
            <meshStandardMaterial color="#f0ece6" side={THREE.FrontSide} />
          </mesh>
          {[0.04, 0, -0.04].map((y, i) => (
            <mesh key={`doc2-line-${i}`} position={[0.08, 0.08 + y, 0.022]} rotation={[0, 0, 0.05]}>
              <planeGeometry args={[0.12, 0.015]} />
              <meshBasicMaterial color={baseColor} transparent opacity={0.3} side={THREE.FrontSide} />
            </mesh>
          ))}
        </>
      )}

      {/* Empty folder indicator */}
      {!hasProjects && (
        <Text
          position={[0, 0.1, 0.02]}
          fontSize={0.06}
          color="rgba(255,255,255,0.3)"
          anchorX="center"
          anchorY="middle"
        >
          Empty
        </Text>
      )}

      {/* Folder name - prominent */}
      <Text
        position={[0, -0.28, 0.02]}
        fontSize={0.11}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
        font={undefined}
      >
        {folder.name}
      </Text>

      {/* Project count badge */}
      {hasProjects && (
        <>
          <mesh position={[0, -0.46, 0.015]}>
            <planeGeometry args={[0.42, 0.14]} />
            <meshStandardMaterial
              color={baseColor}
              transparent
              opacity={0.25}
              side={THREE.FrontSide}
            />
          </mesh>
          <Text
            position={[0, -0.46, 0.025]}
            fontSize={0.07}
            color={lighterColor}
            anchorX="center"
            anchorY="middle"
          >
            {`${projectCount} project${projectCount !== 1 ? "s" : ""}`}
          </Text>
        </>
      )}

      {/* Bottom nameplate */}
      <mesh position={[0, -canvasHeight / 2 - frameThickness - 0.08, 0.01]}>
        <planeGeometry args={[0.8, 0.1]} />
        <meshStandardMaterial color="#1a1816" metalness={0.4} roughness={0.5} />
      </mesh>
      <Text
        position={[0, -canvasHeight / 2 - frameThickness - 0.08, 0.02]}
        fontSize={0.04}
        color="#c8a96e"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {folder.name.toUpperCase()}
      </Text>

      {/* Nearby glow indicator */}
      <mesh ref={glowRef} position={[0, 0, -0.025]}>
        <planeGeometry args={[canvasWidth + 0.3, canvasHeight + 0.3]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}
