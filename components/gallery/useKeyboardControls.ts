"use client";

import { useEffect, useRef } from "react";

export interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  enter: boolean;
  escape: boolean;
}

export function useKeyboardControls() {
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    enter: false,
    escape: false,
  });

  const enterPressed = useRef(false);
  const escapePressed = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          keys.current.forward = true;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          keys.current.backward = true;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          keys.current.left = true;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          keys.current.right = true;
          break;
        case "Enter":
          if (!enterPressed.current) {
            keys.current.enter = true;
            enterPressed.current = true;
          }
          break;
        case "Escape":
          if (!escapePressed.current) {
            keys.current.escape = true;
            escapePressed.current = true;
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          keys.current.forward = false;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          keys.current.backward = false;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          keys.current.left = false;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          keys.current.right = false;
          break;
        case "Enter":
          enterPressed.current = false;
          break;
        case "Escape":
          escapePressed.current = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}
