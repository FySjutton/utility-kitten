import { Pipette } from "lucide-react";
import { defineTool } from "@/lib/tools/types";

export default defineTool({
    name: "Color Picker",
    description: "Pick a color and copy it as HEX, RGB or HSL.",
    icon: Pipette,
    status: "beta",
    keywords: ["hex", "rgb", "hsl", "colour", "picker"],
});
