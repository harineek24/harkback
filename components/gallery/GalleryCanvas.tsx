"use client";

import { useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import GalleryScene from "./GalleryScene";
import GalleryUI from "./GalleryUI";
import MobileControls from "./MobileControls";
import { useKeyboardControls } from "./useKeyboardControls";
import { folders, Folder, Project } from "./projects";
import { guests as guestData, GuestData } from "./GuestNPC";

export default function GalleryCanvas() {
  const keys = useKeyboardControls();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nearbyFolderId, setNearbyFolderId] = useState<string | null>(null);
  const [nearbyGuestId, setNearbyGuestId] = useState<string | null>(null);
  const [detailFolder, setDetailFolder] = useState<Folder | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [talkingGuest, setTalkingGuest] = useState<GuestData | null>(null);

  const nearbyFolderIdRef = useRef<string | null>(null);
  const nearbyGuestIdRef = useRef<string | null>(null);

  const nearbyFolder = nearbyFolderId
    ? folders.find((f) => f.id === nearbyFolderId) || null
    : null;

  const nearbyGuest = nearbyGuestId
    ? guestData.find((g) => g.id === nearbyGuestId) || null
    : null;

  const handleNearbyChange = useCallback((folderId: string | null) => {
    if (folderId !== nearbyFolderIdRef.current) {
      nearbyFolderIdRef.current = folderId;
      setNearbyFolderId(folderId);
    }
  }, []);

  const handleNearbyGuestChange = useCallback((guestId: string | null) => {
    if (guestId !== nearbyGuestIdRef.current) {
      nearbyGuestIdRef.current = guestId;
      setNearbyGuestId(guestId);
    }
  }, []);

  const handleEnterPress = useCallback(() => {
    if (detailProject || detailFolder || menuOpen) return;

    // If talking to a guest, close the speech bubble
    if (talkingGuest) {
      setTalkingGuest(null);
      return;
    }

    // Check if near a guest first
    const currentNearbyGuest = nearbyGuestIdRef.current;
    if (currentNearbyGuest) {
      const guest = guestData.find((g) => g.id === currentNearbyGuest);
      if (guest) {
        setTalkingGuest(guest);
        return;
      }
    }

    // Then check for artwork
    const currentNearby = nearbyFolderIdRef.current;
    if (currentNearby) {
      const folder = folders.find((f) => f.id === currentNearby);
      if (folder) {
        setDetailFolder(folder);
      }
    }
  }, [menuOpen, detailFolder, detailProject, talkingGuest]);

  const handleEscapePress = useCallback(() => {
    if (talkingGuest) {
      setTalkingGuest(null);
    } else if (detailProject) {
      setDetailProject(null);
    } else if (detailFolder) {
      setDetailFolder(null);
    } else {
      setMenuOpen((prev) => !prev);
    }
  }, [talkingGuest, detailProject, detailFolder]);

  const handleSetDetailFolder = useCallback((folder: Folder | null) => {
    setDetailFolder(folder);
    if (!folder) {
      setDetailProject(null);
    }
  }, []);

  const isAnyModalOpen = detailFolder !== null || talkingGuest !== null;

  return (
    <div className="gallery-container">
      <Canvas
        camera={{ position: [0, 3, 14], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        <GalleryScene
          keys={keys}
          nearbyFolderId={nearbyFolderId}
          nearbyGuestId={nearbyGuestId}
          guests={guestData}
          onNearbyChange={handleNearbyChange}
          onNearbyGuestChange={handleNearbyGuestChange}
          onEnterPress={handleEnterPress}
          onEscapePress={handleEscapePress}
          menuOpen={menuOpen}
          detailOpen={isAnyModalOpen}
        />
      </Canvas>
      <GalleryUI
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        nearbyFolder={nearbyFolder}
        nearbyGuest={nearbyGuest}
        detailFolder={detailFolder}
        setDetailFolder={handleSetDetailFolder}
        detailProject={detailProject}
        setDetailProject={setDetailProject}
        talkingGuest={talkingGuest}
        setTalkingGuest={setTalkingGuest}
      />
      <MobileControls
        keys={keys}
        onEnterPress={handleEnterPress}
        nearbyLabel={
          nearbyGuest
            ? `Talk to ${nearbyGuest.name}`
            : nearbyFolder
              ? nearbyFolder.name
              : null
        }
        hidden={!!detailFolder || !!talkingGuest || menuOpen}
      />
    </div>
  );
}
