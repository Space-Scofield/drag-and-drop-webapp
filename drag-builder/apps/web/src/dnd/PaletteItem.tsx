"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentType } from "@drag-builder/schema";
import type { PaletteDragData } from "./types";

const PALETTE_ITEMS: { type: ComponentType; label: string; icon: string }[] = [
  { type: "container", label: "Container", icon: "⬜" },
  { type: "section",   label: "Section",   icon: "▭" },
  { type: "flex",      label: "Flex",      icon: "⇔" },
  { type: "heading",   label: "Heading",   icon: "H" },
  { type: "text",      label: "Text",      icon: "¶" },
  { type: "button",    label: "Button",    icon: "⬡" },
  { type: "image",     label: "Image",     icon: "🖼" },
  { type: "divider",   label: "Divider",   icon: "—" },
];

function DraggablePaletteItem({ type, label, icon }: { type: ComponentType; label: string; icon: string }) {
  const data: PaletteDragData = { source: "palette", componentType: type };
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        marginBottom: "4px",
        borderRadius: "6px",
        cursor: "grab",
        backgroundColor: isDragging ? "#dbeafe" : "#f8fafc",
        border: "1px solid #e2e8f0",
        fontSize: "0.8rem",
        color: "#334155",
        userSelect: "none",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <span style={{ fontSize: "1rem" }}>{icon}</span>
      {label}
    </div>
  );
}

export function ComponentPalette() {
  return (
    <aside style={{
      width: "200px",
      borderRight: "1px solid #e2e8f0",
      padding: "16px",
      backgroundColor: "#fff",
      overflowY: "auto",
    }}>
      <h3 style={{ margin: "0 0 12px", fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
        Components
      </h3>
      {PALETTE_ITEMS.map((item) => (
        <DraggablePaletteItem key={item.type} {...item} />
      ))}
    </aside>
  );
}
