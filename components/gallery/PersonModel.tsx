"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PersonModelProps {
  color?: string;
  walkPhase?: number;
}

// Dense pool of characters
const C = "@#$%&*+=~{}[]()<>/\\|^!?:;01AXZWMN£¥§©®µ¶×÷±";

function pick(): string {
  return C[Math.floor(Math.random() * C.length)];
}

interface AsciiChar {
  char: string;
  pos: [number, number, number];
  size: number;
  group?: "leftArm" | "rightArm" | "leftLeg" | "rightLeg";
}

// Fill an elliptical region with packed characters
function fillEllipse(
  cx: number, cy: number, rx: number, ry: number,
  spacing: number, size: number, group?: AsciiChar["group"]
): AsciiChar[] {
  const result: AsciiChar[] = [];
  for (let y = cy - ry; y <= cy + ry; y += spacing) {
    for (let x = cx - rx; x <= cx + rx; x += spacing * 0.7) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      if (nx * nx + ny * ny <= 1) {
        result.push({ char: pick(), pos: [x, y, 0], size, group });
      }
    }
  }
  return result;
}

// Fill a rectangle with packed characters
function fillRect(
  cx: number, cy: number, hw: number, hh: number,
  spacing: number, size: number, group?: AsciiChar["group"]
): AsciiChar[] {
  const result: AsciiChar[] = [];
  for (let y = cy - hh; y <= cy + hh; y += spacing) {
    for (let x = cx - hw; x <= cx + hw; x += spacing * 0.7) {
      result.push({ char: pick(), pos: [x, y, 0], size, group });
    }
  }
  return result;
}

// Fill a tapered column (for limbs)
function fillLimb(
  cx: number, topY: number, botY: number,
  topW: number, botW: number,
  spacing: number, size: number, group?: AsciiChar["group"]
): AsciiChar[] {
  const result: AsciiChar[] = [];
  for (let y = botY; y <= topY; y += spacing) {
    const t = (y - botY) / (topY - botY);
    const w = botW + (topW - botW) * t;
    for (let x = cx - w; x <= cx + w; x += spacing * 0.7) {
      result.push({ char: pick(), pos: [x, y, 0], size, group });
    }
  }
  return result;
}

function buildAsciiPerson(): AsciiChar[] {
  const chars: AsciiChar[] = [];
  const sp = 0.028; // looser spacing - chars visible but still form a shape
  const sz = 0.03; // slightly bigger so individual chars are readable

  // HEAD - dense ellipse
  chars.push(...fillEllipse(0, 1.47, 0.10, 0.12, sp, sz));

  // NECK
  chars.push(...fillRect(0, 1.33, 0.03, 0.03, sp, sz));

  // SHOULDERS - wide rect
  chars.push(...fillRect(0, 1.27, 0.20, 0.025, sp, sz));

  // TORSO - tapered column
  chars.push(...fillLimb(0, 1.24, 0.86, 0.14, 0.12, sp, sz));

  // HIPS
  chars.push(...fillRect(0, 0.84, 0.10, 0.02, sp, sz));

  // LEFT ARM
  chars.push(...fillLimb(-0.24, 1.24, 0.76, 0.04, 0.03, sp, sz, "leftArm"));

  // RIGHT ARM
  chars.push(...fillLimb(0.24, 1.24, 0.76, 0.04, 0.03, sp, sz, "rightArm"));

  // LEFT LEG
  chars.push(...fillLimb(-0.07, 0.82, 0.22, 0.05, 0.04, sp, sz, "leftLeg"));

  // LEFT FOOT
  chars.push(...fillRect(-0.06, 0.20, 0.05, 0.02, sp, sz, "leftLeg"));

  // RIGHT LEG
  chars.push(...fillLimb(0.07, 0.82, 0.22, 0.05, 0.04, sp, sz, "rightLeg"));

  // RIGHT FOOT
  chars.push(...fillRect(0.06, 0.20, 0.05, 0.02, sp, sz, "rightLeg"));

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

  const bodyChars = useMemo(() => asciiChars.filter((c) => !c.group), [asciiChars]);
  const leftArmChars = useMemo(() => asciiChars.filter((c) => c.group === "leftArm"), [asciiChars]);
  const rightArmChars = useMemo(() => asciiChars.filter((c) => c.group === "rightArm"), [asciiChars]);
  const leftLegChars = useMemo(() => asciiChars.filter((c) => c.group === "leftLeg"), [asciiChars]);
  const rightLegChars = useMemo(() => asciiChars.filter((c) => c.group === "rightLeg"), [asciiChars]);

  const leftArmPivot: [number, number, number] = [-0.24, 1.24, 0];
  const rightArmPivot: [number, number, number] = [0.24, 1.24, 0];
  const leftLegPivot: [number, number, number] = [-0.07, 0.84, 0];
  const rightLegPivot: [number, number, number] = [0.07, 0.84, 0];

  useFrame(() => {
    const swing = Math.sin(walkPhase) * 0.35;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.5;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.5;
  });

  // Black/dark text - solid black silhouettes made of text
  const charColor = "#0a0a0a";

  const renderChar = (c: AsciiChar, key: string, offset?: [number, number, number]) => {
    const pos: [number, number, number] = offset
      ? [c.pos[0] - offset[0], c.pos[1] - offset[1], c.pos[2] - offset[2]]
      : c.pos;
    return (
      <Text
        key={key}
        position={pos}
        fontSize={c.size}
        color={charColor}
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
      {bodyChars.map((c, i) => renderChar(c, `b-${i}`))}

      <group ref={leftArmRef} position={leftArmPivot}>
        {leftArmChars.map((c, i) => renderChar(c, `la-${i}`, leftArmPivot))}
      </group>

      <group ref={rightArmRef} position={rightArmPivot}>
        {rightArmChars.map((c, i) => renderChar(c, `ra-${i}`, rightArmPivot))}
      </group>

      <group ref={leftLegRef} position={leftLegPivot}>
        {leftLegChars.map((c, i) => renderChar(c, `ll-${i}`, leftLegPivot))}
      </group>

      <group ref={rightLegRef} position={rightLegPivot}>
        {rightLegChars.map((c, i) => renderChar(c, `rl-${i}`, rightLegPivot))}
      </group>
    </group>
  );
}
