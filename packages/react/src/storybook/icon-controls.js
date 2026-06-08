import iconRegistry from "../../../../system/icons/material-symbols.json";

export const ICON_REGISTRY = iconRegistry;
export const ICON_OPTIONS = iconRegistry.icons.map((icon) => icon.name);

export function iconArgType(description = "A1 icon name") {
  return {
    control: "select",
    options: [undefined, ...ICON_OPTIONS],
    description,
  };
}

export function requiredIconArgType(description = "A1 icon name") {
  return {
    control: "select",
    options: ICON_OPTIONS,
    description,
  };
}
