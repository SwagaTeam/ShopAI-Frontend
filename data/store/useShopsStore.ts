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

interface ShopsState {
    shops: Shop[];
    isLoading: boolean;
    error: string | null;
    
    fetchMyShops: () => Promise<void>;
}

export const useShopsStore = create<ShopsState>((set) => ({
    shops: [],
    isLoading: false,
    error: null,

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
    }
}));
