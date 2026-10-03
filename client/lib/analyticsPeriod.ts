export type AnalyticsPeriod = 'today' | 'week' | 'month' | 'year';

export function normalizeAnalyticsPeriod(value?: string): AnalyticsPeriod {
    return value === 'today' || value === 'week' || value === 'year' ? value : 'month';
}

function indianCalendarParts(date: Date) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(date);
    const get = (type: string) => parts.find(part => part.type === type)?.value || '';
    return { year: get('year'), month: get('month'), day: get('day') };
}

export function getAnalyticsDateRange(period: AnalyticsPeriod, now = new Date()) {
    const { year, month, day } = indianCalendarParts(now);
    let startDate: Date;
    if (period === 'today') startDate = new Date(`${year}-${month}-${day}T00:00:00+05:30`);
    else if (period === 'year') startDate = new Date(`${year}-01-01T00:00:00+05:30`);
    else startDate = new Date(now.getTime() - (period === 'week' ? 7 : 30) * 24 * 60 * 60 * 1000);
    return { startDate, endDate: now };
}

export function getAnalyticsPeriodLabel(period: AnalyticsPeriod) {
    if (period === 'today') return 'Today';
    if (period === 'week') return 'Last 7 Days';
    if (period === 'year') return 'This Year';
    return 'Last 30 Days';
}
