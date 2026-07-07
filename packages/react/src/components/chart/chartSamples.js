export const categoricalData = [
  { name: "Organic", value: 420, tone: "accent" },
  { name: "Referral", value: 280, tone: "info" },
  { name: "Partner", value: 190, tone: "success" },
  { name: "Paid", value: 120, tone: "warn" },
  { name: "Other", value: 80, tone: "neutral" },
];

export const scatterSeries = [
  {
    key: "enterprise",
    label: "Enterprise",
    tone: "accent",
    data: [
      { x: 42, y: 64, z: 18 },
      { x: 58, y: 72, z: 24 },
      { x: 67, y: 82, z: 28 },
      { x: 76, y: 86, z: 34 },
    ],
  },
  {
    key: "midmarket",
    label: "Midmarket",
    tone: "info",
    data: [
      { x: 30, y: 48, z: 16 },
      { x: 44, y: 58, z: 20 },
      { x: 56, y: 62, z: 22 },
      { x: 70, y: 74, z: 26 },
    ],
  },
];

export const radarData = [
  { capability: "Reach", current: 76, target: 88 },
  { capability: "Quality", current: 82, target: 90 },
  { capability: "Speed", current: 68, target: 84 },
  { capability: "Retention", current: 72, target: 86 },
  { capability: "Expansion", current: 64, target: 80 },
];

export const radarSeries = [
  { key: "current", label: "Current", tone: "accent" },
  { key: "target", label: "Target", tone: "info" },
];

export const hierarchyData = [
  {
    name: "Acquisition",
    children: [
      { name: "Organic", value: 420 },
      { name: "Paid", value: 180 },
      { name: "Partner", value: 240 },
    ],
  },
  {
    name: "Product",
    children: [
      { name: "Core", value: 360 },
      { name: "Add-ons", value: 170 },
      { name: "Services", value: 120 },
    ],
  },
];

export const sunburstData = {
  name: "Products",
  children: [
    {
      name: "Platform",
      children: [
        { name: "Core", value: 360 },
        { name: "Automation", value: 180 },
      ],
    },
    {
      name: "Services",
      children: [
        { name: "Strategy", value: 140 },
        { name: "Support", value: 220 },
      ],
    },
  ],
};

export const sankeyData = {
  nodes: [
    { name: "Visit" },
    { name: "Trial" },
    { name: "Demo" },
    { name: "Active" },
    { name: "Lost" },
  ],
  links: [
    { source: 0, target: 1, value: 340 },
    { source: 0, target: 2, value: 220 },
    { source: 1, target: 3, value: 190 },
    { source: 1, target: 4, value: 150 },
    { source: 2, target: 3, value: 140 },
    { source: 2, target: 4, value: 80 },
  ],
};
