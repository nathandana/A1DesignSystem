import { ComposedChart } from "./Chart.jsx";

const monthlyData = [
  { month: "Jan", revenue: 32, expenses: 18, forecast: 26 },
  { month: "Feb", revenue: 40, expenses: 22, forecast: 30 },
  { month: "Mar", revenue: 36, expenses: 24, forecast: 34 },
  { month: "Apr", revenue: 48, expenses: 28, forecast: 39 },
  { month: "May", revenue: 56, expenses: 32, forecast: 45 },
  { month: "Jun", revenue: 64, expenses: 36, forecast: 52 },
];

const sampleSeries = [
  { key: "revenue", label: "Revenue", type: "bar", tone: "accent" },
  { key: "expenses", label: "Expenses", type: "bar", tone: "warn" },
  { key: "forecast", label: "Forecast", type: "line", tone: "info" },
];

const meta = {
  title: "Components/Recharts/ComposedChart",
  component: ComposedChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: monthlyData,
    xKey: "month",
    series: sampleSeries,
    title: "Plan against actuals",
    description: "Bars show revenue and expenses; the line shows forecast.",
    height: "md",
    curve: "monotone",
    stacked: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    showXAxis: true,
    showYAxis: true,
  },
  argTypes: {
    height: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    curve: {
      control: "inline-radio",
      options: ["linear", "monotone", "natural", "step"],
    },
    stacked: { control: "boolean" },
    showGrid: { control: "boolean" },
    showLegend: { control: "boolean" },
    showTooltip: { control: "boolean" },
    showXAxis: { control: "boolean" },
    showYAxis: { control: "boolean" },
  },
};

export default meta;

export const Default = {};

export const MixedArea = {
  args: {
    series: [
      { key: "revenue", label: "Revenue", type: "bar", tone: "accent" },
      { key: "expenses", label: "Expenses", type: "area", tone: "warn" },
      { key: "forecast", label: "Forecast", type: "line", tone: "info" },
    ],
    title: "Plan, cost, and trend",
    description: "Composed charts can mix bar, area, and line series.",
  },
};
