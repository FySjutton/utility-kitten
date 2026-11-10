import meta from "./meta";
import { toolMetadata } from "@/lib/tools/registry";
import { ToolPage } from "@/components/tool-page";
import { ColorPicker } from "./_components/ColorPicker";

export const metadata = toolMetadata(meta);

export default function PickerPage() {
    return (
        <ToolPage meta={meta}>
            <ColorPicker />
        </ToolPage>
    );
}
