import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary.jsx";
import { useCartStore } from "../stores/useCartStore";
const CartPage = () => {
  const { cart } = useCartStore();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  return (
    <div className="bg-gray-200 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            Savat ({totalItems})
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-600 text-lg font-medium">
                Savatingiz hozircha bosh. Mahsulotlar qoshing!
              </div>
            ) : (
              cart.map((item) => (
                <CartItem key={item._id || item.id} item={item} />
              ))
            )}
          </div>
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
