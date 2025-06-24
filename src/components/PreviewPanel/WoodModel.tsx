import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useConfig } from "../context/ConfigContext";

// Draggable Point Component
const DraggablePoint: React.FC<{
  position: [number, number, number];
  onDrag: (newPosition: [number, number, number]) => void;
  color: string;
  size?: number;
}> = ({ position, onDrag, color, size = 0.005 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { camera, raycaster, gl } = useThree();

  const handlePointerDown = useCallback(
    (event: Event) => {
      event.stopPropagation();
      setIsDragging(true);
      gl.domElement.style.cursor = "grabbing";

      if ((window as Window).__THREE_CONTROLS__) {
        (window as Window).__THREE_CONTROLS__!.enabled = false;
      }
    },
    [gl]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    gl.domElement.style.cursor = isHovered ? "pointer" : "auto";

    if ((window as Window).__THREE_CONTROLS__) {
      (window as Window).__THREE_CONTROLS__!.enabled = true;
    }
  }, [gl, isHovered]);

  const handlePointerMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      event.stopPropagation();

      const rect = gl.domElement.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ("clientX" in event) {
        // MouseEvent
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        // TouchEvent
        const touch = event.touches[0] || event.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      }

      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -position[2]);
      raycaster.setFromCamera(mouse, camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      if (intersection) {
        const constrainedX = Math.max(-2.5, Math.min(2.5, intersection.x));
        const constrainedY = Math.max(-2.5, Math.min(2.5, intersection.y));
        onDrag([constrainedX, constrainedY, position[2]]);
      }
    },
    [isDragging, camera, raycaster, position, onDrag, gl]
  );

  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (event: MouseEvent) => {
        handlePointerMove(event);
      };

      const handleGlobalMouseUp = () => {
        handlePointerUp();
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <mesh
      position={position}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        gl.domElement.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setIsHovered(false);
        if (!isDragging) {
          gl.domElement.style.cursor = "auto";
        }
      }}
    >
      <sphereGeometry args={[isHovered || isDragging ? size * 2 : size]} />
      <meshBasicMaterial
        color={isDragging ? "#ffff00" : isHovered ? "#ff8800" : color}
        transparent
        opacity={isDragging ? 1 : isHovered ? 0.8 : 0.7}
      />
    </mesh>
  );
};

