/** Choose readable text for a solid six-digit brand colour. */
export function contrastTextColor(hex: string): string {
    const match = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!match) return '#ffffff';
    const channels = [0, 2, 4].map((index) => {
        const value = parseInt(match[1].slice(index, index + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    return luminance > 0.179 ? '#18181b' : '#ffffff';
}
