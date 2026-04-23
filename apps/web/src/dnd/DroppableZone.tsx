"use client";
import { useDroppable } from "@dnd-kit/core";
import type { DropData } from "./types";

interface DroppableZoneProps {
  parentId: string;
  index?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function DroppableZone({ parentId, index, children, style }: DroppableZoneProps) {
  const data: DropData = { parentId, index };
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${parentId}-${index ?? "append"}`,
    data,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "relative",
        minHeight: "8px",
        ...style,
        ...(isOver
          ? { outline: "2px dashed #3b82f6", backgroundColor: "#eff6ff" }
          : {}),
      }}
    >
      {children}
    </div>
  );
}
