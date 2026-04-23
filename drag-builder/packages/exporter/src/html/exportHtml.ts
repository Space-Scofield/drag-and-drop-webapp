import type { ComponentNode } from "@drag-builder/schema";
import { nodeToHtml } from "./nodeToHtml";

export interface HtmlExportOptions {
  title?: string;
  lang?: string;
  charset?: string;
  meta?: Record<string, string>;
  injectCss?: string;
  includeViewport?: boolean;
}

export function exportToHtml(
  root: ComponentNode,
  options: HtmlExportOptions = {}
): string {
  const {
    title = "Untitled",
    lang = "en",
    charset = "UTF-8",
    meta = {},
    injectCss = "",
    includeViewport = true,
  } = options;

  const body = nodeToHtml(root, 2);

  const metaTags = Object.entries(meta)
    .map(([name, content]) => `    <meta name="${name}" content="${content}" />`)
    .join("\n");

  const viewportTag = includeViewport
    ? `    <meta name="viewport" content="width=device-width, initial-scale=1" />`
    : "";

  const styleBlock = injectCss
    ? `    <style>\n${injectCss}\n    </style>`
    : "";

  const baseReset = `    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: system-ui, sans-serif; }
    </style>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="${charset}" />
${viewportTag}
    <title>${title}</title>
${baseReset}
${metaTags}
${styleBlock}
  </head>
  <body>
${body}
  </body>
</html>`;
}
