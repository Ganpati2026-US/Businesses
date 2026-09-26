export interface TableVisit {
    visitId: string;
    sessionId: string;
}

const visitKey = (restaurantId: string, tableId: string) => `table_visit:${restaurantId}:${tableId}`;
const validId = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9]{32,64}$/.test(value);
const memoryVisits = new Map<string, TableVisit>();

function randomId(bytes: number): string {
    const values = new Uint8Array(bytes);
    window.crypto.getRandomValues(values);
    return Array.from(values, value => value.toString(16).padStart(2, '0')).join('');
}

/** A visit lives only in this browser tab and only for this restaurant and table. */
export function getTableVisit(restaurantId: string, tableId: string): TableVisit | null {
    if (typeof window === 'undefined') return null;
    const key = visitKey(restaurantId, tableId);
    try {
        const stored = window.sessionStorage.getItem(key);
        if (!stored) return memoryVisits.get(key) || null;
        const visit = JSON.parse(stored) as TableVisit;
        return validId(visit.visitId) && validId(visit.sessionId) ? visit : null;
    } catch {
        return memoryVisits.get(key) || null;
    }
}

export function startTableVisit(restaurantId: string, tableId: string): TableVisit {
    const visit = { visitId: randomId(16), sessionId: randomId(32) };
    const key = visitKey(restaurantId, tableId);
    memoryVisits.set(key, visit);
    try { window.sessionStorage.setItem(key, JSON.stringify(visit)); } catch { /* Keep the visit in memory for this tab. */ }
    return visit;
}
