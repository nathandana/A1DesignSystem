// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=218-1176
// source=packages/react/src/components/menu/Menu.jsx
// component=MenuItem
import figma from "figma"

const instance = figma.selectedInstance

const label = instance.getString("Label") || "Menu item"
const shortcut = instance.getString("Shortcut") || ""
const showIcon = instance.getBoolean("Show icon")
const showShortcut = instance.getBoolean("Show shortcut")
const state = instance.getEnum("State", {
  default: "default",
  hover: "hover",
  focus: "focus",
  pressed: "pressed",
  active: "active",
  disabled: "disabled",
  destructive: "destructive",
})

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function stringProp(name: string, value: string | undefined, defaultValue = "") {
  return value && value !== defaultValue ? ` ${name}="${escapeAttr(value)}"` : ""
}

function booleanProp(name: string, value: boolean) {
  return value ? ` ${name}` : ""
}

const iconName = state === "destructive" ? "delete" : "more_vert"
const iconProp = showIcon ? stringProp("icon", iconName) : ""
const shortcutProp = showShortcut ? stringProp("shortcut", shortcut) : ""
const activeProp = booleanProp("active", state === "active")
const disabledProp = booleanProp("disabled", state === "disabled")
const variantProp = state === "destructive" ? ' variant="destructive"' : ""

export default {
  id: "a1-menu-item",
  imports: ['import { MenuItem } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<MenuItem${iconProp}${shortcutProp}${activeProp}${disabledProp}${variantProp}>${escapeAttr(label)}</MenuItem>`,
  metadata: {
    nestable: true,
    props: {
      visualStates: ["hover", "focus", "pressed"],
      iconMapping: "Icon instance swaps are visual; this template emits more_vert by default and delete for the destructive state.",
      omittedProps: ["href", "onClick", "className", "style", "aria-*", "ref"],
    },
  },
}
