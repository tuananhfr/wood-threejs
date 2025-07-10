import React, { useState } from "react";

interface ShapeConfig {
  id: string;
  name?: string;
  icon: React.ReactNode;
}

interface ShapeSelectorProps {
  list: ShapeConfig[];
  selectedShape?: string; // Optional for internal state mode
  onShapeChange?: (shapeId: string) => void; // ← Made optional
  hasSubOptions?: boolean;
  getSubOptions?: (mainShapeId: string) => ShapeConfig[]; // Dynamic sub-options
  onMainShapeUpdate?: (
    mainShapeId: string,
    selectedSubShape: ShapeConfig
  ) => void; // Update main list
  defaultSelected?: string; // Default selection for internal state
}

const ShapeSelector = ({
  list,
  selectedShape,
  onShapeChange,
  hasSubOptions = false,
  getSubOptions,

  defaultSelected,
}: ShapeSelectorProps) => {
  // Internal state cho simple selector (no hasSubOptions)
  const [internalSelected, setInternalSelected] = useState<string>(
    defaultSelected || list[0]?.id || ""
  );

  // Determine which selectedShape to use
  const currentSelected = hasSubOptions ? selectedShape : internalSelected;

  const handleShapeClick = (shape: ShapeConfig) => {
    if (hasSubOptions && getSubOptions) {
      // Get sub-options cho shape này
    } else {
      // Simple mode - update internal state và call onChange nếu có
      setInternalSelected(shape.id);
      if (onShapeChange) {
        onShapeChange(shape.id);
      }
    }
  };

  return (
    <div>
      <div className="row row-cols-2 g-3 mb-3">
        {list.map((shape: ShapeConfig) => {
          return (
            <div className="col" key={shape.id}>
              <button
                className={`btn ${
                  currentSelected === shape.id
                    ? "btn-primary"
                    : "btn-outline-primary"
                } rounded p-2 text-center w-100 h-100 d-flex flex-column justify-content-center align-items-center position-relative`}
                onClick={() => handleShapeClick(shape)}
              >
                <div className="mb-2">{shape.icon}</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShapeSelector;
