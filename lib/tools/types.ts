import type { LucideIcon } from "lucide-react";

export type ToolStatus = "released" | "beta" | "alpha";

export interface ToolMeta {
    slug: string;
    name: string;
    description: string;
    icon: LucideIcon;
    status: ToolStatus;
    keywords?: string[];
    unlisted?: boolean;
}

export interface ExternalLink {
    name: string;
    url: string;
    description?: string;
    icon?: LucideIcon;
    keywords?: string[];
}

export interface CategoryMeta {
    slug: string;
    name: string;
    description: string;
    icon: LucideIcon;
    keywords?: string[];
    categories?: CategoryMeta[];
    tools?: ToolMeta[];
    external?: ExternalLink[];
}

export function defineTool(meta: ToolMeta): ToolMeta {
    return meta;
}

export function defineCategory(meta: CategoryMeta): CategoryMeta {
    return meta;
}
