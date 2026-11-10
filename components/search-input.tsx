"use client";

import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

export function SearchInput({
    query,
    onQueryChange,
    global,
    onGlobalChange,
    scopeName,
    placeholder = "Search tools...",
    onFocus,
}: {
    query: string;
    onQueryChange: (q: string) => void;
    global: boolean;
    onGlobalChange: (global: boolean) => void;
    scopeName?: string;
    placeholder?: string;
    onFocus?: () => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <InputGroup>
                <InputGroupInput
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder={!global && scopeName ? `Search in ${scopeName}...` : placeholder}
                    type="search"
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>
            {scopeName && (
                <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => onGlobalChange(!global)}
                    title="Toggle search scope"
                >
                    {global ? "Everywhere" : `In ${scopeName}`}
                </Button>
            )}
        </div>
    );
}
