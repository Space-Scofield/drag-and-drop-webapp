"use client";
import type { AdaptedNode } from "./types";

type Viewport = "desktop" | "tablet" | "mobile";

interface CanvasCtx {
  selectedId: string | null;
  hoveredId: string | null;
  setSelected: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  dragOver: string | null;
  setDragOver: (id: string | null) => void;
  onDrop: (parentId: string) => void;
}

const CONTAINER_TYPES = new Set(["container", "section", "grid", "flex"]);

function EmptyDrop({ label }: { label: string }) {
  return (
    <div className="min-h-[64px] border border-dashed border-zinc-300 rounded-md grid place-items-center text-[11px] font-mono text-zinc-400 bg-zinc-50/50">
      Drop into {label}
    </div>
  );
}

function renderElement(node: AdaptedNode, ctx: CanvasCtx): React.ReactNode {
  const { selectedId, hoveredId, setHovered, setSelected, onDrop, dragOver, setDragOver } = ctx;
  const isSelected = node.id === selectedId;
  const isHovered = hoveredId === node.id && !isSelected;
  const isContainer = CONTAINER_TYPES.has(node.type);
  const isDropTarget = dragOver === node.id && isContainer;

  const wrap = (content: React.ReactNode, extraClass = "") => (
    <div
      key={node.id}
      data-node-id={node.id}
      onMouseEnter={e => { e.stopPropagation(); setHovered(node.id); }}
      onMouseLeave={() => setHovered(null)}
      onClick={e => { e.stopPropagation(); setSelected(node.id); }}
      onDragOver={e => {
        if (isContainer) { e.preventDefault(); e.stopPropagation(); setDragOver(node.id); }
      }}
      onDragLeave={() => setDragOver(null)}
      onDrop={e => {
        if (isContainer) { e.preventDefault(); e.stopPropagation(); onDrop(node.id); }
      }}
      className={`relative transition-[outline-color] ${extraClass}
        ${isSelected ? "outline outline-2 outline-blue-500 outline-offset-[-1px]" : ""}
        ${isHovered ? "outline outline-1 outline-blue-400/70 outline-offset-[-1px]" : ""}
        ${isDropTarget ? "outline outline-2 outline-dashed outline-blue-500 bg-blue-500/5" : ""}
      `}
      style={node.style || {}}
    >
      {isSelected && (
        <div className="absolute -top-[19px] left-0 bg-blue-500 text-white text-[10px] font-mono leading-none px-1.5 py-1 rounded-t-[3px] whitespace-nowrap z-20">
          {node.type}{node.name ? ` · ${node.name}` : ""}
        </div>
      )}
      {content}
    </div>
  );

  switch (node.type) {
    case "section":
      return wrap(
        <section className="w-full py-16 px-10">
          {node.children.length ? node.children.map(c => renderElement(c, ctx)) : <EmptyDrop label="Section" />}
        </section>,
        "w-full"
      );
    case "container":
      return wrap(
        <div className="w-full max-w-5xl mx-auto px-6 py-6">
          {node.children.length ? node.children.map(c => renderElement(c, ctx)) : <EmptyDrop label="Container" />}
        </div>
      );
    case "grid":
      return wrap(
        <div className="grid grid-cols-3 gap-4">
          {node.children.length ? node.children.map(c => renderElement(c, ctx)) : <><EmptyDrop label="Cell"/><EmptyDrop label="Cell"/><EmptyDrop label="Cell"/></>}
        </div>
      );
    case "flex":
      return wrap(
        <div className="flex gap-4">
          {node.children.length ? node.children.map(c => renderElement(c, ctx)) : <><EmptyDrop label="Item"/><EmptyDrop label="Item"/></>}
        </div>
      );
    case "heading":
      return wrap(<h1 className="text-4xl font-semibold tracking-tight text-zinc-900" style={node.props?.style as React.CSSProperties}>{node.props?.text || "Section heading"}</h1>);
    case "text":
      return wrap(<p className="text-[15px] leading-relaxed text-zinc-700 max-w-prose" style={node.props?.style as React.CSSProperties}>{node.props?.text || "Body text."}</p>);
    case "button":
      return wrap(<button className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-500" style={node.props?.style as React.CSSProperties}>{node.props?.text || "Get started"}</button>);
    case "link":
      return wrap(<a className="text-blue-600 hover:underline text-sm" style={node.props?.style as React.CSSProperties}>{node.props?.text || "Learn more →"}</a>);
    case "image":
      return wrap(
        <div className="w-full aspect-[16/9] bg-zinc-100 border border-zinc-200 rounded-md overflow-hidden relative" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 12px, rgba(0,0,0,0.03) 12px 24px)" }}>
          <div className="absolute inset-0 grid place-items-center text-[11px] font-mono text-zinc-500">image placeholder · 16:9</div>
        </div>
      );
    case "divider":
      return wrap(<hr className="border-zinc-200" />);
    case "input":
      return wrap(
        <div className="flex flex-col gap-1.5 w-80">
          <label className="text-[12px] font-medium text-zinc-700">{node.props?.label || "Email"}</label>
          <input placeholder={node.props?.placeholder || "you@company.com"} className="h-9 px-3 border border-zinc-300 rounded-md text-sm" readOnly />
        </div>
      );
    case "textarea":
      return wrap(<textarea placeholder="Message" className="w-80 h-24 p-3 border border-zinc-300 rounded-md text-sm" readOnly />);
    case "checkbox":
      return wrap(
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" readOnly /> {node.props?.label || "Accept terms"}
        </label>
      );
    case "select":
      return wrap(<select className="h-9 px-2 border border-zinc-300 rounded-md text-sm bg-white w-60" disabled><option>Option 1</option><option>Option 2</option></select>);
    default:
      return wrap(<div className="p-2 text-xs text-zinc-500 font-mono">Unknown: {node.type}</div>);
  }
}

