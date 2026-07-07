import { SankeyChart } from "./Chart.jsx";
import { sankeyData } from "./chartSamples.js";

export default {
  title: "Components/Recharts/SankeyChart",
  component: SankeyChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: sankeyData,
    title: "User journey flow",
    description: "Movement between acquisition, product, and outcome stages.",
    height: "md",
    showTooltip: true,
  },
};

export const Default = {};
