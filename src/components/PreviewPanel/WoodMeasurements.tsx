import LineWithLabel from "./LineWithLabelProps";

interface WoodMeasurementsProps {
  points: Array<{ x: number; y: number; z: number }>;
  thickness: number;
  config: ConfigState;
  orderPoints: (
    pts: Array<{ x: number; y: number; z: number }>
  ) => Array<{ x: number; y: number; z: number }>;
}

const WoodMeasurements: React.FC<WoodMeasurementsProps> = ({
  points,
  thickness,
  config,
  orderPoints,
}) => {
  const renderMeasurements = () => {
    const measurements: React.ReactNode[] = [];
    const orderedPoints = orderPoints(points);
    const edgeNames = ["Haut", "Droite", "Bas", "Gauche"];
    const edgeValues = [config.top, config.right, config.bottom, config.left];

    orderedPoints.forEach((point, index) => {
      const nextIndex = (index + 1) % points.length;
      const nextPoint = orderedPoints[nextIndex];

      // Use direct config values instead of calculating
      const lengthCm = edgeValues[index];
      const edgeName = edgeNames[index];

      measurements.push(
        <LineWithLabel
          key={`measurement-${index}`}
          start={[point.x, point.y, point.z + thickness / 2 + 0.01]}
          end={[nextPoint.x, nextPoint.y, nextPoint.z + thickness / 2 + 0.01]}
          label={`${edgeName}: ${lengthCm} cm`}
          color="#ffff00"
          backgroundColor="#000000"
        />
      );
    });

    return measurements;
  };

  return <group>{renderMeasurements()}</group>;
};

export default WoodMeasurements;
