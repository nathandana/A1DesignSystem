// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=663-1009
// source=packages/react/src/components/tabs/Tabs.jsx
// component=Tabs (Tab item set + Tabs line strip)
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("Variant", {
  line: "line",
  pills: "pills",
  segment: "segment",
  progress: "progress",
  folder: "folder",
});

const variantProp = variant && variant !== "line" ? ` variant="${variant}"` : "";

export default {
  id: "a1-tabs",
  imports: ['import { Tabs, TabList, Tab, TabPanel } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Tabs value="overview" onChange={setTab}${variantProp}>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="specifications">Specifications</Tab>
    <Tab value="reviews">Reviews</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
</Tabs>`,
  metadata: {
    props: {
      visualStates: ["State"],
      omittedProps: ["level", "size", "equalHeight", "labelMode", "onChange", "className"],
      figmaGaps: [
        "The Tab item set carries the five variants (line/pills/segment/folder × default|active; progress adds State=completed). Selecting a Tab item emits the parent Tabs usage.",
        "Tab icon/count/iconPosition, progress error/warn statuses, overflow scrolling, and panels are runtime-owned.",
        "The Tabs strip component composes line Tab items over the bottom hairline; build pills/segment/folder strips by composing Tab items in an auto-layout row.",
      ],
    },
  },
};
