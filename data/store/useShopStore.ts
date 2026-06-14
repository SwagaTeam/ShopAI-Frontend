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

export interface Category {
    id: string;
    name: string;
    shopId: string;
    parentCategoryId: string | null;
    subCategories: Category[];
}

export interface CategoryDTO {
    name: string;
    shopId: string;
}

export interface Brand {
    id: string;
    name: string;
    logoUrl: string;
}

export interface ShopProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string | null;
    brandName: string | null;
    stockQuantity: number;
    categoryName?: string | null;
}

export interface CreateProductRequest {
    shopId: string;
    name: string;
    price: number;
    categoryId: string;
    description: string;
    imageUrl: string;
    stockQuantity: number;
    brandId: string;
}

interface ShopState {
    shop: Shop | null;
    categories: Category[];
    brands: Brand[];
    products: ShopProduct[];
    productsPage: number;
    productsPageSize: number;
    totalProducts: number;
    totalProductPages: number;
    isLoading: boolean;
    isSubmittingProduct: boolean;
    isSubmittingCategory: boolean;
    isSubmittingShop: boolean;
    error: string | null;

    fetchShop: (shopId: string) => Promise<void>;
    fetchCategories: (shopId: string) => Promise<void>;
    fetchBrands: () => Promise<void>;
    fetchShopProducts: (shopId: string, page?: number, pageSize?: number) => Promise<void>;
    createProduct: (product: CreateProductRequest) => Promise<boolean>;
    createProductWithImage: (formData: FormData) => Promise<boolean>;
    createShop: (shop: { name: string, urlAlias: string, description: string, logoPath: string }) => Promise<boolean>;
    updateShop: (shopId: string, name: string, urlAlias: string) => Promise<void>;
    deleteShop: (shopId: string) => Promise<void>;
    createCategory: (category: CategoryDTO) => Promise<boolean>;
}

export const useShopStore = create<ShopState>((set) => ({
    shop: null,
    categories: [],
    brands: [],
    products: [],
    productsPage: 1,
    productsPageSize: 20,
    totalProducts: 0,
    totalProductPages: 0,
    isLoading: false,
    isSubmittingProduct: false,
    isSubmittingCategory: false,
    isSubmittingShop: false,
    error: null,

    async fetchShop(shopId) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/Shops/${shopId}`);
            set({
                shop: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении магазина:', error);
            set({
                error: 'Ошибка при загрузке магазина',
                isLoading: false
            });
        }
    },

    async fetchCategories(shopId) {
        try {
            const response = await apiClient.get(`/Categories/shop/${shopId}`);
            set({
                categories: response.data
            });
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            set({
                error: 'Ошибка при загрузке категорий'
            });
        }
    },

    async createCategory(category: CategoryDTO) {
        set({ isSubmittingCategory: true, error: null });
        try {
            await apiClient.post('/Categories', category);
            await useShopStore.getState().fetchCategories(category.shopId);
            set({ isSubmittingCategory: false, error: null });
            return true;
        } catch (error) {
            console.error('Ошибка при создании категории:', error);
            set({
                error: 'Ошибка при создании категории',
                isSubmittingCategory: false
            });
            return false;
        }
    },

    async fetchBrands() {
        try {
            const response = await apiClient.get('/Brands');
            set({
                brands: response.data
            });
        } catch (error) {
            console.error('Ошибка при получении брендов:', error);
            set({
                error: 'Ошибка при загрузке брендов'
            });
        }
    },

    async fetchShopProducts(shopId, page = 1, pageSize = 20) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/Shops/${shopId}/products`, {
                params: { page, pageSize }
            });

            set({
                products: response.data.items,
                productsPage: response.data.page,
                productsPageSize: response.data.pageSize,
                totalProducts: response.data.totalCount,
                totalProductPages: response.data.totalPages,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка при получении товаров магазина:', error);
            set({
                error: 'Ошибка при загрузке товаров магазина',
                isLoading: false
            });
        }
    },

    async createProduct(product) {
        set({ isSubmittingProduct: true, error: null });
        try {
            await apiClient.post('/Products', product);
            await useShopStore.getState().fetchShopProducts(product.shopId, 1, useShopStore.getState().productsPageSize);
            set({ isSubmittingProduct: false, error: null });
            return true;
        } catch (error) {
            console.error('Ошибка при создании товара:', error);
            set({
                error: 'Ошибка при создании товара',
                isSubmittingProduct: false
            });
            return false;
        }
    },

    async createProductWithImage(formData: FormData) {
        set({ isSubmittingProduct: true, error: null });
        try {
            await apiClient.post('/Products/with-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const shopId = formData.get('ShopId') as string;
            if (shopId) {
                await useShopStore.getState().fetchShopProducts(shopId, 1, useShopStore.getState().productsPageSize);
            }
            set({ isSubmittingProduct: false, error: null });
            return true;
        } catch (error) {
            console.error('Ошибка при создании товара с изображением:', error);
            set({
                error: 'Ошибка при создании товара',
                isSubmittingProduct: false
            });
            return false;
        }
    },

    async createShop(shop) {
        set({ isSubmittingShop: true, error: null });
        try {
            await apiClient.post('/Shops', shop);
            set({ isSubmittingShop: false });
            return true;
        } catch (error) {
            console.error('Ошибка при создании магазина:', error);
            set({
                error: 'Ошибка при создании магазина',
                isSubmittingShop: false
            });
            return false;
        }
    },

    async updateShop(shopId, name, urlAlias) {
        try {
            await apiClient.put(`/Shops/${shopId}`, {
                name,
                urlAlias
            });
            await useShopStore.getState().fetchShop(shopId);
            set({ error: null });
        } catch (error) {
            console.error('Ошибка при обновлении магазина:', error);
            set({
                error: 'Ошибка при обновлении магазина'
            });
        }
    },

    async deleteShop(shopId) {
        try {
            await apiClient.delete(`/Shops/${shopId}`);
            set({ shop: null, error: null });
        } catch (error) {
            console.error('Ошибка при удалении магазина:', error);
            set({
                error: 'Ошибка при удалении магазина'
            });
        }
    }
}));
