import React from "react";
import { useCartStore } from "../stores/useCartStore";
const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) return "0";
  const parts = price.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

const OrderSummary = () => {
  const {
    cart,
    subtotal,
    total,
    coupon,
    isCouponApplied,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const [couponCode, setCouponCode] = React.useState("");
  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
    } else {
      console.log("Kupon kodini kiriting!");
    }
  };
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalDiscount = subtotal - total;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-900">Buyurtmangiz</h2>
      <div className="flex justify-between text-gray-700 text-sm">
        <span>Mahsulotlar ({totalItems}):</span>
        <span>{formatPrice(subtotal)} som</span>
      </div>
      {totalDiscount > 0 && (
        <div className="flex justify-between text-green-600 text-sm font-medium">
          <span>Chegirma:</span>
          <span>- {formatPrice(totalDiscount)} som</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-gray-900 text-base md:text-lg">
        <span>Jami:</span>
        <span>{formatPrice(total)} som</span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Sizda kupon bormi?
        </h3>
        {isCouponApplied && coupon ? (
          <div className="flex justify-between items-center bg-gray-100 rounded-md p-3 border border-gray-200">
            <span className="font-medium text-gray-800">
              {coupon.code || "Qo'llanilgan kupon"}
            </span>
            <button
              className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none"
              onClick={removeCoupon}
            >
              Olib tashlash
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Kupon kodini kiriting"
              className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              className="shrink-0 bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600"
              onClick={handleApplyCoupon}
            >
              Qollash
            </button>
          </div>
        )}
      </div>
      <button className="mt-4 w-full bg-purple-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600">
        Rasmiylashtirishga otish
      </button>
    </div>
  );
};

export default OrderSummary;
