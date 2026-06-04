import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@/data/api/apiClient';
import { ICartItem } from '@/data/interfaces/ICartItem';
import {sileo} from "sileo";

interface CartState {
    id: string | null;
    items: ICartItem[];
    itemsCount: number;
    totalPrice: number;
    isLoading: boolean;
    error: string | null;

    fetchCart: () => Promise<void>;
    addOrUpdateItem: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
    setItems: (items: ICartItem[]) => void;
    setTotalPrice: (price: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            id: null,
            items: [],
            itemsCount: 0,
            totalPrice: 0,
            isLoading: false,
            error: null,

            async fetchCart() {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiClient.get('/Cart');
                    set({
                        id: response.data.id,
                        items: response.data.items,
                        itemsCount: response.data.items.length,
                        totalPrice: response.data.totalPrice,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Ошибка при получении корзины:', error);
                    set({
                        error: 'Ошибка при загрузке корзины',
                        isLoading: false
                    });
                }
            },

            async addOrUpdateItem(productId, quantity) {
                try {
                    await apiClient.post('/Cart/items', {
                        productId,
                        quantity
                    });
                    await useCartStore.getState().fetchCart();
                } catch (error) {
                    console.error('Ошибка при добавлении товара в корзину:', error);
                    sileo.error({ title: "Ошибка!", description: "Товар не добавлен в корзину", duration: 2000 });
                }
            },

            async removeItem(productId) {
                try {
                    await apiClient.delete(`/Cart/items/${productId}`);
                    await useCartStore.getState().fetchCart();
                } catch (error) {
                    console.error('Ошибка при удалении товара из корзины:', error);
                    set({
                        error: 'Ошибка при удалении товара'
                    });
                }
            },

            async updateItemQuantity(productId, quantity) {
                await useCartStore.getState().addOrUpdateItem(productId, quantity);
            },

            setItems(items) {
                set({ items });
            },

            setTotalPrice(price) {
                set({ totalPrice: price });
            },

            clearCart() {
                set({
                    id: null,
                    items: [],
                    totalPrice: 0,
                    error: null
                });
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
