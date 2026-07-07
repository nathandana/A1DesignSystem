import { FunnelChart } from "./Chart.jsx";
import { categoricalData } from "./chartSamples.js";

export default {
  title: "Components/Recharts/FunnelChart",
  component: FunnelChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: categoricalData,
    title: "Conversion funnel",
    description: "Prospects remaining at each lifecycle stage.",
    height: "md",
    showLegend: true,
    showTooltip: true,
  },
};

export const Default = {};
