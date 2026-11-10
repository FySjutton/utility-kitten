"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat, ChevronRight } from "lucide-react";
import { getBreadcrumbs, getCurrentCategory, search, type RegistryNode } from "@/lib/tools/registry";
import { SearchInput } from "@/components/search-input";

const MAX_RESULTS = 8;

export function Navbar() {
    const pathname = usePathname();
    const current = getCurrentCategory(pathname);

    const [query, setQuery] = useState("");
    const [global, setGlobal] = useState(true);
    const [open, setOpen] = useState(false);

    const [lastPath, setLastPath] = useState(pathname);
    if (pathname !== lastPath) {
        setLastPath(pathname);
        setQuery("");
        setOpen(false);
    }

    const results = search(query, global || !current ? "" : current.path);
    const items: RegistryNode[] = [...results.categories, ...results.tools].slice(0, MAX_RESULTS);
    const showResults = open && query.trim() !== "";

    return (
        <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
                <Link href="/" className="flex shrink-0 items-center gap-2 font-medium">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Cat className="size-5" />
                    </span>
                    <span className="hidden sm:inline">UtilityKitten</span>
                </Link>

                <Breadcrumbs pathname={pathname} />

                <div className="relative ml-auto w-full max-w-sm">
                    <SearchInput
                        query={query}
                        onQueryChange={(q) => {
                            setQuery(q);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        global={global}
                        onGlobalChange={setGlobal}
                        scopeName={current?.name}
                    />

                    {showResults && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                            <ul className="absolute right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border bg-popover shadow-lg">
                                {items.length === 0 && (
                                    <li className="px-3 py-2 text-sm text-muted-foreground">No results.</li>
                                )}
                                {items.map((item) => (
                                    <li key={item.path}>
                                        <Link href={item.href} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent">
                                            <item.icon className="size-4 shrink-0 text-primary" />
                                            <span className="flex-1 truncate">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.kind === "category" ? "Category" : getCurrentCategory(item.href)?.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
    const crumbs = getBreadcrumbs(pathname);
    if (crumbs.length === 0) return null;
    return (
        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm text-muted-foreground md:flex">
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
