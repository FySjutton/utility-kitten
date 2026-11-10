export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

export function hexToRgb(hex: string): Rgb {
    const n = parseInt(hex.replace("#", ""), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
    const [rn, gn, bn] = [r / 255, g / 255, b / 255];
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) };

    const s = d / (1 - Math.abs(2 * l - 1));
    let h: number;
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;

    return { h: Math.round((h * 60 + 360) % 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function formatAll(hex: string) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    return {
        HEX: hex.toUpperCase(),
        RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
}
