import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface LineWithLabelProps {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
  color?: string;
  backgroundColor?: string;
  lineColor?: string;
}

const LineWithLabel: React.FC<LineWithLabelProps> = ({
  start,
  end,
  label,
  color = "#ffffff",
  backgroundColor = "#1a1a1a",
  lineColor = "#ff0000",
}) => {
  // Tính điểm giữa để đặt label
  const midPoint = new THREE.Vector3(
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  );

  return (
    <group>
      {/* Measurement line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...start, ...end]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={lineColor} />
      </line>

      {/* Label ở giữa */}
      <group position={[midPoint.x, midPoint.y, midPoint.z + 0.005]}>
        {/* Background */}
        <mesh>
          <planeGeometry args={[0.4, 0.1]} />
          <meshBasicMaterial
            color={backgroundColor}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Text */}
        <Text
          position={[0, 0, 0.001]}
          fontSize={0.05}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </group>
  );
};

export default LineWithLabel;
