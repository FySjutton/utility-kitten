import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS_DIR = path.join(PROJECT_ROOT, "app", "(tools)");
const TEMPLATES = path.join(PROJECT_ROOT, "scripts", "templates");
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const fail = (msg) => {
    console.error(`✖ ${msg}`);
    process.exit(1);
};
const titleCase = (slug) => slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const pascalCase = (slug) => titleCase(slug).replace(/ /g, "");
const camelCase = (slug) => pascalCase(slug).replace(/^./, (c) => c.toLowerCase());
const rel = (p) => path.relative(PROJECT_ROOT, p);

function fill(templateFile, vars) {
    return fs
        .readFileSync(path.join(TEMPLATES, templateFile), "utf8")
        .replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

function writeNew(file, content) {
    if (fs.existsSync(file)) fail(`${rel(file)} already exists.`);
    fs.writeFileSync(file, content);
    console.log(`  + ${rel(file)}`);
}

const args = process.argv.slice(2);
const nameFlag = args.indexOf("--name");
const displayName = nameFlag === -1 ? undefined : args[nameFlag + 1];
const [categoryPath, slug] = nameFlag === -1 ? args : args.filter((_, i) => i !== nameFlag && i !== nameFlag + 1);

if (!categoryPath || !slug) {
    fail('Usage: npm run new:tool <category/path> <tool-slug> [-- --name "Name"]');
}
const segments = categoryPath.replace(/^\/+|\/+$/g, "").split("/");
for (const s of [...segments, slug]) {
    if (!SLUG.test(s)) fail(`"${s}" isn't a valid slug.`);
}

const todo = [];
let dir = TOOLS_DIR;
let parentFile = path.join(TOOLS_DIR, "categories.ts");

for (const segment of segments) {
    dir = path.join(dir, segment);
    const categoryFile = path.join(dir, "category.ts");
    if (!fs.existsSync(categoryFile)) {
        fs.mkdirSync(dir, { recursive: true });
        const vars = { slug: segment, name: titleCase(segment), component: pascalCase(segment) };
        writeNew(categoryFile, fill("category/category.ts.tpl", vars));
        writeNew(path.join(dir, "page.tsx"), fill("category/page.tsx.tpl", vars));
        todo.push({
            file: parentFile,
            line: `import ${camelCase(segment)} from "./${segment}/category";`,
            list: parentFile.endsWith("categories.ts") ? "export default [...]" : "categories: [...]",
            name: camelCase(segment),
        });
    }
    parentFile = categoryFile;
}

const toolDir = path.join(dir, slug);
if (fs.existsSync(toolDir)) fail(`${rel(toolDir)} finns redan.`);
fs.mkdirSync(path.join(toolDir, "_components"), { recursive: true });
fs.mkdirSync(path.join(toolDir, "_lib"), { recursive: true });
const vars = { slug, name: displayName ?? titleCase(slug), component: pascalCase(slug) };
writeNew(path.join(toolDir, "meta.ts"), fill("tool/meta.ts.tpl", vars));
writeNew(path.join(toolDir, "page.tsx"), fill("tool/page.tsx.tpl", vars));
todo.push({
    file: parentFile,
    line: `import ${camelCase(slug)} from "./${slug}/meta";`,
    list: "tools: [...]",
    name: camelCase(slug),
});

console.log("\nAdd for it to be seen:");
for (const t of todo) {
    console.log(`\n  ${rel(t.file)}`);
    console.log(`    ${t.line}`);
    console.log(`    and ${t.name} in ${t.list}`);
}
console.log();
