"use client";
import { forwardRef } from "react";
import type { ComponentNode } from "@drag-builder/schema";

interface PrimitiveProps {
  node: ComponentNode;
  style: React.CSSProperties;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function TextNode({ node, style, onClick, onMouseEnter, onMouseLeave }: PrimitiveProps) {
  const content = typeof node.props.content === "string" ? node.props.content : "Text";
  return (
    <p
      data-node-id={node.id}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </p>
  );
}

export function HeadingNode({ node, style, onClick, onMouseEnter, onMouseLeave }: PrimitiveProps) {
  const content = typeof node.props.content === "string" ? node.props.content : "Heading";
  const level = typeof node.props.level === "number" ? node.props.level : 2;
  const Tag = `h${Math.min(Math.max(level, 1), 6)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag
      data-node-id={node.id}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </Tag>
  );
}

export function ImageNode({ node, style, onClick, onMouseEnter, onMouseLeave }: PrimitiveProps) {
  const src = typeof node.props.src === "string" ? node.props.src : "";
  const alt = typeof node.props.alt === "string" ? node.props.alt : "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-node-id={node.id}
      src={src || "https://placehold.co/400x300"}
      alt={alt}
      style={{ display: "block", maxWidth: "100%", ...style }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export function ButtonNode({ node, style, onClick, onMouseEnter, onMouseLeave }: PrimitiveProps) {
  const label = typeof node.props.label === "string" ? node.props.label : "Button";
  return (
    <button
      data-node-id={node.id}
      style={{ cursor: "pointer", ...style }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
    </button>
  );
}

export function DividerNode({ node, style, onClick, onMouseEnter, onMouseLeave }: PrimitiveProps) {
  return (
    <hr
      data-node-id={node.id}
      style={{ border: "none", borderTop: "1px solid currentColor", ...style }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export const ContainerNode = forwardRef<HTMLDivElement, PrimitiveProps>(
  function ContainerNode({ node, style, children, onClick, onMouseEnter, onMouseLeave }, ref) {
    return (
      <div
        ref={ref}
        data-node-id={node.id}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    );
  }
);
