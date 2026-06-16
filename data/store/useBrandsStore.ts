import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface Brand {
    id: string;
    name: string;
    logoUrl: string;
}

export interface CreateBrandRequest {
    name: string;
    logoUrl: string;
}

interface BrandsState {
    brands: Brand[];
    isLoading: boolean;
    error: string | null;

    fetchBrands: () => Promise<void>;
    createBrand: (brand: CreateBrandRequest) => Promise<boolean>;
    updateBrand: (id: string, brand: CreateBrandRequest) => Promise<boolean>;
    deleteBrand: (id: string) => Promise<boolean>;
}

export const useBrandsStore = create<BrandsState>((set, get) => ({
    brands: [],
    isLoading: false,
    error: null,

    fetchBrands: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Brands');
            set({ brands: response.data, isLoading: false });
        } catch (error: any) {
            console.error('Error fetching brands:', error);
            set({ error: 'Failed to fetch brands', isLoading: false });
        }
    },

    createBrand: async (brand) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/Brands', brand);
            await get().fetchBrands();
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            console.error('Error creating brand:', error);
            set({ error: 'Failed to create brand', isLoading: false });
            return false;
        }
    },

    updateBrand: async (id, brand) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/Brands/${id}`, brand);
            await get().fetchBrands();
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            console.error('Error updating brand:', error);
            set({ error: 'Failed to update brand', isLoading: false });
            return false;
        }
    },

    deleteBrand: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/Brands/${id}`);
            await get().fetchBrands();
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            console.error('Error deleting brand:', error);
            set({ error: 'Failed to delete brand', isLoading: false });
            return false;
        }
    },
}));
