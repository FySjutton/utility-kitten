import type { LucideIcon } from "lucide-react";

export type ToolStatus = "released" | "beta" | "alpha";

export interface ToolMeta {
    name: string;
    description: string;
    icon: LucideIcon;
    status: ToolStatus;
    keywords?: string[];
    order?: number;
    unlisted?: boolean;
}

export interface CategoryMeta {
    name: string;
    description: string;
    icon: LucideIcon;
    keywords?: string[];
    order?: number;
}

export function defineTool(meta: ToolMeta): ToolMeta {
    return meta;
}

export function defineCategory(meta: CategoryMeta): CategoryMeta {
    return meta;
}
