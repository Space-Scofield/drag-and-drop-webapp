"use client";
import { DragOverlay } from "@dnd-kit/core";
import type { Active } from "@dnd-kit/core";
import type { DragData } from "./types";

export function EditorDragOverlay({ active }: { active: Active | null }) {
  if (!active) return null;

  const data = active.data.current as DragData | undefined;
  if (!data) return null;

  const label =
    data.source === "palette"
      ? data.componentType
      : `node:${data.nodeId.slice(0, 6)}`;

  return (
    <DragOverlay>
      <div style={{
        padding: "6px 12px",
        backgroundColor: "#3b82f6",
        color: "#fff",
        borderRadius: "6px",
        fontSize: "0.8rem",
        fontFamily: "sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        pointerEvents: "none",
      }}>
        {label}
      </div>
    </DragOverlay>
  );
}
