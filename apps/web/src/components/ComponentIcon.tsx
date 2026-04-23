"use client";

const s = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function ComponentIcon({ type }: { type: string }) {
  switch (type) {
    case "container": return <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
    case "section":   return <svg {...s}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18"/></svg>;
    case "grid":      return <svg {...s}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "flex":      return <svg {...s}><rect x="3" y="7" width="5" height="10"/><rect x="10" y="7" width="5" height="10"/><rect x="17" y="7" width="4" height="10"/></svg>;
    case "heading":   return <svg {...s}><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/></svg>;
    case "text":      return <svg {...s}><path d="M4 6h16"/><path d="M4 12h12"/><path d="M4 18h16"/></svg>;
    case "button":    return <svg {...s}><rect x="3" y="8" width="18" height="8" rx="2"/><path d="M8 12h8"/></svg>;
    case "link":      return <svg {...s}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>;
    case "image":     return <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>;
    case "divider":   return <svg {...s}><path d="M3 12h18"/></svg>;
    case "input":     return <svg {...s}><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 12h1"/></svg>;
    case "textarea":  return <svg {...s}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 9h6M7 13h10"/></svg>;
    case "checkbox":  return <svg {...s}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 3 3 5-6"/></svg>;
    case "select":    return <svg {...s}><rect x="3" y="8" width="18" height="8" rx="1"/><path d="m15 11 2 2 2-2"/></svg>;
    default:          return <svg {...s}><rect x="4" y="4" width="16" height="16"/></svg>;
  }
}
