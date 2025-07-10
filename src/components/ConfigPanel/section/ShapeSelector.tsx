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
  onMainShapeUpdate,
  defaultSelected,
}: ShapeSelectorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSubShape, setSelectedSubShape] = useState<string>("");
  const [currentSubOptions, setCurrentSubOptions] = useState<ShapeConfig[]>([]);
  const [selectedMainShape, setSelectedMainShape] = useState<string>("");

  // Internal state cho simple selector (no hasSubOptions)
  const [internalSelected, setInternalSelected] = useState<string>(
    defaultSelected || list[0]?.id || ""
  );

  // Determine which selectedShape to use
  const currentSelected = hasSubOptions ? selectedShape : internalSelected;

  const handleShapeClick = (shape: ShapeConfig) => {
    if (hasSubOptions && getSubOptions) {
      // Get sub-options cho shape này
      const subOptions = getSubOptions(shape.id);
      setCurrentSubOptions(subOptions);
      setSelectedMainShape(shape.id);
      setSelectedSubShape("");
      setShowModal(true);
    } else {
      // Simple mode - update internal state và call onChange nếu có
      setInternalSelected(shape.id);
      if (onShapeChange) {
        onShapeChange(shape.id);
      }
    }
  };

  const handleSubShapeSelect = (subShapeId: string) => {
    setSelectedSubShape(subShapeId);
  };

  const handleModalConfirm = () => {
    if (selectedSubShape) {
      // Update main shape icon với selected sub-shape
      if (onMainShapeUpdate && selectedMainShape) {
        const selectedSubShapeConfig = currentSubOptions.find(
          (s) => s.id === selectedSubShape
        );
        if (selectedSubShapeConfig) {
          onMainShapeUpdate(selectedMainShape, selectedSubShapeConfig);
        }
      }

      // Call onShapeChange nếu có
      if (onShapeChange) {
        onShapeChange(selectedSubShape);
      }
      setShowModal(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedSubShape("");
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

      {/* Modal for sub-options */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chọn kiểu{" "}
                  {list.find((s) => s.id === selectedMainShape)?.name ||
                    "corner"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalCancel}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row row-cols-3 g-3">
                  {currentSubOptions.map((subShape) => (
                    <div className="col" key={subShape.id}>
                      <button
                        className={`btn ${
                          selectedSubShape === subShape.id
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        } rounded p-2 text-center w-100 h-100 d-flex flex-column justify-content-center align-items-center`}
                        onClick={() => handleSubShapeSelect(subShape.id)}
                      >
                        <div className="mb-1">{subShape.icon}</div>
                        <small>{subShape.name}</small>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalCancel}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalConfirm}
                  disabled={!selectedSubShape}
                >
                  Chọn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShapeSelector;
