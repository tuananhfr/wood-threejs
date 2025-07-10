// utils/areaCalculator.ts
interface CornerSelection {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

interface CornerLengths {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

interface AreaCalculationParams {
  width: number;
  height: number;
  shapeId: string;
  cornerSelection: CornerSelection;
  cornerLengths: CornerLengths;
}

// Helper function để tính diện tích của góc cắt/bo tròn
const calculateCornerArea = (
  cornerType: number,
  cornerLength: number
): number => {
  switch (cornerType) {
    case 0: // Sharp corner - không mất diện tích
      return 0;
    case 1: // Rounded corner - mất diện tích = r² - (πr²/4)
      return cornerLength * cornerLength * (1 - Math.PI / 4);
    case 2: // Cut corner - mất diện tích = r²/2 (tam giác vuông)
      return (cornerLength * cornerLength) / 2;
    default:
      return 0;
  }
};

// Helper để tính diện tích hình thang
const calculateTrapezoidArea = (
  width: number,
  height: number,
  cutLength: number,
  isLeftSide: boolean = false
): number => {
  if (isLeftSide) {
    // Trapezoid left: đáy trên nhỏ hơn, đáy dưới lớn hơn
    const topBase = width - cutLength;
    const bottomBase = width;
    return ((topBase + bottomBase) * height) / 2;
  } else {
    // Trapezoid right: đáy trên lớn hơn, đáy dưới nhỏ hơn
    const topBase = width;
    const bottomBase = width - cutLength;
    return ((topBase + bottomBase) * height) / 2;
  }
};

export const calculateArea = ({
  width,
  height,
  shapeId,
  cornerSelection,
  cornerLengths,
}: AreaCalculationParams): number => {
  // Convert từ cm² sang m²
  const baseArea = (width * height) / 10000;

  switch (shapeId) {
    case "rectangle": {
      // Rectangle với các góc tùy chỉnh
      let totalLostArea = 0;

      // Tính diện tích mất ở mỗi góc
      totalLostArea += calculateCornerArea(
        cornerSelection.topLeft,
        cornerLengths.topLeft
      );
      totalLostArea += calculateCornerArea(
        cornerSelection.topRight,
        cornerLengths.topRight
      );
      totalLostArea += calculateCornerArea(
        cornerSelection.bottomLeft,
        cornerLengths.bottomLeft
      );
      totalLostArea += calculateCornerArea(
        cornerSelection.bottomRight,
        cornerLengths.bottomRight
      );

      return baseArea - totalLostArea / 10000;
    }

    case "cut-corner-top-right":
    case "cut-corner-bottom-right":
    case "cut-corners-right":
    case "rounded-corner-top-right":
    case "rounded-corner-bottom-right":
    case "rounded-right-side": {
      // Các shape này về cơ bản là rectangle với corners tùy chỉnh
      let totalLostArea = 0;

      totalLostArea += calculateCornerArea(
        cornerSelection.topLeft,
        cornerLengths.topLeft
      );
      totalLostArea += calculateCornerArea(
        cornerSelection.topRight,
        cornerLengths.topRight
      );
      totalLostArea += calculateCornerArea(
        cornerSelection.bottomLeft,
        cornerLengths.bottomLeft
      );
      totalLostArea += calculateCornerArea(
        cornerSelection.bottomRight,
        cornerLengths.bottomRight
      );

      return baseArea - totalLostArea / 10000;
    }

    case "trapezoid-right": {
      // Hình thang nghiêng bên phải
      let trapezoidArea;

      if (cornerSelection.topRight === 2) {
        // Nếu góc topRight là cut corner, tính theo hình thang
        trapezoidArea = calculateTrapezoidArea(
          width,
          height,
          cornerLengths.topRight,
          false
        );
      } else {
        // Nếu không, tính như rectangle rồi trừ góc
        trapezoidArea =
          baseArea * 10000 -
          calculateCornerArea(cornerSelection.topRight, cornerLengths.topRight);
      }

      // Trừ diện tích các góc khác
      trapezoidArea -= calculateCornerArea(
        cornerSelection.topLeft,
        cornerLengths.topLeft
      );
      trapezoidArea -= calculateCornerArea(
        cornerSelection.bottomLeft,
        cornerLengths.bottomLeft
      );
      trapezoidArea -= calculateCornerArea(
        cornerSelection.bottomRight,
        cornerLengths.bottomRight
      );

      return trapezoidArea / 10000;
    }

    case "trapezoid-left": {
      // Hình thang nghiêng bên trái
      let trapezoidArea;

      if (cornerSelection.topLeft === 2) {
        // Nếu góc topLeft là cut corner, tính theo hình thang
        trapezoidArea = calculateTrapezoidArea(
          width,
          height,
          cornerLengths.topLeft,
          true
        );
      } else {
        // Nếu không, tính như rectangle rồi trừ góc
        trapezoidArea =
          baseArea * 10000 -
          calculateCornerArea(cornerSelection.topLeft, cornerLengths.topLeft);
      }

      // Trừ diện tích các góc khác
      trapezoidArea -= calculateCornerArea(
        cornerSelection.topRight,
        cornerLengths.topRight
      );
      trapezoidArea -= calculateCornerArea(
        cornerSelection.bottomLeft,
        cornerLengths.bottomLeft
      );
      trapezoidArea -= calculateCornerArea(
        cornerSelection.bottomRight,
        cornerLengths.bottomRight
      );

      return trapezoidArea / 10000;
    }

    default: {
      // Fallback cho các shape không xác định
      let defaultArea = baseArea * 10000;

      defaultArea -= calculateCornerArea(
        cornerSelection.topLeft,
        cornerLengths.topLeft
      );
      defaultArea -= calculateCornerArea(
        cornerSelection.topRight,
        cornerLengths.topRight
      );
      defaultArea -= calculateCornerArea(
        cornerSelection.bottomLeft,
        cornerLengths.bottomLeft
      );
      defaultArea -= calculateCornerArea(
        cornerSelection.bottomRight,
        cornerLengths.bottomRight
      );

      return defaultArea / 10000;
    }
  }
};

// Hook để tự động tính diện tích dựa trên config thực tế
export const useAreaCalculation = (
  config: ConfigState,
  updateConfig: <K extends keyof ConfigState>(
    key: K,
    value: ConfigState[K]
  ) => void
) => {
  const area = calculateArea({
    width: config.width || 50,
    height: config.height || 30,
    shapeId: config.shapeId || "rectangle",
    cornerSelection: config.cornerSelection || {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    },
    cornerLengths: config.cornerLength || {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    },
  });

  // Auto update area trong config nếu khác
  if (Math.abs(config.area - area) > 0.000001) {
    updateConfig("area", Number(area.toFixed(6)));
  }

  return area;
};

// Utility để format diện tích
export const formatArea = (area: number): string => {
  if (area < 0.001) {
    return `${(area * 1000000).toFixed(0)} mm²`;
  } else if (area < 1) {
    return `${(area * 10000).toFixed(2)} cm²`;
  } else {
    return `${area.toFixed(4)} m²`;
  }
};
