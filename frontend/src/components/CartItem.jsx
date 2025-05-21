import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore"; // Zustand store

const formatPrice = (price) => {
  if (price === undefined || price === null) return "0";
  const numericPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
      : price;
  if (isNaN(numericPrice)) return "0";
  return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  const discountAmount = item.oldPrice
    ? (item.oldPrice - item.price) * item.quantity
    : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-start gap-4 md:gap-6 relative">
      <div className="absolute top-4 left-4 md:static flex-shrink-0">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
        />
      </div>
      <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden mt-6 md:mt-0 ml-6 md:ml-0">
        <img
          className="w-full h-full object-cover object-center"
          src={item.image}
          alt={item.name}
        />
      </div>
      <div className="flex-grow flex flex-col justify-between min-w-0 gap-2">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Uzum bozorlari omborida</p>
          {item.deliveryDate && (
            <p className="text-sm font-semibold text-gray-900">
              {item.deliveryDate} dan yetkazamiz
            </p>
          )}
          <p className="text-base font-semibold text-gray-900">{item.name}</p>
          {item.options && typeof item.options === "object" && (
            <div className="text-sm text-gray-600">
              {Object.entries(item.options).map(([key, value]) => (
                <p key={key}>
                  <span className="font-medium capitalize">{key}:</span> {value}
                </p>
              ))}
            </div>
          )}
          {item.description && typeof item.description === "string" && (
            <p className="text-sm text-gray-600">{item.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
            onClick={() => {
              removeFromCart(item._id);
            }}
          >
            <Trash size={18} className="mr-1" />
            Yoq qilish
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0 w-32 md:w-36">
        <div className="w-full text-end">
          <p className="text-lg md:text-xl font-bold text-gray-900">
            {formatPrice(item.price * item.quantity)} som
          </p>
          {item.oldPrice && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(item.oldPrice * item.quantity)} som
            </p>
          )}
          {discountAmount > 0 && (
            <p className="text-xs text-red-500 font-semibold">
              -{formatPrice(discountAmount)} som chegirma
            </p>
          )}
        </div>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
            onClick={() =>
              item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)
            }
          >
            <Minus size={18} />
          </button>
          <p className="w-8 text-center text-sm font-medium text-gray-900">
            {item.quantity}
          </p>
          <button
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartItem;
