"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PersonModelProps {
  color?: string;
  walkPhase?: number;
}

// Characters used to build the ASCII person
const HEAD_CHARS = ["@", "#", "@", "#", "@"];
const FACE_CHARS = ["{", "o", ".", "o", "}"];
const NECK_CHAR = "|";
const SHOULDER_CHARS = ["/", "=", "=", "=", "\\"];
const TORSO_CHARS_L = ["|", "{", "|", "{"];
const TORSO_CHARS_R = ["|", "}", "|", "}"];
const TORSO_FILL = ["#", "%", "&", "#"];
const HIP_CHARS = ["\\", "_", "_", "/"];
const UPPER_LEG_CHARS = ["|", "|"];
const KNEE_CHARS = [">", "<"];
const LOWER_LEG_CHARS = ["|", "|"];
const FOOT_CHARS = ["/", "_", "\\"];

interface AsciiChar {
  char: string;
  pos: [number, number, number];
  size: number;
  group?: "leftArm" | "rightArm" | "leftLeg" | "rightLeg";
}

function buildAsciiPerson(): AsciiChar[] {
  const chars: AsciiChar[] = [];
  const s = 0.045; // character spacing

  // --- HEAD (circle of characters) ---
  // Top row
  chars.push({ char: "@", pos: [-s, 1.52, 0], size: 0.05 });
  chars.push({ char: "#", pos: [0, 1.53, 0], size: 0.05 });
  chars.push({ char: "@", pos: [s, 1.52, 0], size: 0.05 });
  // Middle row (face)
  chars.push({ char: "{", pos: [-s * 1.5, 1.46, 0], size: 0.05 });
  chars.push({ char: "o", pos: [-s * 0.5, 1.46, 0], size: 0.04 });
  chars.push({ char: "_", pos: [0, 1.45, 0], size: 0.035 });
  chars.push({ char: "o", pos: [s * 0.5, 1.46, 0], size: 0.04 });
  chars.push({ char: "}", pos: [s * 1.5, 1.46, 0], size: 0.05 });
  // Bottom row
  chars.push({ char: "\\", pos: [-s * 0.7, 1.40, 0], size: 0.04 });
  chars.push({ char: "_", pos: [0, 1.39, 0], size: 0.04 });
  chars.push({ char: "/", pos: [s * 0.7, 1.40, 0], size: 0.04 });

  // --- NECK ---
  chars.push({ char: "|", pos: [0, 1.34, 0], size: 0.04 });

  // --- SHOULDERS ---
  chars.push({ char: "/", pos: [-0.17, 1.26, 0], size: 0.05 });
  chars.push({ char: "=", pos: [-0.09, 1.27, 0], size: 0.045 });
  chars.push({ char: "T", pos: [0, 1.28, 0], size: 0.05 });
  chars.push({ char: "=", pos: [0.09, 1.27, 0], size: 0.045 });
  chars.push({ char: "\\", pos: [0.17, 1.26, 0], size: 0.05 });

  // --- TORSO ---
  const torsoY = [1.18, 1.10, 1.02, 0.94];
  const torsoWidth = [0.11, 0.12, 0.13, 0.12];
  torsoY.forEach((y, i) => {
    chars.push({ char: TORSO_CHARS_L[i], pos: [-torsoWidth[i], y, 0], size: 0.05 });
    chars.push({ char: TORSO_FILL[i], pos: [0, y, 0], size: 0.05 });
    chars.push({ char: TORSO_CHARS_R[i], pos: [torsoWidth[i], y, 0], size: 0.05 });
  });

  // --- BELT/HIPS ---
  chars.push({ char: "\\", pos: [-0.1, 0.85, 0], size: 0.05 });
  chars.push({ char: "_", pos: [-0.04, 0.84, 0], size: 0.04 });
  chars.push({ char: "_", pos: [0.04, 0.84, 0], size: 0.04 });
  chars.push({ char: "/", pos: [0.1, 0.85, 0], size: 0.05 });

  // --- LEFT ARM ---
  const armCharsL: AsciiChar[] = [
    { char: "\\", pos: [-0.20, 1.18, 0], size: 0.045, group: "leftArm" },
    { char: "|", pos: [-0.22, 1.10, 0], size: 0.045, group: "leftArm" },
    { char: "|", pos: [-0.23, 1.02, 0], size: 0.045, group: "leftArm" },
    { char: ">", pos: [-0.24, 0.95, 0], size: 0.04, group: "leftArm" },
    { char: "|", pos: [-0.24, 0.88, 0], size: 0.04, group: "leftArm" },
    { char: "|", pos: [-0.24, 0.81, 0], size: 0.04, group: "leftArm" },
  ];
  chars.push(...armCharsL);

  // --- RIGHT ARM ---
  const armCharsR: AsciiChar[] = [
    { char: "/", pos: [0.20, 1.18, 0], size: 0.045, group: "rightArm" },
    { char: "|", pos: [0.22, 1.10, 0], size: 0.045, group: "rightArm" },
    { char: "|", pos: [0.23, 1.02, 0], size: 0.045, group: "rightArm" },
    { char: "<", pos: [0.24, 0.95, 0], size: 0.04, group: "rightArm" },
    { char: "|", pos: [0.24, 0.88, 0], size: 0.04, group: "rightArm" },
    { char: "|", pos: [0.24, 0.81, 0], size: 0.04, group: "rightArm" },
  ];
  chars.push(...armCharsR);

  // --- LEFT LEG ---
  const legCharsL: AsciiChar[] = [
    { char: "|", pos: [-0.07, 0.76, 0], size: 0.05, group: "leftLeg" },
    { char: "|", pos: [-0.07, 0.66, 0], size: 0.05, group: "leftLeg" },
    { char: ">", pos: [-0.07, 0.56, 0], size: 0.04, group: "leftLeg" },
    { char: "|", pos: [-0.07, 0.46, 0], size: 0.05, group: "leftLeg" },
    { char: "|", pos: [-0.07, 0.36, 0], size: 0.05, group: "leftLeg" },
    { char: "/", pos: [-0.09, 0.26, 0], size: 0.04, group: "leftLeg" },
    { char: "_", pos: [-0.06, 0.22, 0], size: 0.04, group: "leftLeg" },
    { char: "_", pos: [-0.02, 0.22, 0], size: 0.04, group: "leftLeg" },
  ];
  chars.push(...legCharsL);

  // --- RIGHT LEG ---
  const legCharsR: AsciiChar[] = [
    { char: "|", pos: [0.07, 0.76, 0], size: 0.05, group: "rightLeg" },
    { char: "|", pos: [0.07, 0.66, 0], size: 0.05, group: "rightLeg" },
    { char: "<", pos: [0.07, 0.56, 0], size: 0.04, group: "rightLeg" },
    { char: "|", pos: [0.07, 0.46, 0], size: 0.05, group: "rightLeg" },
    { char: "|", pos: [0.07, 0.36, 0], size: 0.05, group: "rightLeg" },
    { char: "\\", pos: [0.09, 0.26, 0], size: 0.04, group: "rightLeg" },
    { char: "_", pos: [0.06, 0.22, 0], size: 0.04, group: "rightLeg" },
    { char: "_", pos: [0.02, 0.22, 0], size: 0.04, group: "rightLeg" },
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
  const leftArmPivot: [number, number, number] = [-0.20, 1.20, 0];
  const rightArmPivot: [number, number, number] = [0.20, 1.20, 0];
  const leftLegPivot: [number, number, number] = [-0.07, 0.80, 0];
  const rightLegPivot: [number, number, number] = [0.07, 0.80, 0];

  useFrame(() => {
    const swing = Math.sin(walkPhase) * 0.35;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.5;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.5;
  });

  // Use a brighter shade for the text to make it pop
  const textColor = new THREE.Color(color).lerp(new THREE.Color("#00ff88"), 0.3).getStyle();

  return (
    <group>
      {/* Static body characters */}
      {bodyChars.map((c, i) => (
        <Text
          key={`body-${i}`}
          position={c.pos}
          fontSize={c.size}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {c.char}
        </Text>
      ))}

      {/* Left arm - animated */}
      <group ref={leftArmRef} position={leftArmPivot}>
        {leftArmChars.map((c, i) => (
          <Text
            key={`la-${i}`}
            position={[
              c.pos[0] - leftArmPivot[0],
              c.pos[1] - leftArmPivot[1],
              c.pos[2] - leftArmPivot[2],
            ]}
            fontSize={c.size}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {c.char}
          </Text>
        ))}
      </group>

      {/* Right arm - animated */}
      <group ref={rightArmRef} position={rightArmPivot}>
        {rightArmChars.map((c, i) => (
          <Text
            key={`ra-${i}`}
            position={[
              c.pos[0] - rightArmPivot[0],
              c.pos[1] - rightArmPivot[1],
              c.pos[2] - rightArmPivot[2],
            ]}
            fontSize={c.size}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {c.char}
          </Text>
        ))}
      </group>

      {/* Left leg - animated */}
      <group ref={leftLegRef} position={leftLegPivot}>
        {leftLegChars.map((c, i) => (
          <Text
            key={`ll-${i}`}
            position={[
              c.pos[0] - leftLegPivot[0],
              c.pos[1] - leftLegPivot[1],
              c.pos[2] - leftLegPivot[2],
            ]}
            fontSize={c.size}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {c.char}
          </Text>
        ))}
      </group>

      {/* Right leg - animated */}
      <group ref={rightLegRef} position={rightLegPivot}>
        {rightLegChars.map((c, i) => (
          <Text
            key={`rl-${i}`}
            position={[
              c.pos[0] - rightLegPivot[0],
              c.pos[1] - rightLegPivot[1],
              c.pos[2] - rightLegPivot[2],
            ]}
            fontSize={c.size}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {c.char}
          </Text>
        ))}
      </group>
    </group>
  );
}
