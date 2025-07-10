import React from "react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  showInfo?: boolean;
  infoText?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hideSpinner?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  label,
  className = "",
  min,
  max,
  suffix,
  hideSpinner = true,
}) => {
  const [inputValue, setInputValue] = React.useState<string>(
    value?.toString() || ""
  );
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync internal state với prop value
  React.useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  // Disable wheel event - always disabled
  React.useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent wheel khi input được focus
      if (document.activeElement === input) {
        e.preventDefault();
      }
    };

    // Add event listener
    input.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup
    return () => {
      input.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;

    // Always update internal state (user có thể type anything)
    setInputValue(newInputValue);

    // Clear error when user starts typing
    setErrorMessage("");

    // Allow empty input
    if (newInputValue === "") {
      return;
    }

    const newValue = parseFloat(newInputValue);

    // Check if it's a valid number
    if (isNaN(newValue)) {
      setErrorMessage("Veuillez entrer un numéro valide");
      return;
    }

    // Check constraints
    if (min !== undefined && newValue < min) {
      setErrorMessage(
        `La valeur ne peut pas être inférieure à ${min}${suffix || ""}`
      );
      return;
    }

    if (max !== undefined && newValue > max) {
      setErrorMessage(
        `La valeur ne peut pas être supérieure à ${max}${suffix || ""}`
      );
      return;
    }

    // Chỉ update parent khi valid
    onChange(newValue);
  };

  // Prevent wheel change on focus
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur(); // Remove focus to prevent wheel change
  };

  return (
    <div>
      {label && (
        <div className="d-flex align-items-center mb-2">
          <label className="form-label mb-0 me-2">{label}</label>
        </div>
      )}

      <div className="position-relative">
        <input
          ref={inputRef}
          type="number"
          className={`form-control ${className} ${
            hideSpinner ? "no-spinner" : ""
          } `}
          value={inputValue}
          onChange={handleChange}
          onWheel={handleWheel} // React event handler approach
          style={{
            paddingRight: suffix ? "40px" : "12px",
            ...(hideSpinner
              ? {
                  WebkitAppearance: "textfield",
                  MozAppearance: "textfield",
                }
              : {}),
          }}
        />

        {suffix && (
          <span
            className="position-absolute text-muted small"
            style={{
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {suffix}
          </span>
        )}

        {hideSpinner && (
          <style>{`
            .no-spinner::-webkit-outer-spin-button,
            .no-spinner::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }

            .no-spinner[type="number"] {
              -moz-appearance: textfield;
            }
          `}</style>
        )}
      </div>

      {errorMessage && (
        <div className="text-danger small mt-1">
          <i className="bi bi-exclamation-triangle me-1"></i>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default NumberInput;
