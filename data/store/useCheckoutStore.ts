import { create } from "zustand";
import { apiClient } from "@/data/api/apiClient";

export interface DeliveryAddress {
    id: string;
    title: string;
    addressLine: string;
    entrance?: string | null;
    floor?: string | null;
    apartment?: string | null;
    comment?: string | null;
}

export interface CheckoutRequest {
    returnUrl: string;
    deliveryAddressId: string | null;
    deliveryAddressText: string | null;
    contactPhone: string;
    comment?: string | null;
}

export interface CheckoutResponse {
    paymentId: string;
    orderIds: string[];
    confirmationUrl: string;
    amount?: number;
    currency?: string;
    status?: string;
}

interface CheckoutState {
    addresses: DeliveryAddress[];
    isLoadingAddresses: boolean;
    isAddressSaving: boolean;
    isSubmitting: boolean;

    fetchAddresses: () => Promise<void>;
    saveAddress: (addressData: Omit<DeliveryAddress, "id">) => Promise<DeliveryAddress | null>;
    submitOrder: (payload: CheckoutRequest) => Promise<CheckoutResponse | null>;
    confirmPayment: (paymentId: string, orderIds: string[]) => Promise<boolean>;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
    addresses: [],
    isLoadingAddresses: false,
    isAddressSaving: false,
    isSubmitting: false,

    fetchAddresses: async () => {
        set({ isLoadingAddresses: true });

        try {
            const response = await apiClient.get<DeliveryAddress[]>("/DeliveryAddresses");

            set({
                addresses: response.data,
                isLoadingAddresses: false,
            });
        } catch (error) {
            console.error("Ошибка при получении адресов доставки:", error);

            set({
                isLoadingAddresses: false,
            });
        }
    },

    saveAddress: async (addressData) => {
        set({ isAddressSaving: true });

        try {
            const response = await apiClient.post<DeliveryAddress>(
                "/DeliveryAddresses",
                addressData
            );

            const created = response.data;

            set((state) => ({
                addresses: [created, ...state.addresses],
                isAddressSaving: false,
            }));

            return created;
        } catch (error) {
            console.error("Ошибка при сохранении адреса:", error);

            set({ isAddressSaving: false });

            return null;
        }
    },

    submitOrder: async (payload) => {
        set({ isSubmitting: true });

        try {
            const response = await apiClient.post<CheckoutResponse>(
                "/Payments/checkout",
                payload
            );

            set({ isSubmitting: false });

            return response.data;
        } catch (error) {
            console.error("Ошибка при оформлении заказа:", error);

            set({ isSubmitting: false });

            return null;
        }
    },

    confirmPayment: async (paymentId, orderIds) => {
        set({ isSubmitting: true });

        try {
            await apiClient.post(`/Payments/${paymentId}/confirm`, {
                orderIds,
            });

            set({ isSubmitting: false });

            return true;
        } catch (error) {
            console.error("Ошибка при подтверждении платежа:", error);

            set({ isSubmitting: false });

            return false;
        }
    },
}));