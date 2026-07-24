// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=762-125
// source=packages/react/src/components/choice-group/ChoiceGroup.jsx
// component=ChoiceGroup
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Label") || "Choose a plan";
const required = instance.getBoolean("Required");
const helper = instance.getBoolean("Show helper") ? instance.getString("Helper") : "";
const size = instance.getString("Size") || "default";

function escapeAttr(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const requiredProp = required ? "\n  required" : "";
const hintProp = helper ? `\n  hint="${escapeAttr(helper)}"` : "";
const sizeProp = size && size !== "default" ? `\n  size="${escapeAttr(size)}"` : "";

export default {
  id: "a1-choice-group",
  imports: ['import { ChoiceGroup } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<ChoiceGroup
  label="${escapeAttr(label)}"${requiredProp}${hintProp}${sizeProp}
  value={plan}
  onChange={setPlan}
  options={[
    { value: "starter", label: "Starter", icon: "rocket_launch", subtext: "For individuals" },
    { value: "pro", label: "Pro", icon: "workspace_premium", subtext: "For small teams" },
    { value: "team", label: "Team", icon: "groups", subtext: "Up to 50 seats" },
    { value: "enterprise", label: "Enterprise", icon: "domain", subtext: "Contact sales", disabled: true },
  ]}
/>`,
  metadata: {
    props: {
      visualStates: ["State", "Type", "Size"],
      omittedProps: ["multiple", "columns", "inlineIcon", "sections", "error", "success", "value", "onChange", "className"],
      figmaGaps: [
        "The parent Choice Group set exposes Size=compact|default|comfortable and syncs the nested Choice Option tile density.",
        "Tiles compose Choice Option instances (Type=radio|checkbox × State=default|selected|disabled × Size=compact|default|comfortable) with Label, Show indicator, Show icon + Icon swap, and Show subtext + Subtext properties; option values are runtime data.",
        "multiple maps to the checkbox Type on each tile; responsive columns are stored on the embedded Options Grid metadata; labeled sections with dividers, inlineIcon layout, and error/success group messages are runtime-owned.",
        "Selected tiles bind the action surface with a 2px accent border and a filled indicator (dot for radio, check for checkbox); disabled tiles are the raised surface at 50%.",
      ],
    },
  },
};
