"use client";
import { useState } from "react";
import { ComponentIcon } from "./ComponentIcon";
import type { AdaptedNode } from "./types";

const COMPONENT_LIBRARY = [
  {
    group: "Layout",
    items: [
      { type: "container", label: "Container", hint: "div" },
      { type: "section",   label: "Section",   hint: "section" },
      { type: "grid",      label: "Grid",       hint: "grid" },
      { type: "flex",      label: "Flex Row",   hint: "flex" },
    ],
  },
  {
    group: "Basic",
    items: [
      { type: "heading",  label: "Heading",  hint: "h1–h6" },
      { type: "text",     label: "Text",     hint: "p" },
      { type: "button",   label: "Button",   hint: "btn" },
      { type: "link",     label: "Link",     hint: "a" },
      { type: "image",    label: "Image",    hint: "img" },
      { type: "divider",  label: "Divider",  hint: "hr" },
    ],
  },
  {
    group: "Form",
    items: [
      { type: "input",    label: "Input",    hint: "text" },
      { type: "textarea", label: "Textarea", hint: "multi" },
      { type: "checkbox", label: "Checkbox", hint: "bool" },
      { type: "select",   label: "Select",   hint: "dropdown" },
    ],
  },
];

interface LeftSidebarProps {
  onDragStart: (e: React.DragEvent, item: { type: string; label: string }) => void;
  tree: AdaptedNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function LeftSidebar({ onDragStart, tree, selectedId, onSelect, activeTab, setActiveTab }: LeftSidebarProps) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: "components", label: "Add" },
    { id: "layers",     label: "Layers" },
    { id: "assets",     label: "Assets" },
  ];

  return (
    <aside className="w-[260px] shrink-0 bg-[#141416] border-r border-zinc-800/80 flex flex-col text-zinc-300 select-none">
      {/* Tabs */}
      <div className="h-9 shrink-0 border-b border-zinc-800/80 flex items-center px-1 gap-0.5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-2.5 h-7 text-[12px] rounded-[5px] font-medium transition-colors ${activeTab === t.id ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <button className="h-7 w-7 grid place-items-center rounded-[5px] text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-300">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>

      {activeTab === "components" && (
        <>
          <div className="p-2 border-b border-zinc-800/80">
            <div className="relative">
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search components…"
                className="w-full h-7 pl-7 pr-2 bg-zinc-900 border border-zinc-800 rounded-[5px] text-[12px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {COMPONENT_LIBRARY.map(group => {
              const filtered = group.items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
              if (!filtered.length) return null;
              const isCollapsed = collapsed[group.group];
              return (
                <div key={group.group} className="mb-1">
                  <button
                    onClick={() => setCollapsed(c => ({ ...c, [group.group]: !c[group.group] }))}
                    className="w-full flex items-center gap-1 px-2 h-6 text-[10.5px] uppercase tracking-[0.08em] font-semibold text-zinc-500 hover:text-zinc-300"
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${isCollapsed ? "-rotate-90" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
                    {group.group}
                  </button>
                  {!isCollapsed && (
                    <div className="grid grid-cols-2 gap-1 px-1.5 pb-1">
                      {filtered.map(item => (
                        <div
                          key={item.type}
                          draggable
                          onDragStart={e => onDragStart(e, item)}
                          className="group cursor-grab active:cursor-grabbing bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-[5px] p-2 flex flex-col gap-1.5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="h-6 w-6 rounded-[4px] bg-zinc-800 group-hover:bg-zinc-700 grid place-items-center text-zinc-300">
                              <ComponentIcon type={item.type} />
                            </div>
                            <span className="text-[9.5px] font-mono text-zinc-600 group-hover:text-zinc-500">&lt;{item.hint}&gt;</span>
                          </div>
                          <div className="text-[11.5px] text-zinc-300 font-medium leading-none">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "layers" && (
        <LayersTree tree={tree} selectedId={selectedId} onSelect={onSelect} />
      )}

      {activeTab === "assets" && (
        <div className="flex-1 p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-[5px] grid place-items-center text-[10px] font-mono text-zinc-600">
                asset-{String(i).padStart(2, "0")}
              </div>
            ))}
          </div>
          <button className="mt-2 w-full h-8 border border-dashed border-zinc-700 rounded-[5px] text-[12px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-600">
            + Upload asset
          </button>
        </div>
      )}

      <div className="h-8 shrink-0 border-t border-zinc-800/80 flex items-center px-2 text-[11px] text-zinc-500 font-mono">
        <span>24 components</span>
        <div className="flex-1" />
        <span className="text-emerald-500">●</span>
        <span className="ml-1">synced</span>
      </div>
    </aside>
  );
}

function LayersTree({ tree, selectedId, onSelect }: { tree: AdaptedNode[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const renderNode = (node: AdaptedNode, depth = 0): React.ReactNode => {
    const isSelected = node.id === selectedId;
    const hasChildren = node.children.length > 0;
    return (
      <div key={node.id}>
        <div
          onClick={() => onSelect(node.id)}
          className={`flex items-center gap-1 h-6 pr-2 text-[12px] cursor-pointer ${isSelected ? "bg-blue-600/20 text-blue-300" : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"}`}
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          {hasChildren ? (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          ) : (
            <span className="w-[9px]" />
          )}
          <ComponentIcon type={node.type} />
          <span className="truncate flex-1">{node.name || node.type}</span>
          <span className="text-[9.5px] font-mono text-zinc-600">{node.type}</span>
        </div>
        {hasChildren && node.children.map(c => renderNode(c, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto py-1">
      {tree.map(n => renderNode(n))}
    </div>
  );
}
