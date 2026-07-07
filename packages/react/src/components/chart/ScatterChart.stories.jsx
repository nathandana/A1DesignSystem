import { ScatterChart } from "./Chart.jsx";
import { scatterSeries } from "./chartSamples.js";

export default {
  title: "Components/Recharts/ScatterChart",
  component: ScatterChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    xKey: "x",
    yKey: "y",
    zKey: "z",
    series: scatterSeries,
    title: "Opportunity quality",
    description: "Deal value compared with confidence score.",
    height: "md",
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    showXAxis: true,
    showYAxis: true,
  },
};

export const Default = {};
