"use client";

// Serialize source as data, never as HTML in the host document or bootstrap.
function scriptData(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
}

/** Self-contained document for an opaque-origin, allow-scripts-only iframe. */
export function customBlockDocument({ markup, css, js, title, environment }) {
  const payload = scriptData({ markup, css, js, title, environment });
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'">
</head><body><script>
(() => {
  const { markup, css, js, title, environment } = ${payload};
  document.title = title;
  document.documentElement.lang = environment.lang;
  document.documentElement.dir = environment.dir;
  for (const [name, value] of Object.entries(environment.variables)) {
    document.documentElement.style.setProperty(name, value);
  }
  const reset = document.createElement('style');
  reset.textContent = 'html { min-height: 100%; } body { margin: 0; min-height: 100vh; position: relative; } *, *::before, *::after { box-sizing: border-box; }';
  document.head.append(reset);
  // Defaults belong in a stylesheet so authored body typography can override them.
  Object.assign(reset.sheet.cssRules[1].style, environment.body);
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
  const content = document.createElement('template');
  content.innerHTML = markup;
  document.body.append(content.content);
  const script = document.createElement('script');
  script.textContent = js;
  document.body.append(script);
})();
</script></body></html>`;
}
