// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=283-1121
// source=packages/react/src/components/radio-group/RadioGroup.jsx
// component=RadioGroup
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label") || "Subscription plan";
const hint = instance.getString("Helper") || "";
const required = instance.getBoolean("Required");
const size = instance.getEnum("Size", {
  comfortable: "comfortable",
  default: "default",
  compact: "compact",
});

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function stringProp(
  name: string,
  value: string | undefined,
  defaultValue = "",
) {
  return value && value !== defaultValue
    ? ` ${name}="${escapeAttr(value)}"`
    : "";
}

function booleanProp(name: string, value: boolean) {
  return value ? ` ${name}` : "";
}

const labelProp = stringProp("label", label);
const hintProp = stringProp("hint", hint);
const sizeProp = stringProp("size", size, "default");
const requiredProp = booleanProp("required", required);

export default {
  id: "a1-radio-group",
  imports: ['import { RadioGroup } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<RadioGroup${labelProp}${hintProp}${sizeProp}${requiredProp} defaultValue="starter" options={[{ value: "starter", label: "Starter" }, { value: "professional", label: "Professional" }, { value: "enterprise", label: "Enterprise" }]} />`,
  metadata: {
    props: {
      omittedProps: [
        "inline",
        "name",
        "value",
        "onChange",
        "error",
        "disabled",
        "className",
        "id",
        "aria-*",
        "ref",
      ],
      figmaGaps: [
        "Radio Items is a slot composed from Radio Option instances; its option copy, state, and selected value do not map to a single parent property.",
      ],
    },
  },
};
