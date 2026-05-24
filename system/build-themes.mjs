import { existsSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themesDir = join(__dirname, "themes");
const outFile = join(__dirname, "../packages/react/src/themes.css");

const BAR = "─".repeat(60);

const files = readdirSync(themesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    id: entry.name,
    file: join(themesDir, entry.name, "theme.json"),
  }))
  .filter(({ file }) => existsSync(file))
  .sort((a, b) => {
    if (a.id === "base") return -1;
    if (b.id === "base") return 1;
    return a.id.localeCompare(b.id);
  });

let css = `/* Generated from system theme folders — do not edit directly.\n`;
css += `   To update: edit the JSON files, then run: npm run build:themes */\n`;

for (const { id, file } of files) {
  const theme = JSON.parse(readFileSync(file, "utf8"));
  const name = theme.name ?? id;

  css += `\n/* ${BAR}\n`;
  css += `   ${name}\n`;
  if (theme.description) css += `   ${theme.description}\n`;
  css += `   ${BAR} */\n\n`;

  for (const [selector, properties] of Object.entries(theme.selectors ?? {})) {
    css += `${selector} {\n`;
    for (const [prop, value] of Object.entries(properties)) {
      if (value === "") continue;
      css += `  ${prop}: ${value};\n`;
    }
    css += `}\n\n`;
  }
}

writeFileSync(outFile, css);
console.log(`✔︎ themes.css  (${files.length} theme file${files.length !== 1 ? "s" : ""})`);
