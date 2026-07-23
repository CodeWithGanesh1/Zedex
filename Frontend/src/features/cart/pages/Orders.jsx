import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
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
    processing: { label: 'Processing', color: tokens.secondary },
    shipped: { label: 'Shipped', color: tokens.primary },
    out_for_delivery: { label: 'Out for Delivery', color: tokens.primaryDark },
    delivered: { label: 'Delivered', color: '#4a7c59' },
}



const formatPrice = (amount, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

const formatDate = (date) => {
    if (!date) return "Date unavailable"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "Date unavailable"
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const Orders = () => {
    const [orders, setOrders] = useState([])

    const BACKEND_URL = import.meta.env.PROD 
    ? "https://zedex-2.onrender.com" 
    : ""

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
const res = await axios.get(`${BACKEND_URL}/api/cart/payment/my-orders`, { withCredentials: true })                if (res.data.success) setOrders(res.data.orders)
            } catch (err) {
                console.error("Orders fetch failed:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div className="min-h-screen pb-24" style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}>
                <main className="pt-12 lg:pt-20 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="mb-12 space-y-2">
                        <span className="uppercase tracking-[0.2em] text-[10px]" style={{ color: tokens.secondary }}>
                            Your Account
                        </span>
                        <h1 className="text-5xl md:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}>
                            My Orders
                        </h1>
                    </div>

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-6 animate-pulse flex gap-6" style={{ backgroundColor: tokens.surfaceLow }}>
                                    <div className="w-20 h-24 rounded" style={{ backgroundColor: tokens.surfaceHigh }} />
                                    <div className="flex-grow space-y-3 pt-2">
                                        <div className="h-4 rounded w-1/2" style={{ backgroundColor: tokens.surfaceHigh }} />
                                        <div className="h-3 rounded w-1/4" style={{ backgroundColor: tokens.surfaceHigh }} />
                                        <div className="h-3 rounded w-1/3" style={{ backgroundColor: tokens.surfaceHigh }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && orders.length === 0 && (
                        <div className="text-center py-24 space-y-4">
                            <p className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurfaceVariant }}>
                                No orders yet.
                            </p>
                            <Link to="/" className="text-xs uppercase tracking-widest underline" style={{ color: tokens.primaryDark }}>
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {/* Orders List */}
                    {!loading && orders.length > 0 && (
    <div style={{ borderTop: `1px solid ${tokens.outlineVariant}` }}>
        {orders.map((order, i) => {
            const status = statusConfig[order.shippingStatus] || statusConfig.processing
            const firstItem = order.orderItems[0]
            const extraItems = order.orderItems.length - 1

            return (
                <Link
                    key={order._id}
                    to={`/orders/${order.razorpay.orderId}`}
                    className="group flex transition-all duration-500"
                    style={{ borderBottom: `1px solid ${tokens.outlineVariant}`, minHeight: '160px' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = tokens.surfaceLow}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {/* Serial Number */}
                    <div className="hidden md:flex items-center justify-center w-20 flex-shrink-0">
                        <span
                            className="text-[11px] uppercase tracking-[0.2em]"
                            style={{ color: tokens.muted, writingMode: 'vertical-rl' }}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Images */}
                    <div className="flex items-center gap-2 py-8 pl-2 flex-shrink-0">
                        {order.orderItems.slice(0, 3).map((item, idx) => (
                            <div
                                key={idx}
                                className="overflow-hidden flex-shrink-0 transition-all duration-500 group-hover:scale-[1.03]"
                                style={{
                                    width: idx === 0 ? '90px' : '55px',
                                    height: idx === 0 ? '115px' : '70px',
                                    backgroundColor: tokens.surfaceHigh,
                                    marginTop: idx === 0 ? '0' : '24px',
                                    opacity: idx === 0 ? 1 : 0.55,
                                }}
                            >
                                {item.images?.[0]?.url && (
                                    <img
                                        src={item.images[0].url}
                                        alt={item.title}
                                        className="w-full h-full object-cover grayscale-[10%]"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Main Info */}
                    <div className="flex-grow flex flex-col justify-center px-10 py-8 space-y-3">
                        <p
                            className="text-xl md:text-2xl leading-snug"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
                        >
                            {firstItem?.title}
                            {extraItems > 0 && (
                                <span className="text-base ml-3" style={{ color: tokens.secondary }}>
                                    & {extraItems} other{extraItems > 1 ? 's' : ''}
                                </span>
                            )}
                        </p>

                        <div className="flex items-center gap-6">
                            <p className="text-base font-medium" style={{ color: tokens.onSurface }}>
                                {formatPrice(order.price?.amount, order.price?.currency)}
                            </p>
                            <span style={{ color: tokens.outlineVariant }}>·</span>
                            <p className="text-[11px] uppercase tracking-widest" style={{ color: tokens.outline }}>
                                {formatDate(order.createdAt)}
                            </p>
                        </div>

                        <p className="text-[11px] uppercase tracking-widest" style={{ color: tokens.muted }}>
                            {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Right - Status + CTA */}
                    <div className="flex flex-col items-end justify-center px-10 py-8 gap-4 flex-shrink-0">
                        <span
                            className="text-[10px] uppercase tracking-[0.18em] px-4 py-2"
                            style={{
                                backgroundColor: `${status.color}12`,
                                color: status.color,
                                border: `1px solid ${status.color}30`
                            }}
                        >
                            {status.label}
                        </span>
                        <span
                            className="text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
                            style={{ color: tokens.primaryDark }}
                        >
                            View Order <span>→</span>
                        </span>
                    </div>
                </Link>
            )
        })}
    </div>
)}
                </main>
            </div>
        </>
    )
}

export default Orders