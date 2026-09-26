'use server';

import { apiFetch } from '@/client-lib/api';

export interface AssociationRule {
    items: string[];
    frequency: number;
}

export async function getAssociationRules(
    restaurantId: string,
    timeRange?: { startDate: Date; endDate: Date }
): Promise<{ success: boolean; data?: AssociationRule[]; error?: string }> {
    try {
        const queryParams = new URLSearchParams();
        if (timeRange?.startDate) queryParams.set('startDate', timeRange.startDate.toISOString());
        if (timeRange?.endDate) queryParams.set('endDate', timeRange.endDate.toISOString());

        const res = await apiFetch(`/api/v1/analytics/associations?${queryParams.toString()}`);

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to fetch analytics' };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error calculating association rules:', error);
        return { success: false, error: 'Failed to calculate analytics' };
    }
}

export interface BusinessMetrics {
    revenue: {
        period: number;
        total: number;
    };
    orders: {
        period: number;
        total: number;
    };
    topItems: {
        name: string;
        quantity: number;
        revenue: number;
        category?: string;
        dietaryType?: string;
        itemType?: string;
        orders?: number;
    }[];
    averageOrderValue: number;
    unitsSold: number;
    leastFavoriteItems: RankedItem[];
    topVegItems: RankedItem[];
    topNonVegItems: RankedItem[];
    topDrinks: RankedItem[];
    categoryPerformance: DimensionMetric[];
    dietaryPerformance: DimensionMetric[];
    itemTypePerformance: DimensionMetric[];
    hourlyPerformance: { hour: number; orders: number; revenue: number; units: number }[];
    weekdayPerformance: { day: string; orders: number; revenue: number; units: number }[];
    dailyTrend: { date: string; orders: number; revenue: number }[];
    statusCounts: Record<string, number>;
    orderTypes: Record<string, { orders: number; revenue: number }>;
    payments: { paid: number; unpaidCompleted: number; completionRate: number };
    customers: {
        identified: number;
        repeat: number;
        repeatRate: number;
        top: { name: string; phone: string; orders: number; spend: number }[];
    };
    ratings: {
        count: number;
        responseRate: number;
        food: number;
        experience: number;
        preparation: number;
        packaging: number;
        lowFoodOrders: { orderId: string; rating: number; comment: string; customerName: string; createdAt: string; items: string[] }[];
    };
    dataQuality: { totalMenuItems: number; unclassifiedDietaryItems: number; classificationCoverage: number };
    indicators: { group: string; key: string; label: string; value: number; unit: string }[];
    indicatorCount: number;
}

export interface RankedItem {
    menuItemId?: string;
    name: string;
    category?: string;
    dietaryType?: string;
    itemType?: string;
    quantity: number;
    revenue: number;
    orders?: number;
    isAvailable?: boolean;
}

export interface DimensionMetric {
    name: string;
    quantity: number;
    revenue: number;
    orders: number;
}

export async function getBusinessMetrics(
    restaurantId: string,
    timeRange?: { startDate: Date; endDate: Date }
): Promise<{ success: boolean; data?: BusinessMetrics; error?: string }> {
    try {
        const queryParams = new URLSearchParams();
        if (timeRange?.startDate) queryParams.set('startDate', timeRange.startDate.toISOString());
        if (timeRange?.endDate) queryParams.set('endDate', timeRange.endDate.toISOString());

        const res = await apiFetch(`/api/v1/analytics/metrics?${queryParams.toString()}`);

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to fetch metrics' };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching business metrics:', error);
        return { success: false, error: 'Failed to fetch metrics' };
    }
}
