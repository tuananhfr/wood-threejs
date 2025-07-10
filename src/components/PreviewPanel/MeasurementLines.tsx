import React from "react";
import LineWithLabel from "./LineWithLabel";

interface MeasurementLinesProps {
  width: number;
  height: number;
  widthCm: number;
  heightCm: number;
  show?: boolean;
}

const MeasurementLines: React.FC<MeasurementLinesProps> = ({
  width,
  height,
  widthCm,
  heightCm,
  show = true,
}) => {
  if (!show) return null;

  const offset = 0.15; // Distance from the object

  return (
    <group>
      {/* Width measurement (bottom) */}
      <LineWithLabel
        start={[-width / 2, -height / 2 - offset, 0]}
        end={[width / 2, -height / 2 - offset, 0]}
        label={`${widthCm}cm`}
        color="#ffffff"
        backgroundColor="#000000"
        lineColor="#ffffff"
      />

      {/* Height measurement (left) */}
      <LineWithLabel
        start={[-width / 2 - 2 * offset, -height / 2, 0]}
        end={[-width / 2 - 2 * offset, height / 2, 0]}
        label={`${heightCm}cm`}
        color="#ffffff"
        backgroundColor="#000000"
        lineColor="#ffffff"
      />
    </group>
  );
};

export default MeasurementLines;
