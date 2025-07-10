import React from "react";

interface DropdownOption {
  id: string;
  name: string;
  image?: string;
  color?: string;
}

interface ReusableDropdownProps {
  id: string;
  options: DropdownOption[];
  selectedOption: DropdownOption;
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  showIcon?: boolean;
  iconType?: "color" | "image" | "none";
  className?: string;
}

const ReusableDropdown: React.FC<ReusableDropdownProps> = ({
  id,
  options,
  selectedOption,
  onSelect,
  placeholder = "Chọn một tùy chọn",
  showIcon = true,
  iconType = "color",
  className = "",
}) => {
  const renderIcon = (option: DropdownOption) => {
    if (!showIcon) return null;

    if (iconType === "image" && option.image) {
      return (
        <img
          src={option.image}
          alt={option.name}
          className="me-3 border rounded-2"
          style={{
            width: "24px",
            height: "24px",
            objectFit: "cover",
          }}
        />
      );
    }

    if (iconType === "color" && option.color) {
      return (
        <div
          className="me-3 border rounded-2"
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: option.color,
          }}
        ></div>
      );
    }

    // Default fallback
    return null;
  };

  return (
    <div className={`mb-3 ${className}`}>
      <div className="dropdown">
        <button
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between py-3"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          id={`${id}Dropdown`}
        >
          <div className="d-flex align-items-center">
            {renderIcon(selectedOption)}
            <span className="text-start">
              {selectedOption?.name || placeholder}
            </span>
          </div>
          <i className="bi bi-chevron-down ms-2"></i>
        </button>
        <ul
          className="dropdown-menu w-100 shadow-sm"
          aria-labelledby={`${id}Dropdown`}
        >
          {options.map((option) => (
            <li key={option.id}>
              <button
                className="dropdown-item d-flex align-items-center py-2"
                onClick={() => onSelect(option)}
              >
                {renderIcon(option)}
                <span>{option.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReusableDropdown;
