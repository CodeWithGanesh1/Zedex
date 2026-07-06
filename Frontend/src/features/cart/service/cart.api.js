import axios from "axios"

const BACKEND_URL = import.meta.env.PROD
  ? "https://zedex-2.onrender.com"
  : "";

const cartApiInstance = axios.create({
    baseURL: `${BACKEND_URL}/api/cart`,
    withCredentials: true
})

export const addItem = async ({ productId, variantId }) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })
    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}

// 👑 FIXED: Ab ye sahi Render URL par hit karega aur CORS/Vercel error nahi aayega
export const decrementCartItemApi = async ({ productId, variantId }) => {
    try {
        const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`);
        return response.data;
    } catch (error) {
        console.error("API Error while decrementing item:", error);
        throw error;
    }
};

// 👑 FIXED: Ab ye bhi absolute URL par chalega aur item sahi se remove hoga
export const removeCartItemApi = async ({ productId, variantId }) => {
    try {
        const response = await cartApiInstance.delete(`/item/remove/${productId}/${variantId}`);
        return response.data;
    } catch (error) {
        console.error("API Error while removing item:", error);
        throw error;
    }
};

export const createCartOrder = async () => {
    const response = await cartApiInstance.post("/payment/create/order")
    return response.data
}

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    return response.data
}

// 🚀 NEW: Order Success page ke liye jo naya function banaya tha, use yahan export kar diya
export const getOrderDetailsApi = async (orderId) => {
    try {
        const response = await cartApiInstance.get(`/payment/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("API Error while fetching order details:", error);
        throw error;
    }
}