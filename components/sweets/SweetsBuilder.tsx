"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import {
  sweets,
  Sweet,
  Category,
  categories,
  MIN_SWEETS,
  MAX_SWEETS,
} from "./sweetsData";

type Stage = "pick" | "box";
type Filter = "all" | Category;

function encodeSelection(items: Sweet[]): string {
  return items.map((s) => s.id).join(",");
}

function decodeSelection(param: string): Sweet[] {
  const ids = param.split(",").filter(Boolean);
  const found: Sweet[] = [];
  for (const id of ids) {
    const sweet = sweets.find((s) => s.id === id);
    if (sweet) found.push(sweet);
  }
  return found;
}

export default function SweetsBuilder() {
  const [stage, setStage] = useState<Stage>("pick");
  const [selected, setSelected] = useState<Sweet[]>([]);
  const [inspecting, setInspecting] = useState<Sweet | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [copied, setCopied] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const boxParam = params.get("box");
    if (boxParam) {
      const items = decodeSelection(boxParam);
      if (items.length >= MIN_SWEETS) {
        setSelected(items);
        setStage("box");
      }
    }
  }, []);

  // Update URL when box is shown
  useEffect(() => {
    if (stage === "box" && selected.length >= MIN_SWEETS) {
      const encoded = encodeSelection(selected);
      const url = new URL(window.location.href);
      url.searchParams.set("box", encoded);
      window.history.replaceState({}, "", url.toString());
    } else if (stage === "pick") {
      const url = new URL(window.location.href);
      url.searchParams.delete("box");
      window.history.replaceState({}, "", url.toString());
    }
  }, [stage, selected]);

  const filteredItems = useMemo(
    () =>
      filter === "all"
        ? sweets
        : sweets.filter((s) => s.category === filter),
    [filter]
  );

  const toggleSweet = useCallback((sweet: Sweet) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === sweet.id);
      if (exists) return prev.filter((s) => s.id !== sweet.id);
      if (prev.length >= MAX_SWEETS) return prev;
      return [...prev, sweet];
    });
  }, []);

  const canFinish = selected.length >= MIN_SWEETS;

  const startOver = () => {
    setSelected([]);
    setStage("pick");
    setInspecting(null);
    setFilter("all");
  };

  const copyLink = async () => {
    const encoded = encodeSelection(selected);
    const url = new URL(window.location.href);
    url.searchParams.set("box", encoded);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select a temporary input
      const input = document.createElement("input");
      input.value = url.toString();
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadImage = async () => {
    if (!boxRef.current) return;
    try {
      const canvas = await html2canvas(boxRef.current, {
        backgroundColor: "#fdf2f8",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "my-sweetbox.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    }
  };

  // Grid columns for the box based on item count
  const getBoxCols = (count: number) => {
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    return 4;
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
          build a digital gift box of sweets, flowers &amp; love
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
              <h2 className="sweets-pick-title">Choose Your Gifts</h2>
              <p className="sweets-pick-subtitle">
                Pick {MIN_SWEETS} to {MAX_SWEETS} items for your box.
                Mix sweets, flowers, and hearts &mdash; each carries a
                special meaning.
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

            {/* Category Tabs */}
            <div className="category-tabs">
              <button
                className={`category-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-tab ${filter === cat.id ? "active" : ""}`}
                  onClick={() => setFilter(cat.id)}
                >
                  <span className="category-tab-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="sweets-grid">
              {filteredItems.map((sweet) => {
                const isSelected = selected.some(
                  (s) => s.id === sweet.id
                );
                const isMaxed =
                  selected.length >= MAX_SWEETS && !isSelected;
                return (
                  <motion.button
                    key={sweet.id}
                    className={`sweet-card ${isSelected ? "selected" : ""} ${isMaxed ? "maxed" : ""}`}
                    style={
                      {
                        "--sweet-color": sweet.color,
                        "--sweet-bg": sweet.bgColor,
                      } as React.CSSProperties
                    }
                    onClick={() => toggleSweet(sweet)}
                    whileHover={{ scale: isMaxed ? 1 : 1.04 }}
                    whileTap={{ scale: isMaxed ? 1 : 0.96 }}
                    layout
                  >
                    <div className="sweet-card-emoji">{sweet.emoji}</div>
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
                  ? `Box it up (${selected.length} items)`
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
            {/* Downloadable area */}
            <div ref={boxRef} className="sweets-export-area">
              <div className="sweets-box-header">
                <h2 className="sweets-box-title">Your Gift Box</h2>
                <p className="sweets-box-subtitle">
                  A curated collection of {selected.length} gifts, packed
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
                      gridTemplateColumns: `repeat(${getBoxCols(selected.length)}, 1fr)`,
                    }}
                  >
                    {selected.map((sweet, i) => (
                      <motion.button
                        key={sweet.id}
                        className="box-sweet-cell"
                        style={
                          {
                            "--sweet-bg": sweet.bgColor,
                            "--sweet-color": sweet.color,
                          } as React.CSSProperties
                        }
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: i * 0.07,
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
                    ))}
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
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <span className="meaning-emoji">{sweet.emoji}</span>
                      <span className="meaning-name">{sweet.name}</span>
                      <span className="meaning-dash">&mdash;</span>
                      <span className="meaning-text">
                        {sweet.meaning}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="sweets-export-watermark">
                sweetbox
              </p>
            </div>

            {/* Action buttons */}
            <div className="sweets-box-actions">
              <button className="sweets-action-btn share" onClick={copyLink}>
                {copied ? "Link Copied!" : "Copy Link"}
              </button>
              <button className="sweets-action-btn download" onClick={downloadImage}>
                Download Image
              </button>
            </div>

            <div className="sweets-box-footer">
              <button
                className="sweets-startover-btn"
                onClick={startOver}
              >
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
              transition={{
                type: "spring",
                damping: 22,
                stiffness: 280,
              }}
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
