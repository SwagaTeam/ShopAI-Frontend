import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export type OrderItem = {
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
    price: number;
    totalPrice: number;
};

export type Order = {
    id: string;
    shopName: string;
    createdAt: string;
    status: string;
    statusLabel: string;
    paymentStatus: string;
    deliveryAddress: string;
    contactPhone: string;
    comment?: string | null;
    totalPrice: number;
    items: OrderItem[];
};

interface OrdersState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: (showLoader?: boolean) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async (showLoader = false) => {
        if (showLoader) set({ isLoading: true });
        set({ error: null });
        try {
            const response = await apiClient.get<Order[]>('/Orders/my');
            set({ orders: response.data, isLoading: false });
        } catch (error) {
            console.error('Ошибка при получении заказов:', error);
            set({ error: 'Не удалось загрузить заказы', isLoading: false });
        }
    },
}));