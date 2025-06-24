import React, { useState } from "react";
import { useConfig } from "../../context/ConfigContext";

const TextureSelector: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [hoveredTexture, setHoveredTexture] = useState<{
    name: string;
    src: string;
    x: number;
    y: number;
  } | null>(null);

  // Hàm xử lý mouse enter để hiển thị tooltip
  const handleMouseEnter = (
    event: React.MouseEvent,
    texture: { name: string; src: string }
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredTexture({
      name: texture.name,
      src: texture.src,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  // Hàm xử lý mouse leave để ẩn tooltip
  const handleMouseLeave = () => {
    setHoveredTexture(null);
  };

  // Xác định danh sách texture, texture hiện tại, và hàm cập nhật dựa theo loại
  const getTextureConfig = () => {
    return {
      list: config.listTextures,
      current: config.texture,
      updateFn: (textureName: string, textureSrc: string) => {
        // Cập nhật texture mặc định
        updateConfig("texture", {
          name: textureName,
          src: textureSrc,
        });
      },
    };
  };

  const { list, current, updateFn } = getTextureConfig();

  // Chuyển đổi giá trị current thành đối tượng hoặc chuỗi tùy theo từng trường hợp
  const getCurrentTextureSrc = () => {
    if (typeof current === "string") {
      return current;
    } else if (current && typeof current === "object" && current.src) {
      return current.src;
    }
    return "";
  };

  const currentTextureSrc = getCurrentTextureSrc();

  // Kiểm tra trạng thái cho backboard panels

  // Hàm để kiểm tra xem texture có đang được sử dụng không
  const isTextureActiveForSelected = (textureSrc: string) => {
    return currentTextureSrc === textureSrc;
  };

  return (
    <div className="mt-3">
      Texture
      <div className="d-flex flex-wrap">
        {list!.length > 0 &&
          list!.map((texture, index) => {
            const isActive = isTextureActiveForSelected(texture.src);

            return (
              <div key={index} className="position-relative">
                <button
                  onClick={() => updateFn(texture.name, texture.src)}
                  onMouseEnter={(e) => handleMouseEnter(e, texture)}
                  onMouseLeave={handleMouseLeave}
                  className={`btn p-0 m-1 border rounded-2 position-relative ${
                    isActive
                      ? "border-primary border-3"
                      : "border-secondary border-1"
                  }`}
                  style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    boxShadow: isActive
                      ? "0 0 8px rgba(0,123,255,0.3)"
                      : "none",
                  }}
                >
                  <img
                    src={texture.src}
                    alt={texture.name}
                    className="rounded-1"
                    style={{
                      width: 32,
                      height: 32,
                      objectFit: "cover",
                      opacity: isActive ? 1 : 0.8,
                    }}
                  />
                </button>
              </div>
            );
          })}
      </div>
      {hoveredTexture && (
        <div
          className="position-fixed bg-dark text-white p-2 rounded shadow-lg"
          style={{
            left: hoveredTexture.x - 150,
            top: hoveredTexture.y - 250,
            zIndex: 9999,
            pointerEvents: "none",
            minWidth: "300px",
          }}
        >
          <div className="text-center">
            <img
              src={hoveredTexture.src}
              alt={hoveredTexture.name}
              className="rounded mb-2"
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
              }}
            />
            <div className="small fw-bold">{hoveredTexture.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextureSelector;
