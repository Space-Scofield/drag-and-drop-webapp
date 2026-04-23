import type { ComponentNode, CSSProperties } from "@drag-builder/schema";

export interface AdaptedNode {
  id: string;
  type: string;
  name?: string;
  style: React.CSSProperties;
  props: Record<string, string | undefined>;
  children: AdaptedNode[];
  hidden?: boolean;
  locked?: boolean;
}

export function adaptNode(node: ComponentNode): AdaptedNode {
  return {
    id: node.id,
    type: node.type,
    name: node.name,
    style: (node.styles?.base ?? {}) as React.CSSProperties,
    props: node.props as Record<string, string | undefined>,
    children: node.children.map(adaptNode),
    hidden: node.hidden,
    locked: node.locked,
  };
}

export function adaptedStyleToCssProperties(style: React.CSSProperties): CSSProperties {
  return style as CSSProperties;
}
