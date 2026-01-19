// API service that connects to backend REST API
import API from "./api";

const CURRENT_USER_KEY = 'hardware_store_current_user';

// Items API - connects to backend /items endpoints
export const itemsApi = {
    getAll: () => {
        return API.get("/items");
    },

    create: (itemData) => {
        return API.post("/items", itemData);
    },

    increase: (id, amount) => {
        return API.put(`/items/increase/${id}`, { amount });
    },

    decrease: (id, amount) => {
        return API.put(`/items/decrease/${id}`, { amount });
    },

    delete: (id) => {
        return API.delete(`/items/${id}`);
    },

    update: (id, itemData) => {
        return API.put(`/items/${id}`, itemData);
    }
};

// Users API - connects to backend /users endpoints
export const usersApi = {
    register: async (userData) => {
        const response = await API.post("/users/register", userData);
        return response;
    },

    login: async (credentials) => {
        const response = await API.post("/users/login", credentials);
        // Store current user in localStorage for session persistence
        if (response.data.user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.data.user));
        }
        return response;
    },

    loginWithPin: async (pin) => {
        const response = await API.post("/users/login-pin", { pin });
        if (response.data.user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.data.user));
        }
        return response;
    },

    updatePin: async (email, pin) => {
        const response = await API.put("/users/pin", { email, pin });
        return response;
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        return Promise.resolve({ data: { message: 'Logged out' } });
    },

    getCurrentUser: () => {
        const data = localStorage.getItem(CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
    }
};

export default { itemsApi, usersApi };
