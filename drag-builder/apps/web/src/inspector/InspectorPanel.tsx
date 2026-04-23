"use client";
import { useState } from "react";
import { useEditorStore } from "@/store/editor";
import { PropsEditor } from "./PropsEditor";
import { StylesEditor } from "./StylesEditor";

type Tab = "props" | "styles";

export function InspectorPanel() {
  const selectedNode = useEditorStore((s) =>
    s.selectedId ? s.getNode(s.selectedId) : null
  );
  const removeNode = useEditorStore((s) => s.removeNode);
  const rootId = useEditorStore((s) => s.root.id);
  const [tab, setTab] = useState<Tab>("props");

  return (
    <aside style={{
      width: "260px",
      borderLeft: "1px solid #e2e8f0",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
          Inspector
        </h3>
      </div>

      {!selectedNode ? (
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>Click a node to select</p>
        </div>
      ) : (
        <>
          {/* Node info bar */}
          <div style={{ padding: "8px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#334155", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                {selectedNode.type}
              </span>
              <code style={{ fontSize: "0.65rem", color: "#94a3b8" }}>
                {selectedNode.id.slice(0, 6)}
              </code>
            </div>
            {selectedNode.id !== rootId && (
              <button
                onClick={() => removeNode(selectedNode.id)}
                title="Delete node"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc2626",
                  fontSize: "0.8rem",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
            {(["props", "styles"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "0.75rem",
                  fontWeight: tab === t ? 600 : 400,
                  background: "none",
                  border: "none",
                  borderBottom: tab === t ? "2px solid #3b82f6" : "2px solid transparent",
                  cursor: "pointer",
                  color: tab === t ? "#3b82f6" : "#64748b",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
            {tab === "props"
              ? <PropsEditor node={selectedNode} />
              : <StylesEditor node={selectedNode} />
            }
          </div>
        </>
      )}
    </aside>
  );
}
