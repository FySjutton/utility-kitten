import meta from "./category";
import { categoryMetadata } from "@/lib/tools/registry";
import { CategoryPage } from "@/components/category-page";

export const metadata = categoryMetadata(meta);

export default function {{component}}CategoryPage() {
    return <CategoryPage meta={meta} />;
}
