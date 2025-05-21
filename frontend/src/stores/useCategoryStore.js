// src/stores/useCategoryStore.js

import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get("/categories");
      set({ categories: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({
        error: error.message || "Kategoriyalarni yuklab bo'lmadi",
        loading: false,
      });
    }
  },

  fetchProductsByCategory: async (slug) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/categories/${slug}`);
      console.log("data", response.data)
      set({ products: response.data.products, loading: false });
    } catch (error) {
      console.error("Fetch error:", error);
      set({
        error:
          error.response?.data?.error ||
          "Kategoriya bo‘yicha mahsulotlarni yuklashda xato!",
        loading: false,
        products: [],
      });
      toast.error(
        error.response?.data?.error ||
          "Kategoriya bo‘yicha mahsulotlarni yuklashda xato!"
      );
    }
  },
}));
