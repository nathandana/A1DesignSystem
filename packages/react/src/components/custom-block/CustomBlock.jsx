"use client";

import { useEffect, useRef } from 'react';
import { useLabel } from '../labels/Labels.jsx';
import { customBlockDocument } from './customBlockDocument.js';
import './custom-block.css';

const stringValue = (value) => typeof value === 'string' ? value : '';

export function CustomBlock({ markup = '', css = '', js = '', title, height = 'md', className = '', ...props }) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const defaultTitle = useLabel('customBlock.name', 'Custom block');
  const frameTitle = stringValue(title).trim() || defaultTitle;
  const editing = Boolean(props['data-editor-node']);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const doc = root.ownerDocument;
    const view = doc.defaultView;
    let previousDocument;

    // Read the actual scope (including inverse/project themes), not just :root.
    // Only token values and text defaults cross the document boundary.
    const sync = () => {
      const computed = view.getComputedStyle(root);
      const variables = {};
      for (const name of computed) {
        if (/^--(?:base|semantic|component)-/.test(name)) {
          variables[name] = computed.getPropertyValue(name);
        }
      }
      const environment = {
        variables,
        lang: root.closest('[lang]')?.getAttribute('lang') || 'en',
        dir: computed.direction,
        body: {
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          lineHeight: computed.lineHeight,
          color: computed.color,
          colorScheme: computed.colorScheme,
        },
      };
      const nextDocument = customBlockDocument({
        markup: stringValue(markup), css: stringValue(css), js: stringValue(js),
        title: frameTitle, environment,
      });
      if (nextDocument !== previousDocument) {
        frame.srcdoc = nextDocument;
        previousDocument = nextDocument;
      }
    };
    sync();
    const observer = new view.MutationObserver(sync);
    for (let element = root; element; element = element.parentElement) {
      observer.observe(element, { attributes: true });
    }
    const mode = view.matchMedia('(prefers-color-scheme: dark)');
    mode.addEventListener('change', sync);
    view.addEventListener('resize', sync);
    return () => {
      observer.disconnect();
      mode.removeEventListener('change', sync);
      view.removeEventListener('resize', sync);
    };
  }, [markup, css, js, frameTitle]);

  return (
    <div {...props} ref={rootRef} className={`a1-custom-block a1-custom-block--${['sm', 'md', 'lg'].includes(height) ? height : 'md'} ${className}`.trim()}>
      <iframe
        ref={frameRef}
        className="a1-custom-block__frame"
        title={frameTitle}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        tabIndex={editing ? -1 : undefined}
        inert={editing || undefined}
      />
    </div>
  );
}
