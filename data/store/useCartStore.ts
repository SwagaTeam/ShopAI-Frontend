import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@/data/api/apiClient';
import { ICartItem } from '@/data/interfaces/ICartItem';

interface CartState {
    id: string | null;
    items: ICartItem[];
    itemsCount: number;
    totalPrice: number;
    isLoading: boolean;
    error: string | null;
    
    fetchCart: () => Promise<void>;
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
