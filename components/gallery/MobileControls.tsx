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
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

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

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const touch = e.touches[0];
      touchIdRef.current = touch.identifier;
      const rect = joystickRef.current?.getBoundingClientRect();
      if (rect) {
        centerRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    },
    []
  );

  const handleTouchMove = useCallback(
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
            knobRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
          }

          // Map joystick to keys
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

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          if (knobRef.current) {
            knobRef.current.style.transform = "translate(0px, 0px)";
          }
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

  if (!isMobile) return null;

  return (
    <>
      {/* Virtual joystick - bottom left */}
      <div
        ref={joystickRef}
        className="mobile-joystick"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={knobRef} className="mobile-joystick-knob" />
      </div>

      {/* Action button - bottom right */}
      {nearbyLabel && (
        <button
          className="mobile-action-btn"
          onTouchStart={(e) => {
            e.preventDefault();
            onEnterPress();
          }}
        >
          Open
        </button>
      )}
    </>
  );
}
