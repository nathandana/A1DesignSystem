// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=656-991
// source=packages/react/src/components/code/Code.jsx
// component=Code
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("Variant", {
  inline: "inline",
  block: "block",
});
const text = instance.getString("Code text") || "npm run build:tokens";

function escapeText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const variantProp = variant === "block" ? ' variant="block"' : "";

export default {
  id: "a1-code",
  imports: ['import { Code } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Code${variantProp}>${escapeText(text)}</Code>`,
  metadata: {
    props: {
      omittedProps: ["className", "style", "onChangeValue", "copyText"],
      figmaGaps: [
        "copyCode, editable, rows, lineNumbers, and wrapping are runtime behaviors — the Figma component shows the inline chip and the bordered block panel only.",
        "Code text uses the Code/sm text style (Source Code Pro 14) standing in for the ui-monospace token stack.",
      ],
    },
  },
};
