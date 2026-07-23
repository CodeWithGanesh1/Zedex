import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router'
import axios from 'axios'

const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceLowest: '#ffffff',
    surfaceHigh: '#eae8e5',
    surfaceHighest: '#e4e2df',
    onSurface: '#1b1c1a',
    onSurfaceVariant: '#4d463a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    primaryDark: '#745a27',
    outlineVariant: '#d0c5b5',
    outline: '#7f7668',
}

const OrderSuccess = () => {
    const location = useLocation()
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)

    const BACKEND_URL = import.meta.env.PROD 
        ? "https://zedex-2.onrender.com" 
        : ""


    const queryParams = new URLSearchParams(location.search)
    const orderId = queryParams.get("order_id") || "SN-00000"

    // ✅ Payment data fetch karo backend se
    useEffect(() => {
        const fetchPayment = async () => {
            try {
const res = await axios.get(`${BACKEND_URL}/api/cart/payment/order/${orderId}`, {                    withCredentials: true
                })
                if (res.data.success) {
                    setPayment(res.data.payment)
                }
            } catch (err) {
                console.error("Payment fetch failed:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPayment()
    }, [orderId])

    // Arrival estimate - order date se 3-5 din baad
    const getArrivalEstimate = (createdAt) => {
        if (!createdAt) return "5 — 7 business days"
        const date = new Date(createdAt)
        const from = new Date(date); from.setDate(from.getDate() + 3)
        const to = new Date(date); to.setDate(to.getDate() + 5)
        return `${from.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} — ${to.toLocaleDateString('en-US', { day: 'numeric' })}`
    }

    const formatPrice = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div
                className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}
            >
                <main className="pt-12 lg:pt-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Left Column */}
                        <div className="lg:col-span-7 space-y-12">
                            <section className="space-y-6">
                                <span
                                    className="uppercase tracking-[0.2em] text-[10px]"
                                    style={{ color: tokens.secondary }}
                                >
                                    TRANSACTION COMPLETE
                                </span>
                                <h1
                                    className="text-5xl md:text-7xl leading-tight font-light tracking-tight"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
                                >
                                    A piece of our <br />
                                    <i className="italic">Atelier</i> is yours.
                                </h1>
                                <div className="space-y-2 mt-6">
                                    <p className="text-sm uppercase tracking-widest" style={{ color: tokens.outline }}>
                                        Order Reference
                                    </p>
                                    <p className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.primaryDark }}>
                                        #{orderId}
                                    </p>
                                </div>
                            </section>

                            {/* Order Summary */}
                            <section className="p-8 md:p-12 space-y-8" style={{ backgroundColor: tokens.surfaceLow }}>
                                <h3
                                    className="text-xl pb-4"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", borderBottom: `1px solid ${tokens.outlineVariant}` }}
                                >
                                    Order Summary
                                </h3>

                                {loading ? (
                                    // Skeleton loader
                                    <div className="space-y-4 animate-pulse">
                                        <div className="flex gap-6">
                                            <div className="w-24 h-32 rounded" style={{ backgroundColor: tokens.surfaceHigh }} />
                                            <div className="flex-grow space-y-3 pt-2">
                                                <div className="h-4 rounded w-3/4" style={{ backgroundColor: tokens.surfaceHigh }} />
                                                <div className="h-3 rounded w-1/3" style={{ backgroundColor: tokens.surfaceHigh }} />
                                                <div className="h-4 rounded w-1/4" style={{ backgroundColor: tokens.surfaceHigh }} />
                                            </div>
                                        </div>
                                    </div>
                                ) : payment ? (
                                    <>
                                        {/* ✅ Real order items */}
                                        <div className="space-y-6">
                                            {payment.orderItems.map((item, index) => (
                                                <div key={index} className="flex gap-6 items-center">
                                                    <div className="w-24 h-32 flex-shrink-0 overflow-hidden" style={{ backgroundColor: tokens.surfaceHigh }}>
                                                        {item.images?.[0]?.url ? (
                                                            <img
                                                                className="w-full h-full object-cover grayscale-[20%]"
                                                                src={item.images[0].url}
                                                                alt={item.title}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: tokens.muted }}>
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow space-y-1">
                                                        <h4 className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                                            {item.title}
                                                        </h4>
                                                        {item.quantity > 1 && (
                                                            <p className="text-sm uppercase tracking-tighter" style={{ color: tokens.outline }}>
                                                                Qty: {item.quantity}
                                                            </p>
                                                        )}
                                                        <p className="font-semibold mt-2">
                                                            {formatPrice(item.price?.amount, item.price?.currency)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Totals */}
                                        <div className="space-y-4 pt-4" style={{ borderTop: `1px solid ${tokens.outlineVariant}` }}>
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
                                                <span style={{ color: tokens.primaryDark }}>
                                                    {formatPrice(payment.price?.amount, payment.price?.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm" style={{ color: tokens.secondary }}>Order details could not be loaded.</p>
                                )}
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-12 mt-12 lg:mt-0">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h3 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        Arrival Estimate
                                    </h3>
                                    <p className="leading-relaxed" style={{ color: tokens.onSurfaceVariant }}>
                                        Your curated selection is being prepared for transit. Expect arrival between{' '}
                                        <span className="font-semibold" style={{ color: tokens.onSurface }}>
                                            {loading ? '...' : getArrivalEstimate(payment?.createdAt)}
                                        </span>.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        Shipping Address
                                    </h3>
                                    {/* 
                                        ⚠️ Agar tumhare user model mein address hai toh 
                                        payment.user se populate karke yahan show kar sakte ho.
                                        Abhi ke liye placeholder rakha hai.
                                    */}
                                    <p className="leading-relaxed uppercase tracking-tighter text-sm" style={{ color: tokens.onSurfaceVariant }}>
                                        Address on file
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 pt-8">
                                    <Link
                                        to="/orders"
                                        className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                                        style={{ backgroundColor: tokens.primaryDark, color: '#ffffff' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        View Order Status
                                    </Link>
                                    <Link
                                        to="/"
                                        className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                                        style={{ backgroundColor: 'transparent', border: `1px solid ${tokens.outline}`, color: tokens.onSurface }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = tokens.surfaceLow}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-12" style={{ borderTop: `1px solid ${tokens.outlineVariant}40` }}>
                                <p className="text-[10px] uppercase tracking-widest leading-loose" style={{ color: tokens.outline }}>
                                    A confirmation email has been dispatched. For bespoke alterations or inquiries, please contact our private concierge.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default OrderSuccess