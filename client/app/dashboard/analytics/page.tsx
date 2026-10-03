import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAssociationRules, getBusinessMetrics } from '@/app/actions/analytics';
import {
    CurrencyDollarIcon,
    ShoppingBagIcon,
    FireIcon,
    SparklesIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';
import DateFilter from '@/components/dashboard/DateFilter';
import { AdvancedAnalyticsDashboard } from '@/components/dashboard/AdvancedAnalyticsDashboard';
import { getAnalyticsDateRange, getAnalyticsPeriodLabel, normalizeAnalyticsPeriod } from '@/lib/analyticsPeriod';

interface PageProps {
    searchParams: Promise<{ period?: string }>;
}

export default async function AnalyticsPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const session = await auth();

    if (!session || !session.user.restaurantId) {
        redirect('/auth/signin');
    }

    const period = normalizeAnalyticsPeriod(searchParams.period);
    const dateRange = getAnalyticsDateRange(period);
    const periodLabel = getAnalyticsPeriodLabel(period);

    const [associationsRes, metricsRes] = await Promise.all([
        getAssociationRules(session.user.restaurantId, dateRange),
        getBusinessMetrics(session.user.restaurantId, dateRange)
    ]);

    const associations = associationsRes.data;
    const metrics = metricsRes.data;

    const kpis = [
        {
            label: `Revenue (${periodLabel})`,
            value: metrics ? formatCurrency(metrics.revenue.period) : '₹0',
            icon: CurrencyDollarIcon,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            badge: periodLabel,
            badgeBg: 'bg-emerald-50 text-emerald-700',
        },
        {
            label: `Orders (${periodLabel})`,
            value: metrics ? metrics.orders.period : 0,
            icon: ShoppingBagIcon,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            badge: periodLabel,
            badgeBg: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Total Revenue',
            value: metrics ? formatCurrency(metrics.revenue.total) : '₹0',
            icon: ArrowTrendingUpIcon,
            iconBg: 'bg-violet-50',
            iconColor: 'text-violet-600',
            badge: 'All Time',
            badgeBg: 'bg-violet-50 text-violet-700',
        },
        {
            label: 'Total Orders',
            value: metrics ? metrics.orders.total : 0,
            icon: ShoppingBagIcon,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            badge: 'All Time',
            badgeBg: 'bg-amber-50 text-amber-700',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Analytics
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Performance insights &amp; patterns
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <DateFilter />
                    <a href={`/api/analytics/sales-export?period=${period}`} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                        <ArrowDownTrayIcon className="h-4 w-4" /> Download sales Excel
                    </a>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpis.map((kpi, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                                <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider ${kpi.badgeBg}`}>
                                {kpi.badge}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">
                            {kpi.value}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">{kpi.label}</p>
                    </div>
                ))}
            </div>

            <AdvancedAnalyticsDashboard metrics={metrics} periodLabel={periodLabel} />

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Selling Items */}
                <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden lg:col-span-1 h-fit">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-50">
                            <FireIcon className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Top Items</h2>
                            <p className="text-xs text-slate-500">{periodLabel}</p>
                        </div>
                    </div>
                    <div>
                        {!metrics?.topItems || metrics.topItems.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-slate-400 text-sm">No data available</p>
                                <p className="text-slate-400 text-xs mt-1">Complete orders to see insights</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {metrics.topItems.map((item, i) => (
                                    <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i < 3
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {i + 1}
                                            </span>
                                            <span className="font-medium text-slate-900 text-sm">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-slate-900">{item.quantity} sold</div>
                                            <div className="text-xs text-slate-400">{formatCurrency(item.revenue)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Association Mining */}
                <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden lg:col-span-2">
                    <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50">
                                <SparklesIcon className="w-4 h-4 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">Frequently Bought Together</h2>
                                <p className="text-xs text-slate-500">Pattern analysis from orders</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-1 bg-sky-50 text-sky-700 rounded-full uppercase tracking-wider">
                            {periodLabel}
                        </span>
                    </div>

                    <div className="p-5">
                        {!associations || associations.length === 0 ? (
                            <div className="text-center py-12">
                                <SparklesIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm font-medium">Not enough data to find patterns</p>
                                <p className="text-slate-400 text-xs mt-1">Complete more orders to see insights</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {associations.map((rule, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl border border-slate-200/60 hover:border-sky-200 hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                {rule.items.map((item, i) => (
                                                    <div key={i} className="flex items-center">
                                                        <span className="text-sm font-medium text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                                            {item}
                                                        </span>
                                                        {i < rule.items.length - 1 && (
                                                            <span className="text-slate-300 text-xs mx-1">+</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                                <span className="text-lg font-bold text-sky-600 leading-none">
                                                    {rule.frequency}
                                                </span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                                                    Orders
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-sky-400 rounded-full group-hover:bg-sky-500 transition-colors"
                                                style={{ width: `${Math.min((rule.frequency / associations[0].frequency) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
