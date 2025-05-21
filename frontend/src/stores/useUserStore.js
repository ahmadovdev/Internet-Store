import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosAuth from '../lib/axiosAuth';
import toast from 'react-hot-toast';

export const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            signup: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const response = await axiosAuth.post('/auth/signup', userData);
                    set({ user: response.data, loading: false });
                    toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
                    return true;
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "Ro'yxatdan o'tishda xato yuz berdi.";
                    set({ error: errorMessage, loading: false, user: null });
                    toast.error(errorMessage);
                    return false;
                }
            },

            login: async (email, password) => {
              set({ loading: true });
          
              try {
                const res = await axiosAuth.post("/auth/login", { email, password });
                console.log(res);
                set({ user: res.data, loading: false });
              } catch (error) {
                set({ loading: false });
                toast.error(error.response.data.message || "An error occurred");
              }
            },

            logout: async () => {
                set({ loading: true, error: null });
                try {
                    await axiosAuth.post('/auth/logout');
                    set({ user: null, loading: false, error: null });
                    toast.success("Tizimdan chiqdingiz.");
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "Tizimdan chiqishda xato yuz berdi.";
                    set({ error: errorMessage, loading: false });
                    toast.error(errorMessage);
                }
            },

            checkAuth: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await axiosAuth.get('/auth/profile');
                    set({ user: response.data, loading: false });
                } catch (error) {
                    set({ user: null, loading: false, error: error.response?.data?.message || "Autentifikatsiya tekshirishda xato." });
                    if (error.response?.status !== 401) {
                        toast.error(error.response?.data?.message || "Autentifikatsiya tekshirishda xato.");
                    }
                }
            },

            clearUser: () => set({ user: null, loading: false, error: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
