import { createContext, useContext } from "react";

const LabelsContext = createContext({ locale: null, brand: null, labels: null });

export function LabelsProvider({ locale = null, brand = null, labels, children }) {
  return (
    <LabelsContext.Provider value={{ locale, brand, labels }}>
      {children}
    </LabelsContext.Provider>
  );
}

export function useLabel(key, defaultValue) {
  const { locale, brand, labels } = useContext(LabelsContext);
  if (!labels) return defaultValue ?? key;

  const parts = key.split(".");
  let node = labels?.label;
  for (const part of parts) {
    if (node == null || typeof node !== "object") return defaultValue ?? key;
    node = node[part];
  }
  if (node == null) return defaultValue ?? key;

  // Resolution order: locale > brand > default
  if (locale && node.locale?.[locale] != null) return node.locale[locale];
  if (brand && node.brand?.[brand] != null) return node.brand[brand];
  return node.$value ?? defaultValue ?? key;
}
