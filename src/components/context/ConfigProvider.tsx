// src/context/ConfigProvider.tsx
import { useState, type ReactNode, useEffect } from "react";
import { ConfigContext } from "./ConfigContext";

// Wood Type
import MDF from "src/assets/images/woodTypes/mdf.jpg";
import MDFTeinte from "src/assets/images/woodTypes/mdfteinte.jpg";
import Contreplaque from "src/assets/images/woodTypes/contreplaque.jpg";

import MDFBrut from "src/assets/images/woodFinish/MDF/mdf-brut.jpg";
import MDFNoir from "src/assets/images/woodFinish/MDF/mdf-noir.jpg";
import MDFChene from "src/assets/images/woodFinish/MDF/mdf-chene.jpg";

import MDFTeinteGris from "src/assets/images/woodFinish/mdf-teinte/mdf-gris.jpeg";
import MDFTeinteOrange from "src/assets/images/woodFinish/mdf-teinte/mdf-orange.jpeg";
import MDFTeinteRouge from "src/assets/images/woodFinish/mdf-teinte/mdf-rouge-grande.png";

import ContreplaquéPruplier from "src/assets/images/woodFinish/Contreplaqué/cp-peuplier.jpg";
import ContreplaquéBouleau from "src/assets/images/woodFinish/Contreplaqué/cp-bouleau.jpg";
import { calculateArea } from "../../utils/areaCalculator";

interface ConfigProviderProps {
  children: ReactNode;
}

