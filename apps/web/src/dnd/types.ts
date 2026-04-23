import type { ComponentType } from "@drag-builder/schema";

export interface PaletteDragData {
  source: "palette";
  componentType: ComponentType;
}

export interface CanvasDragData {
  source: "canvas";
  nodeId: string;
}

export type DragData = PaletteDragData | CanvasDragData;

export interface DropData {
  parentId: string;
  index?: number;
}
