"use client";
import { useState, useCallback } from "react";
import { Topbar } from "@/components/Topbar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Canvas } from "@/components/Canvas";
import { Inspector } from "@/components/Inspector";
import { adaptNode, type AdaptedNode } from "@/components/types";
import { useEditorStore } from "@/store/editor";
import { exportToHtml } from "@drag-builder/exporter";
import { findNode } from "@drag-builder/editor-core";

type Viewport = "desktop" | "tablet" | "mobile";

export default function EditorPage() {
  const {
    root,
    selectedId,
    hoveredId,
    select,
    hover,
    addNode,
    removeNode,
    replaceBaseStyle,
    updateNodeProps,
    updateNodeName,
  } = useEditorStore();

  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState("components");
  const [dragType, setDragType] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untitled project");

  // Build adapted tree from root's children (root is the container wrapper)
  const tree = root.children.map(adaptNode);

  // Selected adapted node
  const rawSelected = selectedId ? findNode(root, selectedId) : null;
  const selectedAdapted = rawSelected ? adaptNode(rawSelected) : null;

  const handleDragStart = useCallback((e: React.DragEvent, item: { type: string; label: string }) => {
    e.dataTransfer.setData("componentType", item.type);
    e.dataTransfer.effectAllowed = "copy";
    setDragType(item.type);
  }, []);

  const handleDrop = useCallback((parentId: string) => {
    if (!dragType) return;
    const resolvedParent = parentId === root.id ? root.id : parentId;
    addNode(dragType as Parameters<typeof addNode>[0], { type: "append", parentId: resolvedParent });
    setDragType(null);
  }, [dragType, addNode, root.id]);

  const handleInspectorChange = useCallback((updated: AdaptedNode) => {
    replaceBaseStyle(updated.id, updated.style as Record<string, string>);
    updateNodeProps(updated.id, updated.props as Record<string, unknown>);
    if (updated.name !== undefined) updateNodeName(updated.id, updated.name);
  }, [replaceBaseStyle, updateNodeProps, updateNodeName]);

  const handleDuplicate = useCallback(() => {
    if (!selectedId || !rawSelected) return;
    addNode(rawSelected.type as Parameters<typeof addNode>[0], { type: "after", siblingId: selectedId }, {
      props: rawSelected.props,
      styles: rawSelected.styles,
      name: rawSelected.name ? `${rawSelected.name} copy` : undefined,
    });
  }, [selectedId, rawSelected, addNode]);

  const handleDelete = useCallback(() => {
    if (selectedId) removeNode(selectedId);
  }, [selectedId, removeNode]);

  const handleExport = useCallback(() => {
    const html = exportToHtml(root, { title: projectName });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [root, projectName]);

  return (
    <div className="flex flex-col h-screen bg-[#0e0e10] overflow-hidden">
      <Topbar
        projectName={projectName}
        onRename={setProjectName}
        canUndo={false}
        canRedo={false}
        onUndo={() => {}}
        onRedo={() => {}}
        viewport={viewport}
        setViewport={setViewport}
        onPreview={() => {}}
        onExport={handleExport}
      />

      <div className="flex flex-1 min-h-0">
        <LeftSidebar
          onDragStart={handleDragStart}
          tree={tree}
          selectedId={selectedId}
          onSelect={select}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <Canvas
          tree={tree}
          rootId={root.id}
          viewport={viewport}
          zoom={zoom}
          setZoom={setZoom}
          selectedId={selectedId}
          hoveredId={hoveredId}
          setSelected={select}
          setHovered={hover}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onDrop={handleDrop}
        />

        <Inspector
          node={selectedAdapted}
          onChange={handleInspectorChange}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
