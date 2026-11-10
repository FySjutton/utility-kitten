import { Badge } from "@/components/ui/badge";
import type { ToolStatus } from "@/lib/tools/types";

export function StatusBadge({ status }: { status: ToolStatus }) {
    if (status === "beta") return <Badge variant="secondary" className="bg-blue-500 text-white">Beta</Badge>;
    if (status === "alpha") return <Badge variant="destructive">Alpha</Badge>;
    return null;
}
