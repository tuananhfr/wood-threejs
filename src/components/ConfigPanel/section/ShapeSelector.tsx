import { useState } from "react";
import { renderShapeIcon } from "../../icons/shapeIcons";

interface ShapeSelectorProps {
  list: ShapeConfig[];
  selectedShape?: string;
  onShapeChange?: (shapeId: string) => void;
  hasSubOptions?: boolean;
  getSubOptions?: (mainShapeId: string) => ShapeConfig[];
  onMainShapeUpdate?: (
    mainShapeId: string,
    selectedSubShape: ShapeConfig
  ) => void;
  defaultSelected?: string;
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
                <div className="mb-2">{renderShapeIcon(shape.id)}</div>
                {shape.name && (
                  <small className="text-center">{shape.name}</small>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShapeSelector;
