import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
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

const statusOptions = [
    { value: 'processing', label: 'Processing', color: '#7A6E63' },
    { value: 'shipped', label: 'Shipped', color: '#C9A96E' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: '#745a27' },
    { value: 'delivered', label: 'Delivered', color: '#4a7c59' },
    { value: 'cancelled', label: 'Cancelled', color: '#c0392b' },
]

const formatPrice = (amount, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

const formatDate = (date) => {
    if (!date) return "—"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "—"
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const SellerOrders = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [updating, setUpdating] = useState(null)
    const [trackingInputs, setTrackingInputs] = useState({})
    const [successMsg, setSuccessMsg] = useState(null)
    const [activeTab, setActiveTab] = useState('all')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/cart/payment/all-orders', { withCredentials: true })
            if (res.data.success) setOrders(res.data.orders)
        } catch (err) {
            console.error("Orders fetch failed:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateShipping = async (razorpayOrderId, shippingStatus) => {
        setUpdating(razorpayOrderId)
        try {
            const trackingNumber = trackingInputs[razorpayOrderId] || undefined
            const res = await axios.patch(
                `/api/cart/payment/order/${razorpayOrderId}/shipping`,
                { shippingStatus, trackingNumber },
                { withCredentials: true }
            )
            if (res.data.success) {
                setOrders(prev => prev.map(o =>
                    o.razorpay.orderId === razorpayOrderId
                        ? { ...o, shippingStatus: res.data.payment.shippingStatus, trackingNumber: res.data.payment.trackingNumber }
                        : o
                ))
                setSuccessMsg(razorpayOrderId)
                setTimeout(() => setSuccessMsg(null), 2500)
            }
        } catch (err) {
            console.error("Update failed:", err)
        } finally {
            setUpdating(null)
        }
    }

    const tabs = [
        { key: 'all', label: 'All Orders', count: orders.length },
        { key: 'processing', label: 'Processing', count: orders.filter(o => o.shippingStatus === 'processing').length },
        { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.shippingStatus === 'shipped').length },
        { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.shippingStatus === 'delivered').length },
        { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.shippingStatus === 'cancelled').length },
    ]

    const displayOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.shippingStatus === activeTab)

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div className="min-h-screen pb-24" style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">

                    {/* Top Bar */}
                    <div className="pt-10 pb-0 flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200"
                            style={{ color: tokens.muted }}
                            onMouseEnter={e => e.currentTarget.style.color = tokens.primary}
                            onMouseLeave={e => e.currentTarget.style.color = tokens.muted}
                        >
                            ←
                        </button>
                        <span className="text-xs font-medium tracking-[0.32em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.primary }}>
                            Zedex.
                        </span>
                    </div>

                    {/* Header */}
                    <div className="pt-10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}>
                                Order Management
                            </h1>
                            <div className="mt-4 w-14 h-px" style={{ backgroundColor: tokens.primary }} />
                        </div>
                        <button
                            onClick={() => navigate('/seller/dashboard')}
                            className="py-3 px-6 text-[11px] uppercase tracking-[0.3em] transition-all duration-300"
                            style={{ border: `1px solid ${tokens.outline}`, color: tokens.onSurface }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = tokens.surfaceLow}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            ← Back to Vault
                        </button>
                    </div>

                    {/* Tabs */}
                    {!loading && (
                        <div className="flex gap-0 mb-8 overflow-x-auto" style={{ borderBottom: `1px solid ${tokens.outlineVariant}` }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className="px-6 py-4 text-xs uppercase tracking-widest transition-all duration-300 relative flex-shrink-0"
                                    style={{ color: activeTab === tab.key ? tokens.onSurface : tokens.muted }}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="ml-2 text-[10px]" style={{ color: tokens.secondary }}>
                                            ({tab.count})
                                        </span>
                                    )}
                                    {activeTab === tab.key && (
                                        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: tokens.primaryDark }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-6 animate-pulse" style={{ backgroundColor: tokens.surfaceLow }}>
                                    <div className="h-4 w-1/3 rounded mb-3" style={{ backgroundColor: tokens.surfaceHigh }} />
                                    <div className="h-3 w-1/4 rounded" style={{ backgroundColor: tokens.surfaceHigh }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && displayOrders.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurfaceVariant }}>
                                No orders found.
                            </p>
                        </div>
                    )}

                    {/* Orders Table */}
                    {!loading && displayOrders.length > 0 && (
                        <div className="space-y-3">
                            {displayOrders.map((order) => {
                                const isExpanded = expandedOrder === order._id
                                const currentStatus = statusOptions.find(s => s.value === order.shippingStatus) || statusOptions[0]
                                const isUpdating = updating === order.razorpay.orderId
                                const showSuccess = successMsg === order.razorpay.orderId

                                return (
                                    <div
                                        key={order._id}
                                        className="transition-all duration-300"
                                        style={{
                                            backgroundColor: tokens.surfaceLow,
                                            border: `1px solid ${isExpanded ? tokens.outlineVariant : 'transparent'}`
                                        }}
                                    >
                                        {/* Order Row */}
                                        <div
                                            className="flex items-center gap-6 p-6 cursor-pointer"
                                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                        >
                                            {/* First product image */}
                                            <div className="w-14 h-16 flex-shrink-0 overflow-hidden" style={{ backgroundColor: tokens.surfaceHigh }}>
                                                {order.orderItems[0]?.images?.[0]?.url ? (
                                                    <img
                                                        src={order.orderItems[0].images[0].url}
                                                        alt={order.orderItems[0].title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px]" style={{ color: tokens.muted }}>—</div>
                                                )}
                                            </div>

                                            {/* Order info */}
                                            <div className="flex-grow min-w-0">
                                                <p className="text-base truncate" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}>
                                                    {order.orderItems[0]?.title}
                                                    {order.orderItems.length > 1 && (
                                                        <span className="text-sm ml-2" style={{ color: tokens.secondary }}>
                                                            +{order.orderItems.length - 1} more
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: tokens.outline }}>
                                                    {order.razorpay.orderId} · {formatDate(order.createdAt)}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <p className="font-medium text-sm flex-shrink-0 hidden md:block">
                                                {formatPrice(order.price?.amount, order.price?.currency)}
                                            </p>

                                            {/* Status Badge */}
                                            <span
                                                className="text-[10px] uppercase tracking-widest px-3 py-1.5 flex-shrink-0"
                                                style={{
                                                    backgroundColor: `${currentStatus.color}15`,
                                                    color: currentStatus.color,
                                                    border: `1px solid ${currentStatus.color}30`
                                                }}
                                            >
                                                {currentStatus.label}
                                            </span>

                                            {/* Expand arrow */}
                                            <span
                                                className="text-xs transition-transform duration-300 flex-shrink-0"
                                                style={{
                                                    color: tokens.muted,
                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                                }}
                                            >
                                                ▾
                                            </span>
                                        </div>

                                        {/* Expanded Panel */}
                                        {isExpanded && (
                                            <div className="px-6 pb-8 space-y-8" style={{ borderTop: `1px solid ${tokens.outlineVariant}` }}>

                                                {/* Order Items */}
                                                <div className="pt-6 space-y-4">
                                                    <p className="text-xs uppercase tracking-widest" style={{ color: tokens.outline }}>Order Items</p>
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 items-center">
                                                            <div className="w-12 h-14 flex-shrink-0 overflow-hidden" style={{ backgroundColor: tokens.surfaceHigh }}>
                                                                {item.images?.[0]?.url && (
                                                                    <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                            <div className="flex-grow">
                                                                <p className="text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</p>
                                                                {item.quantity > 1 && (
                                                                    <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: tokens.outline }}>Qty: {item.quantity}</p>
                                                                )}
                                                            </div>
                                                            <p className="text-sm font-medium flex-shrink-0">
                                                                {formatPrice(item.price?.amount, item.price?.currency)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Update Controls */}
                                                <div className="space-y-4 pt-4" style={{ borderTop: `1px solid ${tokens.outlineVariant}` }}>
                                                    <p className="text-xs uppercase tracking-widest" style={{ color: tokens.outline }}>Update Order</p>

                                                    {/* Tracking Number Input */}
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase tracking-widest" style={{ color: tokens.secondary }}>
                                                            Tracking Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder={order.trackingNumber || "Enter tracking number..."}
                                                            value={trackingInputs[order.razorpay.orderId] || ''}
                                                            onChange={e => setTrackingInputs(prev => ({
                                                                ...prev,
                                                                [order.razorpay.orderId]: e.target.value
                                                            }))}
                                                            className="w-full py-3 px-4 text-sm outline-none"
                                                            style={{
                                                                backgroundColor: tokens.surface,
                                                                border: `1px solid ${tokens.outlineVariant}`,
                                                                color: tokens.onSurface,
                                                                fontFamily: "'Inter', sans-serif"
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Status Buttons */}
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase tracking-widest" style={{ color: tokens.secondary }}>
                                                            Shipping Status
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {statusOptions.map(status => (
                                                                <button
                                                                    key={status.value}
                                                                    onClick={() => handleUpdateShipping(order.razorpay.orderId, status.value)}
                                                                    disabled={isUpdating || order.shippingStatus === status.value}
                                                                    className="py-2 px-4 text-[10px] uppercase tracking-widest transition-all duration-300"
                                                                    style={{
                                                                        backgroundColor: order.shippingStatus === status.value ? `${status.color}20` : 'transparent',
                                                                        border: `1px solid ${status.color}40`,
                                                                        color: order.shippingStatus === status.value ? status.color : tokens.muted,
                                                                        cursor: order.shippingStatus === status.value ? 'default' : 'pointer',
                                                                        opacity: isUpdating ? 0.6 : 1
                                                                    }}
                                                                    onMouseEnter={e => {
                                                                        if (order.shippingStatus !== status.value && !isUpdating)
                                                                            e.currentTarget.style.color = status.color
                                                                    }}
                                                                    onMouseLeave={e => {
                                                                        if (order.shippingStatus !== status.value)
                                                                            e.currentTarget.style.color = tokens.muted
                                                                    }}
                                                                >
                                                                    {isUpdating && order.shippingStatus !== status.value ? '...' : status.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Success Message */}
                                                    {showSuccess && (
                                                        <p className="text-[11px] uppercase tracking-widest" style={{ color: '#4a7c59' }}>
                                                            ✓ Order updated successfully
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SellerOrders