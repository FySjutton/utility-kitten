import type { Metadata } from "next";
import type { CategoryMeta, ToolMeta, ToolStatus } from "./types";
import { categoryEntries, toolEntries } from "./registry.generated";

export type ToolNode = ToolMeta & {
    kind: "tool";
    /** "games/minecraft/inventory-calculator" */
    path: string;
    /** "/games/minecraft/inventory-calculator" */
    href: string;
    /** "inventory-calculator" */
    slug: string;
    parentPath: string;
};

export type CategoryNode = CategoryMeta & {
    kind: "category";
    path: string;
    href: string;
    slug: string;
    /** null för toppnivå-kategorier */
    parentPath: string | null;
    categories: CategoryNode[];
    tools: ToolNode[];
};

export type RegistryNode = ToolNode | CategoryNode;

const STATUS_ORDER: Record<ToolStatus, number> = { released: 0, beta: 1, alpha: 2 };

const parentOf = (p: string) => p.split("/").slice(0, -1).join("/");
const slugOf = (p: string) => p.split("/").pop()!;
const byOrderThenName = (a: { order?: number; name: string }, b: { order?: number; name: string }) =>
    (a.order ?? Infinity) - (b.order ?? Infinity) || a.name.localeCompare(b.name);

const categoriesByPath = new Map<string, CategoryNode>();
const toolsByPath = new Map<string, ToolNode>();
const nodesByMeta = new Map<ToolMeta | CategoryMeta, RegistryNode>();

for (const { path, meta } of categoryEntries) {
    const node: CategoryNode = {
        ...meta,
        kind: "category",
        path,
        href: `/${path}`,
        slug: slugOf(path),
        parentPath: parentOf(path) || null,
        categories: [],
        tools: [],
    };
    categoriesByPath.set(path, node);
    nodesByMeta.set(meta, node);
}

for (const { path, meta } of toolEntries) {
    const node: ToolNode = {
        ...meta,
        kind: "tool",
        path,
        href: `/${path}`,
        slug: slugOf(path),
        parentPath: parentOf(path),
    };
    toolsByPath.set(path, node);
    nodesByMeta.set(meta, node);
    categoriesByPath.get(node.parentPath)?.tools.push(node);
}

const roots: CategoryNode[] = [];
for (const cat of categoriesByPath.values()) {
    if (cat.parentPath === null) roots.push(cat);
    else categoriesByPath.get(cat.parentPath)?.categories.push(cat);
}

for (const cat of categoriesByPath.values()) {
    cat.categories.sort(byOrderThenName);
    cat.tools.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || byOrderThenName(a, b));
}
roots.sort(byOrderThenName);

export function getTree(): CategoryNode[] {
    return roots;
}

export function getAllTools(): ToolNode[] {
    return [...toolsByPath.values()];
}

export function getTool(path: string): ToolNode | undefined {
    return toolsByPath.get(normalize(path));
}

export function getCategory(path: string): CategoryNode | undefined {
    return categoriesByPath.get(normalize(path));
}

export function getNode(meta: ToolMeta): ToolNode;
export function getNode(meta: CategoryMeta): CategoryNode;
export function getNode(meta: ToolMeta | CategoryMeta): RegistryNode {
    const node = nodesByMeta.get(meta);
    if (!node) throw new Error(`"${meta.name}" finns inte i registret. Kör \`npm run registry\`.`);
    return node;
}

export function getBreadcrumbs(pathname: string): RegistryNode[] {
    const segments = normalize(pathname).split("/").filter(Boolean);
    const crumbs: RegistryNode[] = [];
    for (let i = 1; i <= segments.length; i++) {
        const p = segments.slice(0, i).join("/");
        const node = categoriesByPath.get(p) ?? toolsByPath.get(p);
        if (node) crumbs.push(node);
    }
    return crumbs;
}

export function getCurrentCategory(pathname: string): CategoryNode | undefined {
    return getBreadcrumbs(pathname).filter((n): n is CategoryNode => n.kind === "category").pop();
}

export type Listing = { categories: CategoryNode[]; tools: ToolNode[] };

const inScope = (node: RegistryNode, scope: string) => !scope || node.path.startsWith(scope + "/");
const listed = (tools: ToolNode[]) => tools.filter((t) => !t.unlisted);

export function getChildren(scope = ""): Listing {
    scope = normalize(scope);
    if (!scope) return { categories: roots, tools: [] };
    const category = categoriesByPath.get(scope);
    return { categories: category?.categories ?? [], tools: listed(category?.tools ?? []) };
}

export function getAllToolsIn(scope = ""): ToolNode[] {
    scope = normalize(scope);
    return listed(getAllTools())
        .filter((t) => inScope(t, scope))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export function matches(node: RegistryNode, query: string): boolean {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return true;
    const haystack = [
        node.name,
        node.description,
        ...(node.keywords ?? []),
        ...(node.parentPath ? getBreadcrumbs(node.parentPath).map((c) => c.name) : []),
    ]
        .join(" ")
        .toLowerCase();
    return words.every((w) => haystack.includes(w));
}

export function search(query: string, scope = ""): Listing {
    scope = normalize(scope);
    if (!query.trim()) return { categories: [], tools: [] };
    return {
        categories: [...categoriesByPath.values()].filter((c) => inScope(c, scope) && matches(c, query)),
        tools: listed(getAllTools()).filter((t) => inScope(t, scope) && matches(t, query)),
    };
}

export function toolMetadata(meta: ToolMeta): Metadata {
    const node = getNode(meta);
    return {
        title: meta.name,
        description: meta.description,
        keywords: meta.keywords,
        alternates: { canonical: node.href },
        robots: meta.unlisted ? { index: false } : undefined,
    };
}

export function categoryMetadata(meta: CategoryMeta): Metadata {
    const node = getNode(meta);
    return {
        title: meta.name,
        description: meta.description,
        alternates: { canonical: node.href },
    };
}

function normalize(p: string): string {
    return p.replace(/^\/+|\/+$/g, "");
}
