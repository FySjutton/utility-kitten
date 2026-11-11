import Link from "next/link";
import type { RegistryNode } from "@/lib/tools/registry";
import { StatusBadge } from "@/components/status-badge";

export function NodeGrid({ items }: { items: RegistryNode[] }) {
    return (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <li key={item.path}>
                        <Link
                            href={item.href}
                            {...(item.kind === "external" && { target: "_blank", rel: "noopener noreferrer" })}
                            className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="size-5 shrink-0 text-primary" />
                                <span className="font-medium">{item.name}</span>
                                {item.kind === "tool" && <StatusBadge status={item.status} />}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

export function Section({ title, items }: { title: string; items: RegistryNode[] }) {
    if (items.length === 0) return null;
    return (
        <section className="mb-8">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>
            <NodeGrid items={items} />
        </section>
    );
}
