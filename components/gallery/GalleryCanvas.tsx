"use client";

import { useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import GalleryScene from "./GalleryScene";
import GalleryUI from "./GalleryUI";
import { useKeyboardControls } from "./useKeyboardControls";
import { folders, Folder, Project } from "./projects";

export default function GalleryCanvas() {
  const keys = useKeyboardControls();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nearbyFolderId, setNearbyFolderId] = useState<string | null>(null);
  const [detailFolder, setDetailFolder] = useState<Folder | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const nearbyFolderIdRef = useRef<string | null>(null);

  const nearbyFolder = nearbyFolderId
    ? folders.find((f) => f.id === nearbyFolderId) || null
    : null;

  const handleNearbyChange = useCallback((folderId: string | null) => {
    if (folderId !== nearbyFolderIdRef.current) {
      nearbyFolderIdRef.current = folderId;
      setNearbyFolderId(folderId);
    }
  }, []);

  const handleEnterPress = useCallback(() => {
    if (detailProject) return;
    if (detailFolder) return;
    if (menuOpen) return;

    const currentNearby = nearbyFolderIdRef.current;
    if (currentNearby) {
      const folder = folders.find((f) => f.id === currentNearby);
      if (folder) {
        setDetailFolder(folder);
      }
    }
  }, [menuOpen, detailFolder, detailProject]);

  const handleEscapePress = useCallback(() => {
    if (detailProject) {
      setDetailProject(null);
    } else if (detailFolder) {
      setDetailFolder(null);
    } else {
      setMenuOpen((prev) => !prev);
    }
  }, [detailProject, detailFolder]);

  const handleSetDetailFolder = useCallback((folder: Folder | null) => {
    setDetailFolder(folder);
    if (!folder) {
      setDetailProject(null);
    }
  }, []);

  return (
    <div className="gallery-container">
      <Canvas
        camera={{ position: [0, 3, 14], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        <GalleryScene
          keys={keys}
          nearbyFolderId={nearbyFolderId}
          onNearbyChange={handleNearbyChange}
          onEnterPress={handleEnterPress}
          onEscapePress={handleEscapePress}
          menuOpen={menuOpen}
          detailOpen={detailFolder !== null}
        />
      </Canvas>
      <GalleryUI
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        nearbyFolder={nearbyFolder}
        detailFolder={detailFolder}
        setDetailFolder={handleSetDetailFolder}
        detailProject={detailProject}
        setDetailProject={setDetailProject}
      />
    </div>
  );
}
