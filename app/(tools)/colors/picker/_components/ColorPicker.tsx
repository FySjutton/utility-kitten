"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAll } from "../_lib/convert";

export function ColorPicker() {
    const [hex, setHex] = useState("#6d28d9");
    const [copied, setCopied] = useState<string | null>(null);
    const formats = formatAll(hex);

    const copy = async (label: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(label);
        setTimeout(() => setCopied(null), 1200);
    };

    return (
        <div className="flex flex-col gap-6 sm:flex-row">
            <label className="relative block size-48 shrink-0 cursor-pointer overflow-hidden rounded-xl border" style={{ background: hex }}>
                <input
                    type="color"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                    aria-label="Pick color"
                />
            </label>

            <ul className="flex flex-1 flex-col gap-2">
                {Object.entries(formats).map(([label, value]) => (
                    <li key={label} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
                        <span className="w-10 text-xs font-medium text-muted-foreground">{label}</span>
                        <code className="flex-1 font-mono text-sm">{value}</code>
                        <Button variant="ghost" size="icon" onClick={() => copy(label, value)} aria-label={`Copy ${label}`}>
                            {copied === label ? <Check /> : <Copy />}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
