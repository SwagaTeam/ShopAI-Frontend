import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';
import { ItemInterface } from "@/data/interfaces/ItemInterface";

export interface Brand {
    logoUrl: string;
    id: string;
    name: string;
}

interface FilterParams {
    shopId?: string;
    categoryId?: string;
    brandId?: string;
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    tags?: string;
    inStock?: boolean;
    minRating?: number;
    sortBy?: string;
    sortDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}

interface CatalogState {
    products: ItemInterface[];
    brands: Brand[];
    totalCount: number;
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    filters: FilterParams;

    setFilters: (filters: Partial<FilterParams>) => void;
    fetchProducts: (append?: boolean) => Promise<void>;
    fetchBrands: () => Promise<void>;
    resetFilters: () => void;
    clearSearch: () => void;
}

const initialFilters: FilterParams = {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'popularity',
    sortDescending: true,
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
    products: [],
    brands: [],
    totalCount: 0,
    isLoading: false,
    isFetchingMore: false,
    error: null,
    filters: initialFilters,

    setFilters: (newFilters) => {
        const isPageChange = Object.keys(newFilters).length === 1 && 'pageNumber' in newFilters;

        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));

        if (isPageChange) {
            get().fetchProducts(true);
        } else {
            get().fetchProducts(false);
        }
    },

    resetFilters: () => {
        set({ filters: initialFilters });
        get().fetchProducts(false);
    },

    fetchProducts: async (append = false) => {
        if (append) set({ isFetchingMore: true });
        else set({ isLoading: true, error: null });

        try {
            const { filters } = get();
            const response = await apiClient.get('/Products/filter', {
                params: filters
            });

            set((state) => ({
                products: append ? [...state.products, ...response.data.items] : response.data.items,
                totalCount: response.data.totalCount,
                isLoading: false,
                isFetchingMore: false
            }));
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            set({
                error: 'Ошибка при загрузке товаров',
                isLoading: false,
                isFetchingMore: false
            });
        }
    },

    fetchBrands: async () => {
        try {
            const response = await apiClient.get('/Brands');
            set({ brands: response.data });
        } catch (error) {
            console.error('Ошибка при загрузке брендов:', error);
        }
    },

    clearSearch: () => {
        set((state) => ({
            filters: { ...state.filters, searchTerm: undefined }
        }));
    }
}));
