import * as THREE from "three";
declare global {
  // Định nghĩa kiểu cho context
  interface ConfigContextType {
    config: ConfigState;
    updateConfig: <K extends keyof ConfigState>(
      key: K,
      value: ConfigState[K]
    ) => void;
    batchUpdate: (updates: Partial<ConfigState>) => void; // Thêm kiểu cho batchUpdate
  }

  interface ConfigState {
    width: number;
    height: number;
    depth: number;
    area: number;
    perimeter: number;

    selectedWood: SelectedWood;

    woodTypes: WoodType[];

    shapeId: string;

    shapes: ShapeConfig[];

    listCorner: ShapeConfig[];

    cornerSelection: CornerSelection;

    cornerSelections: {
      [shapeId: string]: CornerSelection;
    };

    cornerLength: CornerLengths;

    cornerLengths: {
      [shapeId: string]: CornerLengths;
    };

    cornerLengthsDefault: {
      [shapeId: string]: CornerLengths;
    };

    listCornerTopLeft: ShapeConfig[];

    listCornerTopRight: ShapeConfig[];

    listCornerBottomLeft: ShapeConfig[];

    listCornerBottomRight: ShapeConfig[];

    edgeBanding: boolean;

    price: number;
    originalPrice: number;

    showMeasurements: boolean;
  }

  interface WoodType {
    id: string;
    name: string;
    image: string;
    finishes: WoodFinish[];
    thicknesses: WoodThickness[];
  }

  interface WoodFinish {
    id: string;
    name: string;
    image: string;
  }

  interface WoodThickness {
    id: string;
    name: string;
  }

  interface SelectedWood {
    woodType: WoodType;
    finish: WoodFinish;
    thickness: WoodThickness;
  }

  interface ShapeConfig {
    id: string;
    icon: React.ReactNode;
  }

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

  interface DimensionControlProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
  }

  interface CameraControllerProps {
    zoomInTriggered: boolean;
    zoomOutTriggered: boolean;
    resetZoomTriggers: () => void;
  }

  interface OrbitControls {
    enabled: boolean;
    update: () => void;
    target: THREE.Vector3;
    enableDamping?: boolean;
    dampingFactor?: number;
  }

  interface SceneConfig {
    [key: string]: string | number | boolean | null | undefined;
  }

  interface Window {
    __THREE_SCENE__?: THREE.Scene | null;
    __THREE_CAMERA__?: THREE.Camera | null;
    __THREE_CONTROLS__?: OrbitControls | null;
    __THREE_SCENE_CONFIG__?: SceneConfig;
    configUpdateTimeout?: number;
    drupalSettings?: DrupalSettings;
  }

  interface DrupalSettings {
    shelf3d_block: Wood3DBlockSettings;
    shelf3d: Wood3DSettings;
  }

  interface Wood3DBlockSettings {
    containerId: string;
    createProductUrl: string;
    fileUploadUrl: string;
    taxonomyBaseUrl: string;
  }

  interface Wood3DSettings {
    product_id: string;
    config_3d: ConfigState;
  }

  interface WoodModelProps {
    showMeasurements: boolean;
  }
}
export {};
