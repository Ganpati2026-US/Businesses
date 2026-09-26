import type { ScannedMenuItem } from '@/app/actions/menu';

const COMMON_CATEGORIES = [
    'starters', 'appetizers', 'soups', 'salads', 'breakfast', 'snacks', 'main course',
    'mains', 'rice', 'biryani', 'breads', 'noodles', 'pasta', 'pizza', 'burgers',
    'sandwiches', 'desserts', 'beverages', 'drinks', 'mocktails', 'shakes', 'coffee',
    'tea', 'combos', 'thali', 'south indian', 'north indian', 'chinese',
];

const titleCase = (value: string) => value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const cleanLine = (value: string) => value
    .replace(/[|•●◆]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const looksLikeCategory = (line: string) => {
    const normalized = line.toLowerCase().replace(/[^a-z ]/g, '').trim();
    if (COMMON_CATEGORIES.some((category) => normalized === category || normalized.includes(category))) return true;
    const letters = line.replace(/[^A-Za-z]/g, '');
    const uppercase = letters.length >= 3 && letters === letters.toUpperCase();
    return uppercase && line.split(/\s+/).length <= 5 && !/\d/.test(line);
};

/**
 * Convert raw OCR lines into editable menu rows. Printed menus usually place a
 * price at the end of each item line; headings become the category for rows
 * that follow them. Ambiguous text stays editable in the review screen.
 */
export function parseMenuOcrText(text: string): ScannedMenuItem[] {
    const lines = text.split(/\r?\n/).map(cleanLine).filter(Boolean);
    const items: ScannedMenuItem[] = [];
    let category = 'Other';

    for (const line of lines) {
        if (looksLikeCategory(line)) {
            category = titleCase(line.replace(/[^A-Za-z& ]/g, '').trim()).slice(0, 80) || 'Other';
            continue;
        }

        // Accept ₹250, Rs. 250, INR 250, dotted leaders, or a plain trailing price.
        const match = line.match(/^(.*?)\s*(?:\.{2,}|[-–—:]\s*)?(?:₹|Rs\.?|INR)?\s*(\d{1,5}(?:[.,]\d{1,2})?)\s*\/?-?\s*$/i);
        if (!match) {
            const previous = items[items.length - 1];
            if (previous && line.length >= 4 && line.length <= 180 && !/^(menu|tax|gst|phone|contact|address)\b/i.test(line)) {
                previous.description = [previous.description, line].filter(Boolean).join(' ').slice(0, 500);
            }
            continue;
        }

        const name = match[1]
            .replace(/\.{2,}$/g, '')
            .replace(/^\d+[.)]\s*/, '')
            .trim();
        const price = Number(match[2].replace(',', '.'));
        if (!name || name.length > 120 || !Number.isFinite(price) || price <= 0 || price > 100000) continue;
        if (/^(total|subtotal|tax|gst|service charge|phone|contact)$/i.test(name)) continue;

        items.push({
            name: titleCase(name),
            description: '',
            price: Math.round(price * 100) / 100,
            category,
        });
        if (items.length === 100) break;
    }

    return items;
}
