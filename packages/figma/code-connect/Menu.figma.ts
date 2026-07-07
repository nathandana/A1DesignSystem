// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=218-1177
// source=packages/react/src/components/menu/Menu.jsx
// component=Menu
import figma from "figma"

const instance = figma.selectedInstance

const ariaLabel = instance.getString("Aria label") || "Account actions"
const sectionLabel = instance.getString("Section label") || "Account"
const showSectionLabel = instance.getBoolean("Show section label")
const showSlots = [1, 2, 3, 4, 5].map((number) => instance.getBoolean(`Show item slot ${number}`))

const defaultItems = [
  { label: "Profile", icon: "person", shortcut: "" },
  { label: "Preferences", icon: "settings", shortcut: "" },
  { label: "Command palette", icon: "keyboard", shortcut: "⌘K" },
  { label: "Archive", icon: "archive", shortcut: "" },
  { label: "Delete", icon: "delete", shortcut: "", props: ' variant="destructive"' },
]

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

function menuItem(item: { label: string; icon: string; shortcut: string; props?: string }) {
  const iconProp = stringProp("icon", item.icon)
  const shortcutProp = stringProp("shortcut", item.shortcut)
  return `    <MenuItem${iconProp}${shortcutProp}${item.props || ""}>${escapeAttr(item.label)}</MenuItem>`
}

const ariaLabelProp = stringProp("aria-label", ariaLabel, "Account actions")
const sectionLabelProp = showSectionLabel ? stringProp("label", sectionLabel) : ""
const items = defaultItems.filter((_, index) => showSlots[index]).map(menuItem).join("\n")

export default {
  id: "a1-menu",
  imports: ['import { Menu, MenuItem, MenuSection } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Menu open${ariaLabelProp}>
  <MenuSection${sectionLabelProp}>
${items}
  </MenuSection>
</Menu>`,
  metadata: {
    nestable: true,
    props: {
      slotModel: "Menu is a shell with Menu Item child slots. Edit child rows through the Menu Item component.",
      omittedProps: ["open state management", "onClose", "anchorRef", "trapFocus", "modalOnMobile", "href", "onClick", "className", "style", "aria-* other than aria-label", "ref", "arbitrary children beyond documented slots"],
    },
  },
}
