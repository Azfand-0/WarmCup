// Tells TypeScript that CSS side-effect imports (e.g. import './globals.css') are valid.
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
