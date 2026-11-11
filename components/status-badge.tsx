import { Badge } from "@/components/ui/badge";
import type { ToolStatus } from "@/lib/tools/types";
import {ArrowUpRightIcon} from "lucide-react";

export function StatusBadge({ status }: { status: ToolStatus }) {
    if (status === "beta") return <Badge variant="secondary" className="bg-blue-500 text-white">Beta</Badge>;
    if (status === "alpha") return <Badge variant="destructive">Alpha</Badge>;
    if (status === "external") return <Badge asChild><p>External <ArrowUpRightIcon data-icon="inline-end" /></p></Badge>;

    return null;
}
