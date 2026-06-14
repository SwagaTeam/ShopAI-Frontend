import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@/data/api/apiClient';
import { ICartItem } from '@/data/interfaces/ICartItem';
import {sileo} from "sileo";

const pendingTimeouts = new Map<string, NodeJS.Timeout>();
const pendingDeltas = new Map<string, number>();

interface CartState {
    id: string | null;
    items: ICartItem[];
    itemsCount: number;
    totalPrice: number;
    isLoading: boolean;
    error: string | null;
    _pendingCount: number;

    fetchCart: (silent?: boolean) => Promise<void>;
    addOrUpdateItem: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
    setItems: (items: ICartItem[]) => void;
    setTotalPrice: (price: number) => void;
    clearCart: () => void;
    addBundleToCart: (productIds: string[]) => Promise<void>;
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
            _pendingCount: 0,

            async addBundleToCart(productIds) {
                set({ isLoading: true });
                try {
                    await apiClient.post('/Cart/bundles', {
                        productIds,
                        quantity: 1
                    });
                    await useCartStore.getState().fetchCart();
                } catch (error) {
                    console.error('Ошибка при добавлении бандла в корзину:', error);
                    set({ error: 'Не удалось добавить комплект в корзину', isLoading: false });
                    throw error;
                }
            },

            async fetchCart(silent = false) {
                if (!silent) set({ isLoading: true, error: null });
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
                const state = useCartStore.getState();
                const currentItems = [...state.items];
                const existingItemIndex = currentItems.findIndex(i => i.productId === productId);

                // 1. Оптимистичное обновление UI (мгновенно)
                if (existingItemIndex > -1) {
                    const existingItem = currentItems[existingItemIndex];
                    const newQuantity = existingItem.quantity + quantity;

                    if (newQuantity <= 0) {
                        currentItems.splice(existingItemIndex, 1);
                    } else {
                        currentItems[existingItemIndex] = {
                            ...existingItem,
                            quantity: newQuantity
                        };
                    }
                } else if (quantity > 0) {
                    currentItems.push({
                        productId,
                        quantity,
                        productName: 'Загрузка...',
                        price: 0,
                        imageUrl: '',
                        brandName: '',
                        stockQuantity: 999,
                        rating: 0,
                        reviewsCount: 0,
                        shopName: '',
                        tags: [],
                        isInWishlist: false
                    });
                }

                set({
                    items: currentItems,
                    itemsCount: currentItems.length
                });

                // 2. Дебаунс отправки запроса на сервер
                const accumulatedDelta = (pendingDeltas.get(productId) || 0) + quantity;
                pendingDeltas.set(productId, accumulatedDelta);

                if (pendingTimeouts.has(productId)) {
                    clearTimeout(pendingTimeouts.get(productId)!);
                } else {
                    set(s => ({ _pendingCount: s._pendingCount + 1 }));
                }

                const timeout = setTimeout(async () => {
                    const delta = pendingDeltas.get(productId);
                    pendingDeltas.delete(productId);
                    pendingTimeouts.delete(productId);

                    try {
                        if (delta !== undefined && delta !== 0) {
                            await apiClient.post('/Cart/items', {
                                productId,
                                quantity: delta
                            });
                        }
                    } catch (error) {
                        console.error('Ошибка при синхронизации корзины:', error);
                        sileo.error({
                            title: "Ошибка!",
                            description: "Не удалось синхронизировать изменения с сервером",
                            duration: 2000
                        });
                    } finally {
                        set(s => ({ _pendingCount: Math.max(0, s._pendingCount - 1) }));

                        if (useCartStore.getState()._pendingCount === 0) {
                            await useCartStore.getState().fetchCart(true); // Тихая загрузка для обновления данных без скелетона
                        }
                    }
                }, 500);

                pendingTimeouts.set(productId, timeout);
            },

            async removeItem(productId) {
                const state = useCartStore.getState();
                const newItems = state.items.filter(i => i.productId !== productId);

                // Оптимистичное удаление
                set({
                    items: newItems,
                    itemsCount: newItems.length
                });

                try {
                    await apiClient.delete(`/Cart/items/${productId}`);
                    await useCartStore.getState().fetchCart(true); // Тихая загрузка для обновления итогов
                } catch (error) {
                    console.error('Ошибка при удалении товара из корзины:', error);
                    // В случае ошибки возвращаем товар (опционально) или показываем ошибку
                    await useCartStore.getState().fetchCart();
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
                    itemsCount: 0,
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
