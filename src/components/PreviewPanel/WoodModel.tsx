import React, { useMemo, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useConfig } from "../context/ConfigContext";

// Interface định nghĩa
interface WoodModelProps {
  showMeasurements?: boolean;
}

// Shape Geometry Creator
const createShapeGeometry = (
  shapeId: string,
  width: number,
  height: number,
  depth: number
) => {
  const shape = new THREE.Shape();

  // Convert cm to Three.js units
  const w = width / 100;
  const h = height / 100;
  const d = depth / 100;

  // Tính toán offset để đưa tâm về giữa
  const offsetX = -w / 2;
  const offsetY = -h / 2;

  switch (shapeId) {
    case "rectangle":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, h + offsetY);
      shape.lineTo(0 + offsetX, h + offsetY);
      break;

    case "cut-corner-top-right":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, h * 0.7 + offsetY);
      shape.lineTo(w * 0.75 + offsetX, h + offsetY);
      shape.lineTo(0 + offsetX, h + offsetY);

      break;

    case "cut-corner-bottom-right":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w * 0.75 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, h * 0.3 + offsetY);
      shape.lineTo(w + offsetX, h + offsetY);
      shape.lineTo(0 + offsetX, h + offsetY);
      break;

    case "cut-corners-right":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w * 0.75 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, h * 0.3 + offsetY);
      shape.lineTo(w + offsetX, h * 0.7 + offsetY);
      shape.lineTo(w * 0.75 + offsetX, h + offsetY);
      shape.lineTo(0 + offsetX, h + offsetY);
      break;

    case "trapezoid-right":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, 0 + offsetY);
      shape.lineTo(w * 0.75 + offsetX, h + offsetY);
      shape.lineTo(0 + offsetX, h + offsetY);
      break;

    case "trapezoid-left":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, h + offsetY);
      shape.lineTo(w * 0.25 + offsetX, h + offsetY);
      break;

    case "rounded-corner-bottom-right":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w * 0.7 + offsetX, 0 + offsetY);
      shape.quadraticCurveTo(
        w + offsetX,
        0 + offsetY,
        w + offsetX,
        h * 0.3 + offsetY
      );
      shape.lineTo(w + offsetX, h + offsetY);
      shape.lineTo(0 + offsetX, h + offsetY);
      break;

    case "rounded-corner-top-right":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, h * 0.7 + offsetY);
      shape.quadraticCurveTo(
        w + offsetX,
        h + offsetY,
        w * 0.7 + offsetX,
        h + offsetY
      );
      shape.lineTo(0 + offsetX, h + offsetY);
      break;

    case "rounded-right-side":
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w * 0.7 + offsetX, 0 + offsetY);
      shape.quadraticCurveTo(
        w + offsetX,
        0 + offsetY,
        w + offsetX,
        h * 0.5 + offsetY
      );
      shape.quadraticCurveTo(
        w + offsetX,
        h + offsetY,
        w * 0.7 + offsetX,
        h + offsetY
      );
      shape.lineTo(0 + offsetX, h + offsetY);
      break;

    default:
      // Default rectangle
      shape.moveTo(0 + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, 0 + offsetY);
      shape.lineTo(w + offsetX, h + offsetY);
      shape.lineTo(0 + offsetX, h + offsetY);
  }

  const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: false,
    curveSegments: 32,
  });

  // Center the geometry on Z-axis as well (depth)
  extrudeGeometry.translate(0, 0, -d / 2);

  // Fix normals for consistent lighting
  extrudeGeometry.computeVertexNormals();

  const normals = extrudeGeometry.attributes.normal.array;

  for (let i = 0; i < normals.length; i += 9) {
    const faceNormalZ = normals[i + 2];

    if (faceNormalZ < 0) {
      for (let j = 0; j < 9; j += 3) {
        normals[i + j] *= -1;
        normals[i + j + 1] *= -1;
        normals[i + j + 2] *= -1;
      }
    }
  }

  extrudeGeometry.attributes.normal.needsUpdate = true;

  return extrudeGeometry;
};

// WoodModel Component
const WoodModel: React.FC<WoodModelProps> = () => {
  const { config } = useConfig();

  // Load texture
  const texture = useLoader(THREE.TextureLoader, config.texture.src);

  // Create geometry
  const geometry = useMemo(() => {
    return createShapeGeometry(
      config.shapeId,
      config.width,
      config.height,
      config.depth
    );
  }, [config.shapeId, config.width, config.height, config.depth]);

  // Setup texture
  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(config.width / 100, config.height / 100);
    }
  }, [texture, config.width, config.height]);

  // Material with explicit front/back face handling
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,

      roughness: 0.7,
      metalness: 0.1,
    });
  }, [texture]);

  return (
    <group>
      {/* Main wood piece */}
      <mesh geometry={geometry} material={material} castShadow receiveShadow />

      {/* Edge banding if enabled */}
      {config.edgeBanding && (
        <lineSegments>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color="#8B4513" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
};

export default WoodModel;
