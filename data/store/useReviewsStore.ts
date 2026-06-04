import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface ProductReview {
    id: string;
    userId: string;
    userName: string;
    imagePaths: string[];
    rating: number;
    comment: string;
    createdAtUtc: string;
}

interface ReviewsState {
    review: ProductReview | null;
    reviews: ProductReview[];
    currentPage: number;
    hasMore: boolean;
    isLoading: boolean;
    error: string | null;
    isSubmitting: boolean;
    submitError: string | null;
    hasUserReview: boolean;

    fetchFirstReview: (productId: string) => Promise<void>;
    fetchReviews: (productId: string, page?: number, pageSize?: number) => Promise<void>;
    loadMoreReviews: (productId: string, pageSize?: number) => Promise<void>;
    submitReview: (productId: string, rating: number, comment: string) => Promise<void>;
    checkUserReview: (productId: string) => Promise<void>;
    resetReviews: () => void;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
    review: null,
    reviews: [],
    currentPage: 0,
    hasMore: true,
    isLoading: false,
    error: null,
    isSubmitting: false,
    submitError: null,
    hasUserReview: false,

    async fetchFirstReview(productId: string) {
        set({ isLoading: true, error: null, review: null });
        try {
            const response = await apiClient.get(`/Products/${productId}/reviews`, {
                params: { page: 1, pageSize: 1 }
            });
            const reviews: ProductReview[] = response.data;
            if (reviews && reviews.length > 0) {
                set({ review: reviews[0], isLoading: false });
            } else {
                set({ review: null, isLoading: false, error: 'Нет отзывов' });
            }
        } catch (error) {
            set({ review: null, error: 'Нет отзывов', isLoading: false });
        }
    },

    async fetchReviews(productId: string, page = 1, pageSize = 10) {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/Products/${productId}/reviews`, {
                params: { page, pageSize }
            });
            const reviews: ProductReview[] = response.data;
            const updatedReviews = page === 1 ? reviews : [...get().reviews, ...reviews];

            set({
                reviews: updatedReviews,
                currentPage: page,
                hasMore: reviews.length >= pageSize,
                isLoading: false
            });
        } catch (error) {
            set({
                error: 'Ошибка загрузки отзывов',
                isLoading: false,
                reviews: page === 1 ? [] : get().reviews
            });
        }
    },

    async loadMoreReviews(productId: string, pageSize = 10) {
        const { currentPage } = get();
        await get().fetchReviews(productId, currentPage + 1, pageSize);
    },

    async checkUserReview(productId: string) {
        try {
            const response = await apiClient.get(`/Products/${productId}/reviews/my`);
            // Если эндпоинт вернул отзыв — значит пользователь уже оставлял
            set({ hasUserReview: !!response.data });
        } catch (error: any) {
            // Если 404 — отзыва нет, это нормально
            if (error?.response?.status === 404) {
                set({ hasUserReview: false });
            } else {
                // Если нет специального эндпоинта — ищем в загруженных отзывах
                // Проверка произойдёт через checkUserInLoadedReviews
                set({ hasUserReview: false });
            }
        }
    },

    async submitReview(productId: string, rating: number, comment: string) {
        set({ isSubmitting: true, submitError: null });
        try {
            await apiClient.post(`/Products/${productId}/reviews`, {
                rating,
                comment
            });
            set({ isSubmitting: false, hasUserReview: true });
            // Перезагружаем отзывы
            set({ reviews: [], currentPage: 0, hasMore: true });
            await get().fetchReviews(productId, 1, 10);
        } catch (error: any) {
            const status = error?.response?.status;
            const serverMessage = error?.response?.data?.message
                || error?.response?.data?.title
                || error?.response?.data;

            let errorMsg = 'Ошибка при отправке отзыва';

            if (status === 502) {
                errorMsg = 'Вы уже оставляли отзыв на этот товар';
                set({ hasUserReview: true });
            } else if (typeof serverMessage === 'string') {
                errorMsg = serverMessage;
            }

            set({ submitError: errorMsg, isSubmitting: false });
            throw error;
        }
    },

    resetReviews() {
        set({
            reviews: [],
            currentPage: 0,
            hasMore: true,
            error: null,
            hasUserReview: false
        });
    }
}));