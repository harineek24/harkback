"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import ArtworkFrame from "./ArtworkFrame";
import Stanchion from "./Stanchion";
import Character from "./Character";
import GuestNPC, { GuestData } from "./GuestNPC";
import { getArtworkPositions } from "./projects";
import { KeyState } from "./useKeyboardControls";

interface GallerySceneProps {
  keys: React.RefObject<KeyState>;
  nearbyFolderId: string | null;
  nearbyGuestId: string | null;
  guests: GuestData[];
  onNearbyChange: (folderId: string | null) => void;
  onNearbyGuestChange: (guestId: string | null) => void;
  onEnterPress: () => void;
  onEscapePress: () => void;
  menuOpen: boolean;
  detailOpen: boolean;
}

export default function GalleryScene({
  keys,
  nearbyFolderId,
  nearbyGuestId,
  guests,
  onNearbyChange,
  onNearbyGuestChange,
  onEnterPress,
  onEscapePress,
  menuOpen,
  detailOpen,
}: GallerySceneProps) {
  const artworkPositions = getArtworkPositions();

  const roomLength = 30;
  const roomWidth = 8;
  const roomHeight = 5;

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />

      {/* Ceiling lights */}
      <pointLight
        position={[0, roomHeight - 0.3, -7]}
        intensity={15}
        color="#fff5e6"
        distance={20}
      />
      <pointLight
        position={[0, roomHeight - 0.3, 0]}
        intensity={15}
        color="#fff5e6"
        distance={20}
      />
      <pointLight
        position={[0, roomHeight - 0.3, 7]}
        intensity={15}
        color="#fff5e6"
        distance={20}
      />

      {/* Ceiling light fixtures (visual) */}
      {[-7, 0, 7].map((z) => (
        <mesh key={`fixture-${z}`} position={[0, roomHeight - 0.05, z]}>
          <boxGeometry args={[1.5, 0.05, 0.4]} />
          <meshBasicMaterial color="#fff5e6" />
        </mesh>
      ))}

      {/* Spotlights aimed at paintings */}
      {artworkPositions.map((art, i) => (
        <pointLight
          key={`spot-${i}`}
          position={[
            art.position[0] * 0.6,
            roomHeight - 1,
            art.position[2],
          ]}
          intensity={2}
          distance={5}
          color="#fff8f0"
        />
      ))}

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#d4d0c8" side={THREE.DoubleSide} />
      </mesh>

      {/* Floor grid lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={`grid-z-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.005, -14 + i * 2]}
        >
          <planeGeometry args={[roomWidth, 0.02]} />
          <meshBasicMaterial color="#c0bbb0" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`grid-x-${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[-3 + i * 1.5, 0.005, 0]}
        >
          <planeGeometry args={[roomLength, 0.02]} />
          <meshBasicMaterial color="#c0bbb0" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, roomHeight, 0]}
      >
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#b8b4aa" side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-roomWidth / 2, roomHeight / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[roomLength, roomHeight]} />
        <meshStandardMaterial color="#e8e0d4" side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall - with gap for skybox view */}
      {/* Back section of right wall */}
      <mesh
        position={[roomWidth / 2, roomHeight / 2, -5]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[20, roomHeight]} />
        <meshStandardMaterial color="#e8e0d4" side={THREE.DoubleSide} />
      </mesh>
      {/* Front section of right wall (with gap) */}
      <mesh
        position={[roomWidth / 2, roomHeight / 2, 11]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[8, roomHeight]} />
        <meshStandardMaterial color="#e8e0d4" side={THREE.DoubleSide} />
      </mesh>

      {/* Sky blue background visible through gap */}
      <mesh position={[roomWidth / 2 + 1, roomHeight / 2, 7]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5, roomHeight]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall */}
      <mesh
        position={[0, roomHeight / 2, -roomLength / 2]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#ddd5c8" side={THREE.DoubleSide} />
      </mesh>

      {/* "HARK BACK" branding on back wall */}
      <Text
        position={[0, 3.2, -roomLength / 2 + 0.05]}
        fontSize={0.7}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        HARK BACK
      </Text>
      <Text
        position={[0, 2.4, -roomLength / 2 + 0.05]}
        fontSize={0.15}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        PORTFOLIO GALLERY
      </Text>

      {/* Artwork frames */}
      {artworkPositions.map((art, i) => (
        <ArtworkFrame
          key={`art-${i}`}
          position={art.position}
          rotation={art.rotation}
          folder={art.folder}
          isNearby={nearbyFolderId === art.folder.id}
        />
      ))}

      {/* Stanchion barriers - left side */}
      <Stanchion
        start={[-2.8, 0, -12]}
        end={[-2.8, 0, -4]}
      />
      <Stanchion
        start={[-2.8, 0, -4]}
        end={[-2.8, 0, 4]}
      />
      <Stanchion
        start={[-2.8, 0, 4]}
        end={[-2.8, 0, 12]}
      />

      {/* Stanchion barriers - right side */}
      <Stanchion
        start={[2.8, 0, -12]}
        end={[2.8, 0, -4]}
      />
      <Stanchion
        start={[2.8, 0, -4]}
        end={[2.8, 0, 4]}
      />
      <Stanchion
        start={[2.8, 0, 4]}
        end={[2.8, 0, 12]}
      />

      {/* NPC Guests */}
      {guests.map((guest) => (
        <GuestNPC
          key={guest.id}
          guest={guest}
          isNearby={nearbyGuestId === guest.id}
        />
      ))}

      {/* Character */}
      <Character
        keys={keys}
        artworkPositions={artworkPositions}
        guests={guests}
        onNearbyChange={onNearbyChange}
        onNearbyGuestChange={onNearbyGuestChange}
        onEnterPress={onEnterPress}
        onEscapePress={onEscapePress}
        menuOpen={menuOpen}
        detailOpen={detailOpen}
      />
    </>
  );
}
