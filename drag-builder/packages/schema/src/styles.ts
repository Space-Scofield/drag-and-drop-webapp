import { z } from "zod";

export const CSSPropertiesSchema = z.object({
  // Layout
  display: z.string().optional(),
  position: z.enum(["static", "relative", "absolute", "fixed", "sticky"]).optional(),
  top: z.string().optional(),
  right: z.string().optional(),
  bottom: z.string().optional(),
  left: z.string().optional(),
  zIndex: z.number().optional(),
  // Box model
  width: z.string().optional(),
  height: z.string().optional(),
  minWidth: z.string().optional(),
  minHeight: z.string().optional(),
  maxWidth: z.string().optional(),
  maxHeight: z.string().optional(),
  margin: z.string().optional(),
  marginTop: z.string().optional(),
  marginRight: z.string().optional(),
  marginBottom: z.string().optional(),
  marginLeft: z.string().optional(),
  padding: z.string().optional(),
  paddingTop: z.string().optional(),
  paddingRight: z.string().optional(),
  paddingBottom: z.string().optional(),
  paddingLeft: z.string().optional(),
  // Flexbox
  flexDirection: z.enum(["row", "row-reverse", "column", "column-reverse"]).optional(),
  flexWrap: z.enum(["nowrap", "wrap", "wrap-reverse"]).optional(),
  justifyContent: z.string().optional(),
  alignItems: z.string().optional(),
  gap: z.string().optional(),
  flex: z.string().optional(),
  // Typography
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.union([z.string(), z.number()]).optional(),
  lineHeight: z.union([z.string(), z.number()]).optional(),
  letterSpacing: z.string().optional(),
  textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
  color: z.string().optional(),
  // Visual
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  borderRadius: z.string().optional(),
  border: z.string().optional(),
  boxShadow: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
  overflow: z.enum(["visible", "hidden", "scroll", "auto"]).optional(),
});

export const Breakpoint = z.enum(["base", "sm", "md", "lg", "xl", "2xl"]);

export const StyleMapSchema = z.record(Breakpoint, CSSPropertiesSchema);

export type CSSProperties = z.infer<typeof CSSPropertiesSchema>;
export type Breakpoint = z.infer<typeof Breakpoint>;
export type StyleMap = z.infer<typeof StyleMapSchema>;
