import { create } from 'zustand';
import { apiClient } from "@/data/api/apiClient";

export interface SellerAccessRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    innOrOgrnip: string;
    socialOrWebsiteUrl: string;
    plannedCategory: string;
    description: string;
    acceptedMarketplaceRules: boolean;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAtUtc: string;
    reviewedAtUtc: string | null;
    adminComment: string | null;
}

interface SellerRequestsState {
    requests: SellerAccessRequest[];
    isLoading: boolean;
    error: string | null;
    fetchRequests: (status?: string) => Promise<void>;
    approveRequest: (id: string, adminComment?: string) => Promise<void>;
    rejectRequest: (id: string, adminComment?: string) => Promise<void>;
}

export const useSellerRequestsStore = create<SellerRequestsState>((set) => ({
    requests: [],
    isLoading: false,
    error: null,

    fetchRequests: async (status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/SellerAccessRequests', {
                params: { status }
            });
            set({ requests: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Ошибка при загрузке заявок', isLoading: false });
        }
    },

    approveRequest: async (id, adminComment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/SellerAccessRequests/${id}/approve`, { adminComment });
            set((state) => ({
                requests: state.requests.map((req) =>
                    req.id === id ? response.data : req
                ),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Ошибка при одобрении заявки', isLoading: false });
        }
    },

    rejectRequest: async (id, adminComment) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/SellerAccessRequests/${id}/reject`, { adminComment });
            set((state) => ({
                requests: state.requests.map((req) =>
                    req.id === id ? response.data : req
                ),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Ошибка при отклонении заявки', isLoading: false });
        }
    },
}));
