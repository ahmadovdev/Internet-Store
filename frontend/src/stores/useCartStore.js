import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

const calculateTotals = (cart, coupon = null) => {
    const subtotal = cart.reduce((sum, item) => {
        const itemPrice = item.currentPrice !== undefined && item.currentPrice !== null ? item.currentPrice : item.price;
        return sum + itemPrice * item.quantity;
    }, 0);

    let total = subtotal;
    let discountAmount = 0;

    if (coupon && coupon.discountType && coupon.discountValue) {
        if (coupon.discountType === 'percentage') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'fixed') {
            discountAmount = coupon.discountValue;
        }
        total = Math.max(0, subtotal - discountAmount);
    }

    const totalProductDiscount = cart.reduce((sum, item) => {
        if (item.oldPrice !== undefined && item.oldPrice !== null && item.currentPrice !== undefined && item.currentPrice !== null) {
            return sum + (item.oldPrice - item.currentPrice) * item.quantity;
        }
        return sum;
    }, 0);

    return {
        subtotal,
        total,
        couponDiscountAmount: discountAmount,
        totalProductDiscount
    };
};

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            subtotal: 0,
            total: 0,
            coupon: null,
            isCouponApplied: false,

            addToCart: (product) => set((state) => {
                const existingItemIndex = state.cart.findIndex(item => item._id === product._id);
                let newCart;
                if (existingItemIndex > -1) {
                    newCart = state.cart.map((item, index) =>
                        index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    newCart = [...state.cart, { ...product, quantity: 1 }];
                }
                const { subtotal, total } = calculateTotals(newCart, state.coupon);
                toast.success(`${product.name} savatga qo'shildi!`);
                return {
                    cart: newCart,
                    subtotal,
                    total
                };
            }),

            removeFromCart: (productId) => set((state) => {
                const newCart = state.cart.filter(item => item._id !== productId);
                const { subtotal, total } = calculateTotals(newCart, state.coupon);
                const removedItem = state.cart.find(item => item._id === productId);
                if (removedItem) {
                    toast.success(`${removedItem.name} savatdan olib tashlandi.`);
                }
                return {
                    cart: newCart,
                    subtotal,
                    total
                };
            }),

            updateQuantity: (productId, newQuantity) => set((state) => {
                const quantity = Math.max(1, newQuantity);
                const newCart = state.cart.map(item =>
                    item._id === productId ? { ...item, quantity: quantity } : item
                );
                const { subtotal, total } = calculateTotals(newCart, state.coupon);
                return {
                    cart: newCart,
                    subtotal,
                    total
                };
            }),

            applyCoupon: async (couponCode) => {
                try {
                    let appliedCoupon = null;
                    let message = "";
                    if (couponCode.toUpperCase() === 'CODE10') {
                        appliedCoupon = { code: 'CODE10', discountType: 'percentage', discountValue: 10 };
                        message = "10% chegirma qo'llanildi!";
                    } else if (couponCode.toUpperCase() === 'FIXED50') {
                        appliedCoupon = { code: 'FIXED50', discountType: 'fixed', discountValue: 50000 };
                        message = "50 000 so'm chegirma qo'llanildi!";
                    } else {
                        toast.error("Noto'g'ri kupon kodi!");
                        return;
                    }
                    const { subtotal, total } = calculateTotals(get().cart, appliedCoupon);
                    set({
                        coupon: appliedCoupon,
                        isCouponApplied: true,
                        subtotal,
                        total
                    });
                    toast.success(message);
                } catch (error) {
                    console.error("Error applying coupon:", error);
                    toast.error(error.response?.data?.message || "Kuponni qo'llashda xato yuz berdi!");
                }
            },

            removeCoupon: () => set((state) => {
                const { subtotal, total } = calculateTotals(state.cart, null);
                toast.success("Kupon olib tashlandi.");
                return {
                    coupon: null,
                    isCouponApplied: false,
                    subtotal,
                    total
                };
            }),

            clearCart: () => set({ cart: [], subtotal: 0, total: 0, coupon: null, isCouponApplied: false }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
