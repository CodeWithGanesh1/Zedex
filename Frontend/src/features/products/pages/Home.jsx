import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate();
    const [showHero, setShowHero] = useState(true)
    const [heroVisible, setHeroVisible] = useState(true)
    const [heroIndex, setHeroIndex] = useState(0)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        handleGetAllProducts();
        setTimeout(() => setMounted(true), 200)
    }, []);

    const heroProducts = products?.filter(p =>
        ['Lotto H&M', 'Textured one-shoulder top', 'Godet-pleated dress'].includes(p.title)
    ) || []

    useEffect(() => {
        if (!heroProducts.length) return
        const interval = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % heroProducts.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [heroProducts.length])

    const heroImage = heroProducts?.[heroIndex]?.images?.[0]?.url

    const firstProduct = products?.find(p => p.title === 'Textured one-shoulder top') || products?.[0]
    const remainingProducts = products?.filter(p => p._id !== firstProduct?._id) || []

    const handleExplore = () => {
         setHeroVisible(false)
         setTimeout(() => {
            setShowHero(false)
            window.scrollTo({ top: 0 })
         }, 700)
     }


    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}>

                    
                {showHero && (
                    <div
                        className="fixed inset-0 z-50 flex transition-opacity duration-700"
                        style={{ opacity: heroVisible ? 1 : 0, backgroundColor: '#0a0908' }}
                    >
                        {/* Left - Text */}
                        <div className="w-full md:w-1/2 flex flex-col justify-between p-12 lg:p-20">

                            <div className="transition-all duration-1000" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}>
                                <p className="text-[9px] uppercase tracking-[0.6em]" style={{ color: '#C9A96E' }}>
                                    Zedex. — SS 2026
                                </p>
                            </div>

                            <div className="space-y-2 transition-all duration-1000 delay-300" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)' }}>
                                <h1 className="text-7xl lg:text-8xl xl:text-9xl font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f5f3f0' }}>
                                    Wear
                                    <br />the
                                    <br /><i style={{ color: '#C9A96E' }}>Silence.</i>
                                </h1>

                                <div className="pt-8 space-y-6 max-w-xs">
                                    <p className="text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                        Premium minimalist pieces, curated for those who speak through stillness.
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={handleExplore}
                                            className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] transition-all duration-300"
                                            style={{ backgroundColor: '#C9A96E', color: '#0a0908' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A96E'}
                                        >
                                            Explore
                                        </button>
                                        <button
                                            onClick={handleExplore}
                                            className="text-[10px] uppercase tracking-widest transition-colors duration-300"
                                            style={{ color: '#4d463a' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#4d463a'}
                                        >
                                            Skip →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="transition-all duration-1000 delay-500" style={{ opacity: mounted ? 1 : 0 }}>
                                <p className="text-[9px] uppercase tracking-widest" style={{ color: '#2a2825' }}>
                                    New Arrivals — 2026
                                </p>
                            </div>
                        </div>

                        {/* Right - Image */}
                        <div className="hidden md:block w-1/2 relative overflow-hidden transition-all duration-1000 delay-200" style={{ opacity: mounted ? 1 : 0 }}>
                            {heroImage ? (
                                <img
                                    key={heroIndex}
                                    src={heroImage}
                                    alt="Editorial"
                                    className="w-full h-full transition-opacity duration-1000"
                                    style={{ objectFit: 'cover', objectPosition: 'top center', filter: 'brightness(0.55) contrast(1.1)' }}
                                />
                            ) : (
                                <div className="w-full h-full" style={{ backgroundColor: '#1a1814' }} />
                            )}
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0a0908 0%, transparent 50%)' }} />
                            <div className="absolute bottom-12 right-12">
                                <p className="text-[9px] uppercase tracking-widest" style={{ color: '#4d463a' }}>
                                    {heroProducts?.[heroIndex]?.title || 'New Collection'}
                                </p>
                            </div>
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                                <div className="w-px h-12 animate-pulse" style={{ backgroundColor: '#C9A96E', opacity: 0.5 }} />
                                <p className="text-[8px] uppercase tracking-widest" style={{ color: '#4d463a' }}>Scroll</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ZARA STYLE HERO ── */}
                <div
                    className="h-screen flex flex-col items-center justify-center relative transition-all duration-1000"
                    style={{ opacity: mounted ? 1 : 0 }}
                >
                    
                    {/* Center text */}
                    <div className="text-center space-y-4">
                        <h1
                            className="text-6xl md:text-8xl font-light tracking-[0.15em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            The Edit.
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: '#B5ADA3' }}>
                            Scroll Down
                        </p>
                        {/* Scroll line */}
                        <div className="flex flex-col items-center pt-2">
                            <div
                                className="w-px animate-pulse"
                                style={{ height: '80px', backgroundColor: '#1b1c1a' }}
                            />
                        </div>
                    </div>

                    {/* Bottom left - season */}
                    <div className="absolute bottom-8 left-8 md:left-16">
                        <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: '#B5ADA3' }}>
                            SS 2026
                        </p>
                    </div>

                    {/* Bottom right - brand */}
                    <div className="absolute bottom-8 right-8 md:right-16">
                        <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: '#B5ADA3' }}>
                            Zedex.
                        </p>
                    </div>
                </div>

                {/* ── PRODUCTS ── */}
                {firstProduct && (
                    <div className="pb-32">

                        {/* First product - Full width */}
                        <div
                            onClick={() => navigate(`/product/${firstProduct._id}`)}
                            className="group cursor-pointer w-full relative overflow-hidden mb-1"
                            style={{ height: '100vh' }}
                        >
                            <img
                                src={firstProduct.images?.[0]?.url}
                                alt={firstProduct.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                style={{ objectPosition: 'top center' }}
                            />
                            <div
                                className="absolute inset-0 flex items-end p-12 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                                style={{ background: 'linear-gradient(to top, rgba(15,14,12,0.65) 0%, transparent 60%)' }}
                            >
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: '#C9A96E' }}>New Arrival</p>
                                    <h2 className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#fbf9f6' }}>
                                        {firstProduct.title}
                                    </h2>
                                    <p className="text-sm" style={{ color: '#B5ADA3' }}>
                                        {firstProduct.price?.currency} {firstProduct.price?.amount?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2nd and 3rd - side by side */}
                        {remainingProducts.length > 0 && (
                            <div className="grid grid-cols-2 gap-1 mb-1">
                                {remainingProducts.slice(0, 2).map(product => (
                                    <div
                                        key={product._id}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        className="group cursor-pointer relative overflow-hidden"
                                        style={{ height: '80vh' }}
                                    >
                                        <img
                                            src={product.images?.[0]?.url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            style={{ objectPosition: 'top center' }}
                                        />
                                        <div
                                            className="absolute inset-0 flex items-end p-8 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                                            style={{ background: 'linear-gradient(to top, rgba(15,14,12,0.65) 0%, transparent 60%)' }}
                                        >
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#fbf9f6' }}>
                                                    {product.title}
                                                </h2>
                                                <p className="text-sm" style={{ color: '#B5ADA3' }}>
                                                    {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 4th - Full width */}
                        {remainingProducts.length > 2 && (
                            <div
                                onClick={() => navigate(`/product/${remainingProducts[2]._id}`)}
                                className="group cursor-pointer relative overflow-hidden mb-1"
                                style={{ height: '100vh' }}
                            >
                                <img
                                    src={remainingProducts[2].images?.[0]?.url}
                                    alt={remainingProducts[2].title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    style={{ objectPosition: 'top center' }}
                                />
                                <div
                                    className="absolute inset-0 flex items-end p-12 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                                    style={{ background: 'linear-gradient(to top, rgba(15,14,12,0.65) 0%, transparent 60%)' }}
                                >
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: '#C9A96E' }}>Featured</p>
                                        <h2 className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#fbf9f6' }}>
                                            {remainingProducts[2].title}
                                        </h2>
                                        <p className="text-sm" style={{ color: '#B5ADA3' }}>
                                            {remainingProducts[2].price?.currency} {remainingProducts[2].price?.amount?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Remaining - 3 col grid */}
                        {remainingProducts.length > 3 && (
                            <>
                                <div className="flex items-center gap-8 py-16 px-8 lg:px-16 xl:px-24">
                                    <div className="flex-grow h-px" style={{ backgroundColor: '#e4e2df' }} />
                                    <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: '#C9A96E' }}>The Archive</span>
                                    <div className="flex-grow h-px" style={{ backgroundColor: '#e4e2df' }} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                                    {remainingProducts.slice(3).map(product => (
                                        <div
                                            key={product._id}
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="group cursor-pointer relative overflow-hidden"
                                            style={{ height: '60vh' }}
                                        >
                                            <img
                                                src={product.images?.[0]?.url}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                style={{ objectPosition: 'top center' }}
                                            />
                                            <div
                                                className="absolute inset-0 flex items-end p-6 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                                                style={{ background: 'linear-gradient(to top, rgba(15,14,12,0.75) 0%, transparent 60%)' }}
                                            >
                                                <div className="space-y-1">
                                                    <h2 className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#fbf9f6' }}>
                                                        {product.title}
                                                    </h2>
                                                    <p className="text-xs" style={{ color: '#B5ADA3' }}>
                                                        {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Footer */}
                {/* Footer */}
<footer style={{ backgroundColor: '#f5f3f0', borderTop: `1px solid #e4e2df` }}>
    
    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Column 1 - About */}
            <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: '#1b1c1a' }}>
                    Zedex.
                </p>
                <div className="space-y-3">
                    {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                        <p key={item} className="text-xs cursor-pointer transition-colors duration-200 hover:text-[#C9A96E]" style={{ color: '#7A6E63' }}>
                            {item}
                        </p>
                    ))}
                </div>
            </div>

            {/* Column 2 - Customer Policies */}
            <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: '#1b1c1a' }}>
                    Customer Policies
                </p>
                <div className="space-y-3">
                    {['Contact Us', 'FAQ', 'Terms of Use', 'Track Orders', 'Shipping', 'Cancellation', 'Return Policy', 'Privacy Policy'].map(item => (
                        <p key={item} className="text-xs cursor-pointer transition-colors duration-200 hover:text-[#C9A96E]" style={{ color: '#7A6E63' }}>
                            {item}
                        </p>
                    ))}
                </div>
            </div>

            {/* Column 3 - Keep in Touch */}
            <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: '#1b1c1a' }}>
                    Keep in Touch
                </p>
                <div className="flex gap-4">
                    {[
                        { name: 'Instagram', icon: (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        )},
                        { name: 'Twitter', icon: (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        )},
                        { name: 'YouTube', icon: (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        )},
                    ].map(social => (
                        <div
                            key={social.name}
                            className="cursor-pointer transition-colors duration-200"
                            style={{ color: '#B5ADA3' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                            onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                        >
                            {social.icon}
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 4 - Guarantees */}
            <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: '#1b1c1a' }}>
                    Our Promise
                </p>
                <div className="space-y-5">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e4e2df' }}>
                            <svg width="14" height="14" fill="none" stroke="#745a27" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: '#1b1c1a' }}>100% Authentic</p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#7A6E63' }}>Genuine products guaranteed</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e4e2df' }}>
                            <svg width="14" height="14" fill="none" stroke="#745a27" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: '#1b1c1a' }}>Easy Returns</p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#7A6E63' }}>Within 14 days of delivery</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e4e2df' }}>
                            <svg width="14" height="14" fill="none" stroke="#745a27" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: '#1b1c1a' }}>Free Shipping</p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#7A6E63' }}>On orders above INR 15,000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t py-6 text-center" style={{ borderColor: '#e4e2df' }}>
        <span className="text-[10px] uppercase tracking-[0.35em]" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#B5ADA3' }}>
            Zedex. © {new Date().getFullYear()} — All Rights Reserved
        </span>
    </div>
</footer>
            </div>
        </>
    )
}

export default Home