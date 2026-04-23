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

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

function cssValueToString(value: unknown): string {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return String(value);
}

export function styleMapToInline(styleMap: StyleMap): string {
  const merged: CSSProperties = {};
  for (const bp of BP_ORDER) {
    const styles = styleMap[bp];
    if (styles) Object.assign(merged, styles);
  }
  return objectToCssString(merged);
}

export function objectToCssString(styles: CSSProperties): string {
  return Object.entries(styles)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${camelToKebab(k)}: ${cssValueToString(v)}`)
    .join("; ");
}

export function styleMapToMediaQueries(styleMap: StyleMap, selector: string): string {
  const blocks: string[] = [];

  for (const bp of BP_ORDER) {
    const styles = styleMap[bp];
    if (!styles || Object.keys(styles).length === 0) continue;
    const css = objectToCssString(styles);
    if (!css) continue;

    if (bp === "base") {
      blocks.push(`${selector} { ${css} }`);
    } else {
      const minW = BP_MIN_WIDTH[bp];
      blocks.push(`@media (min-width: ${minW}px) { ${selector} { ${css} } }`);
    }
  }

  return blocks.join("\n");
}
