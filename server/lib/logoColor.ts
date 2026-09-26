import sharp from 'sharp';

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/** Pick the most common visible brand colour, ignoring white backgrounds when possible. */
export async function colorFromLogo(logoUrl: string): Promise<string | null> {
    const match = /^data:image\/(?:png|jpe?g|webp|gif|avif);base64,([A-Za-z0-9+/=]+)$/i.exec(logoUrl);
    if (!match || match[1].length > MAX_LOGO_BYTES * 4 / 3 + 8) return null;

    try {
        const input = Buffer.from(match[1], 'base64');
        if (input.length > MAX_LOGO_BYTES) return null;

        const { data, info } = await sharp(input, { limitInputPixels: 16_000_000 })
            .resize(96, 96, { fit: 'inside', kernel: 'nearest' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        type Bucket = { count: number; red: number; green: number; blue: number };
        const colorful = new Map<number, Bucket>();
        const neutral = new Map<number, Bucket>();

        for (let i = 0; i < data.length; i += info.channels) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const alpha = data[i + 3];
            if (alpha < 128) continue;

            const max = Math.max(red, green, blue);
            const min = Math.min(red, green, blue);
            const saturated = max > 40 && (max - min) / max >= 0.14;
            // If the logo is monochrome, prefer its ink over a white background.
            if (!saturated && max > 235) continue;

            const palette = saturated ? colorful : neutral;
            const key = (red >> 4) << 8 | (green >> 4) << 4 | (blue >> 4);
            const bucket = palette.get(key) || { count: 0, red: 0, green: 0, blue: 0 };
            bucket.count++;
            bucket.red += red;
            bucket.green += green;
            bucket.blue += blue;
            palette.set(key, bucket);
        }

        const candidates = colorful.size ? colorful : neutral;
        const best = [...candidates.values()].sort((a, b) => b.count - a.count)[0];
        if (!best) return null;

        return `#${[best.red, best.green, best.blue]
            .map(total => Math.round(total / best.count).toString(16).padStart(2, '0'))
            .join('')}`;
    } catch {
        return null;
    }
}
