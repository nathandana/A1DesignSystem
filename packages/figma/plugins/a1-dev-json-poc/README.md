# A1 JSON Dev Mode POC

This is a deliberately small Figma Dev Mode codegen plugin. It does not open
an iframe or depend on the main A1:Figma plugin.

## Try it in Figma

1. Switch to Dev Mode after importing the manifest. (The manifest is also
   available to the design-mode loader so Figma can import it from either
   editor.)
2. Choose **Plugins → Development → Import plugin from manifest…**.
3. Select this directory's `manifest.json`.
4. In the Inspect panel, choose **A1 JSON** as the code language.
5. Select a Button instance. The **A1 Button JSON** section will show the JSON
   representation. Other selections return a small generic selection object.

Button output is generated from the live Figma instance: component properties,
label text, icon configuration, and full-width layer metadata are serialized
through the same shared Button contract used by the main A1:Figma exporter.
Other selections return a small generic selection object until their exporter
is added to the shared layer.

Rebuild after changing either plugin's shared serializer:

```sh
node packages/figma/plugins/a1-dev-json-poc/scripts/build.mjs
```
