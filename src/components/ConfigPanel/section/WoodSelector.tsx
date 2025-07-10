import React, { useState } from "react";
import { useConfig } from "../../context/ConfigContext";

const WoodSelector: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [hoveredWoodType, setHoveredWoodType] = useState<{
    name: string;
    image: string;
    x: number;
    y: number;
  } | null>(null);

  // Get current selected wood from config
  const selectedWood = {
    woodType: config.selectedWood.woodType,
    finish: config.selectedWood.finish,
    thickness: config.selectedWood.thickness,
  };

  const handleWoodTypeSelect = (woodType: WoodType) => {
    const newSelection = {
      woodType,
      finish: woodType.finishes[0], // Chọn finish đầu tiên
      thickness: woodType.thicknesses[0], // Chọn thickness đầu tiên
    };

    // Update config context
    updateConfig("selectedWood", newSelection);
  };

  // Hàm xử lý mouse enter để hiển thị tooltip
  const handleMouseEnter = (
    event: React.MouseEvent,
    woodType: { name: string; image: string }
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredWoodType({
      name: woodType.name,
      image: woodType.image,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  // Hàm xử lý mouse leave để ẩn tooltip
  const handleMouseLeave = () => {
    setHoveredWoodType(null);
  };

  // Kiểm tra wood type có đang được chọn không
  const isWoodTypeActive = (woodTypeId: string) => {
    return selectedWood.woodType.id === woodTypeId;
  };

  return (
    <div className="wood-selector">
      <div className="mt-3">
        <div className="d-flex flex-wrap">
          {config.woodTypes.length > 0 &&
            config.woodTypes.map((woodType, index) => {
              const isActive = isWoodTypeActive(woodType.id);

              return (
                <div key={index} className="position-relative">
                  <button
                    onClick={() => handleWoodTypeSelect(woodType)}
                    onMouseEnter={(e) => handleMouseEnter(e, woodType)}
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
                      src={woodType.image}
                      alt={woodType.name}
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
      </div>

      {/* Hover Tooltip */}
      {hoveredWoodType && (
        <div
          className="position-fixed bg-dark text-white p-2 rounded shadow-lg"
          style={{
            left: hoveredWoodType.x - 150,
            top: hoveredWoodType.y - 250,
            zIndex: 9999,
            pointerEvents: "none",
            minWidth: "300px",
          }}
        >
          <div className="text-center">
            <img
              src={hoveredWoodType.image}
              alt={hoveredWoodType.name}
              className="rounded mb-2"
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
              }}
            />
            <div className="small fw-bold">{hoveredWoodType.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WoodSelector;