const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const shapes = [
    {
      id: "rectangle",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="2"
            width="36"
            height="26"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "cut-corner-top-right",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L30 2 L38 10 L38 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "cut-corner-bottom-right",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L38 2 L38 20 L30 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "cut-corners-right",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L30 2 L38 10 L38 20 L30 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "trapezoid-right",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L30 2 L38 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "trapezoid-left",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2 L38 2 L38 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "rounded-corner-top-right",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L28 2 Q38 2 38 12 L38 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "rounded-corner-bottom-right",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L38 2 L38 18 Q38 28 28 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "rounded-right-side",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L28 2 Q38 2 38 15 Q38 28 28 28 L2 28 Z"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  const listCornerTopLeft = [
    {
      id: "corner-top-left-1",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 28 L2 2 L38 2"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-top-left-2",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 28 Q2 2 28 2"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-top-left-3",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 28 L38 2"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  const listCornerTopRight = [
    {
      id: "corner-top-right-1",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L38 2 L38 28"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-top-right-2",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M38 28 Q38 2 12 2"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-top-right-3",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M38 28 L2 2"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  const listCornerBottomRight = [
    {
      id: "corner-bottom-right-1",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M38 2 L38 28 L2 28"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-bottom-right-2",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M38 2 Q38 28 12 28"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-bottom-right-3",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M38 2 L2 28"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  const listCornerBottomLeft = [
    {
      id: "corner-bottom-left-1",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M38 28 L2 28 L2 2"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-bottom-left-2",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 Q2 28 28 28"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "corner-bottom-left-3",
      icon: (
        <svg
          width="40"
          height="30"
          viewBox="0 0 40 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L38 28"
            fill="none"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  // Default corner selections cho từng shape
  const defaultCornerSelections: Record<string, CornerSelection> = {
    rectangle: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
    "cut-corner-top-right": {
      topLeft: 0,
      topRight: 2,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "cut-corner-bottom-right": {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 2,
    },
    "cut-corners-right": {
      topLeft: 0,
      topRight: 2,
      bottomLeft: 0,
      bottomRight: 2,
    },
    "trapezoid-right": {
      topLeft: 0,
      topRight: 2,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "trapezoid-left": {
      topLeft: 2,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "rounded-corner-top-right": {
      topLeft: 0,
      topRight: 1,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "rounded-corner-bottom-right": {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 1,
    },
    "rounded-right-side": {
      topLeft: 0,
      topRight: 1,
      bottomLeft: 0,
      bottomRight: 1,
    },
  };

  // Default corner lengths cho từng shape
  const defaultCornerLengthsTemplate: Record<string, CornerLengths> = {
    rectangle: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
    "cut-corner-top-right": {
      topLeft: 0,
      topRight: 8,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "cut-corner-bottom-right": {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 8,
    },
    "cut-corners-right": {
      topLeft: 0,
      topRight: 5,
      bottomLeft: 0,
      bottomRight: 5,
    },
    "trapezoid-right": {
      topLeft: 0,
      topRight: 30,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "trapezoid-left": {
      topLeft: 30,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "rounded-corner-top-right": {
      topLeft: 0,
      topRight: 30,
      bottomLeft: 0,
      bottomRight: 0,
    },
    "rounded-corner-bottom-right": {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 30,
    },
    "rounded-right-side": {
      topLeft: 0,
      topRight: 15,
      bottomLeft: 0,
      bottomRight: 15,
    },
  };

  const woodTypes: WoodType[] = [
    {
      id: "mdf",
      name: "MDF",
      image: MDF,
      finishes: [
        {
          id: "brut",
          name: "Brut",
          image: MDFBrut,
        },
        {
          id: "noir_brut",
          name: "Noir Brut",
          image: MDFNoir,
        },
        {
          id: "Plaquage_chêne",
          name: "Plaquage Chêne",
          image: MDFChene,
        },
      ],
      thicknesses: [
        { id: "Standard", name: "Standard" },
        { id: "Milieu Humide", name: "Milieu Humide" },
      ],
    },
    {
      id: "MDF Teinte",
      name: "MDF Teinte",
      image: MDFTeinte,
      finishes: [
        {
          id: "MDF Gris Brut",
          name: "MDF Gris Brut",
          image: MDFTeinteGris,
        },
        {
          id: "MDF Orange Brut",
          name: "MDF Orange Brut",
          image: MDFTeinteOrange,
        },
        {
          id: "MDF Rouge Brut",
          name: "MDF Rouge Brut",
          image: MDFTeinteRouge,
        },
      ],
      thicknesses: [{ id: "Standard", name: "Standard" }],
    },
    {
      id: "Contreplaqué",
      name: "Contreplaqué",
      image: Contreplaque,
      finishes: [
        {
          id: "Peuplier ",
          name: "Peuplier ",
          image: ContreplaquéPruplier,
        },
        {
          id: "Bouleau - Fil Verticale ",
          name: "Bouleau - Fil Verticale ",
          image: ContreplaquéBouleau,
        },
      ],
      thicknesses: [{ id: "Standard", name: "Standard" }],
    },
  ];

  const [config, setConfig] = useState<ConfigState>({
    depth: 1.9,
    width: 60,
    height: 30,
    area: 0.025,

    selectedWood: {
      woodType: woodTypes[0],
      finish: woodTypes[0].finishes[0],
      thickness: woodTypes[0].thicknesses[0],
    },

    woodTypes: woodTypes,

    shapeId: "rectangle",
    shapes: shapes,
    listCorner: [],
    cornerSelection: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
    cornerSelections: defaultCornerSelections,

    cornerLength: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
    cornerLengths: defaultCornerLengthsTemplate,
    cornerLengthsDefault: defaultCornerLengthsTemplate,

    listCornerTopLeft: listCornerTopLeft,
    listCornerTopRight: listCornerTopRight,
    listCornerBottomRight: listCornerBottomRight,
    listCornerBottomLeft: listCornerBottomLeft,
    edgeBanding: false,

    price: 25,
    originalPrice: 30,
    showMeasurements: true,
  });

  // useEffect để tự động update listCorner và cornerSelection khi shapeId hoặc cornerSelections thay đổi
  useEffect(() => {
    const currentCornerSelection = config.cornerSelections[config.shapeId] || {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    };

    // Safe computation với fallback
    const computedListCorner = [
      listCornerTopLeft[currentCornerSelection.topLeft] || listCornerTopLeft[0],
      listCornerTopRight[currentCornerSelection.topRight] ||
        listCornerTopRight[0],
      listCornerBottomLeft[currentCornerSelection.bottomLeft] ||
        listCornerBottomLeft[0],
      listCornerBottomRight[currentCornerSelection.bottomRight] ||
        listCornerBottomRight[0],
    ].filter(Boolean); // Loại bỏ undefined values

    // Chỉ update khi thực sự khác biệt
    const needsUpdate =
      config.listCorner.length !== computedListCorner.length ||
      config.listCorner.some(
        (corner, index) => corner?.id !== computedListCorner[index]?.id
      );

    if (needsUpdate) {
      setConfig((prev) => ({
        ...prev,
        listCorner: computedListCorner,
        cornerSelection: currentCornerSelection,
      }));
    }
  }, [
    config.shapeId,
    // Chỉ listen specific corner values thay vì toàn bộ object
    config.cornerSelections[config.shapeId]?.topLeft,
    config.cornerSelections[config.shapeId]?.topRight,
    config.cornerSelections[config.shapeId]?.bottomLeft,
    config.cornerSelections[config.shapeId]?.bottomRight,
  ]);

  // Caculer area
  useEffect(() => {
    const newArea = calculateArea({
      width: config.width,
      height: config.height,
      shapeId: config.shapeId,
      cornerSelection: config.cornerSelection,
      cornerLengths: config.cornerLength,
    });

    // Chỉ update nếu diện tích thay đổi đáng kể (tránh infinite loop)
    if (Math.abs(config.area - newArea) > 0.000001) {
      setConfig((prev) => ({
        ...prev,
        area: Number(newArea.toFixed(6)),
        price: Number((newArea * 45).toFixed(2)),
        originalPrice: Number((newArea * 45 * 1.2).toFixed(2)),
      }));
    }
  }, [
    config.width,
    config.height,
    config.shapeId,
    config.cornerSelection?.topLeft,
    config.cornerSelection?.topRight,
    config.cornerSelection?.bottomLeft,
    config.cornerSelection?.bottomRight,
    config.cornerLength?.topLeft,
    config.cornerLength?.topRight,
    config.cornerLength?.bottomLeft,
    config.cornerLength?.bottomRight,
  ]);

  const updateConfig = <K extends keyof ConfigState>(
    key: K,
    value: ConfigState[K]
  ) => {
    if (key === "shapeId") {
      // Type assertion để TypeScript hiểu value là string
      const newShapeId = value as string;
      const newCornerLength = config.cornerLengthsDefault[newShapeId];
      const newCornerSelection = defaultCornerSelections[newShapeId];

      setConfig((prev) => ({
        ...prev,
        shapeId: newShapeId,
        cornerLength: newCornerLength,
        cornerSelection: newCornerSelection,
        cornerSelections: {
          ...prev.cornerSelections,
          [newShapeId]: newCornerSelection,
        },
        cornerLengths: {
          ...prev.cornerLengths,
          [newShapeId]: newCornerLength,
        },
      }));
    } else {
      setConfig((prev) => ({ ...prev, [key]: value }));
    }
  };

  const batchUpdate = (updates: Partial<ConfigState>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        batchUpdate,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