interface CanvasProps extends CanvasCtx {
  tree: AdaptedNode[];
  rootId: string;
  viewport: Viewport;
  zoom: number;
  setZoom: (z: number) => void;
}

export function Canvas({ tree, rootId, viewport, zoom, setZoom, selectedId, hoveredId, setSelected, setHovered, dragOver, setDragOver, onDrop }: CanvasProps) {
  const widths: Record<Viewport, number> = { desktop: 1280, tablet: 834, mobile: 390 };
  const frameWidth = widths[viewport];
  const ctx: CanvasCtx = { selectedId, hoveredId, setSelected, setHovered, dragOver, setDragOver, onDrop };

  return (
    <main className="flex-1 min-w-0 flex flex-col bg-[#0e0e10] relative overflow-hidden">
      {/* Canvas toolbar */}
      <div className="h-9 shrink-0 bg-[#111113] border-b border-zinc-800/80 flex items-center px-3 gap-3 text-[12px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Breakpoint</span>
          <span className="text-zinc-200 capitalize font-medium">{viewport}</span>
          <span className="text-zinc-600 font-mono">· {frameWidth}px</span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <button className="flex items-center gap-1 hover:text-zinc-200">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          Grid
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 rounded-[5px] p-0.5">
          <button onClick={() => setZoom(Math.max(0.25, +(zoom - 0.1).toFixed(2)))} className="h-5 w-5 grid place-items-center rounded-[3px] hover:bg-zinc-800 text-zinc-400">−</button>
          <span className="px-1.5 text-[11px] font-mono text-zinc-300 min-w-[42px] text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))} className="h-5 w-5 grid place-items-center rounded-[3px] hover:bg-zinc-800 text-zinc-400">+</button>
        </div>
        <button onClick={() => setZoom(1)} className="text-zinc-500 hover:text-zinc-200 font-mono">Fit</button>
      </div>

      {/* Canvas scroll area */}
      <div
        className="flex-1 overflow-auto relative"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        onClick={() => setSelected(null)}
      >
        <div className="min-h-full min-w-full grid place-items-start justify-center py-10 px-10">
          <div
            className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-sm"
            style={{ width: frameWidth, transform: `scale(${zoom})`, transformOrigin: "top center", transition: "width 150ms ease" }}
            onDragOver={e => { e.preventDefault(); setDragOver("__root__"); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => { e.preventDefault(); onDrop(rootId); }}
          >
            <div className="absolute ml-2 -translate-y-5 text-[11px] font-mono text-zinc-500 flex items-center gap-2">
              <span className="text-zinc-300">Home</span>
              <span>·</span>
              <span>{frameWidth}px</span>
            </div>

            <div className={`min-h-[900px] relative ${dragOver === "__root__" ? "outline outline-2 outline-dashed outline-blue-500/70 outline-offset-[-2px]" : ""}`}>
              {tree.length ? (
                tree.map(n => renderElement(n, ctx))
              ) : (
                <div className="h-[900px] grid place-items-center">
                  <div className="text-center">
                    <div className="h-16 w-16 mx-auto mb-3 rounded-lg border-2 border-dashed border-zinc-300 grid place-items-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                    <div className="text-sm text-zinc-500">Drop a component to start</div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-mono">or click "Add" to browse the library</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="h-6 shrink-0 bg-[#111113] border-t border-zinc-800/80 flex items-center px-3 gap-4 text-[11px] text-zinc-500 font-mono">
        <span>{countNodes(tree)} elements</span>
        <span>·</span>
        <span>{viewport}</span>
        <span>·</span>
        <span>zoom {Math.round(zoom * 100)}%</span>
        <div className="flex-1" />
        <span>{selectedId ? `#${selectedId.slice(0, 6)}` : "no selection"}</span>
        <span>·</span>
        <span className="text-emerald-500">saved</span>
      </div>
    </main>
  );
}

function countNodes(tree: AdaptedNode[]): number {
  return tree.reduce((a, x) => a + 1 + (x.children ? countNodes(x.children) : 0), 0);
}
