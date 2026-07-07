import { RadialBarChart } from "./Chart.jsx";
import { categoricalData } from "./chartSamples.js";

export default {
  title: "Components/Recharts/RadialBarChart",
  component: RadialBarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: categoricalData,
    title: "Goal progress",
    description: "Progress by team against the same target.",
    height: "md",
    showLegend: true,
    showTooltip: true,
  },
};

export const Default = {};
