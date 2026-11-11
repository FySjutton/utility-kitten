import type { CategoryMeta } from "@/lib/tools/types";
import {getBreadcrumbs, getNode} from "@/lib/tools/registry";
import { CategoryBrowser } from "@/components/category-browser";
import {Fragment} from "react";
import {ChevronRight} from "lucide-react";
import Link from "next/link";

export function CategoryPage({ meta }: { meta: CategoryMeta }) {
    const category = getNode(meta);
    const Icon = category.icon;

    return (
        <div className="w-5xl flex flex-wrap items-center justify-center mx-auto mt-4">
            <Breadcrumbs pathname={category.path} />

            <div className="w-full flex items-center gap-3 mt-4">
                <Icon className="size-7 shrink-0 text-primary" />
                <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
            </div>
            <p className="w-full mt-2 text-muted-foreground">{category.description}</p>

            <CategoryBrowser scope={category.path} />
        </div>
    );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
    const crumbs = getBreadcrumbs(pathname);
    if (crumbs.length === 0) return null;
    return (
        <nav aria-label="Breadcrumb" className="hidden min-w-0 w-full items-center gap-1.5 text-m text-muted-foreground md:flex">
            {crumbs.map((node, i) => (
                <Fragment key={node.path}>
                    {i > 0 && <ChevronRight className="size-3.5 shrink-0" />}
                    {i === crumbs.length - 1 ? (
                        <span className="truncate font-medium text-foreground">{node.name}</span>
                    ) : (
                        <Link href={node.href} className="truncate hover:text-foreground">
                            {node.name}
                        </Link>
                    )}
                </Fragment>
            ))}
        </nav>
    );
}
