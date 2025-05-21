import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],

  featuredProducts: [],
  uyUchunProducts: [],
  arzonNarxlarProducts: [],

  selectedProduct: null,

  searchResults: [],
  searchLoading: false,
  searchError: null,

  loading: false,

  error: null,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
        error: null,
      }));
      toast.success("Mahsulot muvaffaqiyatli yaratildi!");
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || "Mahsulot yaratishda xato!",
      });
      toast.error(error.response?.data?.error || "Mahsulot yaratishda xato!");
      console.error("Create Product Error:", error);
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/products");
      set({
        products: response.data.products || response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.error || "Barcha mahsulotlarni yuklashda xato!",
        loading: false,
        products: [],
      });
      toast.error(
        error.response?.data?.error || "Barcha mahsulotlarni yuklashda xato!"
      );
      console.error("Fetch All Products Error:", error);
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
        error: null,
      }));
      toast.success("Mahsulot muvaffaqiyatli ochirildi!");
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || "Mahsulotni ochirishda xato!",
      });
      toast.error(error.response?.data?.error || "Mahsulotni ochirishda xato!");
      console.error("Delete Product Error:", error);
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
        error: null,
      }));
      toast.success("Mahsulot holati yangilandi!");
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.error || "Mahsulot holatini yangilashda xato!",
      });
      toast.error(
        error.response?.data?.error || "Mahsulot holatini yangilashda xato!"
      );
      console.error("Toggle Featured Product Error:", error);
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/products/featured");
      set({
        featuredProducts: response.data.products || response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        featuredProducts: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "Mashhur mahsulotlarni yuklashda xato!",
      });
      console.error("Error fetching featured products:", error);
      toast.error(
        error.response?.data?.message || "Mashhur mahsulotlarni yuklashda xato!"
      );
    }
  },

  fetchUyUchunProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/products/category/Uy uchun");
      set({
        uyUchunProducts: response.data.products || response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        uyUchunProducts: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "'Uy uchun' mahsulotlarni yuklashda xato!",
      });
      console.error("Error fetching Uy uchun products:", error);
      toast.error(
        error.response?.data?.message ||
          "'Uy uchun' mahsulotlarni yuklashda xato!"
      );
    }
  },

  fetchArzonNarxlarProducts: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `/products?sort=price&order=asc&limit=${limit}`
      );
      set({
        arzonNarxlarProducts: response.data.products || response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        arzonNarxlarProducts: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "'Arzon narxlar' mahsulotlarni yuklashda xato!",
      });
      console.error("Error fetching Arzon narxlar products:", error);
      toast.error(
        error.response?.data?.message ||
          "'Arzon narxlar' mahsulotlarni yuklashda xato!"
      );
    }
  },

  fetchProductById: async (productId) => {
    set({ loading: true, error: null, selectedProduct: null });
    try {
      const response = await axios.get(`/products/${productId}`);
      set({ selectedProduct: response.data, loading: false, error: null });
    } catch (error) {
      set({
        selectedProduct: null,
        loading: false,
        error: error.response?.data?.message || "Mahsulotni yuklashda xato!",
      });
      console.error(`Error fetching product with ID ${productId}:`, error);
      toast.error(
        error.response?.data?.message || "Mahsulotni yuklashda xato!"
      );
    }
  },

  fetchSearchResults: async (query) => {
    set({ searchLoading: true, searchError: null, searchResults: [] });
    if (!query || query.trim() === "") {
      set({ searchLoading: false, searchResults: [] });
      return;
    }
    try {
      const response = await axios.get(`/products/search?q=${query}`);
      const resultsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.results)
        ? response.data.results
        : [];
      set({
        searchResults: resultsData,
        searchLoading: false,
        searchError: null,
      });
    } catch (error) {
      set({
        searchResults: [],
        searchLoading: false,
        searchError:
          error.response?.data?.message ||
          "Qidiruv natijalarini yuklashda xato!",
      });
      toast.error(
        error.response?.data?.message || "Qidiruv natijalarini yuklashda xato!"
      );
      console.error("Fetch Search Results Error:", error);
    }
  },
}));
