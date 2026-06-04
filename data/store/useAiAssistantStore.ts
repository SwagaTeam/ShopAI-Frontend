import { create } from 'zustand';
import { apiClient } from '@/data/api/apiClient';

export interface AiProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string;
    brandName: string;
    stockQuantity: number;
}

export interface AiInterpreted {
    intent: string;
    categoryHints: string[];
    requiredCategories: string[];
    keywords: string[];
    colors: string[];
    brands: string[];
    tags: string[];
    attributes: Record<string, string>;
    budgetMin: number;
    budgetMax: number;
    priceSort: string;
    bundleSize: number;
}

export interface AiResponse {
    interpreted: AiInterpreted;
    items: AiProduct[];
    bundles: AiProduct[][];
}

export interface AiHistoryEntry {
    id: string;
    query: string;
    response: AiResponse;
    timestamp: Date;
}

interface AiAssistantState {
    history: AiHistoryEntry[];
    isLoading: boolean;
    error: string | null;

    sendQuery: (
        userPrompt: string,
        budgetMin?: number,
        budgetMax?: number,
        categoryId?: string,
        limit?: number
    ) => Promise<void>;

    clearHistory: () => void;
}

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
    history: [],
    isLoading: false,
    error: null,

    async sendQuery(userPrompt, budgetMin, budgetMax, categoryId, limit) {
        set({ isLoading: true, error: null });
        try {
            const body: Record<string, any> = { userPrompt };
            if (budgetMin !== undefined) body.budgetMin = budgetMin;
            if (budgetMax !== undefined) body.budgetMax = budgetMax;
            if (categoryId) body.categoryId = categoryId;
            if (limit !== undefined && limit > 0) body.limit = limit;

            const response = await apiClient.post('/ai/shopping-assistant', body);
            const data: AiResponse = response.data;

            const entry: AiHistoryEntry = {
                id: crypto.randomUUID(),
                query: userPrompt,
                response: data,
                timestamp: new Date()
            };

            set({
                history: [...get().history, entry],
                isLoading: false
            });
        } catch (error: any) {
            console.error('AI Assistant error:', error);
            set({
                error: error?.response?.data?.message || 'Не удалось получить ответ от ИИ',
                isLoading: false
            });
        }
    },

    clearHistory() {
        set({ history: [], error: null });
    }
}));