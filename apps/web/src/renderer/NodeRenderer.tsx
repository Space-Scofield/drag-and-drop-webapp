"use client";
import React, { useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { ComponentNode } from "@drag-builder/schema";
import { useEditorStore, useIsSelected, useIsHovered } from "@/store/editor";
import { resolveStyles } from "./styleUtils";
import { useViewportWidth } from "./hooks/useViewport";
import {
  TextNode,
  HeadingNode,
  ImageNode,
  ButtonNode,
  DividerNode,
  ContainerNode,
} from "./components/primitives";

const CONTAINER_TYPES = new Set(["container", "section", "flex", "grid", "form"]);

interface NodeRendererProps {
  node: ComponentNode;
  isEditing?: boolean;
}

function NodeWrapper({ node, isEditing }: NodeRendererProps) {
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);
  const isSelected = useIsSelected(node.id);
  const isHovered = useIsHovered(node.id);
  const viewportWidth = useViewportWidth();

  const isContainer = CONTAINER_TYPES.has(node.type);

  // Every container is a drop target — id encodes parentId directly
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop::${node.id}`,
    disabled: !isEditing || !isContainer,
  });

  const resolved = resolveStyles(node.styles, viewportWidth);

  const style: React.CSSProperties = {
    ...resolved,
    ...(isEditing && isSelected
      ? { outline: "2px solid #3b82f6", outlineOffset: "1px" }
      : isEditing && isHovered
      ? { outline: "1px dashed #93c5fd", outlineOffset: "1px" }
      : {}),
    ...(isEditing && isContainer && isOver
      ? { backgroundColor: (resolved.backgroundColor ?? "") || "#eff6ff", outline: "2px dashed #3b82f6", outlineOffset: "2px" }
      : {}),
    // Containers need min-height so they're hittable when empty
    ...(isEditing && isContainer && node.children.length === 0
      ? { minHeight: "60px" }
      : {}),
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) {
        e.stopPropagation();
        select(node.id);
      }
    },
    [isEditing, node.id, select]
  );

  const handleMouseEnter = useCallback(() => {
    if (isEditing) hover(node.id);
  }, [isEditing, node.id, hover]);

  const handleMouseLeave = useCallback(() => {
    if (isEditing) hover(null);
  }, [isEditing, hover]);

  const childNodes = node.children.map((child) => (
    <NodeWrapper key={child.id} node={child} isEditing={isEditing} />
  ));

  const emptyHint =
    isEditing && isContainer && node.children.length === 0 ? (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60px",
        fontSize: "0.75rem",
        color: "#94a3b8",
        border: "1px dashed #cbd5e1",
        borderRadius: "6px",
        margin: "8px",
        pointerEvents: "none",
      }}>
        Drop here
      </div>
    ) : null;

  const children = isContainer ? (
    <>{childNodes.length > 0 ? childNodes : emptyHint}</>
  ) : null;

  const sharedProps = {
    node,
    style,
    children,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  // Attach drop ref only to container elements
  const refProp = isContainer && isEditing ? { ref: setDropRef } : {};

  switch (node.type) {
    case "text":
      return <TextNode {...sharedProps} />;
    case "heading":
      return <HeadingNode {...sharedProps} />;
    case "image":
      return <ImageNode {...sharedProps} />;
    case "button":
      return <ButtonNode {...sharedProps} />;
    case "divider":
      return <DividerNode {...sharedProps} />;
    case "container":
    case "section":
    case "flex":
    case "grid":
    case "form":
      return (
        <ContainerNode {...sharedProps} {...refProp}>
          {children}
        </ContainerNode>
      );
    default:
      return (
        <div data-node-id={node.id} style={style} onClick={handleClick} {...refProp}>
          {children}
        </div>
      );
  }
}

export function TreeRenderer({ isEditing = false }: { isEditing?: boolean }) {
  const root = useEditorStore((s) => s.root);
  return <NodeWrapper node={root} isEditing={isEditing} />;
}
