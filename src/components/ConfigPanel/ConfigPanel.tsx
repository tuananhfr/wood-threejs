import { useConfig } from "../context/ConfigContext";
//import DimensionControl from "./section/DimensionControl";
import OptionButtons from "./section/OptionButtons";
import TextureSelector from "./section/TextureSelector";

const ConfigPanel: React.FC = () => {
  const { config, updateConfig, batchUpdate } = useConfig();

  return (
    <div className="accordion" id="configAccordion">
      {/* Top Dimension Section */}
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingTop">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTop"
            aria-expanded="true"
            aria-controls="collapseTop"
          >
            Haut
          </button>
        </h2>
        <div
          id="collapseTop"
          className="accordion-collapse collapse show"
          aria-labelledby="headingTop"
          data-bs-parent="#configAccordion"
        >
          <div className="accordion-body">
            <div>
              <label className="dimension-label mb-1">Direction Haut</label>

              <OptionButtons
                options={["Défaut", "Droite", "Gauche"]}
                activeOption={config.directionTop}
                onChange={(value: string) =>
                  batchUpdate({ directionTop: value, directionBottom: value })
                }
                showInfo={true}
                infoText="Le placage de chant est une bande appliquée sur les bords des panneaux pour améliorer l'apparence, renforcer la durabilité et éviter les infiltrations d'humidité."
              />
            </div>
            <div>Top: {config.top}</div>
            <div>Bottom: {config.bottom}</div>
            <div>Left: {config.left}</div>
            <div>Right: {config.right}</div>

            {/* <DimensionControl
              label="Haut"
              value={config.top}
              min={10}
              max={100}
              step={1}
              onChange={(value: number) => updateConfig("top", value)}
            /> */}
          </div>
        </div>
      </div>

      {/* Bottom Dimension Section */}
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingBottom">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseBottom"
            aria-expanded="false"
            aria-controls="collapseBottom"
          >
            Bas
          </button>
        </h2>
        <div
          id="collapseBottom"
          className="accordion-collapse collapse"
          aria-labelledby="headingBottom"
          data-bs-parent="#configAccordion"
        >
          <div className="accordion-body">
            <div>
              <label className="dimension-label mb-1">Direction Bas</label>

              <OptionButtons
                options={["Défaut", "Droite", "Gauche"]}
                activeOption={config.directionBottom}
                onChange={(value: string) =>
                  batchUpdate({ directionTop: value, directionBottom: value })
                }
                showInfo={true}
                infoText="Le placage de chant est une bande appliquée sur les bords des panneaux pour améliorer l'apparence, renforcer la durabilité et éviter les infiltrations d'humidité."
              />
            </div>
            <div>{config.bottom}</div>
            {/* <DimensionControl
              label="Bas"
              value={config.bottom}
              min={10}
              max={100}
              step={1}
              onChange={(value: number) => updateConfig("bottom", value)}
            /> */}
          </div>
        </div>
      </div>

      {/* Left Dimension Section */}
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingLeft">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseLeft"
            aria-expanded="false"
            aria-controls="collapseLeft"
          >
            Gauche
          </button>
        </h2>
        <div
          id="collapseLeft"
          className="accordion-collapse collapse"
          aria-labelledby="headingLeft"
          data-bs-parent="#configAccordion"
        >
          <div className="accordion-body">
            <div>
              <label className="dimension-label mb-1">Direction Gauche</label>

              <OptionButtons
                options={["Défaut", "Haut", "Bas"]}
                activeOption={config.directionLeft}
                onChange={(value: string) =>
                  batchUpdate({ directionLeft: value, directionRight: value })
                }
                showInfo={true}
                infoText="Le placage de chant est une bande appliquée sur les bords des panneaux pour améliorer l'apparence, renforcer la durabilité et éviter les infiltrations d'humidité."
              />
            </div>
            <div>{config.left}</div>
            {/* <DimensionControl
              label="Gauche"
              value={config.left}
              min={10}
              max={100}
              step={1}
              onChange={(value: number) => updateConfig("left", value)}
            /> */}
          </div>
        </div>
      </div>

      {/* Right Dimension Section */}
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingRight">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseRight"
            aria-expanded="false"
            aria-controls="collapseRight"
          >
            Droite
          </button>
        </h2>
        <div
          id="collapseRight"
          className="accordion-collapse collapse"
          aria-labelledby="headingRight"
          data-bs-parent="#configAccordion"
        >
          <div className="accordion-body">
            <div>
              <label className="dimension-label mb-1">Direction Gauche</label>

              <OptionButtons
                options={["Défaut", "Haut", "Bas"]}
                activeOption={config.directionRight}
                onChange={(value: string) =>
                  batchUpdate({ directionLeft: value, directionRight: value })
                }
                showInfo={true}
                infoText="Le placage de chant est une bande appliquée sur les bords des panneaux pour améliorer l'apparence, renforcer la durabilité et éviter les infiltrations d'humidité."
              />
            </div>
            <div>{config.right}</div>
            {/* <DimensionControl
              label="Droite"
              value={config.right}
              min={10}
              max={100}
              step={1}
              onChange={(value: number) => updateConfig("right", value)}
            /> */}
          </div>
        </div>
      </div>

      {/* Edge Banding Section */}
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingEdgeBanding">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseEdgeBanding"
            aria-expanded="false"
            aria-controls="collapseEdgeBanding"
          >
            Placage de chant
          </button>
        </h2>
        <div
          id="collapseEdgeBanding"
          className="accordion-collapse collapse"
          aria-labelledby="headingEdgeBanding"
          data-bs-parent="#configAccordion"
        >
          <div className="accordion-body">
            <div>
              <label className="dimension-label mb-1">Placage de chant</label>
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

      {/* Texture Section */}
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingTexture">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTexture"
            aria-expanded="false"
            aria-controls="collapseTexture"
          >
            Texture
          </button>
        </h2>
        <div
          id="collapseTexture"
          className="accordion-collapse collapse"
          aria-labelledby="headingTexture"
          data-bs-parent="#configAccordion"
        >
          <div className="accordion-body">
            <TextureSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
