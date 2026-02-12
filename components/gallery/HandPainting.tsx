"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Generates a CanvasTexture of the wireframe hand + starburst artwork.
 * Dark background, green wireframe mesh hand reaching down, with a
 * pink/blue starburst at the fingertip contact point.
 */
export function useHandPaintingTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const w = 512;
    const h = 400;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // Dark background
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, w, h);

    // Subtle noise/texture
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Starburst center point
    const burstX = 256;
    const burstY = 280;

    // Draw starburst glow
    const grad1 = ctx.createRadialGradient(burstX, burstY, 0, burstX, burstY, 120);
    grad1.addColorStop(0, "rgba(255, 220, 180, 0.6)");
    grad1.addColorStop(0.2, "rgba(255, 150, 100, 0.3)");
    grad1.addColorStop(0.5, "rgba(200, 50, 120, 0.1)");
    grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, w, h);

    // Starburst rays
    ctx.save();
    ctx.translate(burstX, burstY);
    const rayCount = 24;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const length = 40 + Math.random() * 80;
      const hue = i % 3 === 0 ? "rgba(255,100,150,0.4)" :
                  i % 3 === 1 ? "rgba(100,150,255,0.3)" :
                                "rgba(255,200,100,0.35)";
      ctx.strokeStyle = hue;
      ctx.lineWidth = 0.5 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
      ctx.stroke();
    }
    ctx.restore();

    // Small bright center
    const grad2 = ctx.createRadialGradient(burstX, burstY, 0, burstX, burstY, 15);
    grad2.addColorStop(0, "rgba(255, 255, 240, 0.9)");
    grad2.addColorStop(0.5, "rgba(255, 200, 150, 0.4)");
    grad2.addColorStop(1, "rgba(255, 100, 100, 0)");
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.arc(burstX, burstY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Wireframe hand - drawn as a grid mesh
    ctx.strokeStyle = "rgba(0, 255, 100, 0.6)";
    ctx.lineWidth = 0.8;

    // Hand outline points (reaching down from top-left)
    // Wrist area (top-left)
    const hand: [number, number][][] = [];

    // Define finger-like grid columns reaching toward burst point
    const fingers = [
      // Index finger (pointing at burst)
      { startX: 190, startY: 40, endX: 250, endY: 265, width: 14, segments: 12 },
      // Middle finger
      { startX: 210, startY: 30, endX: 260, endY: 250, width: 13, segments: 12 },
      // Ring finger
      { startX: 235, startY: 45, endX: 270, endY: 260, width: 12, segments: 11 },
      // Pinky
      { startX: 260, startY: 65, endX: 285, endY: 265, width: 10, segments: 10 },
      // Thumb (wider, separate)
      { startX: 155, startY: 80, endX: 230, endY: 270, width: 16, segments: 10 },
    ];

    // Draw each finger as a wireframe mesh
    fingers.forEach((f) => {
      const rows: [number, number][][] = [];
      for (let s = 0; s <= f.segments; s++) {
        const t = s / f.segments;
        const cx = f.startX + (f.endX - f.startX) * t;
        const cy = f.startY + (f.endY - f.startY) * t;
        const w = f.width * (1 - t * 0.3);
        const pts: [number, number][] = [];
        const cols = 4;
        for (let c = 0; c <= cols; c++) {
          const ct = c / cols;
          pts.push([cx - w + ct * w * 2, cy + (Math.sin(ct * Math.PI) * 3)]);
        }
        rows.push(pts);
      }

      // Draw horizontal lines
      rows.forEach((row) => {
        ctx.beginPath();
        row.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p[0], p[1]);
          else ctx.lineTo(p[0], p[1]);
        });
        ctx.stroke();
      });

      // Draw vertical lines
      for (let c = 0; c < rows[0].length; c++) {
        ctx.beginPath();
        rows.forEach((row, i) => {
          if (i === 0) ctx.moveTo(row[c][0], row[c][1]);
          else ctx.lineTo(row[c][0], row[c][1]);
        });
        ctx.stroke();
      }
    });

    // Palm mesh (wider section connecting fingers)
    const palmRows = 6;
    const palmCols = 8;
    for (let r = 0; r <= palmRows; r++) {
      const t = r / palmRows;
      const y = 80 + t * 100;
      ctx.beginPath();
      for (let c = 0; c <= palmCols; c++) {
        const ct = c / palmCols;
        const x = 150 + ct * 140;
        const wobble = Math.sin(ct * Math.PI * 2 + t * 3) * 4;
        if (c === 0) ctx.moveTo(x + wobble, y);
        else ctx.lineTo(x + wobble, y);
      }
      ctx.stroke();
    }
    for (let c = 0; c <= palmCols; c++) {
      const ct = c / palmCols;
      ctx.beginPath();
      for (let r = 0; r <= palmRows; r++) {
        const t = r / palmRows;
        const y = 80 + t * 100;
        const x = 150 + ct * 140;
        const wobble = Math.sin(ct * Math.PI * 2 + t * 3) * 4;
        if (r === 0) ctx.moveTo(x + wobble, y);
        else ctx.lineTo(x + wobble, y);
      }
      ctx.stroke();
    }

    // Draw some scattered dots (vertices)
    ctx.fillStyle = "rgba(0, 255, 100, 0.8)";
    for (let i = 0; i < 60; i++) {
      const x = 140 + Math.random() * 170;
      const y = 30 + Math.random() * 250;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add some faint grid lines in background
    ctx.strokeStyle = "rgba(0, 255, 100, 0.05)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}
