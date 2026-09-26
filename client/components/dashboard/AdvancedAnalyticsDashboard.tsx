import type { BusinessMetrics, RankedItem, DimensionMetric } from '@/app/actions/analytics';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ChartBarIcon, ExclamationTriangleIcon, StarIcon } from '@heroicons/react/24/outline';

function RankedList({ title, note, items, empty }: { title: string; note: string; items?: RankedItem[]; empty: string }) {
    const max = Math.max(...(items || []).map((item) => item.quantity), 1);
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
            <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-sm font-bold text-slate-900">{title}</h3><p className="mt-0.5 text-xs text-slate-500">{note}</p></div>
            {!items?.length ? <p className="p-7 text-center text-sm text-slate-400">{empty}</p> : (
                <div className="divide-y divide-slate-100">
                    {items.slice(0, 7).map((item, index) => (
                        <div key={item.menuItemId || item.name} className="px-5 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{index + 1}. {item.name}</p><p className="text-[10px] capitalize text-slate-400">{item.category || 'Other'} · {item.dietaryType || 'unknown'}</p></div>
                                <div className="shrink-0 text-right"><p className="text-xs font-bold text-slate-800">{item.quantity} sold</p><p className="text-[10px] text-slate-400">{formatCurrency(item.revenue)}</p></div>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400" style={{ width: `${item.quantity / max * 100}%` }} /></div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function DimensionList({ title, data }: { title: string; data?: DimensionMetric[] }) {
    const max = Math.max(...(data || []).map((item) => item.quantity), 1);
    return (
        <section className="rounded-2xl border border-slate-200/70 bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <div className="mt-4 space-y-3">
                {!data?.length ? <p className="py-6 text-center text-sm text-slate-400">No data available</p> : data.slice(0, 10).map((item) => (
                    <div key={item.name}>
                        <div className="flex justify-between gap-3 text-xs"><span className="font-semibold capitalize text-slate-700">{item.name}</span><span className="text-slate-500">{item.quantity} · {formatCurrency(item.revenue)}</span></div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${item.quantity / max * 100}%` }} /></div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function displayValue(value: number, unit: string) {
    if (unit === 'currency') return formatCurrency(value);
    if (unit === 'percent') return `${value}%`;
    if (unit === 'rating') return value ? `${value}/5` : '—';
    return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function AdvancedAnalyticsDashboard({ metrics, periodLabel }: { metrics?: BusinessMetrics; periodLabel: string }) {
    if (!metrics) return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Advanced analytics could not be loaded.</div>;
    const groups = Object.entries(metrics.indicators.reduce((result, indicator) => {
        (result[indicator.group] ||= []).push(indicator);
        return result;
    }, {} as Record<string, BusinessMetrics['indicators']>));
    const peakHours = [...metrics.hourlyPerformance].sort((a, b) => b.orders - a.orders).slice(0, 6);
    const bestDays = [...metrics.weekdayPerformance].sort((a, b) => b.revenue - a.revenue);

    return (
        <div className="space-y-6">
            {metrics.dataQuality.unclassifiedDietaryItems > 0 && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-amber-600" />
                    <div><p className="text-sm font-bold text-amber-900">Classify {metrics.dataQuality.unclassifiedDietaryItems} menu items for accurate Veg and Non-Veg results</p><p className="mt-0.5 text-xs text-amber-700">Edit Dietary Type and Item Type in Menu. Coverage: {metrics.dataQuality.classificationCoverage}%.</p></div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                    ['Average order', formatCurrency(metrics.averageOrderValue)],
                    ['Units sold', metrics.unitsSold],
                    ['Repeat customers', `${metrics.customers.repeatRate}%`],
                    ['Analytics parameters', metrics.indicatorCount],
                    ['Food rating', metrics.ratings.food ? `${metrics.ratings.food}/5` : '—'],
                    ['Review response', `${metrics.ratings.responseRate}%`],
                    ['Payment completion', `${metrics.payments.completionRate}%`],
                    ['Completed, unpaid', metrics.payments.unpaidCompleted],
                ].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200/70 bg-white p-4"><p className="text-xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}
            </div>

            <div>
                <h2 className="mb-1 text-lg font-bold text-slate-900">Menu intelligence</h2>
                <p className="mb-4 text-xs text-slate-500">Drink rankings exclude water.</p>
                <div className="grid gap-5 lg:grid-cols-3">
                    <RankedList title="Best-selling Veg" note="Vegetarian and vegan" items={metrics.topVegItems} empty="Classify Veg menu items to unlock." />
                    <RankedList title="Best-selling Non-Veg" note="Non-vegetarian and egg" items={metrics.topNonVegItems} empty="Classify Non-Veg menu items to unlock." />
                    <RankedList title="Most consumed drinks" note="Beverages excluding water" items={metrics.topDrinks} empty="Mark drink items as Beverage." />
                    <RankedList title="Overall best sellers" note={periodLabel} items={metrics.topItems} empty="No sales in this period." />
                    <RankedList title="Least favourite" note="Lowest sales, including zero-sale items" items={metrics.leastFavoriteItems} empty="No menu data." />
                    <DimensionList title="Category demand" data={metrics.categoryPerformance} />
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <DimensionList title="Dietary demand" data={metrics.dietaryPerformance} />
                <DimensionList title="Food and beverage demand" data={metrics.itemTypePerformance} />
                <section className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <h3 className="text-sm font-bold text-slate-900">Service and payment</h3>
                    <div className="mt-4 space-y-2">
                        {Object.entries(metrics.orderTypes).map(([type, value]) => <div key={type} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-xs"><span className="font-semibold capitalize text-slate-700">{type}</span><span className="text-slate-500">{value.orders} · {formatCurrency(value.revenue)}</span></div>)}
                        <div className="flex justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-xs"><span className="font-semibold text-emerald-800">Paid orders</span><span className="text-emerald-700">{metrics.payments.paid}</span></div>
                        <div className="flex justify-between rounded-xl bg-amber-50 px-3 py-2.5 text-xs"><span className="font-semibold text-amber-800">Unpaid completed</span><span className="text-amber-700">{metrics.payments.unpaidCompleted}</span></div>
                    </div>
                </section>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200/70 bg-white p-5">
                    <div className="flex items-center gap-2"><StarIcon className="h-5 w-5 text-amber-500" /><h3 className="text-sm font-bold text-slate-900">Ratings</h3></div>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[['Food', metrics.ratings.food], ['Experience', metrics.ratings.experience], ['Preparation', metrics.ratings.preparation], ['Packaging', metrics.ratings.packaging]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-lg font-bold text-slate-900">{value || '—'}{value ? '/5' : ''}</p><p className="text-[10px] text-slate-500">{label}</p></div>)}
                    </div>
                </section>
                <section className="overflow-hidden rounded-2xl border border-red-200 bg-white">
                    <div className="bg-red-50 px-5 py-4"><h3 className="text-sm font-bold text-red-900">Low food-rating orders</h3><p className="text-xs text-red-700">1–2 stars; dishes are correlated with the order.</p></div>
                    {!metrics.ratings.lowFoodOrders.length ? <p className="p-7 text-center text-sm text-slate-400">No low ratings in this period.</p> : <div className="max-h-64 divide-y divide-slate-100 overflow-y-auto">{metrics.ratings.lowFoodOrders.map((review) => <div key={review.orderId} className="px-5 py-3"><div className="flex justify-between"><p className="text-xs font-bold text-slate-800">{review.rating}/5 · {review.customerName}</p><p className="text-[10px] text-slate-400">{formatDate(review.createdAt)}</p></div><p className="mt-1 text-xs text-slate-500">{review.items.join(', ')}</p>{review.comment && <p className="mt-1 text-xs italic text-red-700">“{review.comment}”</p>}</div>)}</div>}
                </section>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200/70 bg-white p-5"><h3 className="text-sm font-bold text-slate-900">Peak hours</h3><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{peakHours.map((point) => <div key={point.hour} className="rounded-xl bg-violet-50 p-3"><p className="font-bold text-violet-900">{String(point.hour).padStart(2, '0')}:00</p><p className="text-[10px] text-violet-700">{point.orders} orders · {point.units} units</p></div>)}</div></section>
                <section className="rounded-2xl border border-slate-200/70 bg-white p-5"><h3 className="text-sm font-bold text-slate-900">Best weekdays</h3><div className="mt-4 space-y-2">{bestDays.map((point, index) => <div key={point.day} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs"><span className="font-semibold text-slate-700">{index + 1}. {point.day}</span><span className="text-slate-500">{point.orders} · {formatCurrency(point.revenue)}</span></div>)}</div></section>
            </div>

            <section className="rounded-2xl border border-slate-200/70 bg-white p-5">
                <div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2"><ChartBarIcon className="h-5 w-5 text-violet-600" /><h2 className="text-sm font-bold text-slate-900">All analytics parameters</h2></div><p className="mt-1 text-xs text-slate-500">Complete catalogue for {periodLabel}</p></div><span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">{metrics.indicatorCount}</span></div>
                <div className="mt-5 space-y-3">
                    {groups.map(([group, indicators]) => <details key={group} className="rounded-xl border border-slate-200"><summary className="flex cursor-pointer list-none justify-between px-4 py-3 text-sm font-bold text-slate-800"><span>{group}</span><span className="rounded-full bg-slate-100 px-2 text-[10px] text-slate-500">{indicators.length}</span></summary><div className="grid gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">{indicators.map((indicator) => <div key={indicator.key} className="flex justify-between gap-3 bg-white px-4 py-3 text-xs"><span className="text-slate-500">{indicator.label}</span><span className="font-bold text-slate-900">{displayValue(indicator.value, indicator.unit)}</span></div>)}</div></details>)}
                </div>
            </section>
        </div>
    );
}
