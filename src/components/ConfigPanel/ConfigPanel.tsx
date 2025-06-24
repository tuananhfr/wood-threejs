import React, { useState, useEffect } from "react";
import { useConfig } from "../context/ConfigContext";
import OptionButtons from "./section/OptionButtons";
import TextureSelector from "./section/TextureSelector";

const ConfigPanel: React.FC = () => {
  const { config, updateConfig, batchUpdate } = useConfig();
  const [scaleValue, setScaleValue] = useState(1);

  // Calculate valid scale options based on current dimensions
  const getValidScaleOptions = () => {
    const currentDims = [config.top, config.right, config.bottom, config.left];
    const maxDim = Math.max(...currentDims);
    const minDim = Math.min(...currentDims);

    // Calculate max scale (to keep largest dimension ≤ 500)
    const maxScale = Math.floor((500 / maxDim) * 10) / 10;

    // Calculate min scale (to keep smallest dimension ≥ 10)
    const minScale = Math.ceil((10 / minDim) * 10) / 10;

    const options = [];

    // Add scale options from minScale to maxScale
    for (let scale = minScale; scale <= maxScale; scale += 0.1) {
      const roundedScale = Math.round(scale * 10) / 10;
      if (roundedScale >= 0.1 && roundedScale <= 10) {
        options.push(roundedScale);
      }
    }

    // Ensure 1.0 is always included if valid
    if (!options.includes(1) && 1 >= minScale && 1 <= maxScale) {
      options.push(1);
    }

    return options.sort((a, b) => a - b);
  };

  const validScales = getValidScaleOptions();

  // Reset scale to 1 when config changes (from drag)
  useEffect(() => {
    setScaleValue(1);
  }, [config.top, config.right, config.bottom, config.left]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-0">Configurateur de Panneau</h2>
      </div>

      {/* Instructions */}
      <div className="alert alert-info mb-4">
        <div className="d-flex">
          <i className="bi bi-info-circle me-2"></i>
          <div>
            <strong>Instructions :</strong> Faites glisser les points rouges
            dans la vue 3D pour modifier la forme du panneau.
          </div>
        </div>
      </div>

      {/* Scale Factor */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-arrows-fullscreen me-2"></i>
            Redimensionner
          </h5>
        </div>
        <div className="card-body">
          <label className="form-label">Choisir une taille :</label>
          <select
            value={scaleValue}
            className="form-select mb-3"
            onChange={(e) => {
              const scale = parseFloat(e.target.value);
              const newConfig = {
                ...config,
                top: Math.round(config.top * scale),
                right: Math.round(config.right * scale),
                bottom: Math.round(config.bottom * scale),
                left: Math.round(config.left * scale),
                price: Math.round(config.price * scale),
                area: config.area * scale,
              };

              batchUpdate(newConfig);
              setScaleValue(1);
            }}
          >
            {validScales.map((scale) => {
              const previewTop = Math.round(config.top * scale);
              const previewRight = Math.round(config.right * scale);
              const previewBottom = Math.round(config.bottom * scale);
              const previewLeft = Math.round(config.left * scale);

              return (
                <option key={scale} value={scale}>
                  {scale === 1
                    ? `Actuel: ${previewTop}×${previewRight}×${previewBottom}×${previewLeft} cm`
                    : `×${scale.toFixed(
                        1
                      )}: ${previewTop}×${previewRight}×${previewBottom}×${previewLeft} cm`}
                </option>
              );
            })}
          </select>
          <small className="text-muted">
            Limites : 10cm ≤ dimensions ≤ 500cm
          </small>
        </div>
      </div>

      {/* Current Dimensions */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-rulers me-2"></i>
            Dimensions actuelles
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-6 mb-2">
              <div className="d-flex justify-content-between">
                <span>Haut :</span>
                <strong>{config.top} cm</strong>
              </div>
            </div>
            <div className="col-6 mb-2">
              <div className="d-flex justify-content-between">
                <span>Bas :</span>
                <strong>{config.bottom} cm</strong>
              </div>
            </div>
            <div className="col-6 mb-2">
              <div className="d-flex justify-content-between">
                <span>Gauche :</span>
                <strong>{config.left} cm</strong>
              </div>
            </div>
            <div className="col-6 mb-2">
              <div className="d-flex justify-content-between">
                <span>Droite :</span>
                <strong>{config.right} cm</strong>
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <span>
              <i className="bi bi-bounding-box me-1"></i>Surface totale :
            </span>
            <strong className="text-primary">
              {config.area?.toFixed(4) || 0} m²
            </strong>
          </div>
        </div>
      </div>

      {/* Edge Banding */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-border-all me-2"></i>
            Placage de chant
          </h5>
        </div>
        <div className="card-body">
          <OptionButtons
            options={["Oui", "Non"]}
            activeOption={config.edgeBanding ? "Oui" : "Non"}
            onChange={(value: string) =>
              updateConfig("edgeBanding", value === "Oui")
            }
            showInfo={true}
            infoText="Le placage de chant est une bande appliquée sur les bords des panneaux pour améliorer l'apparence, renforcer la durabilité et éviter les infiltrations d'humidité."
          />
        </div>
      </div>

      {/* Texture Selection */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-palette me-2"></i>
            Texture & Matériau
          </h5>
        </div>
        <div className="card-body">
          <TextureSelector />
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
