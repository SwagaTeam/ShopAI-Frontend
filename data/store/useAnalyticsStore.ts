import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';
import { ItemInterface } from '@/data/interfaces/ItemInterface';

export interface AnalyticsOverview {
    shopsCount: number;
    productsCount: number;
    inStockProductsCount: number;
    outOfStockProductsCount: number;
    lowStockProductsCount: number;
    ordersCount: number;
    averageOrderValue: number;
    revenue: number;
    averageRating: number;
    reviewsCount: number;
}

export interface DailyOrderAnalytics {
    date: string;
    ordersCount: number;
    revenue: number;
}

interface AnalyticsState {
    overview: AnalyticsOverview | null;
    dailyOrders: DailyOrderAnalytics[];
    topProducts: ItemInterface[];
    isLoading: boolean;
    error: string | null;

    fetchOverview: () => Promise<void>;
    fetchDailyOrders: (days?: number) => Promise<void>;
    fetchTopProducts: (limit?: number) => Promise<void>;
    fetchAllAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
    overview: null,
    dailyOrders: [],
    topProducts: [],
    isLoading: false,
    error: null,

    async fetchOverview() {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Analytics/overview');
            set({ overview: response.data, isLoading: false });
        } catch (error) {
            console.error('Error fetching analytics overview:', error);
            set({ error: 'Failed to fetch analytics overview', isLoading: false });
        }
    },

    async fetchDailyOrders(days = 14) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Analytics/orders/daily', {
                params: { days }
            });
            set({ dailyOrders: response.data, isLoading: false });
        } catch (error) {
            console.error('Error fetching daily orders analytics:', error);
            set({ error: 'Failed to fetch daily orders analytics', isLoading: false });
        }
    },

    async fetchTopProducts(limit = 8) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Analytics/products/top', {
                params: { limit }
            });
            set({ topProducts: response.data, isLoading: false });
        } catch (error) {
            console.error('Error fetching top products analytics:', error);
            set({ error: 'Failed to fetch top products analytics', isLoading: false });
        }
    },

    async fetchAllAnalytics() {
        set({ isLoading: true, error: null });
        try {
            const [overview, daily, top] = await Promise.all([
                apiClient.get('/Analytics/overview'),
                apiClient.get('/Analytics/orders/daily', { params: { days: 14 } }),
                apiClient.get('/Analytics/products/top', { params: { limit: 8 } })
            ]);

            set({
                overview: overview.data,
                dailyOrders: daily.data,
                topProducts: top.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching all analytics:', error);
            set({ error: 'Failed to fetch analytics data', isLoading: false });
        }
    }
}));
