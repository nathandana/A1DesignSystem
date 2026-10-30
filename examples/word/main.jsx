import React from "react";
import { createRoot } from "react-dom/client";
import "../../packages/react/src/utilities/sr-only.css";
import "./styles.css";
import { App } from "./src/App.jsx";

createRoot(document.getElementById("root")).render(<App />);
