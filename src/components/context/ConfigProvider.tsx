// src/context/ConfigProvider.tsx
import { useState, type ReactNode } from "react";
import { ConfigContext } from "./ConfigContext";
import Oak from "../../assets/images/samples-oak-wood-effect-800x800.jpg";
import Wenge from "../../assets/images/samples-wenge-wood-effect-800x800.jpg";

interface ConfigProviderProps {
  children: ReactNode;
}

const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [config, setConfig] = useState<ConfigState>({
    top: 50,
    left: 50,
    bottom: 50,
    right: 50,
    depth: 2,
    area: 0.025,
    directionTop: "Défaut",
    directionLeft: "Défaut",
    directionBottom: "Défaut",
    directionRight: "Défaut",
    edgeBanding: false,
    texture: { name: "Oak", src: Oak },
    listTextures: [
      { name: "Oak", src: Oak },
      { name: "Wenge", src: Wenge },
    ],
    price: 25,
    originalPrice: 30,
  });

  const updateConfig = <K extends keyof ConfigState>(
    key: K,
    value: ConfigState[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const batchUpdate = (updates: Partial<ConfigState>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, batchUpdate }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
