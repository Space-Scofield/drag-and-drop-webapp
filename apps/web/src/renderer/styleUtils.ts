import type { StyleMap, CSSProperties, Breakpoint } from "@drag-builder/schema";

const BP_ORDER: Breakpoint[] = ["base", "sm", "md", "lg", "xl", "2xl"];

const BP_MIN_WIDTH: Record<Breakpoint, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

function getCurrentBreakpoint(width: number): Breakpoint {
  let current: Breakpoint = "base";
  for (const bp of BP_ORDER) {
    if (width >= BP_MIN_WIDTH[bp]) current = bp;
  }
  return current;
}

export function resolveStyles(styleMap: StyleMap, viewportWidth: number): React.CSSProperties {
  const activeBp = getCurrentBreakpoint(viewportWidth);
  const activeBpIdx = BP_ORDER.indexOf(activeBp);

  const merged: CSSProperties = {};
  for (let i = 0; i <= activeBpIdx; i++) {
    const bp = BP_ORDER[i];
    const styles = styleMap[bp];
    if (styles) Object.assign(merged, styles);
  }

  return merged as React.CSSProperties;
}
