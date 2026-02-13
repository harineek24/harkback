"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sweets, Sweet, MIN_SWEETS, MAX_SWEETS } from "./sweetsData";

type Stage = "pick" | "box";

export default function SweetsBuilder() {
  const [stage, setStage] = useState<Stage>("pick");
  const [selected, setSelected] = useState<Sweet[]>([]);
  const [inspecting, setInspecting] = useState<Sweet | null>(null);

  const toggleSweet = useCallback(
    (sweet: Sweet) => {
      setSelected((prev) => {
        const exists = prev.find((s) => s.id === sweet.id);
        if (exists) return prev.filter((s) => s.id !== sweet.id);
        if (prev.length >= MAX_SWEETS) return prev;
        return [...prev, sweet];
      });
    },
    []
  );

  const canFinish = selected.length >= MIN_SWEETS;

  const startOver = () => {
    setSelected([]);
    setStage("pick");
    setInspecting(null);
  };

  // Grid positions for the box arrangement (up to 9 items in a 3x3 grid)
  const getBoxPositions = (count: number) => {
    if (count <= 4)
      return [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ];
    if (count <= 6)
      return [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ];
    return [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ];
  };

  return (
    <div className="sweets-app">
      {/* Header */}
      <header className="sweets-header">
        <a href="/" className="sweets-back-link">
          &larr; Gallery
        </a>
        <h1 className="sweets-logo">SweetBox</h1>
        <p className="sweets-tagline">
          build a digital sweets assortment
        </p>
      </header>

      <AnimatePresence mode="wait">
        {/* === PICK STAGE === */}
        {stage === "pick" && (
          <motion.div
            key="pick"
            className="sweets-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sweets-pick-header">
              <h2 className="sweets-pick-title">Choose Your Sweets</h2>
              <p className="sweets-pick-subtitle">
                Pick {MIN_SWEETS} to {MAX_SWEETS} treats for your box.
                Each sweet carries a special meaning.
              </p>
              <div className="sweets-counter">
                <span
                  className={`sweets-count ${canFinish ? "ready" : ""}`}
                >
                  {selected.length}
                </span>
                <span className="sweets-count-label">
                  / {MAX_SWEETS} selected
                </span>
              </div>
            </div>

            {/* Sweets Grid */}
            <div className="sweets-grid">
              {sweets.map((sweet) => {
                const isSelected = selected.some((s) => s.id === sweet.id);
                const isMaxed =
                  selected.length >= MAX_SWEETS && !isSelected;
                return (
                  <motion.button
                    key={sweet.id}
                    className={`sweet-card ${isSelected ? "selected" : ""} ${isMaxed ? "maxed" : ""}`}
                    style={{
                      "--sweet-color": sweet.color,
                      "--sweet-bg": sweet.bgColor,
                    } as React.CSSProperties}
                    onClick={() => toggleSweet(sweet)}
                    whileHover={{ scale: isMaxed ? 1 : 1.04 }}
                    whileTap={{ scale: isMaxed ? 1 : 0.96 }}
                    layout
                  >
                    <div className="sweet-card-emoji">
                      {sweet.emoji}
                    </div>
                    <div className="sweet-card-name">{sweet.name}</div>
                    <div className="sweet-card-meaning">
                      {sweet.meaning}
                    </div>
                    {isSelected && (
                      <motion.div
                        className="sweet-card-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        &#10003;
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Finish Button */}
            <div className="sweets-pick-footer">
              <motion.button
                className={`sweets-finish-btn ${canFinish ? "active" : ""}`}
                disabled={!canFinish}
                onClick={() => setStage("box")}
                whileHover={canFinish ? { scale: 1.03 } : {}}
                whileTap={canFinish ? { scale: 0.97 } : {}}
              >
                {canFinish
                  ? `Box it up (${selected.length} sweets)`
                  : `Pick at least ${MIN_SWEETS - selected.length} more`}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* === BOX STAGE === */}
        {stage === "box" && (
          <motion.div
            key="box"
            className="sweets-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="sweets-box-header">
              <h2 className="sweets-box-title">Your Sweet Box</h2>
              <p className="sweets-box-subtitle">
                A curated collection of {selected.length} treats, packed
                with meaning
              </p>
            </div>

            {/* The Gift Box */}
            <div className="gift-box-wrapper">
              <div className="gift-box-lid">
                <div className="gift-box-ribbon-h" />
                <div className="gift-box-ribbon-v" />
                <div className="gift-box-bow">
                  <div className="bow-loop bow-left" />
                  <div className="bow-loop bow-right" />
                  <div className="bow-knot" />
                </div>
              </div>
              <div className="gift-box">
                <div
                  className="gift-box-grid"
                  style={{
                    gridTemplateColumns: `repeat(${selected.length <= 4 ? 2 : 3}, 1fr)`,
                  }}
                >
                  {selected.map((sweet, i) => {
                    const positions = getBoxPositions(selected.length);
                    const pos = positions[i];
                    return (
                      <motion.button
                        key={sweet.id}
                        className="box-sweet-cell"
                        style={{
                          "--sweet-bg": sweet.bgColor,
                          "--sweet-color": sweet.color,
                          gridRow: pos ? pos.row + 1 : "auto",
                          gridColumn: pos ? pos.col + 1 : "auto",
                        } as React.CSSProperties}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: i * 0.08,
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        onClick={() => setInspecting(sweet)}
                      >
                        <span className="box-sweet-emoji">
                          {sweet.emoji}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Meanings List */}
            <div className="sweets-meanings">
              <h3 className="meanings-title">What your box says</h3>
              <div className="meanings-list">
                {selected.map((sweet, i) => (
                  <motion.div
                    key={sweet.id}
                    className="meaning-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <span className="meaning-emoji">{sweet.emoji}</span>
                    <span className="meaning-name">{sweet.name}</span>
                    <span className="meaning-dash">&mdash;</span>
                    <span className="meaning-text">{sweet.meaning}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="sweets-box-footer">
              <button className="sweets-startover-btn" onClick={startOver}>
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspect modal */}
      <AnimatePresence>
        {inspecting && (
          <motion.div
            className="sweet-inspect-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInspecting(null)}
          >
            <motion.div
              className="sweet-inspect-card"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              style={
                {
                  "--sweet-color": inspecting.color,
                  "--sweet-bg": inspecting.bgColor,
                } as React.CSSProperties
              }
            >
              <div className="inspect-emoji">{inspecting.emoji}</div>
              <h3 className="inspect-name">{inspecting.name}</h3>
              <p className="inspect-flavor">{inspecting.flavor}</p>
              <div className="inspect-meaning-badge">
                {inspecting.meaning}
              </div>
              <button
                className="inspect-close"
                onClick={() => setInspecting(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
