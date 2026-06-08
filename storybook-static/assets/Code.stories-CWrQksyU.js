import{i as e}from"./preload-helper-Cs4UwXAW.js";import{r as t}from"./iframe-DZoRqkgT.js";import{n,t as r}from"./Code-B1bXRq96.js";var i,a,o,s,c,l,u,d;e((()=>{n(),i=t(),a={title:`Components/Typography/Code`,component:r,tags:[`autodocs`],parameters:{layout:`padded`},args:{children:`--semantic-color-text-default`,variant:`inline`,wrapping:!1,copyCode:!1},argTypes:{variant:{control:`inline-radio`,options:[`inline`,`block`],description:`Presentation mode. Inline is compact for prose; block renders a preformatted code surface.`},wrapping:{control:`boolean`,description:`Allow long code values to wrap.`},copyCode:{control:`boolean`,description:`Show a small tertiary copy button below the code block.`},copyText:{control:`text`,description:`Optional clipboard text override. Defaults to the rendered text children.`}}},o={},s={args:{variant:`inline`,children:`--semantic-color-text-default`},render:e=>(0,i.jsxs)(`p`,{children:[`Set the token value using `,(0,i.jsx)(r,{...e}),` in your CSS.`]})},c={args:{variant:`block`,children:`import { Button, Code } from "@gtivr4/a1-design-system-react";

export function Example() {
  return <Button icon="arrow_forward">Continue</Button>;
}`}},l={args:{variant:`block`,wrapping:!0,children:`const veryLongTokenName = "--semantic-color-action-background-hover-when-focused-and-active";`}},u={name:`Copy Code`,args:{variant:`block`,copyCode:!0,children:`npm install @gtivr4/a1-design-system-react`}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "inline",
    children: "--semantic-color-text-default"
  },
  render: args => <p>
      Set the token value using <Code {...args} /> in your CSS.
    </p>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "block",
    children: \`import { Button, Code } from "@gtivr4/a1-design-system-react";

export function Example() {
  return <Button icon="arrow_forward">Continue</Button>;
}\`
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "block",
    wrapping: true,
    children: "const veryLongTokenName = \\"--semantic-color-action-background-hover-when-focused-and-active\\";"
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Copy Code",
  args: {
    variant: "block",
    copyCode: true,
    children: \`npm install @gtivr4/a1-design-system-react\`
  }
}`,...u.parameters?.docs?.source}}},d=[`Configurable`,`Inline`,`Block`,`Wrapping`,`CopyCode`]}))();export{c as Block,o as Configurable,u as CopyCode,s as Inline,l as Wrapping,d as __namedExportsOrder,a as default};