"use client";
import { useState } from "react";
import { ComponentIcon } from "./ComponentIcon";
import type { AdaptedNode } from "./types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-2 h-7">
      <div className="w-16 text-[11px] text-zinc-500 shrink-0">{label}</div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function NumberInput({ value, onChange, unit = "px", icon }: { value: string | number | undefined; onChange: (v: string) => void; unit?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center h-6 bg-zinc-900 border border-zinc-800 rounded-[4px] hover:border-zinc-700 focus-within:border-blue-500 overflow-hidden">
      {icon && <div className="px-1.5 text-zinc-500">{icon}</div>}
      <input
        type="text"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="flex-1 min-w-0 bg-transparent outline-none px-1.5 text-[11.5px] text-zinc-200 font-mono"
      />
      {unit && <span className="px-1.5 text-[10px] text-zinc-500 font-mono">{unit}</span>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string | undefined; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-6 px-1.5 bg-zinc-900 border border-zinc-800 rounded-[4px] hover:border-zinc-700 focus:border-blue-500 focus:outline-none text-[11.5px] text-zinc-200"
    />
  );
}

function ColorInput({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  const color = value || "#18181B";
  return (
    <div className="flex items-center h-6 bg-zinc-900 border border-zinc-800 rounded-[4px] hover:border-zinc-700 focus-within:border-blue-500 overflow-hidden">
      <div className="h-full w-6 border-r border-zinc-800 relative">
        <input type="color" value={color} onChange={e => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
        <div className="absolute inset-0.5 rounded-sm" style={{ background: color }} />
      </div>
      <input value={color} onChange={e => onChange(e.target.value)} className="flex-1 min-w-0 bg-transparent outline-none px-1.5 text-[11.5px] text-zinc-200 font-mono uppercase" />
    </div>
  );
}

function Segmented({ options, value, onChange }: { options: { value: string; label: string; icon?: React.ReactNode }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center h-6 bg-zinc-900 border border-zinc-800 rounded-[4px] p-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 h-full rounded-[3px] text-[11px] grid place-items-center transition-colors ${value === o.value ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
          title={o.label}
        >
          {o.icon || o.label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children, defaultOpen = true, actions }: { title: string; children: React.ReactNode; defaultOpen?: boolean; actions?: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800/80">
      <div onClick={() => setOpen(!open)} className="h-8 flex items-center px-2 gap-1 cursor-pointer hover:bg-zinc-900/60">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-zinc-500 transition-transform ${open ? "" : "-rotate-90"}`}><path d="m6 9 6 6 6-6"/></svg>
        <span className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-zinc-400">{title}</span>
        <div className="flex-1" />
        {actions}
      </div>
      {open && <div className="py-1">{children}</div>}
    </div>
  );
}

function SpacingInput({ value, onChange, className }: { value: string | undefined; onChange: (v: string) => void; className: string; position?: string }) {
  return (
    <input
      value={value || "0"}
      onChange={e => onChange(e.target.value)}
      className={`absolute w-8 h-4 bg-transparent text-center text-[10px] font-mono text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 focus:outline-none rounded-[2px] ${className}`}
    />
  );
}

function StyleTab({ style, setStyle }: { style: React.CSSProperties; setStyle: (patch: Partial<React.CSSProperties>) => void }) {
  const s = style as Record<string, string | number | undefined>;
  const set = (patch: Record<string, string | number>) => setStyle(patch as Partial<React.CSSProperties>);

  return (
    <>
      <Section title="Layout">
        <Field label="Display">
          <Segmented
            options={[
              { value: "block", label: "Block", icon: <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="4"/><rect x="2" y="9" width="12" height="4"/></svg> },
              { value: "flex", label: "Flex", icon: <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="3" height="10"/><rect x="6.5" y="3" width="3" height="10"/><rect x="11" y="3" width="3" height="10"/></svg> },
              { value: "grid", label: "Grid", icon: <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></svg> },
              { value: "none", label: "Hidden", icon: "×" },
            ]}
            value={String(s.display || "block")}
            onChange={v => set({ display: v })}
          />
        </Field>
        <Field label="Width">
          <NumberInput value={String(s.width || "auto")} onChange={v => set({ width: v })} unit={typeof s.width === "string" && s.width.includes("%") ? "%" : "px"} />
        </Field>
        <Field label="Height">
          <NumberInput value={String(s.height || "auto")} onChange={v => set({ height: v })} />
        </Field>
      </Section>

      <Section title="Spacing">
        <div className="px-2 py-2">
          <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-[4px] p-5">
            <div className="absolute top-0.5 left-2 text-[9px] font-mono text-zinc-500">MARGIN</div>
            <SpacingInput position="top" value={String(s.marginTop || "")} onChange={v => set({ marginTop: v })} className="top-[2px] left-1/2 -translate-x-1/2" />
            <SpacingInput position="right" value={String(s.marginRight || "")} onChange={v => set({ marginRight: v })} className="right-[2px] top-1/2 -translate-y-1/2" />
            <SpacingInput position="bottom" value={String(s.marginBottom || "")} onChange={v => set({ marginBottom: v })} className="bottom-[2px] left-1/2 -translate-x-1/2" />
            <SpacingInput position="left" value={String(s.marginLeft || "")} onChange={v => set({ marginLeft: v })} className="left-[2px] top-1/2 -translate-y-1/2" />
            <div className="bg-zinc-900 border border-zinc-800 rounded-[3px] p-4 relative">
              <div className="absolute top-0.5 left-1.5 text-[9px] font-mono text-zinc-500">PAD</div>
              <SpacingInput position="top" value={String(s.paddingTop || "")} onChange={v => set({ paddingTop: v })} className="top-[2px] left-1/2 -translate-x-1/2" />
              <SpacingInput position="right" value={String(s.paddingRight || "")} onChange={v => set({ paddingRight: v })} className="right-[2px] top-1/2 -translate-y-1/2" />
              <SpacingInput position="bottom" value={String(s.paddingBottom || "")} onChange={v => set({ paddingBottom: v })} className="bottom-[2px] left-1/2 -translate-x-1/2" />
              <SpacingInput position="left" value={String(s.paddingLeft || "")} onChange={v => set({ paddingLeft: v })} className="left-[2px] top-1/2 -translate-y-1/2" />
              <div className="h-6 bg-blue-500/15 border border-blue-500/40 rounded-[2px] grid place-items-center">
                <span className="text-[9px] font-mono text-blue-400">content</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Typography">
        <Field label="Family">
          <select value={String(s.fontFamily || "Inter")} onChange={e => set({ fontFamily: e.target.value })} className="w-full h-6 px-1.5 bg-zinc-900 border border-zinc-800 rounded-[4px] text-[11.5px] text-zinc-200 focus:border-blue-500 focus:outline-none">
            <option>Inter</option><option>system-ui</option><option>Helvetica</option><option>Georgia</option><option>JetBrains Mono</option>
          </select>
        </Field>
        <Field label="Size">
          <div className="grid grid-cols-2 gap-1">
            <NumberInput value={String(s.fontSize || "16")} onChange={v => set({ fontSize: v })} />
            <NumberInput value={String(s.lineHeight || "1.5")} onChange={v => set({ lineHeight: v })} unit="" />
          </div>
        </Field>
        <Field label="Weight">
          <Segmented
            options={[{ value: "400", label: "R" }, { value: "500", label: "M" }, { value: "600", label: "SB" }, { value: "700", label: "B" }]}
            value={String(s.fontWeight || "400")}
            onChange={v => set({ fontWeight: v })}
          />
        </Field>
        <Field label="Align">
          <Segmented
            options={[{ value: "left", label: "⇤" }, { value: "center", label: "↔" }, { value: "right", label: "⇥" }, { value: "justify", label: "≡" }]}
            value={String(s.textAlign || "left")}
            onChange={v => set({ textAlign: v })}
          />
        </Field>
        <Field label="Color">
          <ColorInput value={String(s.color || "#18181B")} onChange={v => set({ color: v })} />
        </Field>
      </Section>

      <Section title="Background">
        <Field label="Color">
          <ColorInput value={String(s.backgroundColor || "#FFFFFF")} onChange={v => set({ backgroundColor: v })} />
        </Field>
        <Field label="Image">
          <TextInput value={String(s.backgroundImage || "")} onChange={v => set({ backgroundImage: v })} placeholder="url(...)" />
        </Field>
      </Section>

      <Section title="Border & Radius" defaultOpen={false}>
        <Field label="Radius">
          <NumberInput value={String(s.borderRadius || "0")} onChange={v => set({ borderRadius: v })} />
        </Field>
        <Field label="Border">
          <div className="grid grid-cols-[1fr_1fr] gap-1">
            <NumberInput value={String(s.borderWidth || "0")} onChange={v => set({ borderWidth: v })} />
            <ColorInput value={String(s.borderColor || "#E4E4E7")} onChange={v => set({ borderColor: v })} />
          </div>
        </Field>
      </Section>

      <Section title="Effects" defaultOpen={false}>
        <Field label="Opacity">
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="100" value={Math.round(((s.opacity as number) ?? 1) * 100)} onChange={e => set({ opacity: +e.target.value / 100 })} className="flex-1 h-1 accent-blue-500" />
            <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">{Math.round(((s.opacity as number) ?? 1) * 100)}%</span>
          </div>
        </Field>
        <Field label="Shadow">
          <TextInput value={String(s.boxShadow || "")} onChange={v => set({ boxShadow: v })} placeholder="0 2px 8px rgba(0,0,0,.1)" />
        </Field>
      </Section>
    </>
  );
}

function PropsTab({ node, setProp }: { node: AdaptedNode; setProp: (patch: Record<string, string>) => void }) {
  const props = node.props || {};
  const hasText = ["heading", "text", "button", "link"].includes(node.type);
  const hasPlaceholder = ["input", "textarea"].includes(node.type);
  const hasLabel = ["checkbox", "input"].includes(node.type);

  return (
    <>
      <Section title="Content">
        {hasText && (
          <div className="px-2">
            <div className="text-[11px] text-zinc-500 mb-1">Text</div>
            <textarea
              value={props.text || ""}
              onChange={e => setProp({ text: e.target.value })}
              className="w-full h-16 p-2 bg-zinc-900 border border-zinc-800 rounded-[4px] text-[12px] text-zinc-200 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        )}
        {hasLabel && <Field label="Label"><TextInput value={props.label} onChange={v => setProp({ label: v })} /></Field>}
        {hasPlaceholder && <Field label="Placeholder"><TextInput value={props.placeholder} onChange={v => setProp({ placeholder: v })} /></Field>}
        {node.type === "link" && <Field label="Href"><TextInput value={props.href} onChange={v => setProp({ href: v })} placeholder="https://" /></Field>}
        {node.type === "image" && <>
          <Field label="Src"><TextInput value={props.src} onChange={v => setProp({ src: v })} placeholder="/image.png" /></Field>
          <Field label="Alt"><TextInput value={props.alt} onChange={v => setProp({ alt: v })} /></Field>
        </>}
      </Section>
      <Section title="Accessibility" defaultOpen={false}>
        <Field label="Role"><TextInput value={props.role} onChange={v => setProp({ role: v })} /></Field>
        <Field label="Aria-label"><TextInput value={props["aria-label"]} onChange={v => setProp({ "aria-label": v })} /></Field>
      </Section>
    </>
  );
}

function InteractionsTab() {
  return (
    <div className="p-2">
      <div className="text-[11px] text-zinc-500 mb-2 px-1">Triggers</div>
      <button className="w-full h-8 border border-dashed border-zinc-700 rounded-[4px] text-[12px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 flex items-center justify-center gap-1.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        Add trigger
      </button>
      <div className="mt-3 text-[11px] text-zinc-500 mb-2 px-1">Common</div>
      {["On click", "On hover", "On scroll into view", "On page load"].map(t => (
        <div key={t} className="flex items-center h-7 px-2 rounded-[4px] hover:bg-zinc-900 cursor-pointer text-[12px] text-zinc-400">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-zinc-500"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          {t}
        </div>
      ))}
    </div>
  );
}

interface InspectorProps {
  node: AdaptedNode | null;
  onChange: (updated: AdaptedNode) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function Inspector({ node, onChange, onDuplicate, onDelete }: InspectorProps) {
  const [tab, setTab] = useState<"style" | "props" | "interactions">("style");

  if (!node) {
    return (
      <aside className="w-[280px] shrink-0 bg-[#141416] border-l border-zinc-800/80 flex flex-col text-zinc-300 select-none">
        <div className="h-9 shrink-0 border-b border-zinc-800/80 flex items-center px-3">
          <span className="text-[12px] text-zinc-500">No selection</span>
        </div>
        <div className="flex-1 grid place-items-center p-6">
          <div className="text-center">
            <div className="h-10 w-10 mx-auto mb-2 rounded-[6px] border border-dashed border-zinc-700 grid place-items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
            </div>
            <div className="text-[12px] text-zinc-400">Select an element</div>
            <div className="text-[11px] text-zinc-600 mt-1">to edit its properties</div>
          </div>
        </div>
      </aside>
    );
  }

  const style = node.style || {};
  const setStyle = (patch: Partial<React.CSSProperties>) => onChange({ ...node, style: { ...style, ...patch } });
  const setProp = (patch: Record<string, string>) => onChange({ ...node, props: { ...(node.props || {}), ...patch } });

  return (
    <aside className="w-[280px] shrink-0 bg-[#141416] border-l border-zinc-800/80 flex flex-col text-zinc-300 select-none">
      <div className="shrink-0 border-b border-zinc-800/80">
        <div className="h-9 flex items-center px-2 gap-1.5">
          <div className="h-5 w-5 rounded-[3px] bg-blue-500/15 text-blue-400 grid place-items-center">
            <ComponentIcon type={node.type} />
          </div>
          <input
            value={node.name || ""}
            onChange={e => onChange({ ...node, name: e.target.value })}
            placeholder={node.type}
            className="flex-1 min-w-0 bg-transparent outline-none text-[12.5px] font-medium text-zinc-100 focus:bg-zinc-900 px-1 py-0.5 rounded-[3px]"
          />
          <span className="text-[10px] font-mono text-zinc-500">{node.type}</span>
          <button onClick={onDuplicate} className="h-6 w-6 grid place-items-center rounded-[4px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200" title="Duplicate">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
          </button>
          <button onClick={onDelete} className="h-6 w-6 grid place-items-center rounded-[4px] text-zinc-500 hover:bg-red-500/15 hover:text-red-400" title="Delete">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
        <div className="flex items-center px-1 pb-1 gap-0.5">
          {(["style", "props", "interactions"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 h-6 rounded-[4px] text-[11px] capitalize font-medium transition-colors ${tab === t ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "style" && <StyleTab style={style} setStyle={setStyle} />}
        {tab === "props" && <PropsTab node={node} setProp={setProp} />}
        {tab === "interactions" && <InteractionsTab />}
      </div>
    </aside>
  );
}
