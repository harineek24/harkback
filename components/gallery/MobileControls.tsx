"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { KeyState } from "./useKeyboardControls";

interface MobileControlsProps {
  keys: React.RefObject<KeyState>;
  onEnterPress: () => void;
  nearbyLabel: string | null;
}

export default function MobileControls({
  keys,
  onEnterPress,
  nearbyLabel,
}: MobileControlsProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const joystickContainerRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number } | null>(null);
  const [showInteractRipple, setShowInteractRipple] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const radius = 50;

  // Floating joystick - appears where you touch on the left half
  const handleMoveStart = useCallback(
    (e: React.TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const touch = e.touches[0];
      touchIdRef.current = touch.identifier;

      // Place joystick at touch point
      const x = touch.clientX;
      const y = touch.clientY;
      centerRef.current = { x, y };
      setJoystickPos({ x, y });
    },
    []
  );

  const handleMoveTouch = useCallback(
    (e: React.TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === touchIdRef.current) {
          const dx = touch.clientX - centerRef.current.x;
          const dy = touch.clientY - centerRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const clampDist = Math.min(dist, radius);
          const angle = Math.atan2(dy, dx);
          const cx = Math.cos(angle) * clampDist;
          const cy = Math.sin(angle) * clampDist;

          if (knobRef.current) {
            knobRef.current.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px)`;
          }

          const threshold = 0.3;
          const nx = cx / radius;
          const ny = cy / radius;

          if (keys.current) {
            keys.current.forward = ny < -threshold;
            keys.current.backward = ny > threshold;
            keys.current.left = nx < -threshold;
            keys.current.right = nx > threshold;
          }
          break;
        }
      }
    },
    [keys]
  );

  const handleMoveEnd = useCallback(
    (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setJoystickPos(null);
          if (keys.current) {
            keys.current.forward = false;
            keys.current.backward = false;
            keys.current.left = false;
            keys.current.right = false;
          }
          break;
        }
      }
    },
    [keys]
  );

  // Right side tap = interact
  const handleInteractTap = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      onEnterPress();
      setShowInteractRipple(true);
      setTimeout(() => setShowInteractRipple(false), 400);
    },
    [onEnterPress]
  );

  if (!isMobile) return null;

  return (
    <>
      {/* Left half - movement zone (floating joystick) */}
      <div
        ref={joystickContainerRef}
        className="mobile-move-zone"
        onTouchStart={handleMoveStart}
        onTouchMove={handleMoveTouch}
        onTouchEnd={handleMoveEnd}
      >
        {/* Subtle hint when not touching */}
        {!joystickPos && (
          <div className="mobile-move-hint">
            <div className="mobile-move-hint-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M14 6 L14 10 M14 18 L14 22 M6 14 L10 14 M18 14 L22 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="mobile-move-hint-text">Move</span>
          </div>
        )}

        {/* Floating joystick - appears at touch point */}
        {joystickPos && (
          <div
            className="mobile-floating-joystick"
            style={{
              left: joystickPos.x,
              top: joystickPos.y,
            }}
          >
            <div className="mobile-floating-joystick-ring" />
            <div ref={knobRef} className="mobile-floating-joystick-knob" />
          </div>
        )}
      </div>

      {/* Right half - interact zone */}
      <div
        className="mobile-interact-zone"
        onTouchStart={nearbyLabel ? handleInteractTap : undefined}
      >
        {nearbyLabel ? (
          <div className={`mobile-interact-prompt ${showInteractRipple ? "ripple" : ""}`}>
            <div className="mobile-interact-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M8 4 L16 11 L8 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="mobile-interact-label">{nearbyLabel}</span>
            <span className="mobile-interact-sublabel">Tap</span>
          </div>
        ) : (
          <div className="mobile-look-hint">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 4" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
