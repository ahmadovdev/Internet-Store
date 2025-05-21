import { Heart, ShoppingCart, Star } from "lucide-react"; // Ikonkalar uchun
import { useUserStore } from "../stores/useUserStore.js";
import { useCartStore } from "../stores/useCartStore.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { user } = useUserStore();

  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Savatga qo'shish uchun tizimga kiring", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

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

  const discountPercentage =
    product &&
    product.oldPrice !== undefined &&
    product.oldPrice !== null &&
    product.currentPrice !== undefined &&
    product.currentPrice !== null &&
    product.oldPrice > 0
      ? Math.round(
          ((product.oldPrice - product.currentPrice) / product.oldPrice) * 100
        )
      : null;

  return (
    <Link to={`/products/${product._id}`} className="block h-full">
      <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative h-full flex flex-col">
        <div className="border border-gray-300 rounded-lg relative w-full h-48 overflow-hidden flex justify-center items-center bg-gray-50 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          {discountPercentage !== null && discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              -{discountPercentage}%
            </span>
          )}
          <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:text-red-500 transition-colors z-10">
            <Heart size={20} />
          </button>
        </div>
        <div className="p-4 flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>
          {product.rating !== undefined && product.rating !== null && (
            <div className="flex items-center text-yellow-500 text-sm my-1">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 text-gray-600 text-xs">
                {product.rating?.toFixed(1) || "N/A"} ({product.numReviews || 0}{" "}
                sharh)
              </span>
            </div>
          )}
          <div className="mt-2">
            {product.oldPrice !== undefined && product.oldPrice !== null && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(product.oldPrice)} som
              </p>
            )}
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(
                product.currentPrice !== undefined &&
                  product.currentPrice !== null
                  ? product.currentPrice
                  : product.price
              )}
              som
            </p>
          </div>
        </div>
        <button
          className="absolute bottom-4 right-4 bg-purple-600 text-white rounded-full p-2 shadow-lg hover:bg-purple-700 transition-colors z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          <ShoppingCart size={24} />
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
