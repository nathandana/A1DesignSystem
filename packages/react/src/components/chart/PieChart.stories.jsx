import { PieChart } from "./Chart.jsx";
import { categoricalData } from "./chartSamples.js";

export default {
  title: "Components/Recharts/PieChart",
  component: PieChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: categoricalData,
    title: "Traffic mix",
    description: "Channel share grouped by source.",
    height: "md",
    showLegend: true,
    showTooltip: true,
  },
};

export const Default = {};
