"use client";

interface StanchionProps {
  start: [number, number, number];
  end: [number, number, number];
}

export default function Stanchion({ start, end }: StanchionProps) {
  const postHeight = 1.0;
  const postRadius = 0.03;
  const ropeY = 0.75;

  // Calculate rope midpoint and length
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  return (
    <group>
      {/* Start post */}
      <mesh position={[start[0], postHeight / 2, start[2]]}>
        <cylinderGeometry args={[postRadius, postRadius, postHeight, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Start post top ball */}
      <mesh position={[start[0], postHeight + 0.04, start[2]]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#c8a96e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* End post */}
      <mesh position={[end[0], postHeight / 2, end[2]]}>
        <cylinderGeometry args={[postRadius, postRadius, postHeight, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* End post top ball */}
      <mesh position={[end[0], postHeight + 0.04, end[2]]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#c8a96e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rope between posts */}
      <mesh
        position={[midX, ropeY, midZ]}
        rotation={[Math.PI / 2, angle, 0]}
      >
        <cylinderGeometry args={[0.012, 0.012, length, 6]} />
        <meshStandardMaterial color="#8b0000" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}
