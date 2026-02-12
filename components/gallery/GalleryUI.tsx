"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Folder, Project } from "./projects";
import { GuestData } from "./GuestNPC";

interface GalleryUIProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  nearbyFolder: Folder | null;
  nearbyGuest: GuestData | null;
  detailFolder: Folder | null;
  setDetailFolder: (folder: Folder | null) => void;
  detailProject: Project | null;
  setDetailProject: (project: Project | null) => void;
  talkingGuest: GuestData | null;
  setTalkingGuest: (guest: GuestData | null) => void;
}

export default function GalleryUI({
  menuOpen,
  setMenuOpen,
  nearbyFolder,
  nearbyGuest,
  detailFolder,
  setDetailFolder,
  detailProject,
  setDetailProject,
  talkingGuest,
  setTalkingGuest,
}: GalleryUIProps) {
  const hasNearbyAnything = nearbyFolder || nearbyGuest;
  const nearbyPromptText = nearbyGuest
    ? `Talk to ${nearbyGuest.name}`
    : nearbyFolder
      ? `Open "${nearbyFolder.name}"`
      : null;

  return (
    <div className="gallery-ui">
      {/* Top-right menu button */}
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        MENU
      </button>

      {/* Bottom HUD - hidden on mobile (replaced by joystick) */}
      <div className="hud-bar">
        <div className="hud-section">
          <span className="hud-label">Move</span>
          <div className="hud-keys">
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd>
          </div>
        </div>
        <div className="hud-section">
          <span className="hud-label">Menu</span>
          <div className="hud-keys">
            <kbd>ESC</kbd>
          </div>
        </div>
        <div className="hud-section">
          <span className="hud-label">
            {nearbyPromptText || "Interact"}
          </span>
          <div className="hud-keys">
            <kbd>ENTER</kbd>
          </div>
        </div>
      </div>

      {/* Nearby prompt */}
      <AnimatePresence>
        {hasNearbyAnything && !detailFolder && !menuOpen && !talkingGuest && (
          <motion.div
            className="nearby-prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Press <kbd>ENTER</kbd> to{" "}
            {nearbyGuest ? (
              <>talk to <strong>{nearbyGuest.name}</strong></>
            ) : nearbyFolder ? (
              <>open <strong>{nearbyFolder.name}</strong></>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest speech bubble */}
      <AnimatePresence>
        {talkingGuest && (
          <motion.div
            className="speech-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTalkingGuest(null)}
          >
            <motion.div
              className="speech-bubble"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="speech-header">
                <div
                  className="speech-avatar"
                  style={{ backgroundColor: talkingGuest.color }}
                />
                <span className="speech-name">{talkingGuest.name}</span>
              </div>
              <p className="speech-message">{talkingGuest.message}</p>
              <button
                className="speech-close"
                onClick={() => setTalkingGuest(null)}
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="menu-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h1 className="menu-title">Hark Back</h1>
              <nav className="menu-nav">
                <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}>
                  Gallery
                </a>
                <a href="https://github.com/harineek24" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </nav>
              <p className="menu-subtitle">3D Portfolio Gallery</p>
              <button
                className="menu-close"
                onClick={() => setMenuOpen(false)}
              >
                Press ESC or click to close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folder detail modal */}
      <AnimatePresence>
        {detailFolder && !detailProject && (
          <motion.div
            className="detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="detail-modal folder-modal"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                className="detail-close"
                onClick={() => setDetailFolder(null)}
              >
                &times;
              </button>
              <div
                className="detail-color-bar"
                style={{ backgroundColor: detailFolder.color }}
              />
              <h2 className="detail-title">{detailFolder.name}</h2>
              {detailFolder.projects.length > 0 ? (
                <div className="folder-projects-list">
                  {detailFolder.projects.map((project) => (
                    <button
                      key={project.id}
                      className="folder-project-item"
                      onClick={() => setDetailProject(project)}
                    >
                      <div
                        className="project-color-dot"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="project-item-info">
                        <span className="project-item-title">{project.title}</span>
                        <span className="project-item-tech">
                          {project.techStack.slice(0, 3).join(" · ")}
                        </span>
                      </div>
                      <span className="project-item-arrow">&rarr;</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="folder-empty">
                  No projects in this folder yet. Check back soon!
                </p>
              )}
              <p className="detail-hint">Press ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project detail modal */}
      <AnimatePresence>
        {detailProject && (
          <motion.div
            className="detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="detail-modal project-modal"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                className="detail-close"
                onClick={() => setDetailProject(null)}
              >
                &times;
              </button>
              <button
                className="detail-back"
                onClick={() => setDetailProject(null)}
              >
                &larr; Back to folder
              </button>
              <div
                className="detail-color-bar"
                style={{ backgroundColor: detailProject.color }}
              />
              <h2 className="detail-title">{detailProject.title}</h2>
              <p className="detail-description">{detailProject.description}</p>
              <div className="detail-tags">
                {detailProject.techStack.map((tech) => (
                  <span key={tech} className="detail-tag">
                    {tech}
                  </span>
                ))}
              </div>
              {detailProject.links.length > 0 && (
                <div className="detail-links">
                  {detailProject.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      {link.label} &rarr;
                    </a>
                  ))}
                </div>
              )}
              <p className="detail-hint">Press ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
