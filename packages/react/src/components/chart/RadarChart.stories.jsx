import { RadarChart } from "./Chart.jsx";
import { radarData, radarSeries } from "./chartSamples.js";

export default {
  title: "Components/Recharts/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: radarData,
    axisKey: "capability",
    series: radarSeries,
    title: "Capability profile",
    description: "Current and target scores by capability.",
    height: "md",
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    showAngleAxis: true,
    showRadiusAxis: true,
  },
};

export const Default = {};
