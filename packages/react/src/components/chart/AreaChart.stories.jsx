import { AreaChart } from "./Chart.jsx";

const monthlyData = [
  { month: "Jan", revenue: 32, expenses: 18, forecast: 26 },
  { month: "Feb", revenue: 40, expenses: 22, forecast: 30 },
  { month: "Mar", revenue: 36, expenses: 24, forecast: 34 },
  { month: "Apr", revenue: 48, expenses: 28, forecast: 39 },
  { month: "May", revenue: 56, expenses: 32, forecast: 45 },
  { month: "Jun", revenue: 64, expenses: 36, forecast: 52 },
];

const sampleSeries = [
  { key: "revenue", label: "Revenue", tone: "accent" },
  { key: "expenses", label: "Expenses", tone: "warn" },
  { key: "forecast", label: "Forecast", tone: "info" },
];

const meta = {
  title: "Components/Recharts/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: monthlyData,
    xKey: "month",
    series: sampleSeries,
    title: "Capacity allocation",
    description: "Stacked area chart using A1 semantic series tones.",
    height: "md",
    curve: "monotone",
    stacked: true,
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

export const Unstacked = {
  args: {
    stacked: false,
    title: "Forecast bands",
    description: "Unstacked area series compare independent measures.",
  },
};
