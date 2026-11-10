
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "./generate-registry.mjs";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS_DIR = path.join(PROJECT_ROOT, "app", "(tools)");
const TEMPLATES = path.join(PROJECT_ROOT, "scripts", "templates");

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function fail(msg) {
    console.error(`✖ ${msg}`);
    process.exit(1);
}

const titleCase = (slug) => slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const pascalCase = (slug) => titleCase(slug).replace(/ /g, "");

function fill(templateFile, vars) {
    const src = fs.readFileSync(path.join(TEMPLATES, templateFile), "utf8");
    return src.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

function writeNew(file, content) {
    if (fs.existsSync(file)) fail(`${path.relative(PROJECT_ROOT, file)} finns redan.`);
    fs.writeFileSync(file, content);
    console.log(`  + ${path.relative(PROJECT_ROOT, file)}`);
}

const args = process.argv.slice(2);
const nameFlag = args.indexOf("--name");
const displayName = nameFlag !== -1 ? args[nameFlag + 1] : undefined;
const positional = nameFlag === -1 ? args : args.filter((_, i) => i !== nameFlag && i !== nameFlag + 1);
const [categoryPath, slug] = positional;

if (!categoryPath || !slug) {
    fail('Användning: npm run new:tool <kategori/sökväg> <tool-slug> [-- --name "Namn"]\n  t.ex. npm run new:tool games/minecraft inventory-calculator');
}

const categorySegments = categoryPath.replace(/^\/+|\/+$/g, "").split("/");
for (const s of [...categorySegments, slug]) {
    if (!SLUG.test(s)) fail(`"${s}" is not a valid slug. Use lowercase, numbers and -.`);
}

let dir = TOOLS_DIR;
for (const segment of categorySegments) {
    dir = path.join(dir, segment);
    if (fs.existsSync(path.join(dir, "meta.ts"))) fail(`${path.relative(PROJECT_ROOT, dir)} is a tool, not a category.`);
    if (!fs.existsSync(path.join(dir, "category.ts"))) {
        fs.mkdirSync(dir, { recursive: true });
        const vars = { name: titleCase(segment), component: pascalCase(segment) };
        writeNew(path.join(dir, "category.ts"), fill("category/category.ts.tpl", vars));
        writeNew(path.join(dir, "page.tsx"), fill("category/page.tsx.tpl", vars));
    }
}

const toolDir = path.join(dir, slug);
if (fs.existsSync(path.join(toolDir, "meta.ts")) || fs.existsSync(path.join(toolDir, "category.ts"))) {
    fail(`${path.relative(PROJECT_ROOT, toolDir)} already exists.`);
}
fs.mkdirSync(path.join(toolDir, "_components"), { recursive: true });
fs.mkdirSync(path.join(toolDir, "_lib"), { recursive: true });
const vars = { name: displayName ?? titleCase(slug), component: pascalCase(slug) };
writeNew(path.join(toolDir, "meta.ts"), fill("tool/meta.ts.tpl", vars));
writeNew(path.join(toolDir, "page.tsx"), fill("tool/page.tsx.tpl", vars));

if (!generate()) process.exit(1);
console.log(`\nDone! Open /${[...categorySegments, slug].join("/")} and fill in meta.ts.`);
