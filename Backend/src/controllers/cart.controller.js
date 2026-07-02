import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";




export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params
    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const cart = (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }))

    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

    if (isProductAlreadyInCart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
           { returnDocument: 'after' }
        )

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        })
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.price
    })

    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })
}

export const getCart = async (req, res) => {
    const user = req.user

    let cart = await getCartDetails(user._id)

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    })
}

export const incrementCartItemQuantity = async (req, res) => {
    const { productId, variantId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0

    if (itemQuantityInCart + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        { $inc: { "items.$.quantity": 1 } },
        { returnDocument: 'after'}
    )

    return res.status(200).json({
        message: "Cart item quantity incremented successfully",
        success: true
    })
}

export const createOrderController = async (req, res) => {


    const cart = await getCartDetails(req.user._id)

    
    if (!cart) {
        return res.status(400).json({
            message: "Cart is empty",
            success: false
        })
    }

    const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency })

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            productId: item.product._id,
            variantId: item.variant,
            quantity: item.quantity,
            images: item.product.variants.images || item.product.images,
            description: item.product.description,
            price: {
                amount: item.product.variants.price.amount || item.product.price.amount,
                currency: item.product.variants.price.currency || item.product.price.currency
            }
        }))
    })

    return res.status(200).json({
        message: "Order created successfully",
        success: true,
        order
    })
}

export const verifyOrderController = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

    if (!payment) {
        return res.status(400).json({
            message: "Payment not found",
            success: false
        })
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

    if (!isPaymentValid) {
        payment.status = "failed"
        await payment.save()

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        })
    }

    payment.status = "paid"

    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    await payment.save()

   return res.status(200).json({
    message: "Payment verified successfully",
    success: true,
    payment  // ✅ bas ye add karo
})
}

// Isko cart.controller.js ke sabse niche paste kar do
export const removeCartItem = async (req, res) => {
    const { productId, variantId } = req.params

    try {
        const cart = await cartModel.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            })
        }

        // Mongoose array pull matching item out of selection 
        cart.items = cart.items.filter(
            item => !(item.product.toString() === productId && item.variant?.toString() === variantId)
        )

        await cart.save()

        return res.status(200).json({
            message: "Item removed from cart successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}

// Isko cart.controller.js ke sabse niche paste kar do
export const decrementCartItemQuantity = async (req, res) => {
    const { productId, variantId } = req.params

    try {
        const cart = await cartModel.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            })
        }

        const item = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)

        if (!item) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            })
        }

        // Agar quantity 1 hai aur user fir se minus(-) dabata hai, toh item remove ho jaye
        if (item.quantity <= 1) {
            cart.items = cart.items.filter(
                item => !(item.product.toString() === productId && item.variant?.toString() === variantId)
            )
            await cart.save()
            return res.status(200).json({
                message: "Item removed from cart because quantity reached zero",
                success: true
            })
        }

        // Nahi toh quantity 1 se kam kar do
        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": -1 } },
            { returnDocument: 'after' }
        )

        return res.status(200).json({
            message: "Cart item quantity decremented successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        })
    }
}

export const getPaymentByOrderId = async (req, res) => {
    const { razorpayOrderId } = req.params

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpayOrderId,
        user: req.user._id,        // ✅ security - sirf apna order dekh sake
        status: "paid"             // ✅ sirf paid orders
    })

    if (!payment) {
        return res.status(404).json({
            message: "Order not found",
            success: false
        })
    }

    return res.status(200).json({
        success: true,
        payment
    })
}
export const getMyOrders = async (req, res) => {
    const orders = await paymentModel.find({
        user: req.user._id,
        status: "paid"
    }).sort({ createdAt: -1 })

    return res.status(200).json({
        success: true,
        orders
    })
}

export const cancelOrderController = async (req, res) => {
    const { razorpayOrderId } = req.params

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpayOrderId,
        user: req.user._id,
        status: "paid"
    })

    if (!payment) {
        return res.status(404).json({
            message: "Order not found",
            success: false
        })
    }

    // Sirf processing stage pe cancel ho sakta hai
    if (payment.shippingStatus !== "processing") {
        return res.status(400).json({
            message: "Order cannot be cancelled after it has been shipped",
            success: false
        })
    }

    payment.shippingStatus = "cancelled"
    await payment.save()

    return res.status(200).json({
        message: "Order cancelled successfully",
        success: true
    })
}

export const getAllOrdersController = async (req, res) => {
    const orders = await paymentModel.find({ status: "paid" }).sort({ createdAt: -1 })
    return res.status(200).json({ success: true, orders })
}

export const updateShippingStatusController = async (req, res) => {
    const { razorpayOrderId } = req.params
    const { shippingStatus, trackingNumber } = req.body

    const payment = await paymentModel.findOne({ "razorpay.orderId": razorpayOrderId })

    if (!payment) {
        return res.status(404).json({ message: "Order not found", success: false })
    }

    if (shippingStatus) payment.shippingStatus = shippingStatus
    if (trackingNumber) payment.trackingNumber = trackingNumber

    await payment.save()

    return res.status(200).json({ success: true, payment })
}