// src/pages/ProductDetailPage.jsx

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore.js";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "../stores/useCartStore.js";
import { useUserStore } from "../stores/useUserStore.js";
import toast from "react-hot-toast";
const formatPrice = (price) => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  if (
    numericPrice === undefined ||
    numericPrice === null ||
    isNaN(numericPrice)
  ) {
    return "0";
  }
  return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { selectedProduct, loading, error, fetchProductById } =
    useProductStore();

  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);
  const handleAddToCart = () => {
    if (!user) {
      toast.error(
        "Savatga qoshish uchun ro'yxatdan o'ting yoki tizimga kirinig",
        { id: "login" }
      );
      return;
    }
    if (selectedProduct) {
      addToCart(selectedProduct);
    } else {
      toast.error("Mahsulot júklenbegen", { id: "no_product" });
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
        Mahsulot yuklanmoqda...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Xato: {error}
      </div>
    );
  }
  if (!selectedProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
        Mahsulot topılmadı.
      </div>
    );
  }
  const discountPercentage =
    selectedProduct.oldPrice !== undefined &&
    selectedProduct.oldPrice !== null &&
    selectedProduct.currentPrice !== undefined &&
    selectedProduct.currentPrice !== null &&
    selectedProduct.oldPrice > 0
      ? Math.round(
          ((selectedProduct.oldPrice - selectedProduct.currentPrice) /
            selectedProduct.oldPrice) *
            100
        )
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 w-full flex justify-center items-center bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
        <div className="lg:w-1/2 w-full bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {selectedProduct.name}
            </h1>
            {selectedProduct.rating !== undefined &&
              selectedProduct.rating !== null && (
                <div className="flex items-center text-yellow-500 text-sm mb-4">
                  <Star size={20} fill="currentColor" />
                  <span className="ml-1 text-gray-600 text-base">
                    {selectedProduct.rating?.toFixed(1) || "N/A"} (
                    {selectedProduct.numReviews || 0} sharh)
                  </span>
                </div>
              )}
            <div className="mb-4">
              {selectedProduct.oldPrice !== undefined &&
                selectedProduct.oldPrice !== null && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(selectedProduct.oldPrice)} som
                  </p>
                )}
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(
                  selectedProduct.currentPrice !== undefined &&
                    selectedProduct.currentPrice !== null
                    ? selectedProduct.currentPrice
                    : selectedProduct.price
                )}{" "}
                som
              </p>
              {discountPercentage !== null && discountPercentage > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
              )}
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Tavsif:
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center bg-purple-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart size={24} className="mr-2" /> Savatga qoshish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
