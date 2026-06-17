import axios from "axios";
import {useAuthStore} from "@/data/store/useAuthStore";

export const apiClient = axios.create({
    baseURL: "https://84.252.132.226/api/",
});

export function getStoredAccessToken() {
    const stateToken = useAuthStore.getState().token;
    if (stateToken || typeof window === "undefined") {
        return stateToken;
    }

    try {
        const raw = window.localStorage.getItem("auth-storage");
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return parsed?.state?.token ?? null;
    } catch {
        return null;
    }
}

apiClient.interceptors.request.use((config) => {
    const token = getStoredAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { refreshToken } = useAuthStore.getState();
                const response = await apiClient.post(`/Auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { accessToken, refreshToken: newRefresh } = response.data;

                useAuthStore.getState().setAuth(accessToken, newRefresh);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAuth();
                window.location.href="/auth"
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