// WoodModel với ConfigContext integration
const WoodModel: React.FC = () => {
  const { config, batchUpdate } = useConfig();

  // Conversion: config values (cm) to 3D units
  const CM_TO_UNIT = 0.01; // 1cm = 0.01 unit (có thể điều chỉnh)
  const UNIT_TO_CM = 100; // 1 unit = 100cm

  // Tạo front points từ config (top, bottom, left, right)
  const frontPointsFromConfig = useMemo(() => {
    const halfWidth = (config.right * CM_TO_UNIT) / 2;
    const halfHeight = (config.top * CM_TO_UNIT) / 2;

    return [
      { x: -halfWidth, y: halfHeight, z: 0 }, // Top Left
      { x: halfWidth, y: halfHeight, z: 0 }, // Top Right
      { x: halfWidth, y: -halfHeight, z: 0 }, // Bottom Right
      { x: -halfWidth, y: -halfHeight, z: 0 }, // Bottom Left
    ];
  }, [config.top, config.bottom, config.left, config.right, CM_TO_UNIT]);

  // Local state cho 3D points (chỉ sync 1 lần khi mount)
  const [frontPoints, setFrontPoints] = useState(frontPointsFromConfig);
  const [isInitialized, setIsInitialized] = useState(false);

  // Chỉ sync khi component mount hoặc config thay đổi từ bên ngoài (không phải từ drag)
  useEffect(() => {
    if (!isInitialized) {
      setFrontPoints(frontPointsFromConfig);
      setIsInitialized(true);
    }
  }, [frontPointsFromConfig, isInitialized]);

  const thickness = config.depth * CM_TO_UNIT; // Convert depth to 3D units

  // Mặt sau tự động theo mặt trước
  const backPoints = useMemo(
    () =>
      frontPoints.map((point) => ({
        ...point,
        z: point.z - thickness,
      })),
    [frontPoints, thickness]
  );

  // Tính config values từ current points (độ dài cạnh thực tế)
  const calculateConfigFromPoints = useCallback(
    (points: typeof frontPoints) => {
      const edges = [];
      const edgeNames = ["top", "right", "bottom", "left"]; // Config keys

      for (let i = 0; i < points.length; i++) {
        const currentPoint = points[i];
        const nextPoint = points[(i + 1) % points.length];

        const lengthInUnits = Math.sqrt(
          Math.pow(nextPoint.x - currentPoint.x, 2) +
            Math.pow(nextPoint.y - currentPoint.y, 2) +
            Math.pow(nextPoint.z - currentPoint.z, 2)
        );

        const lengthInCm = lengthInUnits * UNIT_TO_CM;

        edges.push({
          configKey: edgeNames[i],
          lengthCm: Math.round(lengthInCm * 10) / 10, // Round to 1 decimal
        });
      }

      // Tạo config object với độ dài cạnh thực tế
      const newConfig: any = {};
      edges.forEach((edge) => {
        newConfig[edge.configKey] = edge.lengthCm;
      });

      return newConfig;
    },
    [UNIT_TO_CM]
  );

  // Tính độ dài các cạnh
  const calculateEdgeLengths = useCallback(
    (points: typeof frontPoints) => {
      const edges = [];
      const edgeNames = ["Top", "Right", "Bottom", "Left"];

      for (let i = 0; i < points.length; i++) {
        const currentPoint = points[i];
        const nextPoint = points[(i + 1) % points.length];

        const lengthInUnits = Math.sqrt(
          Math.pow(nextPoint.x - currentPoint.x, 2) +
            Math.pow(nextPoint.y - currentPoint.y, 2) +
            Math.pow(nextPoint.z - currentPoint.z, 2)
        );

        const lengthInCm = lengthInUnits * UNIT_TO_CM;

        edges.push({
          edgeName: edgeNames[i],
          lengthCm: lengthInCm,
        });
      }

      return edges;
    },
    [UNIT_TO_CM]
  );

  // Handle drag và update config (với debounce để tránh loop)
  const [, setIsDragging] = useState(false);

  const handlePointDrag = useCallback(
    (index: number, newPosition: [number, number, number]) => {
      setIsDragging(true);

      const newPoints = [...frontPoints];
      newPoints[index] = {
        x: newPosition[0],
        y: newPosition[1],
        z: newPosition[2],
      };
      setFrontPoints(newPoints);

      // Debounce config update để tránh loop
      clearTimeout((window as Window).configUpdateTimeout);
      (window as Window).configUpdateTimeout = setTimeout(() => {
        // Update config với độ dài cạnh thực tế
        const newConfigValues = calculateConfigFromPoints(newPoints);
        batchUpdate(newConfigValues);

        // Log dimensions với config values

        setIsDragging(false);
      }, 100); // 100ms debounce
    },
    [
      frontPoints,
      calculateConfigFromPoints,
      calculateEdgeLengths,
      batchUpdate,
      config.depth,
    ]
  );

  // Tạo geometry cho miếng gỗ
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    const vertices = new Float32Array([
      // Mặt trước (2 triangles)
      frontPoints[0].x,
      frontPoints[0].y,
      frontPoints[0].z,
      frontPoints[1].x,
      frontPoints[1].y,
      frontPoints[1].z,
      frontPoints[2].x,
      frontPoints[2].y,
      frontPoints[2].z,

      frontPoints[0].x,
      frontPoints[0].y,
      frontPoints[0].z,
      frontPoints[2].x,
      frontPoints[2].y,
      frontPoints[2].z,
      frontPoints[3].x,
      frontPoints[3].y,
      frontPoints[3].z,

      // Mặt sau (2 triangles)
      backPoints[0].x,
      backPoints[0].y,
      backPoints[0].z,
      backPoints[2].x,
      backPoints[2].y,
      backPoints[2].z,
      backPoints[1].x,
      backPoints[1].y,
      backPoints[1].z,

      backPoints[0].x,
      backPoints[0].y,
      backPoints[0].z,
      backPoints[3].x,
      backPoints[3].y,
      backPoints[3].z,
      backPoints[2].x,
      backPoints[2].y,
      backPoints[2].z,

      // 4 mặt bên
      frontPoints[0].x,
      frontPoints[0].y,
      frontPoints[0].z,
      frontPoints[1].x,
      frontPoints[1].y,
      frontPoints[1].z,
      backPoints[1].x,
      backPoints[1].y,
      backPoints[1].z,

      frontPoints[0].x,
      frontPoints[0].y,
      frontPoints[0].z,
      backPoints[1].x,
      backPoints[1].y,
      backPoints[1].z,
      backPoints[0].x,
      backPoints[0].y,
      backPoints[0].z,

      frontPoints[1].x,
      frontPoints[1].y,
      frontPoints[1].z,
      frontPoints[2].x,
      frontPoints[2].y,
      frontPoints[2].z,
      backPoints[2].x,
      backPoints[2].y,
      backPoints[2].z,

      frontPoints[1].x,
      frontPoints[1].y,
      frontPoints[1].z,
      backPoints[2].x,
      backPoints[2].y,
      backPoints[2].z,
      backPoints[1].x,
      backPoints[1].y,
      backPoints[1].z,

      frontPoints[2].x,
      frontPoints[2].y,
      frontPoints[2].z,
      frontPoints[3].x,
      frontPoints[3].y,
      frontPoints[3].z,
      backPoints[3].x,
      backPoints[3].y,
      backPoints[3].z,

      frontPoints[2].x,
      frontPoints[2].y,
      frontPoints[2].z,
      backPoints[3].x,
      backPoints[3].y,
      backPoints[3].z,
      backPoints[2].x,
      backPoints[2].y,
      backPoints[2].z,

      frontPoints[3].x,
      frontPoints[3].y,
      frontPoints[3].z,
      frontPoints[0].x,
      frontPoints[0].y,
      frontPoints[0].z,
      backPoints[0].x,
      backPoints[0].y,
      backPoints[0].z,

      frontPoints[3].x,
      frontPoints[3].y,
      frontPoints[3].z,
      backPoints[0].x,
      backPoints[0].y,
      backPoints[0].z,
      backPoints[3].x,
      backPoints[3].y,
      backPoints[3].z,
    ]);

    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();

    return geom;
  }, [frontPoints, backPoints]);

  return (
    <group>
      {/* Miếng gỗ */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhongMaterial
          color="#8B4513"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          shininess={30}
        />
      </mesh>

      {/* 4 điểm kéo thả chỉ ở mặt trước (đỏ) */}
      {frontPoints.map((point, index) => (
        <DraggablePoint
          key={`front-${index}`}
          position={[point.x, point.y, point.z]}
          onDrag={(newPos) => handlePointDrag(index, newPos)}
          color="#ff0000"
          size={0.006}
        />
      ))}
    </group>
  );
};

export default WoodModel;
