import type { Metadata } from "next";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import type { CategoryMeta, ExternalLink, ToolMeta } from "./types";
import rootCategories from "@/app/(tools)/categories";

type Base = {
    path: string;
    href: string;
    parentPath: string | null;
};

export type ToolNode = ToolMeta & Base & { kind: "tool"; parentPath: string };

export type ExternalNode = ExternalLink & Base & { kind: "external"; icon: NonNullable<ExternalLink["icon"]>; parentPath: string };

export type CategoryNode = Omit<CategoryMeta, "categories" | "tools" | "external"> &
    Base & {
        kind: "category";
        categories: CategoryNode[];
        tools: ToolNode[];
        external: ExternalNode[];
    };

export type RegistryNode = CategoryNode | ToolNode | ExternalNode;

const categoriesByPath = new Map<string, CategoryNode>();
const toolsByPath = new Map<string, ToolNode>();
const externals: ExternalNode[] = [];
const nodesByMeta = new Map<ToolMeta | CategoryMeta, CategoryNode | ToolNode>();

function buildCategory(meta: CategoryMeta, parentPath: string | null): CategoryNode {
    const path = parentPath ? `${parentPath}/${meta.slug}` : meta.slug;

    const { categories = [], tools = [], external = [], ...rest } = meta;
    const node: CategoryNode = { ...rest, kind: "category", path, href: `/${path}`, parentPath, categories: [], tools: [], external: [] };
    categoriesByPath.set(path, node);
    nodesByMeta.set(meta, node);

    node.tools = tools.map((toolMeta) => {
        const toolPath = `${path}/${toolMeta.slug}`;
        const tool: ToolNode = { ...toolMeta, kind: "tool", path: toolPath, href: `/${toolPath}`, parentPath: path };
        toolsByPath.set(toolPath, tool);
        nodesByMeta.set(toolMeta, tool);
        return tool;
    });

    node.external = external.map((link) => {
        const ext: ExternalNode = {
            ...link,
            kind: "external",
            icon: link.icon ?? ExternalLinkIcon,
            path: `${path}#${link.url}`,
            href: link.url,
            parentPath: path,
        };
        externals.push(ext);
        return ext;
    });

    node.categories = categories.map((c) => buildCategory(c, path));
    return node;
}

const roots = rootCategories.map((c) => buildCategory(c, null));

export function getTree(): CategoryNode[] {
    return roots;
}

export function getTool(path: string): ToolNode | undefined {
    return toolsByPath.get(normalize(path));
}

export function getCategory(path: string): CategoryNode | undefined {
    return categoriesByPath.get(normalize(path));
}

export function getNode(meta: ToolMeta): ToolNode;
export function getNode(meta: CategoryMeta): CategoryNode;
export function getNode(meta: ToolMeta | CategoryMeta): CategoryNode | ToolNode {
    const node = nodesByMeta.get(meta);
    if (!node) {
        throw new Error(`"${meta.name}" isn't listed.`);
    }
    return node;
}

export function getBreadcrumbs(pathname: string): (CategoryNode | ToolNode)[] {
    const segments = normalize(pathname).split("/").filter(Boolean);
    const crumbs: (CategoryNode | ToolNode)[] = [];
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

export type Listing = { categories: CategoryNode[]; tools: ToolNode[]; external: ExternalNode[] };

const inScope = (node: RegistryNode, scope: string) =>
    !scope || node.path.startsWith(scope + "/") || node.parentPath === scope;
const listed = (tools: ToolNode[]) => tools.filter((t) => !t.unlisted);

export function getChildren(scope = ""): Listing {
    scope = normalize(scope);
    if (!scope) return { categories: roots, tools: [], external: [] };
    const c = categoriesByPath.get(scope);
    return { categories: c?.categories ?? [], tools: listed(c?.tools ?? []), external: c?.external ?? [] };
}

export function getAllIn(scope = ""): Listing {
    scope = normalize(scope);
    const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
    return {
        categories: [],
        tools: listed([...toolsByPath.values()]).filter((t) => inScope(t, scope)).sort(byName),
        external: externals.filter((e) => inScope(e, scope)).sort(byName),
    };
}

export function matches(node: RegistryNode, query: string): boolean {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return true;
    const haystack = [
        node.name,
        node.description ?? "",
        ...(node.keywords ?? []),
        ...(node.parentPath ? getBreadcrumbs(node.parentPath).map((c) => c.name) : []),
    ]
        .join(" ")
        .toLowerCase();
    return words.every((w) => haystack.includes(w));
}

export function search(query: string, scope = ""): Listing {
    scope = normalize(scope);
    if (!query.trim()) return { categories: [], tools: [], external: [] };
    const hit = (n: RegistryNode) => inScope(n, scope) && matches(n, query);
    return {
        categories: [...categoriesByPath.values()].filter((c) => c.path !== scope && hit(c)),
        tools: listed([...toolsByPath.values()]).filter(hit),
        external: externals.filter(hit),
    };
}

export function isEmpty(listing: Listing): boolean {
    return listing.categories.length + listing.tools.length + listing.external.length === 0;
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
        keywords: meta.keywords,
        alternates: { canonical: node.href },
    };
}

function normalize(p: string): string {
    return p.replace(/^\/+|\/+$/g, "");
}
