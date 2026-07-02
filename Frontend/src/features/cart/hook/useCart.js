import { 
    addItem, 
    getCart, 
    incrementCartItemApi, 
    decrementCartItemApi, // 1. Yahan decrementCartItemApi ko add kiya
    removeCartItemApi, 
    createCartOrder, 
    verifyCartOrder 
} from "../service/cart.api"
import { useDispatch ,useSelector } from "react-redux"
import { setCart, incrementCartItem } from "../state/cart.slice"
import {  updateTotalPrice } from '../state/cart.slice';

export const useCart = () => {

    const dispatch = useDispatch()

    // Redux store se cart data nikalna
    const cartItems = useSelector((state) => state.cart.items);
    const totalPrice = useSelector((state) => state.cart.totalPrice);

    // Cart me item add karne ka function
    const addToCart = (product) => {
        dispatch(addItem(product));
        dispatch(updateTotalPrice());
    }

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        return data
    }

    async function handleGetCart() {
        try {
            const data = await getCart();
            console.log("Backend Cart Data:", data);
            
            if (data && data.cart) {
                dispatch(setCart(data.cart));
            } else {
                dispatch(setCart(data));
            }
        } catch (error) {
            console.error("Cart fetch error:", error);
        }
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        await incrementCartItemApi({ productId, variantId })
        // Increment ke baad direct refresh kar rahe hain taaki calculation real-time update ho
        await handleGetCart();
    }

    // 2. YAHAN PASTE KIYA: Handle Decrement Function
    async function handleDecrementCartItem({ productId, variantId }) {
        if (!productId || !variantId) {
            console.error("Missing structural elements for decrement");
            return;
        }
        try {
            await decrementCartItemApi({ productId, variantId });
            // Decrement hone ke baad data refresh karega taaki UI update ho jaye
            await handleGetCart(); 
        } catch (error) {
            console.error("Failed to decrement item quantity:", error);
        }
    }

    async function handleRemoveCartItem({ productId, variantId }) {
        if (!productId || !variantId) {
            console.error("Missing structural elements for removal");
            return;
        }
        try {
            await removeCartItemApi({ productId, variantId });
            await handleGetCart(); 
        } catch (error) {
            console.error("Failed to remove item from cart state:", error);
        }
    }

    async function handleCreateCartOrder() {
        const data = await createCartOrder()
        return data.order
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success
    }

    // 3. RETURN OBJECT ME ADD KIYA: handleDecrementCartItem ko export kiya taaki Cart.jsx me mile
    return { 
        handleAddItem, 
        handleGetCart, 
        handleIncrementCartItem, 
        handleDecrementCartItem, // <-- Yeh add ho gaya
        handleRemoveCartItem, 
        handleCreateCartOrder, 
        handleVerifyCartOrder,
        cartItems,
        totalPrice,
        addToCart 
    }
}