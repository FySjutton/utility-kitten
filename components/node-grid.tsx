import type { RegistryNode } from "@/lib/tools/registry";
import { StatusBadge } from "@/components/status-badge";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";

export function NodeGrid({ items }: { items: RegistryNode[] }) {
    return (
        <div className="flex flex-wrap gap-4">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <Link href={item.href} key={item.path}>
                        <Card className="min-w-80 max-w-120">
                            <CardHeader className="flex">
                                <Icon className="size-5 shrink-0 text-primary" />
                                <span className="font-medium">{item.name}</span>
                                {item.kind === "tool" && <StatusBadge status={item.status} />}
                                {item.kind === "external" && <StatusBadge status={"external"} />}
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
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
