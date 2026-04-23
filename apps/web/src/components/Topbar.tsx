"use client";
import { useState } from "react";

type Viewport = "desktop" | "tablet" | "mobile";

interface TopbarProps {
  projectName: string;
  onRename: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  viewport: Viewport;
  setViewport: (v: Viewport) => void;
  onPreview: () => void;
  onExport: () => void;
}

export function Topbar({ projectName, onRename, canUndo, canRedo, onUndo, onRedo, viewport, setViewport, onPreview, onExport }: TopbarProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(projectName);

  const IconBtn = ({ children, onClick, disabled, title }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; title?: string }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-7 w-7 grid place-items-center rounded-[5px] transition-colors text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200 ${disabled ? "opacity-30 pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );

  const viewports: { id: Viewport; w: number; h: number; label: string }[] = [
    { id: "desktop", w: 14, h: 10, label: "Desktop" },
    { id: "tablet",  w: 10, h: 12, label: "Tablet" },
    { id: "mobile",  w: 7,  h: 12, label: "Mobile" },
  ];

  return (
    <header className="h-11 shrink-0 bg-[#111113] border-b border-zinc-800/80 flex items-center px-2 gap-1 text-[13px] text-zinc-200 select-none">
      {/* Logo + project */}
      <div className="flex items-center gap-2 pr-2">
        <div className="h-6 w-6 rounded-[5px] bg-gradient-to-br from-blue-500 to-blue-600 grid place-items-center text-white font-semibold text-[11px] tracking-tight">
          Fb
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="hover:text-zinc-200 cursor-pointer">Acme Co</span>
          <span className="text-zinc-600">/</span>
          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => { setEditing(false); onRename(name); }}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              className="bg-zinc-800 border border-blue-500 outline-none rounded-[3px] px-1 py-0.5 text-zinc-100 w-48"
            />
          ) : (
            <span
              onDoubleClick={() => setEditing(true)}
              className="text-zinc-100 font-medium hover:bg-zinc-800/70 px-1 py-0.5 rounded-[3px] cursor-text"
            >
              {name}
            </span>
          )}
          <span className="ml-1 text-[11px] text-zinc-500 font-mono">v1</span>
        </div>
      </div>

      <div className="h-5 w-px bg-zinc-800" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5 px-1">
        <IconBtn title="Undo (⌘Z)" onClick={onUndo} disabled={!canUndo}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>
        </IconBtn>
        <IconBtn title="Redo (⌘⇧Z)" onClick={onRedo} disabled={!canRedo}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>
        </IconBtn>
      </div>

      <div className="h-5 w-px bg-zinc-800" />

      {/* Pages */}
      <button className="flex items-center gap-1.5 px-2 h-7 rounded-[5px] hover:bg-zinc-800/70 text-zinc-300">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        <span>Home</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-[6px] p-0.5">
          {viewports.map(v => (
            <button
              key={v.id}
              onClick={() => setViewport(v.id)}
              className={`px-2.5 h-6 flex items-center gap-1.5 rounded-[4px] text-[12px] transition-colors ${viewport === v.id ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x={(16 - v.w) / 2} y={(16 - v.h) / 2} width={v.w} height={v.h} rx="1"/>
              </svg>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-1.5 px-2 h-7 rounded-[5px] text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>
          Share
        </button>
        <button onClick={onPreview} className="flex items-center gap-1.5 px-2.5 h-7 rounded-[5px] text-zinc-200 hover:bg-zinc-800/70 border border-zinc-800">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview
        </button>
        <button onClick={onExport} className="flex items-center gap-1.5 px-3 h-7 rounded-[5px] bg-blue-600 hover:bg-blue-500 text-white font-medium">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
          Publish
        </button>
        <div className="h-5 w-px bg-zinc-800 mx-1" />
        <div className="flex items-center -space-x-1.5 pr-1">
          <div className="h-6 w-6 rounded-full bg-emerald-600 border-2 border-[#111113] grid place-items-center text-[10px] font-semibold text-white">JS</div>
          <div className="h-6 w-6 rounded-full bg-amber-600 border-2 border-[#111113] grid place-items-center text-[10px] font-semibold text-white">MK</div>
        </div>
      </div>
    </header>
  );
}
