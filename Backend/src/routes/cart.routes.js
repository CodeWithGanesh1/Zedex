import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart, validateIncrementCartItemQuantity } from '../validator/cart.validator.js';
import { addToCart, createOrderController, getCart, incrementCartItemQuantity,decrementCartItemQuantity,verifyOrderController,removeCartItem,getPaymentByOrderId } from '../controllers/cart.controller.js';
import {  getMyOrders } from '../controllers/cart.controller.js';
import { cancelOrderController } from '../controllers/cart.controller.js';
import { getAllOrdersController, updateShippingStatusController } from '../controllers/cart.controller.js';


const router = express.Router();


/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)



/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */
router.get('/', authenticateUser, getCart)


/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increment item quantity in cart by one
 * @access Private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 */
router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, incrementCartItemQuantity)

/**
 * @route DELETE /api/cart/item/remove/:productId/:variantId
 * @desc Remove item from cart completely
 * @access Private
*/

/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @desc Decrement item quantity in cart by one
 * @access Private
 */
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, decrementCartItemQuantity)

// Pehle ye check karo ki tumhare cart.controller.js me 'removeCartItem' naam ka function exported hai ya nahi.
// Agar controller me naam alag hai (jaise deleteCartItem), toh wahi naam upar import me aur yahan use karna.
router.delete("/item/remove/:productId/:variantId", authenticateUser, removeCartItem)

/**
 * @route POST /api/cart/payment/create/order
 */
router.post("/payment/create/order", authenticateUser, createOrderController)


router.post("/payment/verify/order", authenticateUser, verifyOrderController)

router.get("/payment/order/:razorpayOrderId", authenticateUser, getPaymentByOrderId)

router.get("/payment/my-orders", authenticateUser, getMyOrders)

router.patch("/payment/order/:razorpayOrderId/cancel", authenticateUser, cancelOrderController)

router.get("/payment/all-orders", authenticateUser, getAllOrdersController)
router.patch("/payment/order/:razorpayOrderId/shipping", authenticateUser, updateShippingStatusController)

export default router;