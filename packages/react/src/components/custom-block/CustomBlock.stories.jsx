import { CustomBlock } from './CustomBlock.jsx';

export default {
  title: 'Components/Layout/Custom block',
  component: CustomBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { title: 'Custom block', markup: '', css: '', js: '', height: 'md' },
  argTypes: {
    title: { control: 'text' }, markup: { control: 'text' },
    css: { control: 'text' }, js: { control: 'text' },
    height: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
};

export const Empty = {};
export const PositionedAnnotation = {
  args: {
    title: 'Positioned annotation',
    height: 'sm',
    markup: '<p class="a1-annotation">Annotation anchored inside this block</p>',
    css: '.a1-annotation { position: absolute; inset-inline-end: var(--semantic-spacing-gap-md); inset-block-end: var(--semantic-spacing-gap-md); margin: 0; color: var(--semantic-color-text-accent); font-size: var(--semantic-font-size-body-lg); }',
  },
};
export const Script = {
  args: {
    title: 'Local interaction',
    height: 'lg',
    markup: '<button type="button">Run local action</button><output aria-live="polite"></output>',
    css: 'body { padding: var(--semantic-spacing-gap-md); } button { font: inherit; min-height: var(--component-button-min-height); }',
    js: 'document.querySelector("button").addEventListener("click", () => { document.querySelector("output").textContent = " Action complete"; });',
  },
};
