import { z } from "zod";
import { StyleMapSchema } from "./styles";

export const ComponentType = z.enum([
  // Primitives
  "text",
  "heading",
  "image",
  "button",
  "link",
  "divider",
  "icon",
  // Layout
  "container",
  "section",
  "grid",
  "flex",
  // Forms
  "input",
  "textarea",
  "select",
  "checkbox",
  "form",
  // Media
  "video",
  "carousel",
  "map",
]);

export const ComponentPropsSchema = z.record(z.string(), z.unknown());

export const ComponentNodeSchema: z.ZodType<ComponentNode> = z.lazy(() =>
  z.object({
    id: z.string().uuid(),
    type: ComponentType,
    name: z.string().optional(),
    props: ComponentPropsSchema,
    styles: StyleMapSchema,
    children: z.array(ComponentNodeSchema),
    locked: z.boolean().optional(),
    hidden: z.boolean().optional(),
  })
);

export interface ComponentNode {
  id: string;
  type: z.infer<typeof ComponentType>;
  name?: string;
  props: Record<string, unknown>;
  styles: z.infer<typeof StyleMapSchema>;
  children: ComponentNode[];
  locked?: boolean;
  hidden?: boolean;
}

export type ComponentType = z.infer<typeof ComponentType>;
