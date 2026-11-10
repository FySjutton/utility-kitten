import { CategoryBrowser } from "@/components/category-browser";

export default function HomePage() {
    return (
        <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">UtilityKitten</h1>
                <p className="mt-2 text-muted-foreground">A collection of useful tools.</p>
            </header>
            <CategoryBrowser scope="" />
        </div>
    );
}
