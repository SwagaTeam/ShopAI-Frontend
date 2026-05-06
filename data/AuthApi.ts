import {apiClient} from "@/data/api/apiClient";

export const authApi = {
    login: async (data: any) => {
        const response = await apiClient.post('/Auth/login', data);
        return response.data;
    },
    register: async (data: any) => {
        const response = await apiClient.post('/Auth/register', data);
        return response.data;
    }
};
