"use client";
import type { ComponentNode } from "@drag-builder/schema";
import { useEditorStore } from "@/store/editor";

interface Props { node: ComponentNode }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", fontSize: "0.7rem", color: "#64748b", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "5px 8px",
  border: "1px solid #e2e8f0",
  borderRadius: "4px",
  fontSize: "0.8rem",
  boxSizing: "border-box",
  outline: "none",
};

export function PropsEditor({ node }: Props) {
  const updateNodeProps = useEditorStore((s) => s.updateNodeProps);

  function set(key: string, value: unknown) {
    updateNodeProps(node.id, { [key]: value });
  }

  const p = node.props as Record<string, string | number | undefined>;

  switch (node.type) {
    case "text":
      return (
        <Field label="Content">
          <textarea
            value={String(p.content ?? "")}
            onChange={(e) => set("content", e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>
      );

    case "heading":
      return (
        <>
          <Field label="Content">
            <input
              type="text"
              value={String(p.content ?? "")}
              onChange={(e) => set("content", e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Level">
            <select
              value={Number(p.level ?? 2)}
              onChange={(e) => set("level", Number(e.target.value))}
              style={inputStyle}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>H{n}</option>
              ))}
            </select>
          </Field>
        </>
      );

    case "button":
      return (
        <>
          <Field label="Label">
            <input
              type="text"
              value={String(p.label ?? "")}
              onChange={(e) => set("label", e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="href">
            <input
              type="text"
              value={String(p.href ?? "")}
              onChange={(e) => set("href", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </Field>
        </>
      );

    case "image":
      return (
        <>
          <Field label="src">
            <input
              type="text"
              value={String(p.src ?? "")}
              onChange={(e) => set("src", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </Field>
          <Field label="alt">
            <input
              type="text"
              value={String(p.alt ?? "")}
              onChange={(e) => set("alt", e.target.value)}
              style={inputStyle}
            />
          </Field>
        </>
      );

    default:
      return (
        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No props for {node.type}</p>
      );
  }
}
