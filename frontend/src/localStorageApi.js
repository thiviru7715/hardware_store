// LocalStorage-based data service (replaces backend API)

const ITEMS_KEY = 'hardware_store_items';
const USERS_KEY = 'hardware_store_users';
const CURRENT_USER_KEY = 'hardware_store_current_user';

// Helper functions
const getItems = () => {
    const data = localStorage.getItem(ITEMS_KEY);
    return data ? JSON.parse(data) : [];
};

const saveItems = (items) => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
};

const getUsers = () => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Items API
export const itemsApi = {
    getAll: () => {
        return Promise.resolve({ data: getItems() });
    },

    create: (itemData) => {
        const items = getItems();
        const newItem = {
            id: Date.now(),
            name: itemData.name,
            price: parseFloat(itemData.price),
            quantity: parseInt(itemData.quantity)
        };
        items.push(newItem);
        saveItems(items);
        return Promise.resolve({ data: { message: 'Item added', id: newItem.id } });
    },

    increase: (id, amount) => {
        const items = getItems();
        const item = items.find(i => i.id === parseInt(id));
        if (item) {
            item.quantity += amount;
            saveItems(items);
            return Promise.resolve({ data: { message: 'Stock increased' } });
        }
        return Promise.reject({ response: { data: { message: 'Item not found' } } });
    },

    decrease: (id, amount) => {
        const items = getItems();
        const item = items.find(i => i.id === parseInt(id));
        if (!item) {
            return Promise.reject({ response: { data: { message: 'Item not found' } } });
        }
        if (item.quantity < amount) {
            return Promise.reject({ response: { data: { message: 'Not enough stock' } } });
        }
        item.quantity -= amount;
        saveItems(items);
        return Promise.resolve({ data: { message: 'Stock decreased' } });
    },

    delete: (id) => {
        let items = getItems();
        const originalLength = items.length;
        items = items.filter(i => i.id !== parseInt(id));
        if (items.length === originalLength) {
            return Promise.reject({ response: { data: { message: 'Item not found' } } });
        }
        saveItems(items);
        return Promise.resolve({ data: { message: 'Item deleted' } });
    }
};

// Users API
export const usersApi = {
    register: (userData) => {
        const { name, email, password } = userData;

        if (!name || !email || !password) {
            return Promise.reject({ response: { data: { message: 'All fields are required' } } });
        }

        const users = getUsers();
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            return Promise.reject({ response: { data: { message: 'Email already registered' } } });
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        const { password: _, ...userWithoutPassword } = newUser;
        return Promise.resolve({ data: { message: 'Registration successful', user: userWithoutPassword } });
    },

    login: (credentials) => {
        const { email, password } = credentials;

        if (!email || !password) {
            return Promise.reject({ response: { data: { message: 'Email and password are required' } } });
        }

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return Promise.reject({ response: { data: { message: 'Invalid email or password' } } });
        }

        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        return Promise.resolve({ data: { message: 'Login successful', user: userWithoutPassword } });
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
