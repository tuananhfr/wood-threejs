import React, { useMemo, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useConfig } from "../context/ConfigContext";
import MeasurementLines from "./MeasurementLines";

// Shape Geometry Creator with corner customization
const createShapeGeometry = (
  shapeId: string,
  width: number,
  height: number,
  depth: number,
  cornerSelection?: CornerSelection,
  cornerLengths?: CornerLengths
) => {
  const shape = new THREE.Shape();

  // Convert cm to Three.js units
  const w = width / 100;
  const h = height / 100;
  const d = depth / 100;

  // Tính toán offset để đưa tâm về giữa
  const offsetX = -w / 2;
  const offsetY = -h / 2;

  // Get corner values (default to 0 if not provided)
  const corners = {
    topLeft: cornerSelection?.topLeft || 0,
    topRight: cornerSelection?.topRight || 0,
    bottomLeft: cornerSelection?.bottomLeft || 0,
    bottomRight: cornerSelection?.bottomRight || 0,
  };

  const cornerLens = {
    topLeft: (cornerLengths?.topLeft || 10) / 100, // Convert cm to meters
    topRight: (cornerLengths?.topRight || 10) / 100,
    bottomLeft: (cornerLengths?.bottomLeft || 10) / 100,
    bottomRight: (cornerLengths?.bottomRight || 10) / 100,
  };

  switch (shapeId) {
    case "rectangle": {
      // Create rectangle with individual corner customization
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        // Sharp corner
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        // Rounded corner
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        // Cut corner
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        // Rounded corner
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        // Cut corner
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        // Rounded corner
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        // Cut corner
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        // Rounded corner
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        // Cut corner
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        // Rounded corner
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        // Cut corner
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "cut-corner-top-right": {
      // All 4 corners customizable, but maintain shape characteristic
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "cut-corner-bottom-right": {
      // All 4 corners customizable
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "cut-corners-right": {
      // All 4 corners customizable
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "trapezoid-right": {
      // All 4 corners customizable
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "trapezoid-left": {
      // All 4 corners customizable
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "rounded-corner-bottom-right": {
      // All 4 corners customizable
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "rounded-corner-top-right": {
      // All 4 corners customizable
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }

    case "rounded-right-side": {
      // All 4 corners customizable
      const tl = cornerLens.topLeft;
      const tr = cornerLens.topRight;
      const bl = cornerLens.bottomLeft;
      const br = cornerLens.bottomRight;

      // Start from bottom-left corner
      if (corners.bottomLeft === 0) {
        shape.moveTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 2) {
        shape.moveTo(bl + offsetX, 0 + offsetY);
      }

      // Bottom edge to bottom-right
      if (corners.bottomRight === 0) {
        shape.lineTo(w + offsetX, 0 + offsetY);
      } else if (corners.bottomRight === 1) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          0 + offsetY,
          w + offsetX,
          br + offsetY
        );
      } else if (corners.bottomRight === 2) {
        shape.lineTo(w - br + offsetX, 0 + offsetY);
        shape.lineTo(w + offsetX, br + offsetY);
      }

      // Right edge to top-right
      if (corners.topRight === 0) {
        shape.lineTo(w + offsetX, h + offsetY);
      } else if (corners.topRight === 1) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.quadraticCurveTo(
          w + offsetX,
          h + offsetY,
          w - tr + offsetX,
          h + offsetY
        );
      } else if (corners.topRight === 2) {
        shape.lineTo(w + offsetX, h - tr + offsetY);
        shape.lineTo(w - tr + offsetX, h + offsetY);
      }

      // Top edge to top-left
      if (corners.topLeft === 0) {
        shape.lineTo(0 + offsetX, h + offsetY);
      } else if (corners.topLeft === 1) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          h + offsetY,
          0 + offsetX,
          h - tl + offsetY
        );
      } else if (corners.topLeft === 2) {
        shape.lineTo(tl + offsetX, h + offsetY);
        shape.lineTo(0 + offsetX, h - tl + offsetY);
      }

      // Left edge back to start
      if (corners.bottomLeft === 0) {
        shape.lineTo(0 + offsetX, 0 + offsetY);
      } else if (corners.bottomLeft === 1) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.quadraticCurveTo(
          0 + offsetX,
          0 + offsetY,
          bl + offsetX,
          0 + offsetY
        );
      } else if (corners.bottomLeft === 2) {
        shape.lineTo(0 + offsetX, bl + offsetY);
        shape.lineTo(bl + offsetX, 0 + offsetY);
      }
      break;
    }
  }

  // Close the shape
  shape.closePath();

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

// woodModel
interface WoodModelProps {
  showMeasurements?: boolean;
}

const WoodModel: React.FC<WoodModelProps> = ({ showMeasurements = false }) => {
  const { config } = useConfig();

  // Load texture - sử dụng selectedWood từ config mới
  const textureUrl = config.selectedWood?.finish?.image;
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  // Create geometry with corner customization
  const geometry = useMemo(() => {
    return createShapeGeometry(
      config.shapeId || "rectangle",
      config.width || 50,
      config.height || 30,
      config.depth || 2,
      config.cornerSelection,
      config.cornerLength
    );
  }, [
    config.shapeId,
    config.width,
    config.height,
    config.depth,
    config.cornerSelection,
    config.cornerLength,
  ]);

  // Setup texture
  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(
        (config.width || 50) / 100,
        (config.height || 30) / 100
      );
    }
  }, [texture, config.width, config.height]);

  // Material with explicit front/back face handling
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.6,
      metalness: 0.1,
      color: new THREE.Color(0.5, 0.5, 0.5),
    });
  }, [texture]);

  const measurementLines = useMemo(() => {
    return (
      <MeasurementLines
        width={config.width * 0.01}
        height={config.height * 0.01}
        widthCm={config.width}
        heightCm={config.height}
        show={showMeasurements}
      />
    );
  }, [showMeasurements, config, config.width, config.height, config.depth]);

  return (
    <group>
      {/* Main wood piece */}
      <mesh geometry={geometry} material={material} castShadow receiveShadow />

      {/* Edge banding if enabled */}
      {!config.edgeBanding && (
        <lineSegments>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color="#8B4513" linewidth={2} />
        </lineSegments>
      )}

      {/* Measurement lines */}
      {measurementLines}
    </group>
  );
};

export default WoodModel;
