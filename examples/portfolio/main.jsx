import "../../build/css/tokens.css";
import "../../packages/react/src/themes.css";
import "../../packages/react/src/color-scheme.css";
import "../../packages/react/src/utilities/spacing.css";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
