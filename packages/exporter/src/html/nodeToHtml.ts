import type { ComponentNode } from "@drag-builder/schema";
import { styleMapToInline } from "./styleUtils";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function attrs(obj: Record<string, string>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
    .join("");
}

function nodeToHtml(node: ComponentNode, indent: number): string {
  if (node.hidden) return "";

  const pad = "  ".repeat(indent);
  const style = styleMapToInline(node.styles);
  const styleAttr = style ? ` style="${escapeHtml(style)}"` : "";
  const p = node.props as Record<string, unknown>;

  const children = node.children
    .map((c) => nodeToHtml(c, indent + 1))
    .filter(Boolean)
    .join("\n");

  const wrap = (tag: string, extraAttrs = "", content = children): string => {
    if (!content) return `${pad}<${tag}${styleAttr}${extraAttrs}></${tag}>`;
    return `${pad}<${tag}${styleAttr}${extraAttrs}>\n${content}\n${pad}</${tag}>`;
  };

  const textContent = (tag: string): string => {
    const text = escapeHtml(String(p.content ?? ""));
    return `${pad}<${tag}${styleAttr}>${text}</${tag}>`;
  };

  switch (node.type) {
    case "text":
      return textContent("p");

    case "heading": {
      const level = Math.min(Math.max(Number(p.level ?? 2), 1), 6);
      return textContent(`h${level}`);
    }

    case "button": {
      const href = String(p.href ?? "");
      const label = escapeHtml(String(p.label ?? "Button"));
      if (href) {
        return `${pad}<a${styleAttr}${attrs({ href, rel: "noopener noreferrer" })}>${label}</a>`;
      }
      return `${pad}<button${styleAttr} type="button">${label}</button>`;
    }

    case "image": {
      const src = String(p.src ?? "");
      const alt = escapeHtml(String(p.alt ?? ""));
      return `${pad}<img${styleAttr}${attrs({ src, alt })} loading="lazy" />`;
    }

    case "divider":
      return `${pad}<hr${styleAttr} />`;

    case "container":
    case "section":
      return wrap(node.type === "section" ? "section" : "div");

    case "flex":
    case "grid":
      return wrap("div");

    case "form":
      return wrap("form");

    case "input": {
      const type = String(p.type ?? "text");
      const placeholder = escapeHtml(String(p.placeholder ?? ""));
      const name = escapeHtml(String(p.name ?? ""));
      return `${pad}<input${styleAttr}${attrs({ type, placeholder, name })} />`;
    }

    case "textarea": {
      const placeholder = escapeHtml(String(p.placeholder ?? ""));
      const name = escapeHtml(String(p.name ?? ""));
      return `${pad}<textarea${styleAttr}${attrs({ placeholder, name })}></textarea>`;
    }

    case "select": {
      const name = escapeHtml(String(p.name ?? ""));
      return wrap("select", attrs({ name }));
    }

    case "checkbox": {
      const name = escapeHtml(String(p.name ?? ""));
      const label = escapeHtml(String(p.label ?? ""));
      return `${pad}<label${styleAttr}><input type="checkbox"${attrs({ name })} /> ${label}</label>`;
    }

    default:
      return wrap("div");
  }
}

export { nodeToHtml };
