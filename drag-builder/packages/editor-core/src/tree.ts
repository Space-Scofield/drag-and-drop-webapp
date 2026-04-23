import { v4 as uuidv4 } from "uuid";
import type { ComponentNode, ComponentType, StyleMap, CSSProperties, Breakpoint } from "@drag-builder/schema";

// ─── Factory ────────────────────────────────────────────────────────────────

export function createNode(
  type: ComponentType,
  overrides: Partial<Omit<ComponentNode, "id" | "type" | "children">> = {}
): ComponentNode {
  return {
    id: uuidv4(),
    type,
    props: {},
    styles: { base: {} },
    children: [],
    ...overrides,
  };
}

// ─── Traversal (immutable helpers) ──────────────────────────────────────────

export function mapTree(
  node: ComponentNode,
  fn: (n: ComponentNode) => ComponentNode
): ComponentNode {
  const mapped = fn(node);
  if (mapped.children.length === 0) return mapped;
  return {
    ...mapped,
    children: mapped.children.map((child) => mapTree(child, fn)),
  };
}

function filterTree(
  node: ComponentNode,
  predicate: (n: ComponentNode) => boolean
): ComponentNode {
  return {
    ...node,
    children: node.children
      .filter(predicate)
      .map((child) => filterTree(child, predicate)),
  };
}

export function findNode(
  root: ComponentNode,
  id: string
): ComponentNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

// ─── Insert ──────────────────────────────────────────────────────────────────

export type InsertPosition =
  | { type: "append"; parentId: string }
  | { type: "prepend"; parentId: string }
  | { type: "before"; siblingId: string }
  | { type: "after"; siblingId: string }
  | { type: "at"; parentId: string; index: number };

export function insertNode(
  root: ComponentNode,
  node: ComponentNode,
  position: InsertPosition
): ComponentNode {
  return mapTree(root, (current) => {
    if (position.type === "append" && current.id === position.parentId) {
      return { ...current, children: [...current.children, node] };
    }

    if (position.type === "prepend" && current.id === position.parentId) {
      return { ...current, children: [node, ...current.children] };
    }

    if (position.type === "at" && current.id === position.parentId) {
      const children = [...current.children];
      children.splice(position.index, 0, node);
      return { ...current, children };
    }

    if (
      position.type === "before" &&
      current.children.some((c) => c.id === position.siblingId)
    ) {
      const idx = current.children.findIndex((c) => c.id === position.siblingId);
      const children = [...current.children];
      children.splice(idx, 0, node);
      return { ...current, children };
    }

    if (
      position.type === "after" &&
      current.children.some((c) => c.id === position.siblingId)
    ) {
      const idx = current.children.findIndex((c) => c.id === position.siblingId);
      const children = [...current.children];
      children.splice(idx + 1, 0, node);
      return { ...current, children };
    }

    return current;
  });
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export function deleteNode(
  root: ComponentNode,
  id: string
): ComponentNode {
  if (root.id === id) {
    throw new Error(`Cannot delete root node (id: ${id})`);
  }
  return filterTree(root, (node) => node.id !== id);
}

// ─── Update props ────────────────────────────────────────────────────────────

export function updateProps(
  root: ComponentNode,
  id: string,
  props: Record<string, unknown>
): ComponentNode {
  return mapTree(root, (node) => {
    if (node.id !== id) return node;
    return { ...node, props: { ...node.props, ...props } };
  });
}

// ─── Update styles ───────────────────────────────────────────────────────────

export function updateStyles(
  root: ComponentNode,
  id: string,
  styles: Partial<Record<Breakpoint, CSSProperties>>
): ComponentNode {
  return mapTree(root, (node) => {
    if (node.id !== id) return node;
    const merged: StyleMap = { ...node.styles };
    for (const [bp, css] of Object.entries(styles) as [Breakpoint, CSSProperties][]) {
      merged[bp] = { ...(merged[bp] ?? {}), ...css };
    }
    return { ...node, styles: merged };
  });
}

// ─── Move (delete + insert) ──────────────────────────────────────────────────

export function moveNode(
  root: ComponentNode,
  id: string,
  position: InsertPosition
): ComponentNode {
  const node = findNode(root, id);
  if (!node) throw new Error(`Node not found: ${id}`);
  const withoutNode = deleteNode(root, id);
  return insertNode(withoutNode, node, position);
}
