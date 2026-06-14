import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';
import { ItemInterface } from "@/data/interfaces/ItemInterface";

export interface Category {
    id: string;
    name: string;
    shopId?: string;
    parentCategoryId?: string | null;
}

export interface Brand {
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
    categories: Category[];
    brands: Brand[];
    totalCount: number;
    isLoading: boolean;
    error: string | null;
    filters: FilterParams;

    setFilters: (filters: Partial<FilterParams>) => void;
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchBrands: () => Promise<void>;
    resetFilters: () => void;
}

const initialFilters: FilterParams = {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'popularity',
    sortDescending: true,
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
    products: [],
    categories: [],
    brands: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    filters: initialFilters,

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
        get().fetchProducts();
    },

    resetFilters: () => {
        set({ filters: initialFilters });
        get().fetchProducts();
    },

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const response = await apiClient.get('/Products/filter', {
                params: filters
            });
            set({
                products: response.data.items,
                totalCount: response.data.totalCount,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            set({
                error: 'Ошибка при загрузке товаров',
                isLoading: false
            });
        }
    },

    fetchCategories: async () => {
        try {
            const response = await apiClient.get('/Categories');
            set({ categories: response.data });
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    },

    fetchBrands: async () => {
        try {
            const response = await apiClient.get('/Brands');
            set({ brands: response.data });
        } catch (error) {
            console.error('Ошибка при загрузке брендов:', error);
        }
    }
}));
