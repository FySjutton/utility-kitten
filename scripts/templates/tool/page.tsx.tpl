import meta from "./meta";
import { toolMetadata } from "@/lib/tools/registry";
import { ToolPage } from "@/components/tool-page";

export const metadata = toolMetadata(meta);

export default function {{component}}Page() {
    return (
        <ToolPage meta={meta}>
            <p className="text-muted-foreground">{{name}}.</p>
        </ToolPage>
    );
}
