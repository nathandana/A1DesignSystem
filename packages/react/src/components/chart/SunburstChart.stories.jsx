import { SunburstChart } from "./Chart.jsx";
import { sunburstData } from "./chartSamples.js";

export default {
  title: "Components/Recharts/SunburstChart",
  component: SunburstChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: sunburstData,
    title: "Product taxonomy",
    description: "Hierarchical share across product families.",
    height: "md",
    showTooltip: true,
  },
};

export const Default = {};
