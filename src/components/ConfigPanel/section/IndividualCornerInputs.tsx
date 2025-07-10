// Individual Corner Inputs Layout with Modal - Enhanced with Height Constraints
import React, { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import NumberInput from "./NumberInput";

const IndividualCornerInputs: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [selectedCornerIndex, setSelectedCornerIndex] = useState<number | null>(
    null
  );

  const getCornerSubOptions = (cornerIndex: number): ShapeConfig[] => {
    switch (cornerIndex) {
      case 0:
        return config.listCornerTopLeft;
      case 1:
        return config.listCornerTopRight;
      case 2:
        return config.listCornerBottomLeft;
      case 3:
        return config.listCornerBottomRight;
      default:
        return [];
    }
  };

  const getCornerPosition = (
    cornerIndex: number
  ): keyof CornerSelection | null => {
    switch (cornerIndex) {
      case 0:
        return "topLeft";
      case 1:
        return "topRight";
      case 2:
        return "bottomLeft";
      case 3:
        return "bottomRight";
      default:
        return null;
    }
  };

  // Validate if corner can be changed from square to another type
  const validateCornerTypeChange = (
    cornerIndex: number,
    newStyleIndex: number
  ): { canChange: boolean; reason?: string } => {
    const cornerPosition = getCornerPosition(cornerIndex);
    if (!cornerPosition) return { canChange: false };

    const currentSelection = config.cornerSelections[config.shapeId];
    const currentLengths = config.cornerLengths[config.shapeId] || {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    };

    const previousStyleIndex = currentSelection?.[cornerPosition] || 0;
    const isChangingFromSquare =
      previousStyleIndex === 0 && newStyleIndex !== 0;

    // If not changing from square, allow the change
    if (!isChangingFromSquare) {
      return { canChange: true };
    }

    // Get partner corner on the same side
    let partnerPosition: keyof CornerLengths;
    let partnerCornerIndex: number;

    if (cornerIndex === 0) {
      // topLeft
      partnerPosition = "bottomLeft";
      partnerCornerIndex = 2;
    } else if (cornerIndex === 1) {
      // topRight
      partnerPosition = "bottomRight";
      partnerCornerIndex = 3;
    } else if (cornerIndex === 2) {
      // bottomLeft
      partnerPosition = "topLeft";
      partnerCornerIndex = 0;
    } else {
      // bottomRight
      partnerPosition = "topRight";
      partnerCornerIndex = 1;
    }

    const partnerLength = currentLengths[partnerPosition] || 0;
    const partnerSelection = currentSelection?.[partnerPosition] || 0;
    const isPartnerSquare = partnerSelection === 0;

    // If partner corner is at max height (config.height), can't change
    if (partnerLength >= config.height) {
      return {
        canChange: false,
        reason: `Impossible de changer car le coin ${
          partnerCornerIndex === 0
            ? "supérieur gauche"
            : partnerCornerIndex === 1
            ? "supérieur droit"
            : partnerCornerIndex === 2
            ? "inférieur gauche"
            : "inférieur droit"
        } a atteint la hauteur maximale`,
      };
    }

    // If partner is not square and its length > (config.height - 5), can't change
    if (!isPartnerSquare && partnerLength > config.height - 5) {
      return {
        canChange: false,
        reason: `Impossible de changer car le coin ${
          partnerCornerIndex === 0
            ? "supérieur gauche"
            : partnerCornerIndex === 1
            ? "supérieur droit"
            : partnerCornerIndex === 2
            ? "inférieur gauche"
            : "inférieur droit"
        } a atteint la hauteur maximale`,
      };
    }

    return { canChange: true };
  };

  const handleMainShapeUpdate = (
    cornerIndex: number,
    selectedSubShape: ShapeConfig
  ) => {
    const cornerPosition = getCornerPosition(cornerIndex);
    if (!cornerPosition) return;

    const subOptions = getCornerSubOptions(cornerIndex);
    const styleIndex = subOptions.findIndex(
      (option) => option.id === selectedSubShape.id
    );

    if (styleIndex !== -1) {
      // Validate if this change is allowed
      const validation = validateCornerTypeChange(cornerIndex, styleIndex);
      if (!validation.canChange) {
        // Show error message or prevent change
        console.warn(validation.reason);
        alert(validation.reason); // You can replace this with a better UI notification
        return;
      }
      // Get current selections and lengths
      const currentSelection = config.cornerSelections[config.shapeId];
      const currentLengths = config.cornerLengths[config.shapeId] || {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0,
      };

      // Check if changing from square corner (index 0) to another corner type
      const previousStyleIndex = currentSelection?.[cornerPosition] || 0;
      const isChangingFromSquare = previousStyleIndex === 0 && styleIndex !== 0;
      const currentLength = currentLengths[cornerPosition] || 0;

      // Update corner selection for current shape
      const newCornerSelections = {
        ...config.cornerSelections,
        [config.shapeId]: {
          ...config.cornerSelections[config.shapeId],
          [cornerPosition]: styleIndex,
        },
      };

      // If changing from square corner to another type AND current length is 0, set to 5
      if (isChangingFromSquare && currentLength === 0) {
        const newCornerLength = {
          ...currentLengths,
          [cornerPosition]: 5,
        };

        // Use batch update to update both selections and lengths
        updateConfig("cornerSelections", newCornerSelections);
        updateConfig("cornerLength", newCornerLength);
      } else {
        // Only update selections
        const newCornerLength = {
          ...currentLengths,
          [cornerPosition]: 0,
        };
        updateConfig("cornerSelections", newCornerSelections);
        updateConfig("cornerLength", newCornerLength);
      }
    }
  };

  const cornerNeedsLength = (cornerIndex: number): boolean => {
    const cornerPosition = getCornerPosition(cornerIndex);
    if (!cornerPosition) return false;

    // Get current corner selection for this shape
    const currentSelection = config.cornerSelections[config.shapeId];
    if (!currentSelection) return false;

    const styleIndex = currentSelection[cornerPosition] || 0;
    return styleIndex === 1 || styleIndex === 2;
  };

  // Calculate maximum allowed value for a corner
  const getMaxCornerLength = (cornerIndex: number): number => {
    // Individual corner cannot exceed config.height
    const maxIndividual = config.height;

    // Get current corner lengths for this shape
    const currentLengths = config.cornerLengths[config.shapeId] || {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    };

    // Calculate partner corner position and current value
    let partnerPosition: keyof CornerLengths;

    if (cornerIndex === 0) {
      // topLeft
      partnerPosition = "bottomLeft";
    } else if (cornerIndex === 1) {
      // topRight
      partnerPosition = "bottomRight";
    } else if (cornerIndex === 2) {
      // bottomLeft
      partnerPosition = "topLeft";
    } else {
      // bottomRight
      partnerPosition = "topRight";
    }

    // Get partner corner current value
    const partnerCurrentValue = currentLengths[partnerPosition] || 0;

    // Maximum allowed considering partner corner
    const maxWithPartner = Math.max(0, config.height - partnerCurrentValue);

    // Return the smaller of the constraints, also respect the original max of 5
    return Math.min(maxIndividual, maxWithPartner);
  };

  // Validate if a corner length change is allowed
  const validateCornerLength = (
    cornerIndex: number,
    newValue: number
  ): boolean => {
    const cornerPosition = getCornerPosition(cornerIndex);
    if (!cornerPosition) return false;

    // Check if new value exceeds config.height
    if (newValue > config.height) return false;

    // Get current corner lengths for this shape
    const currentLengths = config.cornerLengths[config.shapeId] || {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    };

    // Check if sum with partner corner exceeds config.height
    let partnerPosition: keyof CornerLengths;

    if (cornerIndex === 0 || cornerIndex === 2) {
      // left side
      partnerPosition = cornerIndex === 0 ? "bottomLeft" : "topLeft";
    } else {
      // right side
      partnerPosition = cornerIndex === 1 ? "bottomRight" : "topRight";
    }

    const partnerCurrentValue = currentLengths[partnerPosition] || 0;
    const totalSideLength = newValue + partnerCurrentValue;

    return totalSideLength <= config.height;
  };

  const handleCornerLengthChange = (cornerIndex: number, value: number) => {
    const cornerPosition = getCornerPosition(cornerIndex);
    if (!cornerPosition) return;

    // Validate the change
    if (!validateCornerLength(cornerIndex, value)) {
      // Optionally show an error message or just prevent the change
      console.warn(`Corner length ${value} exceeds height constraint`);
      return;
    }

    // Get current corner lengths for this shape
    const currentLengths = config.cornerLengths[config.shapeId] || {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    };

    // Update corner lengths for current shape
    const newCornerLengths = {
      ...config.cornerLengths,
      [config.shapeId]: {
        ...currentLengths,
        [cornerPosition]: value,
      },
    };

    const newCornerLength = {
      ...currentLengths,
      [cornerPosition]: value,
    };

    updateConfig("cornerLengths", newCornerLengths);
    updateConfig("cornerLength", newCornerLength);
  };

  const getCornerLength = (cornerIndex: number): number => {
    const cornerPosition = getCornerPosition(cornerIndex);
    if (!cornerPosition) return 0;

    // Get corner lengths for current shape
    const currentLengths = config.cornerLength;
    if (!currentLengths) return 0;

    return currentLengths[cornerPosition] || 0;
  };

  const handleCornerClick = (cornerIndex: number) => {
    setSelectedCornerIndex(cornerIndex);
  };

  // Handle corner selection directly
  const handleCornerSelection = (selectedShape: ShapeConfig) => {
    if (selectedCornerIndex !== null) {
      handleMainShapeUpdate(selectedCornerIndex, selectedShape);
      setSelectedCornerIndex(null); // Close modal after selection
    }
  };

  // Get current corner icon for display
  const getCurrentCornerIcon = (cornerIndex: number): React.ReactNode => {
    const cornerPosition = getCornerPosition(cornerIndex);
    if (!cornerPosition) return null;

    const currentSelection = config.cornerSelections[config.shapeId];
    if (!currentSelection) return config.listCorner[cornerIndex]?.icon;

    const styleIndex = currentSelection[cornerPosition] || 0;
    const subOptions = getCornerSubOptions(cornerIndex);

    return subOptions[styleIndex]?.icon || config.listCorner[cornerIndex]?.icon;
  };

  return (
    <div className="individual-corner-inputs">
      <div className="text-secondary mb-3">
        Sélectionnez les coins et ajustez les dimensions individuellement.
        <br />
      </div>

      {/* 2x2 Grid Layout */}
      <div className="row g-3">
        {/* Row 1 */}
        <div className="col-6">
          {/* Top Left Corner */}
          <div className="corner-container">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center mb-2"
              onClick={() => handleCornerClick(0)}
              style={{ minHeight: "80px" }}
            >
              <div className="text-center">{getCurrentCornerIcon(0)}</div>
            </button>

            {/* Individual Input for Top Left */}
            {cornerNeedsLength(0) && (
              <div className="corner-input">
                <NumberInput
                  value={getCornerLength(0)}
                  onChange={(value) => handleCornerLengthChange(0, value)}
                  min={5}
                  max={getMaxCornerLength(0)}
                  suffix="cm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-6">
          {/* Top Right Corner */}
          <div className="corner-container">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center mb-2"
              onClick={() => handleCornerClick(1)}
              style={{ minHeight: "80px" }}
            >
              <div className="text-center">{getCurrentCornerIcon(1)}</div>
            </button>

            {/* Individual Input for Top Right */}
            {cornerNeedsLength(1) && (
              <div className="corner-input">
                <NumberInput
                  value={getCornerLength(1)}
                  onChange={(value) => handleCornerLengthChange(1, value)}
                  min={5}
                  max={getMaxCornerLength(1)}
                  suffix="cm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="col-6">
          {/* Bottom Left Corner */}
          <div className="corner-container">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center mb-2"
              onClick={() => handleCornerClick(2)}
              style={{ minHeight: "80px" }}
            >
              <div className="text-center">{getCurrentCornerIcon(2)}</div>
            </button>

            {/* Individual Input for Bottom Left */}
            {cornerNeedsLength(2) && (
              <div className="corner-input">
                <NumberInput
                  value={getCornerLength(2)}
                  onChange={(value) => handleCornerLengthChange(2, value)}
                  min={5}
                  max={getMaxCornerLength(2)}
                  suffix="cm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-6">
          {/* Bottom Right Corner */}
          <div className="corner-container">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center mb-2"
              onClick={() => handleCornerClick(3)}
              style={{ minHeight: "80px" }}
            >
              <div className="text-center">{getCurrentCornerIcon(3)}</div>
            </button>

            {/* Individual Input for Bottom Right */}
            {cornerNeedsLength(3) && (
              <div className="corner-input">
                <NumberInput
                  value={getCornerLength(3)}
                  onChange={(value) => handleCornerLengthChange(3, value)}
                  min={5}
                  max={getMaxCornerLength(3)}
                  suffix="cm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Corner Selection - Direct List Display */}
      {selectedCornerIndex !== null && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chọn kiểu corner</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedCornerIndex(null)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Direct corner options display */}
                <div className="row row-cols-3 g-3">
                  {getCornerSubOptions(selectedCornerIndex).map((shape) => (
                    <div className="col" key={shape.id}>
                      <button
                        className="btn btn-outline-secondary rounded p-2 text-center w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                        onClick={() => handleCornerSelection(shape)}
                      >
                        <div className="mb-1">{shape.icon}</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualCornerInputs;
