import { z } from "zod";
import { ComponentNodeSchema } from "./node";

export const TreeSchema = z.object({
  root: ComponentNodeSchema,
  version: z.number().int().default(1),
});

export const PageSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  tree: TreeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  pages: z.array(PageSchema).min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Tree = z.infer<typeof TreeSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Project = z.infer<typeof ProjectSchema>;
