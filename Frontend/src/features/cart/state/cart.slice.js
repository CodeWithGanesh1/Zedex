import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: 0, // 0 se start karna better hai
        currency: "INR",
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
        },
        addItem: (state, action) => {
            const newItem = action.payload;
            // Check karo ki kya item pehle se hai
            const existingItem = state.items.find(
                (item) => item.product._id === newItem.product._id && item.variant === newItem.variant
            );

            if (existingItem) {
                // Agar hai, toh sirf quantity badhao
                existingItem.quantity += newItem.quantity || 1;
            } else {
                // Agar nahi hai, toh add karo
                state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
            }
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;
            const item = state.items.find(
                (item) => item.product._id === productId && item.variant === variantId
            );
            
            if (item) {
                item.quantity += 1;
            }
        },
        // Total price update karne ke liye ye reducer zaroori hai
        updateTotalPrice: (state) => {
            state.totalPrice = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        }
    }
});

export const { setCart, addItem, incrementCartItem, updateTotalPrice } = cartSlice.actions;
export default cartSlice.reducer;

