import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import axios from 'axios'

const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceHigh: '#eae8e5',
    onSurface: '#1b1c1a',
    onSurfaceVariant: '#4d463a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    primaryDark: '#745a27',
    outlineVariant: '#d0c5b5',
    outline: '#7f7668',
}

const statusConfig = {
    processing: { label: 'Processing', color: '#7A6E63' },
    shipped: { label: 'Shipped', color: '#C9A96E' },
    out_for_delivery: { label: 'Out for Delivery', color: '#745a27' },
    delivered: { label: 'Delivered', color: '#4a7c59' },
    cancelled: { label: 'Cancelled', color: '#c0392b' },
}

const timelineSteps = [
    { key: 'processing', label: 'Order Placed', sub: 'Your order is being prepared' },
    { key: 'shipped', label: 'Shipped', sub: 'On its way to you' },
    { key: 'out_for_delivery', label: 'Out for Delivery', sub: 'Arriving today' },
    { key: 'delivered', label: 'Delivered', sub: 'Enjoy your purchase' },
]

const stepIndex = { processing: 0, shipped: 1, out_for_delivery: 2, delivered: 3 }

const formatPrice = (amount, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

const formatDate = (date) => {
    if (!date) return "Date unavailable"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "Date unavailable"
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const OrderDetail = () => {
    const { orderId } = useParams()

    const BACKEND_URL = import.meta.env.PROD 
    ? "https://zedex-2.onrender.com" 
    : ""

    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState(false)
    const [cancelError, setCancelError] = useState(null)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
const res = await axios.get(`${BACKEND_URL}/api/cart/payment/order/${orderId}`, { withCredentials: true })   
             if (res.data.success) setPayment(res.data.payment)
            } catch (err) {
                console.error("Order fetch failed:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [orderId])

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return
        setCancelling(true)
        setCancelError(null)
        try {
            const res = await axios.patch(
                `/api/cart/payment/order/${orderId}/cancel`,
                {},
                { withCredentials: true }
            )
            if (res.data.success) {
                setPayment(prev => ({ ...prev, shippingStatus: "cancelled" }))
            }
        } catch (err) {
            setCancelError(err.response?.data?.message || "Cancellation failed")
        } finally {
            setCancelling(false)
        }
    }

    const currentStep = stepIndex[payment?.shippingStatus] ?? 0

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div className="min-h-screen pb-24" style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}>
                <main className="pt-12 lg:pt-20 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">

                    <Link to="/orders" className="text-xs uppercase tracking-widest flex items-center gap-2 mb-10" style={{ color: tokens.secondary }}>
                        ← All Orders
                    </Link>

                    {loading ? (
                        <div className="animate-pulse space-y-8">
                            <div className="h-8 w-1/3 rounded" style={{ backgroundColor: tokens.surfaceHigh }} />
                            <div className="h-32 rounded" style={{ backgroundColor: tokens.surfaceLow }} />
                            <div className="h-48 rounded" style={{ backgroundColor: tokens.surfaceLow }} />
                        </div>
                    ) : !payment ? (
                        <p className="text-center py-24 text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurfaceVariant }}>
                            Order not found.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* Left */}
                            <div className="lg:col-span-7 space-y-10">

                                {/* Header */}
                                <div className="space-y-2">
                                    <span className="uppercase tracking-[0.2em] text-[10px]" style={{ color: tokens.secondary }}>
                                        Order Reference
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.primaryDark }}>
                                        #{payment.razorpay.orderId}
                                    </h1>
                                    <p className="text-xs uppercase tracking-widest" style={{ color: tokens.outline }}>
                                        Placed on {formatDate(payment.createdAt)}
                                    </p>
                                </div>

                                {/* Timeline or Cancelled */}
                                {payment.shippingStatus === "cancelled" ? (
                                    <div className="p-8 space-y-4" style={{ backgroundColor: tokens.surfaceLow }}>
                                        <h3 className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                            Shipping Status
                                        </h3>
                                        <div className="flex items-center gap-4 p-6" style={{ backgroundColor: '#c0392b08', border: '1px solid #c0392b25' }}>
                                            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#c0392b' }}>
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                    <path d="M2 2l6 6M8 2l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: '#c0392b' }}>Order Cancelled</p>
                                                <p className="text-xs mt-0.5" style={{ color: tokens.secondary }}>
                                                    Refund will be processed in 5-7 business days
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8" style={{ backgroundColor: tokens.surfaceLow }}>
                                        <h3 className="text-xl mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                            Shipping Status
                                        </h3>
                                        <div className="relative">
                                            <div className="absolute left-3 top-0 bottom-0 w-px" style={{ backgroundColor: tokens.outlineVariant }} />
                                            <div className="space-y-8">
                                                {timelineSteps.map((step, index) => {
                                                    const isCompleted = index <= currentStep
                                                    const isCurrent = index === currentStep
                                                    return (
                                                        <div key={step.key} className="flex gap-6 items-start relative">
                                                            <div
                                                                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10 transition-all duration-500"
                                                                style={{
                                                                    backgroundColor: isCompleted ? tokens.primaryDark : tokens.surfaceHigh,
                                                                    border: isCurrent ? `2px solid ${tokens.primaryDark}` : 'none'
                                                                }}
                                                            >
                                                                {isCompleted && (
                                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div className="pb-2">
                                                                <p className="text-sm font-medium" style={{ color: isCompleted ? tokens.onSurface : tokens.muted }}>
                                                                    {step.label}
                                                                </p>
                                                                <p className="text-xs mt-0.5" style={{ color: tokens.secondary }}>
                                                                    {step.sub}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Order Items */}
                                <div className="p-8 space-y-6" style={{ backgroundColor: tokens.surfaceLow }}>
                                    <h3 className="text-xl pb-4" style={{ fontFamily: "'Cormorant Garamond', serif", borderBottom: `1px solid ${tokens.outlineVariant}` }}>
                                        Order Items
                                    </h3>
                                    {payment.orderItems.map((item, index) => (
                                        <div key={index} className="flex gap-6 items-center">
                                            <div className="w-20 h-24 flex-shrink-0 overflow-hidden" style={{ backgroundColor: tokens.surfaceHigh }}>
                                                {item.images?.[0]?.url ? (
                                                    <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover grayscale-[20%]" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: tokens.muted }}>No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-grow space-y-1">
                                                <p className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</p>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs uppercase tracking-tighter" style={{ color: tokens.outline }}>Qty: {item.quantity}</p>
                                                )}
                                                <p className="font-semibold text-sm">{formatPrice(item.price?.amount, item.price?.currency)}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="space-y-3 pt-4" style={{ borderTop: `1px solid ${tokens.outlineVariant}` }}>
                                        <div className="flex justify-between text-sm uppercase tracking-widest" style={{ color: tokens.secondary }}>
                                            <span>Subtotal</span>
                                            <span>{formatPrice(payment.price?.amount, payment.price?.currency)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm uppercase tracking-widest" style={{ color: tokens.secondary }}>
                                            <span>Shipping</span>
                                            <span>Complimentary</span>
                                        </div>
                                        <div className="flex justify-between text-lg pt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                            <span>Total</span>
                                            <span style={{ color: tokens.primaryDark }}>{formatPrice(payment.price?.amount, payment.price?.currency)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">

                                {/* Tracking */}
                                <div className="p-8 space-y-3" style={{ backgroundColor: tokens.surfaceLow }}>
                                    <h3 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Tracking</h3>
                                    {payment.trackingNumber ? (
                                        <p className="text-sm uppercase tracking-widest" style={{ color: tokens.primaryDark }}>{payment.trackingNumber}</p>
                                    ) : (
                                        <p className="text-sm" style={{ color: tokens.secondary }}>Tracking number will appear once shipped.</p>
                                    )}
                                </div>

                                {/* Payment Info */}
                                <div className="p-8 space-y-3" style={{ backgroundColor: tokens.surfaceLow }}>
                                    <h3 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Payment</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="uppercase tracking-widest text-xs" style={{ color: tokens.outline }}>Status</span>
                                            <span className="uppercase text-xs tracking-widest" style={{ color: '#4a7c59' }}>Paid</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="uppercase tracking-widest text-xs" style={{ color: tokens.outline }}>Payment ID</span>
                                            <span className="text-xs" style={{ color: tokens.secondary }}>{payment.razorpay.paymentId?.slice(-10)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cancel Button */}
                                {payment.shippingStatus === "processing" && (
                                    <div className="space-y-2">
                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={cancelling}
                                            className="w-full py-4 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: '1px solid #c0392b40',
                                                color: cancelling ? tokens.muted : '#c0392b',
                                                cursor: cancelling ? 'not-allowed' : 'pointer'
                                            }}
                                            onMouseEnter={e => { if (!cancelling) e.currentTarget.style.backgroundColor = '#c0392b10' }}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            {cancelling ? "Cancelling..." : "Cancel Order"}
                                        </button>
                                        {cancelError && (
                                            <p className="text-[11px] text-center" style={{ color: '#c0392b' }}>{cancelError}</p>
                                        )}
                                    </div>
                                )}

                                {/* Cancelled Message */}
                                {payment.shippingStatus === "cancelled" && (
                                    <div className="py-4 px-6 text-center space-y-1" style={{ backgroundColor: '#c0392b10', border: '1px solid #c0392b30' }}>
                                        <p className="text-xs uppercase tracking-widest" style={{ color: '#c0392b' }}>Order Cancelled</p>
                                        <p className="text-[10px]" style={{ color: tokens.secondary }}>Refund will be processed in 5-7 business days</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                    <Link
                                        to="/"
                                        className="py-4 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                                        style={{ backgroundColor: tokens.primaryDark, color: '#ffffff' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        Continue Shopping
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="py-4 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                                        style={{ backgroundColor: 'transparent', border: `1px solid ${tokens.outline}`, color: tokens.onSurface }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = tokens.surfaceLow}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        All Orders
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}

export default OrderDetail