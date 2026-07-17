// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=656-986
// source=packages/react/src/components/inline/inline.css
// component=Inline (semantic inline elements)
import figma from "figma";

const instance = figma.selectedInstance;
const element = instance.getEnum("Element", {
  kbd: "kbd",
  mark: "mark",
});
const text = instance.getString("Text") || "Ctrl";

function escapeText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export default {
  id: "a1-inline",
  imports: [],
  example: figma.code`<${element || "kbd"}>${escapeText(text)}</${element || "kbd"}>`,
  metadata: {
    props: {
      omittedProps: ["className", "style"],
      figmaGaps: [
        "Inline is not a React component — inline.css styles the semantic elements (kbd, mark, code, cite, del, var, time, q) globally. The Figma set represents the kbd and mark treatments.",
        "mark colors bind to the color/inline/markBackground and color/inline/markForeground variables (component.heading.markHighlight tokens; identical in dark mode).",
      ],
    },
  },
};
