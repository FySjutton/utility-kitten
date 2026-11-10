import type { ReactNode } from "react";
import type { ToolMeta } from "@/lib/tools/types";
import { StatusBadge } from "@/components/status-badge";

export function ToolPage({ meta, children }: { meta: ToolMeta; children: ReactNode }) {
    const Icon = meta.icon;
    return (
        <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <Icon className="size-7 shrink-0 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">{meta.name}</h1>
                    <StatusBadge status={meta.status} />
                </div>
                <p className="mt-2 text-muted-foreground">{meta.description}</p>
            </header>
            {children}
        </div>
    );
}
