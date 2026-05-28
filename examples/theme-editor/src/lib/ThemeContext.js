import { createContext } from "react";
import { DEFAULT_COLORS } from "./colorUtils.js";

export const ThemeContext = createContext({
  colors: DEFAULT_COLORS,
  updateColor: () => {},
});
