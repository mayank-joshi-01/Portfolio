// "Build" check for a static site with no bundler: verifies that what GitHub Pages will serve is wired up.
import { readFile } from "node:fs/promises";
import { cueNames } from "uisfx";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const installed = JSON.parse(
  await readFile(new URL("node_modules/uisfx/package.json", root), "utf8"),
).version;
const failures = [];

const map = html.match(/<script type="importmap">(.*?)<\/script>/s);
const cdn = map && JSON.parse(map[1]).imports.uisfx;
const pinned = cdn && cdn.match(/uisfx@(\d+\.\d+\.\d+)\//);
if (!pinned)
  failures.push("index.html: import map must pin uisfx to an exact version");
else {
  if (pinned[1] !== pkg.dependencies.uisfx)
    failures.push(
      `import map pins uisfx@${pinned[1]} but package.json has ${pkg.dependencies.uisfx}`,
    );
  if (pinned[1] !== installed)
    failures.push(
      `import map pins uisfx@${pinned[1]} but node_modules has ${installed}`,
    );
}
if (
  map &&
  html.indexOf('<script type="importmap">') >
    html.indexOf('<script type="module">')
)
  failures.push(
    "index.html: the import map must come before the module script",
  );
if (!/import \{boot\} from '\.\/sfx\.js'/.test(html))
  failures.push("index.html: sfx.js is not booted");

for (const m of html.matchAll(/sfx\((?:[^?;]*\?'([a-z-]+)':)?'([a-z-]+)'/g))
  for (const cue of m.slice(1).filter(Boolean))
    if (!cueNames.includes(cue)) failures.push(`unknown cue "${cue}"`);
if ((html.match(/data-sound-toggle/g) || []).length < 1)
  failures.push("index.html: no sound toggle");

// the module must load in Node too (no DOM access at import time)
await import(new URL("sfx.js", root).href);

if (failures.length) {
  console.error(failures.map((f) => "✗ " + f).join("\n"));
  process.exit(1);
}
console.log(`✓ site check passed (uisfx@${installed}, pack "mechanical")`);
