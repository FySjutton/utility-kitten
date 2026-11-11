import { Palette } from "lucide-react";
import { defineCategory } from "@/lib/tools/types";
import picker from "./picker/meta";

export default defineCategory({
    slug: "colors",
    name: "Colors",
    description: "Pick, convert and play with colors.",
    icon: Palette,
    keywords: ["colour"],
    categories: [],
    tools: [picker],
    external: [
        {
            name: "Coolors",
            url: "https://coolors.co",
            description: "Generate color palettes.",
            keywords: ["palette", "generator"],
        },
    ],
});
