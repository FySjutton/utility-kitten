"use client";

import {useState} from "react";
import {getAllIn, getCategory, getChildren, isEmpty, search, type Listing as ListingData} from "@/lib/tools/registry";
import { Section } from "@/components/node-grid";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

export function CategoryBrowser({ scope }: { scope: string }) {
    const [view, setView] = useState("this");
    const [query, setQuery] = useState("");
    const [global, setGlobal] = useState(false);

    const scopeName = scope ? getCategory(scope)?.name : undefined;
    const searching = query.trim() !== "";

    let content;
    if (searching) {
        const results = search(query, global ? "" : scope);
        content = isEmpty(results) ? (
            <p className="text-muted-foreground">No results for “{query}”.</p>
        ) : (
            <Listing listing={results} />
        );
    } else {
        const listing = view == "all" ? getAllIn(scope) : getChildren(scope);
        content = isEmpty(listing) ? (
            <p className="text-muted-foreground">No tools here yet.</p>
        ) : (
            <Listing listing={listing} />
        );
    }

    return (
        <div>
            <div className="flex">
                <Tabs value={view} onValueChange={v => setView(v)} className="m-4 ml-0">
                    <TabsList className="flex-wrap h-auto">
                        <TabsTrigger value="this">Overview</TabsTrigger>
                        <TabsTrigger value="all">View All</TabsTrigger>
                    </TabsList>
                </Tabs>

                <SearchInput
                    query={query}
                    onQueryChange={setQuery}
                    global={global}
                    onGlobalChange={setGlobal}
                    scopeName={scopeName}
                />
            </div>
            {content}
        </div>
    );
}

function Listing({ listing }: { listing: ListingData }) {
    return (
        <>
            <Section title="Categories" items={listing.categories} />
            <Section title="Tools" items={listing.tools} />
            <Section title="External" items={listing.external} />
        </>
    );
}
