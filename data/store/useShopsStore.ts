import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface Shop {
    id: string;
    name: string;
    description: string;
    logoPath: string;
    urlAlias: string;
    ownerId: string;
    ownerName: string;
}

export interface CreateShopDto {
    name: string;
    description: string;
    logoPath: string;
    urlAlias: string;
}

export type SellerRequestStatus = 'pending' | 'approved' | 'rejected';

export type SellerAccessRequest = {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    innOrOgrnip: string;
    socialOrWebsiteUrl: string;
    plannedCategory: string;
    description: string;
    acceptedMarketplaceRules: boolean;
    status: SellerRequestStatus;
    createdAtUtc: string;
    reviewedAtUtc?: string | null;
    adminComment?: string | null;
};

interface ShopsState {
    shops: Shop[];
    myRequests: SellerAccessRequest[];
    pendingRequests: SellerAccessRequest[];
    isLoading: boolean;
    isCreating: boolean;
    isRequestLoading: boolean;
    isRequestSubmitting: boolean;
    error: string | null;
    createError: string | null;

    fetchMyShops: () => Promise<void>;
    createShop: (data: CreateShopDto) => Promise<boolean>;
    fetchMySellerRequests: () => Promise<void>;
    fetchPendingSellerRequests: () => Promise<void>;
    submitSellerRequest: (data: any) => Promise<boolean>;
    handleAdminDecision: (requestId: string, action: 'approve' | 'reject') => Promise<void>;
}

export const useShopsStore = create<ShopsState>((set, get) => ({
    shops: [],
    myRequests: [],
    pendingRequests: [],
    isLoading: false,
    isCreating: false,
    isRequestLoading: false,
    isRequestSubmitting: false,
    error: null,
    createError: null,

    async fetchMyShops() {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Shops/my');
            set({
                shops: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении магазинов:', error);
            set({
                error: 'Ошибка при загрузке магазинов',
                isLoading: false
            });
        }
    },

    async createShop(data: CreateShopDto) {
        set({ isCreating: true, createError: null });
        try {
            await apiClient.post('/Shops', data);
            await get().fetchMyShops();

            set({ isCreating: false });
            return true;
        } catch (error) {
            console.error('Ошибка при создании магазина:', error);
            set({
                createError: 'Не удалось создать магазин. Проверьте данные или URL.',
                isCreating: false
            });
            return false;
        }
    },

    async fetchMySellerRequests() {
        set({ isRequestLoading: true });
        try {
            const response = await apiClient.get<SellerAccessRequest[]>('/SellerAccessRequests/my');
            set({ myRequests: response.data, isRequestLoading: false });
        } catch (error) {
            console.error('Ошибка при получении заявки продавца:', error);
            set({ isRequestLoading: false });
        }
    },

    async fetchPendingSellerRequests() {
        try {
            const response = await apiClient.get<SellerAccessRequest[]>('/SellerAccessRequests', {
                params: { status: 'pending' },
            });
            set({ pendingRequests: response.data });
        } catch (error) {
            console.error('Ошибка при получении заявок продавцов:', error);
        }
    },

    async submitSellerRequest(data) {
        set({ isRequestSubmitting: true });
        try {
            await apiClient.post('/SellerAccessRequests', data);
            await get().fetchMySellerRequests();
            set({ isRequestSubmitting: false });
            return true;
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            set({ isRequestSubmitting: false });
            return false;
        }
    },

    async handleAdminDecision(requestId, action) {
        try {
            await apiClient.post(`/SellerAccessRequests/${requestId}/${action}`, {});
            await get().fetchPendingSellerRequests();
            await get().fetchMySellerRequests();
        } catch (error) {
            console.error('Ошибка при обработке заявки:', error);
            throw error;
        }
    }
}));
