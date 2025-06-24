import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useConfig } from "../context/ConfigContext";
import WoodMeasurements from "./WoodMeasurements";

// Draggable Point Component
const DraggablePoint: React.FC<{
  position: [number, number, number];
  onDrag: (newPosition: [number, number, number]) => void;
  color: string;
  size?: number;
}> = ({ position, onDrag, color, size = 0.006 }) => {
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
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
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

  useEffect(() => {
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

// WoodModel Component
const WoodModel: React.FC<WoodModelProps> = ({ showMeasurements = false }) => {
  const { config, batchUpdate } = useConfig();

  // Load texture
  const texture = useLoader(THREE.TextureLoader, config.texture.src);

  // Configure texture
  useMemo(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture]);

  // Constants
  const CM_TO_UNIT = 0.01;
  const UNIT_TO_CM = 100;

  // Create initial points from config
  const initialPoints = useMemo(() => {
    const halfWidth = (config.right * CM_TO_UNIT) / 2;
    const halfHeight = (config.top * CM_TO_UNIT) / 2;

    return [
      { x: -halfWidth, y: halfHeight, z: 0 }, // Top Left
      { x: halfWidth, y: halfHeight, z: 0 }, // Top Right
      { x: halfWidth, y: -halfHeight, z: 0 }, // Bottom Right
      { x: -halfWidth, y: -halfHeight, z: 0 }, // Bottom Left
    ];
  }, [config.top, config.right, CM_TO_UNIT]);

  // Local state for draggable points
  const [points, setPoints] = useState(initialPoints);
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync with config changes (only on mount or external config changes - NOT during drag)
  useEffect(() => {
    if (!isDragging && !isInitialized) {
      setPoints(initialPoints);
      setIsInitialized(true);
    }
  }, [initialPoints, isDragging, isInitialized]);

  const thickness = config.depth * CM_TO_UNIT;

  // Ensure points are in correct order (counter-clockwise)
  const orderPoints = useCallback((pts: typeof points) => {
    // Find centroid
    const centroid = {
      x: pts.reduce((sum, p) => sum + p.x, 0) / pts.length,
      y: pts.reduce((sum, p) => sum + p.y, 0) / pts.length,
    };

    // Sort points by angle from centroid
    const sortedPoints = [...pts].sort((a, b) => {
      const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
      const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
      return angleA - angleB;
    });

    return sortedPoints;
  }, []);

  // Calculate area using corrected shoelace formula
  const calculateArea = useCallback(
    (pts: typeof points) => {
      // Order points properly first
      const orderedPts = orderPoints(pts);

      let area = 0;
      const n = orderedPts.length;

      // Shoelace formula
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += orderedPts[i].x * orderedPts[j].y;
        area -= orderedPts[j].x * orderedPts[i].y;
      }

      area = Math.abs(area) / 2;
      const areaCm2 = area * (UNIT_TO_CM * UNIT_TO_CM);

      return areaCm2;
    },
    [orderPoints, UNIT_TO_CM]
  );

  // Calculate bounding box area for comparison
  const calculateBoundingBoxArea = useCallback(
    (pts: typeof points) => {
      const minX = Math.min(...pts.map((p) => p.x));
      const maxX = Math.max(...pts.map((p) => p.x));
      const minY = Math.min(...pts.map((p) => p.y));
      const maxY = Math.max(...pts.map((p) => p.y));

      const width = maxX - minX;
      const height = maxY - minY;

      return {
        area: width * height * (UNIT_TO_CM * UNIT_TO_CM),
        width: width * UNIT_TO_CM,
        height: height * UNIT_TO_CM,
      };
    },
    [UNIT_TO_CM]
  );

  // Comprehensive area verification
  const verifyArea = useCallback(
    (pts: typeof points) => {
      const shoelaceArea = calculateArea(pts);
      const boundingBox = calculateBoundingBoxArea(pts);

      // Triangle method for verification
      const orderedPts = orderPoints(pts);
      const triangleArea1 =
        0.5 *
        Math.abs(
          (orderedPts[1].x - orderedPts[0].x) *
            (orderedPts[2].y - orderedPts[0].y) -
            (orderedPts[2].x - orderedPts[0].x) *
              (orderedPts[1].y - orderedPts[0].y)
        );
      const triangleArea2 =
        0.5 *
        Math.abs(
          (orderedPts[2].x - orderedPts[0].x) *
            (orderedPts[3].y - orderedPts[0].y) -
            (orderedPts[3].x - orderedPts[0].x) *
              (orderedPts[2].y - orderedPts[0].y)
        );
      const triangleSum =
        (triangleArea1 + triangleArea2) * (UNIT_TO_CM * UNIT_TO_CM);

      // Log verification

      return {
        shoelace: shoelaceArea,
        triangleSum: triangleSum,
        boundingBox: boundingBox.area,
        width: boundingBox.width,
        height: boundingBox.height,
      };
    },
    [calculateArea, calculateBoundingBoxArea, orderPoints, UNIT_TO_CM]
  );

  // Handle point drag
  const handlePointDrag = useCallback(
    (index: number, newPosition: [number, number, number]) => {
      setIsDragging(true);

      const newPoints = [...points];
      newPoints[index] = {
        x: newPosition[0],
        y: newPosition[1],
        z: newPosition[2],
      };
      setPoints(newPoints);

      // Debounced config update
      clearTimeout((window as Window).configUpdateTimeout);
      (window as Window).configUpdateTimeout = setTimeout(() => {
        // Calculate new config values from ordered points
        const orderedPoints = orderPoints(newPoints);
        const edges = [];
        const edgeNames = ["top", "right", "bottom", "left"];

        for (let i = 0; i < orderedPoints.length; i++) {
          const current = orderedPoints[i];
          const next = orderedPoints[(i + 1) % orderedPoints.length];
          const length = Math.sqrt(
            Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
          );
          edges.push({
            key: edgeNames[i],
            value: Math.round(length * UNIT_TO_CM * 10) / 10,
          });
        }

        const newConfig: any = {};
        edges.forEach((edge) => {
          newConfig[edge.key] = edge.value;
        });

        const verification = verifyArea(newPoints);
        console.log(`🔄 Area updated: ${verification.shoelace.toFixed(2)} cm²`);
        newConfig.area = Number((verification.shoelace / 10000).toFixed(2));
        newConfig.price = newConfig.area * 100;
        newConfig.originalPrice = newConfig.price * 1.2;
        batchUpdate(newConfig);
        setIsDragging(false);
      }, 100);
    },
    [points, UNIT_TO_CM, verifyArea, batchUpdate, orderPoints]
  );

  // Create geometry using Shape and ExtrudeGeometry
  const geometry = useMemo(() => {
    // Order points properly for shape creation
    const orderedPoints = orderPoints(points);

    // Create shape from ordered points
    const shape = new THREE.Shape();
    shape.moveTo(orderedPoints[0].x, orderedPoints[0].y);
    for (let i = 1; i < orderedPoints.length; i++) {
      shape.lineTo(orderedPoints[i].x, orderedPoints[i].y);
    }
    shape.lineTo(orderedPoints[0].x, orderedPoints[0].y); // Close the shape

    // Extrude settings
    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false,
    };

    // Create extruded geometry
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Transform to center the geometry
    geom.translate(0, 0, -thickness / 2);

    return geom;
  }, [points, thickness, orderPoints]);

  return (
    <group>
      {/* Wood mesh */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Draggable points */}
      {points.map((point, index) => (
        <DraggablePoint
          key={`point-${index}`}
          position={[point.x, point.y, point.z]}
          onDrag={(newPos) => handlePointDrag(index, newPos)}
          color="#ff0000"
          size={0.025}
        />
      ))}

      {showMeasurements && (
        <WoodMeasurements
          points={points}
          thickness={thickness}
          config={config}
          orderPoints={orderPoints}
        />
      )}
    </group>
  );
};

export default WoodModel;
