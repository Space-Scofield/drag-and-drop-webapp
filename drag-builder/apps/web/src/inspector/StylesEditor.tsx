"use client";
import { useState } from "react";
import type { ComponentNode, Breakpoint, CSSProperties } from "@drag-builder/schema";
import { useEditorStore } from "@/store/editor";

interface Props { node: ComponentNode }

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "4px 6px",
  border: "1px solid #e2e8f0",
  borderRadius: "4px",
  fontSize: "0.75rem",
  boxSizing: "border-box",
  outline: "none",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
      <span style={{ width: "90px", fontSize: "0.7rem", color: "#64748b", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: "12px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", padding: "4px 0", width: "100%", fontSize: "0.75rem", fontWeight: 600, color: "#0f172a" }}
      >
        <span style={{ transform: open ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.15s" }}>▶</span>
        {title}
      </button>
      {open && <div style={{ paddingLeft: "12px" }}>{children}</div>}
    </div>
  );
}

const BREAKPOINTS: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];

export function StylesEditor({ node }: Props) {
  const updateNodeStyles = useEditorStore((s) => s.updateNodeStyles);
  const [bp, setBp] = useState<Breakpoint>("base");

  const current: CSSProperties = node.styles[bp] ?? {};

  function set(key: string, value: string) {
    updateNodeStyles(node.id, { [bp]: { [key]: value || undefined } as CSSProperties });
  }

  function val(key: keyof CSSProperties): string {
    const v = current[key];
    return v !== undefined ? String(v) : "";
  }

  return (
    <div>
      {/* Breakpoint selector */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "12px", flexWrap: "wrap" }}>
        {BREAKPOINTS.map((b) => (
          <button
            key={b}
            onClick={() => setBp(b)}
            style={{
              padding: "2px 8px",
              fontSize: "0.7rem",
              borderRadius: "4px",
              border: "1px solid",
              cursor: "pointer",
              borderColor: bp === b ? "#3b82f6" : "#e2e8f0",
              backgroundColor: bp === b ? "#eff6ff" : "#fff",
              color: bp === b ? "#3b82f6" : "#64748b",
            }}
          >
            {b}
          </button>
        ))}
      </div>

      <Section title="Layout">
        <Row label="display">
          <select value={val("display")} onChange={(e) => set("display", e.target.value)} style={inputStyle}>
            <option value="">—</option>
            {["block", "flex", "grid", "inline", "inline-flex", "inline-block", "none"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Row>
        <Row label="flex-dir">
          <select value={val("flexDirection")} onChange={(e) => set("flexDirection", e.target.value)} style={inputStyle}>
            <option value="">—</option>
            {["row", "column", "row-reverse", "column-reverse"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Row>
        <Row label="gap">
          <input type="text" value={val("gap")} onChange={(e) => set("gap", e.target.value)} placeholder="16px" style={inputStyle} />
        </Row>
        <Row label="align">
          <select value={val("alignItems")} onChange={(e) => set("alignItems", e.target.value)} style={inputStyle}>
            <option value="">—</option>
            {["flex-start", "center", "flex-end", "stretch", "baseline"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Row>
        <Row label="justify">
          <select value={val("justifyContent")} onChange={(e) => set("justifyContent", e.target.value)} style={inputStyle}>
            <option value="">—</option>
            {["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Row>
      </Section>

      <Section title="Size">
        <Row label="width">
          <input type="text" value={val("width")} onChange={(e) => set("width", e.target.value)} placeholder="100%" style={inputStyle} />
        </Row>
        <Row label="height">
          <input type="text" value={val("height")} onChange={(e) => set("height", e.target.value)} placeholder="auto" style={inputStyle} />
        </Row>
        <Row label="min-w">
          <input type="text" value={val("minWidth")} onChange={(e) => set("minWidth", e.target.value)} placeholder="0" style={inputStyle} />
        </Row>
        <Row label="max-w">
          <input type="text" value={val("maxWidth")} onChange={(e) => set("maxWidth", e.target.value)} placeholder="none" style={inputStyle} />
        </Row>
      </Section>

      <Section title="Spacing">
        <Row label="padding">
          <input type="text" value={val("padding")} onChange={(e) => set("padding", e.target.value)} placeholder="0px" style={inputStyle} />
        </Row>
        <Row label="pad-top">
          <input type="text" value={val("paddingTop")} onChange={(e) => set("paddingTop", e.target.value)} placeholder="0px" style={inputStyle} />
        </Row>
        <Row label="pad-bot">
          <input type="text" value={val("paddingBottom")} onChange={(e) => set("paddingBottom", e.target.value)} placeholder="0px" style={inputStyle} />
        </Row>
        <Row label="margin">
          <input type="text" value={val("margin")} onChange={(e) => set("margin", e.target.value)} placeholder="0px" style={inputStyle} />
        </Row>
      </Section>

      <Section title="Typography">
        <Row label="font-size">
          <input type="text" value={val("fontSize")} onChange={(e) => set("fontSize", e.target.value)} placeholder="1rem" style={inputStyle} />
        </Row>
        <Row label="font-wt">
          <input type="text" value={val("fontWeight")} onChange={(e) => set("fontWeight", e.target.value)} placeholder="400" style={inputStyle} />
        </Row>
        <Row label="color">
          <div style={{ display: "flex", gap: "4px" }}>
            <input type="color" value={val("color") || "#000000"} onChange={(e) => set("color", e.target.value)} style={{ width: "28px", height: "28px", border: "1px solid #e2e8f0", borderRadius: "4px", cursor: "pointer", padding: "1px" }} />
            <input type="text" value={val("color")} onChange={(e) => set("color", e.target.value)} placeholder="#000000" style={{ ...inputStyle, flex: 1 }} />
          </div>
        </Row>
        <Row label="align">
          <select value={val("textAlign")} onChange={(e) => set("textAlign", e.target.value)} style={inputStyle}>
            <option value="">—</option>
            {["left", "center", "right", "justify"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Row>
        <Row label="line-h">
          <input type="text" value={val("lineHeight")} onChange={(e) => set("lineHeight", e.target.value)} placeholder="1.5" style={inputStyle} />
        </Row>
      </Section>

      <Section title="Visual">
        <Row label="bg-color">
          <div style={{ display: "flex", gap: "4px" }}>
            <input type="color" value={val("backgroundColor") || "#ffffff"} onChange={(e) => set("backgroundColor", e.target.value)} style={{ width: "28px", height: "28px", border: "1px solid #e2e8f0", borderRadius: "4px", cursor: "pointer", padding: "1px" }} />
            <input type="text" value={val("backgroundColor")} onChange={(e) => set("backgroundColor", e.target.value)} placeholder="transparent" style={{ ...inputStyle, flex: 1 }} />
          </div>
        </Row>
        <Row label="border-r">
          <input type="text" value={val("borderRadius")} onChange={(e) => set("borderRadius", e.target.value)} placeholder="0px" style={inputStyle} />
        </Row>
        <Row label="border">
          <input type="text" value={val("border")} onChange={(e) => set("border", e.target.value)} placeholder="1px solid #ccc" style={inputStyle} />
        </Row>
        <Row label="shadow">
          <input type="text" value={val("boxShadow")} onChange={(e) => set("boxShadow", e.target.value)} placeholder="0 2px 4px rgba(0,0,0,.1)" style={inputStyle} />
        </Row>
        <Row label="opacity">
          <input type="range" min="0" max="1" step="0.01"
            value={val("opacity") !== "" ? Number(val("opacity")) : 1}
            onChange={(e) => set("opacity", e.target.value)}
            style={{ width: "100%" }}
          />
        </Row>
      </Section>
    </div>
  );
}
