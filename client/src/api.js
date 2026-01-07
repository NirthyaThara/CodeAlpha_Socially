import axios from 'axios';
// export const BASE_URL = 'http://localhost:5000';
export const BASE_URL = 'https://codealpha-socially.onrender.com';
const API = axios.create({
    baseURL: `${BASE_URL}/api`,
});

// Add token to requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Handle unauthorized responses
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // We can't easily trigger a state update here without passing setUser, 
            // but clearing localStorage ensures the next reload starts fresh.
            // Or we can just redirect to /auth
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data) => API.post('/auth/login', data),
    register: (data) => API.post('/auth/register', data),
    updateDP: (data) => API.put('/auth/update-dp', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateProfile: (data) => API.put('/auth/update-profile', data),
    searchUsers: (query) => API.get(`/auth/search?q=${query}`)
};

export const postAPI = {
    getAll: () => API.get('/posts'),
    create: (data) => API.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    likePost: (id) => API.post(`/posts/${id}/like`),
    sharePost: (id) => API.post(`/posts/${id}/share`),
    savePost: (id) => API.post(`/posts/${id}/save`),
    getSavedPosts: () => API.get('/posts/saved'),
    update: (id, content) => API.put(`/posts/${id}`, { content }),
    delete: (id) => API.delete(`/posts/${id}`)
};

export const messageAPI = {
    getChatList: () => API.get('/messages/users'),
    getMessages: (id) => API.get(`/messages/${id}`),
    sendMessage: (data) => API.post('/messages', data)
};

export const notificationAPI = {
    getNotifications: () => API.get('/notifications'),
    markRead: () => API.put('/notifications/read')
};

export default API;
