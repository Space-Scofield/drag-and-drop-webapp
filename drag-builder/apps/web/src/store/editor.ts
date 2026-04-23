import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { ComponentNode, ComponentType, CSSProperties, Breakpoint } from "@drag-builder/schema";
import {
  createNode,
  insertNode,
  deleteNode,
  updateProps,
  updateStyles,
  moveNode,
  findNode,
  mapTree,
  type InsertPosition,
} from "@drag-builder/editor-core";

// ─── State ───────────────────────────────────────────────────────────────────

interface EditorState {
  root: ComponentNode;
  selectedId: string | null;
  hoveredId: string | null;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

interface EditorActions {
  // Selection
  select: (id: string | null) => void;
  hover: (id: string | null) => void;

  // Tree mutations
  addNode: (type: ComponentType, position: InsertPosition, overrides?: Partial<Omit<ComponentNode, "id" | "type" | "children">>) => string;
  removeNode: (id: string) => void;
  moveNode: (id: string, position: InsertPosition) => void;

  // Node mutations
  updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  updateNodeStyles: (id: string, styles: Partial<Record<Breakpoint, CSSProperties>>) => void;
  updateNodeName: (id: string, name: string) => void;
  replaceBaseStyle: (id: string, style: CSSProperties) => void;
  toggleLock: (id: string) => void;
  toggleVisibility: (id: string) => void;

  // Derived
  getSelected: () => ComponentNode | null;
  getNode: (id: string) => ComponentNode | null;
}

// ─── Initial tree ─────────────────────────────────────────────────────────────

function makeInitialRoot(): ComponentNode {
  return createNode("container", {
    name: "Root",
    styles: {
      base: {
        width: "100%",
        minHeight: "100vh",
        position: "relative",
      },
    },
  });
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    immer((set, get) => ({
      root: makeInitialRoot(),
      selectedId: null,
      hoveredId: null,

    select: (id) =>
      set((s) => {
        s.selectedId = id;
      }),

    hover: (id) =>
      set((s) => {
        s.hoveredId = id;
      }),

    addNode: (type, position, overrides = {}) => {
      const node = createNode(type, overrides);
      set((s) => {
        s.root = insertNode(s.root, node, position);
      });
      return node.id;
    },

    removeNode: (id) =>
      set((s) => {
        s.root = deleteNode(s.root, id);
        if (s.selectedId === id) s.selectedId = null;
        if (s.hoveredId === id) s.hoveredId = null;
      }),

    moveNode: (id, position) =>
      set((s) => {
        s.root = moveNode(s.root, id, position);
      }),

    updateNodeProps: (id, props) =>
      set((s) => {
        s.root = updateProps(s.root, id, props);
      }),

    updateNodeStyles: (id, styles) =>
      set((s) => {
        s.root = updateStyles(s.root, id, styles);
      }),

    updateNodeName: (id, name) =>
      set((s) => {
        s.root = mapTree(s.root, (node) =>
          node.id === id ? { ...node, name } : node
        );
      }),

    replaceBaseStyle: (id, style) =>
      set((s) => {
        s.root = mapTree(s.root, (node) =>
          node.id === id ? { ...node, styles: { ...node.styles, base: style } } : node
        );
      }),

    toggleLock: (id) =>
      set((s) => {
        const node = findNode(s.root, id);
        if (!node) return;
        s.root = updateProps(s.root, id, { __locked: !node.locked });
      }),

    toggleVisibility: (id) =>
      set((s) => {
        const node = findNode(s.root, id);
        if (!node) return;
        s.root = updateProps(s.root, id, { __hidden: !node.hidden });
      }),

    getSelected: () => {
      const { root, selectedId } = get();
      if (!selectedId) return null;
      return findNode(root, selectedId);
    },

    getNode: (id) => findNode(get().root, id),
  })),
  {
    name: "drag-builder-editor",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ root: state.root }),
  }
));

// ─── Selector hooks ───────────────────────────────────────────────────────────

export const useSelectedNode = () =>
  useEditorStore((s) => (s.selectedId ? findNode(s.root, s.selectedId) : null));

export const useIsSelected = (id: string) =>
  useEditorStore((s) => s.selectedId === id);

export const useIsHovered = (id: string) =>
  useEditorStore((s) => s.hoveredId === id);
