"use client";

import { useState } from "react";
import { getAllToolsIn, getCategory, getChildren, search } from "@/lib/tools/registry";
import { Section } from "@/components/node-grid";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";

export function CategoryBrowser({ scope }: { scope: string }) {
    const [viewAll, setViewAll] = useState(false);
    const [query, setQuery] = useState("");
    const [global, setGlobal] = useState(false);

    const scopeName = scope ? getCategory(scope)?.name : undefined;
    const searching = query.trim() !== "";

    let content;
    if (searching) {
        const results = search(query, global ? "" : scope);
        const empty = results.categories.length === 0 && results.tools.length === 0;
        content = empty ? (
            <p className="text-muted-foreground">No results for “{query}”.</p>
        ) : (
            <>
                <Section title="Categories" items={results.categories} />
                <Section title="Tools" items={results.tools} />
            </>
        );
    } else if (viewAll) {
        content = <Section title="All tools" items={getAllToolsIn(scope)} />;
    } else {
        const { categories, tools } = getChildren(scope);
        content = (
            <>
                <Section title="Categories" items={categories} />
                <Section title="Tools" items={tools} />
                {categories.length === 0 && tools.length === 0 && (
                    <p className="text-muted-foreground">No tools here yet.</p>
                )}
            </>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1">
                    <Button variant={viewAll ? "ghost" : "secondary"} size="sm" onClick={() => setViewAll(false)}>
                        Overview
                    </Button>
                    <Button variant={viewAll ? "secondary" : "ghost"} size="sm" onClick={() => setViewAll(true)}>
                        View All
                    </Button>
                </div>
                <div className="sm:w-96">
                    <SearchInput
                        query={query}
                        onQueryChange={setQuery}
                        global={global}
                        onGlobalChange={setGlobal}
                        scopeName={scopeName}
                    />
                </div>
            </div>
            {content}
        </div>
    );
}
