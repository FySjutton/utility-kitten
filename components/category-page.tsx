import type { CategoryMeta } from "@/lib/tools/types";
import { getNode } from "@/lib/tools/registry";
import { CategoryBrowser } from "@/components/category-browser";

export function CategoryPage({ meta }: { meta: CategoryMeta }) {
    const category = getNode(meta);
    const Icon = category.icon;

    return (
        <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <Icon className="size-7 shrink-0 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
                </div>
                <p className="mt-2 text-muted-foreground">{category.description}</p>
            </header>
            <CategoryBrowser scope={category.path} />
        </div>
    );
}
