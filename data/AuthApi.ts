import {apiClient} from "@/data/api/apiClient";

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/Auth/login', data);
        return response.data;
    },
    register: async (data: RegisterRequest): Promise<unknown> => {
        const response = await apiClient.post('/Auth/register', data);
        return response.data;
    }
};
