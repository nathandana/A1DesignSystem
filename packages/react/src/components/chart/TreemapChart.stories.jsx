import { TreemapChart } from "./Chart.jsx";
import { hierarchyData } from "./chartSamples.js";

export default {
  title: "Components/Recharts/TreemapChart",
  component: TreemapChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: hierarchyData,
    title: "Portfolio allocation",
    description: "Nested allocation by business area.",
    height: "md",
    showTooltip: true,
  },
};

export const Default = {};
