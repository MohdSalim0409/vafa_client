import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Star, ShieldCheck, Zap } from "lucide-react";

function PerfumeList() {

    const [perfumes, setPerfumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        const fetchPerfumes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/inventory");
                setPerfumes(response.data);
                const defaults = {};
                response.data.forEach((p) => {
                    defaults[p._id] = p.variants[0];
                });
                setSelectedVariants(defaults);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchPerfumes();
    }, []);

    const handleVariantChange = (productId, variant) => {
        setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
        );


    const addToCart = async (variant, openDrawer = false) => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            if (!user) return alert("Please login to continue");

            const res = await axios.post("http://localhost:5000/api/cart/add", {
                userId: user.phone,
                inventoryId: variant.inventoryId,
                quantity: 1,
            });

            if (res.data.success) {
                sessionStorage.setItem("cartCount", res.data.cartCount);

                // 1. Update the count icon
                window.dispatchEvent(new Event("cartUpdated"));

                // 2. If 'Buy Now' was clicked, tell the Navbar to open the drawer
                if (openDrawer) {
                    window.dispatchEvent(new Event("openCartDrawer"));
                } else {
                    alert("Added to cart");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Failed to add to cart");
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-16">
            <div className="mx-auto">
                {/* Header Section */}
                <div className="mb-12 border-b border-gray-200 pb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Luxury Fragrances</h2>
                    <p className="text-lg text-gray-500">Explore our curated collection of authentic scents.</p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {perfumes.map((item) => {
                        const selected = selectedVariants[item._id];
                        const master = item.perfume;

                        return (
                            <div key={item._id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                {/* Image Container */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100 h-90">
                                    <img src={`http://localhost:5000/uploads/${master.images}`} alt={master.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                                    {selected?.quantity < 5 && selected?.quantity > 0 && <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Low Stock</span>}
                                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-600">
                                        <Star size={18} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{master.brand}</span>
                                    <h3 className="mt-1 text-lg font-bold text-gray-900 truncate">{master.name}</h3>
                                    <p className="text-sm text-gray-500 italic my-3">{master.concentration}</p>

                                    {/* Ratings Mockup */}
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="ml-2 text-xs text-gray-400">(4.8)</span>
                                    </div>

                                    {/* Price and Sizes */}
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-5">
                                            <span className="text-2xl font-bold text-gray-900">${selected?.price}</span>
                                            <span className="text-sm text-gray-400 line-through">${(selected?.price * 1.2).toFixed(2)}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {item.variants.map((v) => (
                                                <button
                                                    key={v.inventoryId}
                                                    onClick={() => handleVariantChange(item._id, v)}
                                                    className={`px-5 py-2.5 text-xs font-medium rounded-md border transition-all
                                                        ${selected?.inventoryId === v.inventoryId ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"} ${v.quantity === 0 ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
                                                    disabled={v.quantity === 0}
                                                >
                                                    {v.size}ml
                                                </button>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        {isLoggedIn ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {/* Cart Button: Just adds to cart */}
                                                <button
                                                    onClick={() => addToCart(selected, false)}
                                                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                                                >
                                                    <ShoppingCart size={18} />
                                                    Cart
                                                </button>

                                                {/* Buy Now Button: Adds to cart AND opens the drawer */}
                                                <button
                                                    onClick={() => addToCart(selected, true)}
                                                    className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
                                                >
                                                    <Zap size={18} />
                                                    Buy Now
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-red-500 font-semibold text-center">Please login to purchase</p>
                                        )}
                                    </div>
                                </div>

                                {/* Trust Badge */}
                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} className="text-green-600" />
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tight">100% Authentic Product</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PerfumeList