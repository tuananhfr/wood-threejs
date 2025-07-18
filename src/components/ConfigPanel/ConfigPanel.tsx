import React from "react";
import { useConfig } from "../context/ConfigContext";
import { renderShapeIcon } from "../icons/shapeIcons";
import OptionButtons from "./section/OptionButtons";
import ShapeSelector from "./section/ShapeSelector";
import NumberInput from "./section/NumberInput";
import WoodSelector from "./section/WoodSelector";
import ReusableDropdown from "./section/ReusableDropdown";
import IndividualCornerInputs from "./section/IndividualCornerInputs";

const ConfigPanel: React.FC = () => {
  const { config, updateConfig } = useConfig();

  const selectedWood = {
    woodType: config.selectedWood.woodType,
    finish: config.selectedWood.finish,
    thickness: config.selectedWood.thickness,
  };

  const handleFinishSelect = (finish: WoodFinish) => {
    const newSelection = {
      ...selectedWood,
      finish,
    };
    updateConfig("selectedWood", newSelection);
  };

  const handleThicknessSelect = (thickness: WoodThickness) => {
    const newSelection = {
      ...selectedWood,
      thickness,
    };
    updateConfig("selectedWood", newSelection);
  };

  const getMinHeight = () => {
    const corners = config.cornerLength;
    const cornerSelection = config.cornerSelection;

    // Chỉ tính corner nếu type !== 0 (không phải góc vuông)
    const leftSide = Math.max(
      cornerSelection.topLeft !== 0 ? corners.topLeft : 0,
      cornerSelection.bottomLeft !== 0 ? corners.bottomLeft : 0
    );

    const rightSide = Math.max(
      cornerSelection.topRight !== 0 ? corners.topRight : 0,
      cornerSelection.bottomRight !== 0 ? corners.bottomRight : 0
    );

    return Math.max(10, leftSide, rightSide);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-0">Configurateur de Panneau</h2>
      </div>

      {/* Bootstrap Accordion */}
      <div className="accordion" id="configAccordion">
        {/* Wood Selector Selection */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseWood"
              aria-expanded="true"
              aria-controls="collapseWood"
            >
              <img
                src={config.selectedWood?.woodType?.image}
                alt={config.selectedWood?.woodType?.name}
                className="rounded me-2 border border-secondary"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
              1. {config.selectedWood?.woodType?.name}
            </button>
          </h2>
          <div
            id="collapseWood"
            className="accordion-collapse collapse show"
            data-bs-parent="#configAccordion"
          >
            <div className="accordion-body">
              <div className="text-secondary mb-3">
                Sélectionnez le type de bois pour votre panneau.
              </div>
              <WoodSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Finish & Thickness Dropdowns */}
      <div className="mt-3">
        <ReusableDropdown
          id="finish"
          options={selectedWood.woodType.finishes.map((finish) => ({
            id: finish.id,
            name: finish.name,
            image: finish.image,
          }))}
          selectedOption={{
            id: selectedWood.finish.id,
            name: selectedWood.finish.name,
            image: selectedWood.finish.image,
          }}
          onSelect={(option) => {
            const finish = selectedWood.woodType.finishes.find(
              (f) => f.id === option.id
            );
            if (finish) handleFinishSelect(finish);
          }}
          iconType="image"
          showIcon={true}
        />

        <ReusableDropdown
          id="thickness"
          options={selectedWood.woodType.thicknesses.map((thickness) => ({
            id: thickness.id,
            name: thickness.name,
          }))}
          selectedOption={{
            id: selectedWood.thickness.id,
            name: selectedWood.thickness.name,
          }}
          onSelect={(option) => {
            const thickness = selectedWood.woodType.thicknesses.find(
              (t) => t.id === option.id
            );
            if (thickness) handleThicknessSelect(thickness);
          }}
          iconType="none"
        />
      </div>

      {/* Continue with other accordion items */}
      <div className="accordion mt-3" id="configAccordionContinue">
        {/* Shape Selection */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseShape"
              aria-expanded="false"
              aria-controls="collapseShape"
            >
              <span className="me-2">{renderShapeIcon(config.shapeId)}</span>
              2. Sélection de forme
            </button>
          </h2>
          <div
            id="collapseShape"
            className="accordion-collapse collapse"
            data-bs-parent="#configAccordionContinue"
          >
            <div className="accordion-body">
              <div className="text-secondary mb-3">
                Sélectionnez le type de forme pour votre bois.
              </div>
              <ShapeSelector
                list={config.shapes}
                onShapeChange={(value) => updateConfig("shapeId", value)}
                defaultSelected="rectangle"
              />
            </div>
          </div>
        </div>

        {/* Corner Selection */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseDimensions"
              aria-expanded="false"
              aria-controls="collapseDimensions"
            >
              3. Coin
            </button>
          </h2>
          <div
            id="collapseDimensions"
            className="accordion-collapse collapse"
            data-bs-parent="#configAccordionContinue"
          >
            <div className="accordion-body">
              <IndividualCornerInputs />
            </div>
          </div>
        </div>

        {/* Redimensionner Section */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseScale"
              aria-expanded="false"
              aria-controls="collapseScale"
            >
              4. Redimensionner
            </button>
          </h2>
          <div
            id="collapseScale"
            className="accordion-collapse collapse"
            data-bs-parent="#configAccordionContinue"
          >
            <div className="accordion-body">
              <div className="mt-3">
                <NumberInput
                  label="Longueur"
                  value={config.width}
                  onChange={(value) => updateConfig("width", value)}
                  min={getMinHeight()}
                  max={500}
                  suffix="cm"
                />
                <small className="text-muted">
                  Limites : 10cm ≤ dimensions ≤ 500cm
                </small>
              </div>

              <div className="mt-3">
                <NumberInput
                  label="Largeur"
                  value={config.height}
                  onChange={(value) => updateConfig("height", value)}
                  min={getMinHeight()}
                  max={500}
                  suffix="cm"
                />
                <small className="text-muted">
                  Limites : 10cm ≤ dimensions ≤ 500cm
                </small>
              </div>
              <div className="mt-3">
                <label className="form-label">Epaisseur</label>
                <select className="form-select">
                  <option value="option1">{config.depth}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* edgeBanding Section */}

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEdgeBanding"
              aria-expanded="false"
              aria-controls="collapseEdgeBanding"
            >
              5. Placage de chant
            </button>
          </h2>
          <div
            id="collapseEdgeBanding"
            className="accordion-collapse collapse"
            data-bs-parent="#configAccordionContinue"
          >
            <div className="accordion-body">
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
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
