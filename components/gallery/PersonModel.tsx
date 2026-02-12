"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PersonModelProps {
  color?: string;
  walkPhase?: number;
}

// Pool of random characters to fill the body
const FILL_CHARS = [
  "@", "#", "$", "%", "&", "*", "+", "=", "~",
  "{", "}", "[", "]", "(", ")", "<", ">",
  "/", "\\", "|", "^", "!", "?", ":", ";",
  "0", "1", "A", "X", "Z", "W", "M", "N",
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface AsciiChar {
  char: string;
  pos: [number, number, number];
  size: number;
  bright?: boolean; // outline/structural chars rendered brighter
  group?: "leftArm" | "rightArm" | "leftLeg" | "rightLeg";
}

function buildAsciiPerson(): AsciiChar[] {
  const chars: AsciiChar[] = [];
  const s = 0.04; // tighter character spacing for density

  // ========= HEAD =========
  // Dense circle of characters
  // Row 1 (top)
  chars.push({ char: pick(FILL_CHARS), pos: [-s, 1.55, 0], size: 0.04 });
  chars.push({ char: "@", pos: [0, 1.56, 0], size: 0.05, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [s, 1.55, 0], size: 0.04 });
  // Row 2
  chars.push({ char: "(", pos: [-s * 2, 1.50, 0], size: 0.045, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [-s, 1.50, 0], size: 0.04 });
  chars.push({ char: pick(FILL_CHARS), pos: [0, 1.50, 0], size: 0.04 });
  chars.push({ char: pick(FILL_CHARS), pos: [s, 1.50, 0], size: 0.04 });
  chars.push({ char: ")", pos: [s * 2, 1.50, 0], size: 0.045, bright: true });
  // Row 3 (face)
  chars.push({ char: "{", pos: [-s * 2.2, 1.45, 0], size: 0.05, bright: true });
  chars.push({ char: "o", pos: [-s * 0.7, 1.45, 0], size: 0.04, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [0, 1.45, 0], size: 0.03 });
  chars.push({ char: "o", pos: [s * 0.7, 1.45, 0], size: 0.04, bright: true });
  chars.push({ char: "}", pos: [s * 2.2, 1.45, 0], size: 0.05, bright: true });
  // Row 4
  chars.push({ char: pick(FILL_CHARS), pos: [-s * 1.5, 1.41, 0], size: 0.035 });
  chars.push({ char: "_", pos: [-s * 0.4, 1.40, 0], size: 0.035, bright: true });
  chars.push({ char: "w", pos: [0, 1.40, 0], size: 0.035, bright: true });
  chars.push({ char: "_", pos: [s * 0.4, 1.40, 0], size: 0.035, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [s * 1.5, 1.41, 0], size: 0.035 });
  // Row 5 (chin)
  chars.push({ char: "\\", pos: [-s * 1.2, 1.37, 0], size: 0.035, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [0, 1.37, 0], size: 0.03 });
  chars.push({ char: "/", pos: [s * 1.2, 1.37, 0], size: 0.035, bright: true });

  // ========= NECK =========
  chars.push({ char: "|", pos: [0, 1.32, 0], size: 0.04, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [-0.02, 1.33, 0], size: 0.03 });
  chars.push({ char: pick(FILL_CHARS), pos: [0.02, 1.33, 0], size: 0.03 });

  // ========= SHOULDERS =========
  chars.push({ char: "/", pos: [-0.19, 1.26, 0], size: 0.05, bright: true });
  chars.push({ char: "=", pos: [-0.13, 1.27, 0], size: 0.045, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [-0.07, 1.27, 0], size: 0.04 });
  chars.push({ char: "T", pos: [0, 1.28, 0], size: 0.05, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [0.07, 1.27, 0], size: 0.04 });
  chars.push({ char: "=", pos: [0.13, 1.27, 0], size: 0.045, bright: true });
  chars.push({ char: "\\", pos: [0.19, 1.26, 0], size: 0.05, bright: true });

  // ========= TORSO (densely filled) =========
  const torsoRows = [
    { y: 1.20, w: 0.12 },
    { y: 1.15, w: 0.13 },
    { y: 1.10, w: 0.14 },
    { y: 1.05, w: 0.14 },
    { y: 1.00, w: 0.15 },
    { y: 0.95, w: 0.14 },
    { y: 0.90, w: 0.13 },
  ];
  const outlineL = ["|", "{", "|", "{", "|", "{", "|"];
  const outlineR = ["|", "}", "|", "}", "|", "}", "|"];

  torsoRows.forEach((row, i) => {
    // Left outline
    chars.push({ char: outlineL[i], pos: [-row.w, row.y, 0], size: 0.05, bright: true });
    // Fill columns
    const cols = 4;
    for (let c = 0; c < cols; c++) {
      const x = -row.w + (row.w * 2) * ((c + 1) / (cols + 1));
      chars.push({ char: pick(FILL_CHARS), pos: [x, row.y, 0], size: 0.04 });
    }
    // Right outline
    chars.push({ char: outlineR[i], pos: [row.w, row.y, 0], size: 0.05, bright: true });
  });

  // ========= BELT/HIPS =========
  chars.push({ char: "\\", pos: [-0.12, 0.85, 0], size: 0.05, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [-0.06, 0.84, 0], size: 0.04 });
  chars.push({ char: "_", pos: [0, 0.84, 0], size: 0.04, bright: true });
  chars.push({ char: pick(FILL_CHARS), pos: [0.06, 0.84, 0], size: 0.04 });
  chars.push({ char: "/", pos: [0.12, 0.85, 0], size: 0.05, bright: true });

  // ========= LEFT ARM (denser) =========
  const armCharsL: AsciiChar[] = [
    { char: "\\", pos: [-0.21, 1.20, 0], size: 0.045, bright: true, group: "leftArm" },
    { char: pick(FILL_CHARS), pos: [-0.22, 1.15, 0], size: 0.035, group: "leftArm" },
    { char: "|", pos: [-0.23, 1.10, 0], size: 0.045, bright: true, group: "leftArm" },
    { char: pick(FILL_CHARS), pos: [-0.24, 1.05, 0], size: 0.035, group: "leftArm" },
    { char: "|", pos: [-0.24, 1.00, 0], size: 0.045, bright: true, group: "leftArm" },
    { char: ">", pos: [-0.25, 0.95, 0], size: 0.04, bright: true, group: "leftArm" },
    { char: pick(FILL_CHARS), pos: [-0.25, 0.90, 0], size: 0.035, group: "leftArm" },
    { char: "|", pos: [-0.25, 0.85, 0], size: 0.04, bright: true, group: "leftArm" },
    { char: pick(FILL_CHARS), pos: [-0.25, 0.80, 0], size: 0.035, group: "leftArm" },
    { char: ")", pos: [-0.25, 0.76, 0], size: 0.035, bright: true, group: "leftArm" },
  ];
  chars.push(...armCharsL);

  // ========= RIGHT ARM (denser) =========
  const armCharsR: AsciiChar[] = [
    { char: "/", pos: [0.21, 1.20, 0], size: 0.045, bright: true, group: "rightArm" },
    { char: pick(FILL_CHARS), pos: [0.22, 1.15, 0], size: 0.035, group: "rightArm" },
    { char: "|", pos: [0.23, 1.10, 0], size: 0.045, bright: true, group: "rightArm" },
    { char: pick(FILL_CHARS), pos: [0.24, 1.05, 0], size: 0.035, group: "rightArm" },
    { char: "|", pos: [0.24, 1.00, 0], size: 0.045, bright: true, group: "rightArm" },
    { char: "<", pos: [0.25, 0.95, 0], size: 0.04, bright: true, group: "rightArm" },
    { char: pick(FILL_CHARS), pos: [0.25, 0.90, 0], size: 0.035, group: "rightArm" },
    { char: "|", pos: [0.25, 0.85, 0], size: 0.04, bright: true, group: "rightArm" },
    { char: pick(FILL_CHARS), pos: [0.25, 0.80, 0], size: 0.035, group: "rightArm" },
    { char: "(", pos: [0.25, 0.76, 0], size: 0.035, bright: true, group: "rightArm" },
  ];
  chars.push(...armCharsR);

  // ========= LEFT LEG (denser) =========
  const legCharsL: AsciiChar[] = [
    { char: "|", pos: [-0.08, 0.78, 0], size: 0.05, bright: true, group: "leftLeg" },
    { char: pick(FILL_CHARS), pos: [-0.08, 0.73, 0], size: 0.035, group: "leftLeg" },
    { char: "|", pos: [-0.08, 0.68, 0], size: 0.05, bright: true, group: "leftLeg" },
    { char: pick(FILL_CHARS), pos: [-0.08, 0.63, 0], size: 0.035, group: "leftLeg" },
    { char: ">", pos: [-0.08, 0.58, 0], size: 0.04, bright: true, group: "leftLeg" },
    { char: pick(FILL_CHARS), pos: [-0.08, 0.53, 0], size: 0.035, group: "leftLeg" },
    { char: "|", pos: [-0.08, 0.48, 0], size: 0.05, bright: true, group: "leftLeg" },
    { char: pick(FILL_CHARS), pos: [-0.08, 0.43, 0], size: 0.035, group: "leftLeg" },
    { char: "|", pos: [-0.08, 0.38, 0], size: 0.05, bright: true, group: "leftLeg" },
    { char: pick(FILL_CHARS), pos: [-0.08, 0.33, 0], size: 0.035, group: "leftLeg" },
    { char: "/", pos: [-0.10, 0.27, 0], size: 0.04, bright: true, group: "leftLeg" },
    { char: "_", pos: [-0.07, 0.22, 0], size: 0.04, bright: true, group: "leftLeg" },
    { char: pick(FILL_CHARS), pos: [-0.03, 0.22, 0], size: 0.035, group: "leftLeg" },
    { char: "_", pos: [0.01, 0.22, 0], size: 0.04, bright: true, group: "leftLeg" },
  ];
  chars.push(...legCharsL);

  // ========= RIGHT LEG (denser) =========
  const legCharsR: AsciiChar[] = [
    { char: "|", pos: [0.08, 0.78, 0], size: 0.05, bright: true, group: "rightLeg" },
    { char: pick(FILL_CHARS), pos: [0.08, 0.73, 0], size: 0.035, group: "rightLeg" },
    { char: "|", pos: [0.08, 0.68, 0], size: 0.05, bright: true, group: "rightLeg" },
    { char: pick(FILL_CHARS), pos: [0.08, 0.63, 0], size: 0.035, group: "rightLeg" },
    { char: "<", pos: [0.08, 0.58, 0], size: 0.04, bright: true, group: "rightLeg" },
    { char: pick(FILL_CHARS), pos: [0.08, 0.53, 0], size: 0.035, group: "rightLeg" },
    { char: "|", pos: [0.08, 0.48, 0], size: 0.05, bright: true, group: "rightLeg" },
    { char: pick(FILL_CHARS), pos: [0.08, 0.43, 0], size: 0.035, group: "rightLeg" },
    { char: "|", pos: [0.08, 0.38, 0], size: 0.05, bright: true, group: "rightLeg" },
    { char: pick(FILL_CHARS), pos: [0.08, 0.33, 0], size: 0.035, group: "rightLeg" },
    { char: "\\", pos: [0.10, 0.27, 0], size: 0.04, bright: true, group: "rightLeg" },
    { char: "_", pos: [0.07, 0.22, 0], size: 0.04, bright: true, group: "rightLeg" },
    { char: pick(FILL_CHARS), pos: [0.03, 0.22, 0], size: 0.035, group: "rightLeg" },
    { char: "_", pos: [-0.01, 0.22, 0], size: 0.04, bright: true, group: "rightLeg" },
  ];
  chars.push(...legCharsR);

  return chars;
}

export default function PersonModel({
  color = "#2a2a2a",
  walkPhase = 0,
}: PersonModelProps) {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const asciiChars = useMemo(() => buildAsciiPerson(), []);

  // Separate characters by group
  const bodyChars = useMemo(() => asciiChars.filter((c) => !c.group), [asciiChars]);
  const leftArmChars = useMemo(() => asciiChars.filter((c) => c.group === "leftArm"), [asciiChars]);
  const rightArmChars = useMemo(() => asciiChars.filter((c) => c.group === "rightArm"), [asciiChars]);
  const leftLegChars = useMemo(() => asciiChars.filter((c) => c.group === "leftLeg"), [asciiChars]);
  const rightLegChars = useMemo(() => asciiChars.filter((c) => c.group === "rightLeg"), [asciiChars]);

  // Pivot points for animated groups
  const leftArmPivot: [number, number, number] = [-0.21, 1.22, 0];
  const rightArmPivot: [number, number, number] = [0.21, 1.22, 0];
  const leftLegPivot: [number, number, number] = [-0.08, 0.82, 0];
  const rightLegPivot: [number, number, number] = [0.08, 0.82, 0];

  useFrame(() => {
    const swing = Math.sin(walkPhase) * 0.35;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.5;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.5;
  });

  // Bright white for outline chars, slightly dimmer for fill chars
  // No green - clean white text on the dark gallery background
  const brightColor = "#ffffff";
  const fillColor = "#cccccc";

  const renderChar = (c: AsciiChar, key: string, offset?: [number, number, number]) => {
    const pos: [number, number, number] = offset
      ? [c.pos[0] - offset[0], c.pos[1] - offset[1], c.pos[2] - offset[2]]
      : c.pos;
    return (
      <Text
        key={key}
        position={pos}
        fontSize={c.size}
        color={c.bright ? brightColor : fillColor}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {c.char}
      </Text>
    );
  };

  return (
    <group>
      {/* Static body characters */}
      {bodyChars.map((c, i) => renderChar(c, `body-${i}`))}

      {/* Left arm - animated */}
      <group ref={leftArmRef} position={leftArmPivot}>
        {leftArmChars.map((c, i) => renderChar(c, `la-${i}`, leftArmPivot))}
      </group>

      {/* Right arm - animated */}
      <group ref={rightArmRef} position={rightArmPivot}>
        {rightArmChars.map((c, i) => renderChar(c, `ra-${i}`, rightArmPivot))}
      </group>

      {/* Left leg - animated */}
      <group ref={leftLegRef} position={leftLegPivot}>
        {leftLegChars.map((c, i) => renderChar(c, `ll-${i}`, leftLegPivot))}
      </group>

      {/* Right leg - animated */}
      <group ref={rightLegRef} position={rightLegPivot}>
        {rightLegChars.map((c, i) => renderChar(c, `rl-${i}`, rightLegPivot))}
      </group>
    </group>
  );
}
