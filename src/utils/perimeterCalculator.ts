interface PerimeterParams {
  width: number;
  height: number;
  shapeId: string;
  cornerSelection: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
  cornerLengths: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
}

export const calculatePerimeter = ({
  width,
  height,
  shapeId,

  cornerLengths,
}: PerimeterParams): number => {
  // Tất cả thông số đầu vào đã là cm, không cần chuyển đổi
  // Kết quả trả về cũng là cm
  let perimeter = 0;

  switch (shapeId) {
    case "rectangle":
      perimeter = 2 * (width + height);
      break;

    case "cut-corner-top-right": { // Chu vi = 2*width + 2*height - cạnh bị cắt + cạnh chéo
      const cutLengthTR = cornerLengths.topRight || 0;
      const diagonalTR = Math.sqrt(2) * cutLengthTR;
      perimeter = 2 * (width + height) - 2 * cutLengthTR + diagonalTR;
      break;
    }

    case "cut-corner-bottom-right": {
      const cutLengthBR = cornerLengths.bottomRight || 0;
      const diagonalBR = Math.sqrt(2) * cutLengthBR;
      perimeter = 2 * (width + height) - 2 * cutLengthBR + diagonalBR;
      break;
    }

    case "cut-corners-right": {
      const cutLengthTR2 = cornerLengths.topRight || 0;
      const cutLengthBR2 = cornerLengths.bottomRight || 0;
      const diagonalTR2 = Math.sqrt(2) * cutLengthTR2;
      const diagonalBR2 = Math.sqrt(2) * cutLengthBR2;
      perimeter =
        2 * (width + height) -
        2 * (cutLengthTR2 + cutLengthBR2) +
        diagonalTR2 +
        diagonalBR2;
      break;
    }

    case "trapezoid-right": { // Hình thang, cạnh phải nghiêng
      const slopeLengthR = cornerLengths.topRight || 0;
      const hypotenuse = Math.sqrt(
        height * height + slopeLengthR * slopeLengthR
      );
      perimeter = width + (width - slopeLengthR) + height + hypotenuse;
      break;
    }

    case "trapezoid-left": { // Hình thang, cạnh trái nghiêng
      const slopeLengthL = cornerLengths.topLeft || 0;
      const hypotenuseL = Math.sqrt(
        height * height + slopeLengthL * slopeLengthL
      );
      perimeter = width + (width - slopeLengthL) + height + hypotenuseL;
      break;
    }

    case "rounded-corner-top-right": { // Góc bo tròn = chu vi hình chữ nhật - cạnh bị bỏ + cung tròn
      const radiusTR = cornerLengths.topRight || 0;
      const arcLengthTR = (Math.PI / 2) * radiusTR; // 1/4 chu vi hình tròn
      perimeter = 2 * (width + height) - 2 * radiusTR + arcLengthTR;
      break;
    }

    case "rounded-corner-bottom-right": {
      const radiusBR = cornerLengths.bottomRight || 0;
      const arcLengthBR = (Math.PI / 2) * radiusBR;
      perimeter = 2 * (width + height) - 2 * radiusBR + arcLengthBR;
      break;
    }

    case "rounded-right-side": { // Cả hai góc phải đều bo tròn
      const radiusTR3 = cornerLengths.topRight || 0;
      const radiusBR3 = cornerLengths.bottomRight || 0;
      const arcLengthTR3 = (Math.PI / 2) * radiusTR3;
      const arcLengthBR3 = (Math.PI / 2) * radiusBR3;
      perimeter =
        2 * (width + height) -
        2 * (radiusTR3 + radiusBR3) +
        arcLengthTR3 +
        arcLengthBR3;
      break;
    }

    default:
      // Mặc định là hình chữ nhật
      perimeter = 2 * (width + height);
      break;
  }

  return Math.max(0, perimeter / 100); // Đảm bảo chu vi không âm, kết quả là cm
};
