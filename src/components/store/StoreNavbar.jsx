import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ShoppingBag, LogOut, X, ArrowRight, User as UserIcon, ChevronLeft } from "lucide-react";
import VafaPerfume from "../../assets/VafaPerfume.jpeg";

function StoreNavbar() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [authView, setAuthView] = useState("login");
    const [loginData, setLoginData] = useState({ phone: "", password: "" });
    const [signupData, setSignupData] = useState({ name: "", phone: "", address: "", password: "" });
    const [cartCount, setCartCount] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [checkoutStage, setCheckoutStage] = useState("cart"); 
    const [addressData, setAddressData] = useState({
        name: "", phone: "", address: "", city: "", pincode: "", paymentMethod: "COD"
    });

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setIsLoggedIn(true);
            fetchCart(parsedUser.phone);
        }

        const updateCartFromStorage = () => {
            const count = sessionStorage.getItem("cartCount");
            if (count) setCartCount(Number(count));
        };

        // ADD THIS LISTENER
        const handleOpenDrawer = () => {
            const user = sessionStorage.getItem("user");
            if (user) {
                const parsedUser = JSON.parse(user);
                fetchCart(parsedUser.phone); 
                setShowCart(true);
                setCheckoutStage("cart");
            }
        };

        window.addEventListener("cartUpdated", updateCartFromStorage);
        window.addEventListener("openCartDrawer", handleOpenDrawer);

        return () => {
            window.removeEventListener("cartUpdated", updateCartFromStorage);
            window.removeEventListener("openCartDrawer", handleOpenDrawer);
        };
    }, []);

    const fetchCart = async (phone) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/cart/${phone}`);
            setCartItems(res.data.items || []);
            setCartCount(res.data.items.length);
        } catch (err) { console.error("Cart fetch error", err); }
    };

    // --- Action Handlers ---
    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
            if (res.data.success) {
                sessionStorage.setItem("user", JSON.stringify(res.data.user));
                window.location.reload();
            } else alert(res.data.message);
        } catch (err) { alert("Login Failed"); }
    };

    const handleQuantityChange = async (inventoryId, action) => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) return;
        try {
            const res = await axios.put("http://localhost:5000/api/cart/update", {
                phone: user.phone, inventoryId, action
            });
            if (res.data.success) {
                setCartItems(res.data.items);
                setCartCount(res.data.cartCount);
            }
        } catch (err) { console.error(err); }
    };

    const handleRemove = async (inventoryId) => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) return;
        try {
            const res = await axios.delete(`http://localhost:5000/api/cart/remove/${user.phone}/${inventoryId}`);
            if (res.data.success) {
                setCartItems(res.data.items);
                setCartCount(res.data.cartCount);
            }
        } catch (err) { alert("Failed to remove item"); }
    };

    const handleCheckout = async () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        try {
            const res = await axios.post("http://localhost:5000/api/order/checkout", {
                phone: user.phone,
                shippingAddress: addressData,
                paymentMethod: addressData.paymentMethod
            });
            if (res.data.success) {
                alert("Order Placed Successfully 🎉");
                setShowCart(false);
                setCartCount(0);
                window.location.reload();
            }
        } catch (err) { alert("Checkout Failed"); }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);

    return (
        <>
            {/* --- Navigation --- */}
            <nav className="fixed top-0 w-full z-50 px-6 md:px-10 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-sm">
                    <div className="hidden md:flex gap-8 text-[10px] uppercase font-bold tracking-[0.25em] text-gray-800">
                        <a href="#shop" className="hover:text-neutral-400 transition-colors">Collection</a>
                        <a href="#story" className="hover:text-neutral-400 transition-colors">The Atelier</a>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-lg font-serif tracking-[1em] uppercase font-light text-neutral-800">VAFAPERFUME</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        {!isLoggedIn ? (
                            <div className="flex items-center gap-6">
                                <button onClick={() => { setAuthView("login"); setShowLoginModal(true); }} className="text-[10px] uppercase tracking-[0.2em] font-bold">Login</button>
                                <button onClick={() => { setAuthView("signup"); setShowLoginModal(true); }} className="text-[10px] uppercase tracking-[0.2em] font-bold bg-black text-white px-6 py-2.5 rounded-full">Register</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-5">
                                <UserIcon size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
                                <div className="relative cursor-pointer" onClick={() => { setShowCart(true); setCheckoutStage("cart"); }}>
                                    <ShoppingBag size={18} />
                                    {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
                                </div>
                                <button onClick={() => { sessionStorage.removeItem("user"); window.location.reload(); }}>
                                    <LogOut size={18} className="text-neutral-400 hover:text-black" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- Auth Modal (Unchanged Layout) --- */}
            <AnimatePresence>
                {showLoginModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLoginModal(false)} className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-[850px] h-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                            <div className="hidden md:flex w-5/12 bg-neutral-900 relative p-12 flex-col justify-between text-white">
                                <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${VafaPerfume})` }} />
                                <h3 className="relative z-10 text-2xl font-serif tracking-[0.2em] uppercase">Pure Essence</h3>
                                <p className="relative z-10 text-[9px] tracking-[0.3em] uppercase opacity-50">Private Collection 2026</p>
                            </div>
                            <div className="w-full md:w-7/12 p-12 flex flex-col justify-center relative bg-white">
                                <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-neutral-300 hover:text-black"><X size={20} /></button>
                                <h2 className="text-2xl font-serif tracking-widest uppercase mb-10">{authView === "login" ? "Sign In" : "Register"}</h2>
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <InputField label="Phone Number" placeholder="+91" onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })} />
                                    <InputField label="Password" type="password" placeholder="••••••••" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                                    <button onClick={handleLogin} className="w-full bg-neutral-900 text-white py-4 mt-4 flex items-center justify-center gap-3">
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Authenticate</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- Side Checkout Drawer --- */}
            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)} className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-[110]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30 }} className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[120] shadow-2xl flex flex-col">

                            {/* Drawer Header */}
                            <div className="px-10 py-12 flex justify-between items-end border-b border-neutral-50">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-light tracking-[0.15em] uppercase text-neutral-900">
                                        {checkoutStage === "cart" ? "The Archive" : checkoutStage === "address" ? "Shipping" : "Payment"}
                                    </h2>
                                    <div className="flex gap-2">
                                        <div className={`h-[2px] w-6 ${checkoutStage === 'cart' ? 'bg-black' : 'bg-neutral-200'}`} />
                                        <div className={`h-[2px] w-6 ${checkoutStage === 'address' ? 'bg-black' : 'bg-neutral-200'}`} />
                                        <div className={`h-[2px] w-6 ${checkoutStage === 'payment' ? 'bg-black' : 'bg-neutral-200'}`} />
                                    </div>
                                </div>
                                <button onClick={() => setShowCart(false)} className="p-2 hover:rotate-90 transition-all"><X size={20} strokeWidth={1} /></button>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 overflow-y-auto px-10 py-8 scrollbar-hide">
                                <AnimatePresence mode="wait">
                                    {/* STAGE 1: CART (With Remove Button) */}
                                    {checkoutStage === "cart" && (
                                        <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                            {cartItems.length > 0 ? cartItems.map((item, idx) => (
                                                <div key={idx} className="flex gap-6 items-start">
                                                    <div className="w-24 aspect-[3/4] bg-[#F9F9F9] p-2 flex items-center justify-center">
                                                        <img src={`http://localhost:5000/uploads/${item.image}`} className="max-h-full mix-blend-multiply" alt="" />
                                                    </div>
                                                    <div className="flex-1 flex flex-col min-h-[120px]">
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h4 className="text-[12px] uppercase tracking-widest font-bold text-neutral-900">{item.perfumeName}</h4>
                                                                <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">{item.size}ML</p>
                                                            </div>
                                                            <span className="text-xs font-light">${(item.priceAtTime * item.quantity).toFixed(2)}</span>
                                                        </div>

                                                        {/* Quantity & Remove Control */}
                                                        <div className="mt-auto flex items-center justify-between">
                                                            <div className="flex items-center gap-4 border border-neutral-100 px-3 py-1">
                                                                <button onClick={() => handleQuantityChange(item.inventory._id || item.inventory, "decrease")} className="text-xs hover:text-black transition-colors">–</button>
                                                                <span className="text-[10px] font-medium w-4 text-center">{item.quantity}</span>
                                                                <button onClick={() => handleQuantityChange(item.inventory._id || item.inventory, "increase")} className="text-xs hover:text-black transition-colors">+</button>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemove(item.inventory._id || item.inventory)}
                                                                className="text-[9px] uppercase tracking-widest text-neutral-400 hover:text-red-700 transition-colors border-b border-transparent hover:border-red-700"
                                                            >
                                                                Remove Item
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-20 text-[10px] uppercase tracking-[0.4em] text-neutral-400 italic">Your archive is empty</div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* STAGE 2: SHIPPING ADDRESS */}
                                    {checkoutStage === "address" && (
                                        <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <InputField label="Recipient Name" placeholder="Full Name" onChange={(e) => setAddressData({ ...addressData, name: e.target.value })} />
                                            <div className="grid grid-cols-2 gap-6">
                                                <InputField label="Contact" placeholder="+91" onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })} />
                                                <InputField label="Postal Code" placeholder="000 000" onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })} />
                                            </div>
                                            <InputField label="Shipping Address" placeholder="Street, Apartment, Building" onChange={(e) => setAddressData({ ...addressData, address: e.target.value })} />
                                            <InputField label="City" placeholder="City / State" onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} />
                                        </motion.div>
                                    )}

                                    {/* STAGE 3: PAYMENT METHOD */}
                                    {checkoutStage === "payment" && (
                                        <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                            <PaymentOption
                                                title="Artisan Delivery (COD)"
                                                desc="Traditional cash payment on secure delivery"
                                                active={addressData.paymentMethod === "COD"}
                                                onClick={() => setAddressData({ ...addressData, paymentMethod: "COD" })}
                                            />
                                            <PaymentOption
                                                title="Secure Digital Payment"
                                                desc="Pay via Razorpay / Card / UPI"
                                                active={addressData.paymentMethod === "RAZORPAY"}
                                                onClick={() => setAddressData({ ...addressData, paymentMethod: "RAZORPAY" })}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sidebar Footer Summary */}
                            {cartItems.length > 0 && (
                                <div className="px-10 py-10 border-t border-neutral-50">
                                    <div className="flex justify-between mb-8">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Total Valuation</span>
                                        <span className="text-lg font-light">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        {checkoutStage !== "cart" && (
                                            <button onClick={() => setCheckoutStage(checkoutStage === "payment" ? "address" : "cart")} className="flex-1 border border-neutral-200 py-5 flex items-center justify-center hover:bg-neutral-50 transition-colors">
                                                <ChevronLeft size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                if (checkoutStage === "cart") setCheckoutStage("address");
                                                else if (checkoutStage === "address") setCheckoutStage("payment");
                                                else handleCheckout();
                                            }}
                                            className="flex-[4] bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all shadow-lg"
                                        >
                                            {checkoutStage === "payment" ? "Confirm Order" : "Proceed"}
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-center mt-6 text-neutral-400 tracking-widest italic font-light">Complimentary white-glove shipping on all orders.</p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// --- High-End Sub-Components ---
const InputField = ({ label, ...props }) => (
    <div className="flex flex-col gap-2 group">
        <label className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 group-focus-within:text-black transition-colors">{label}</label>
        <input {...props} className="border-b border-neutral-100 py-2 focus:outline-none focus:border-black transition-colors text-sm font-light placeholder:text-neutral-200" />
    </div>
);

const PaymentOption = ({ title, desc, active, onClick }) => (
    <div onClick={onClick} className={`p-6 border cursor-pointer transition-all duration-300 ${active ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-100 hover:border-neutral-300'}`}>
        <div className="flex justify-between items-center mb-1">
            <h5 className="text-[11px] uppercase tracking-widest font-bold">{title}</h5>
            <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-black' : 'border border-neutral-300'}`} />
        </div>
        <p className="text-[10px] text-neutral-400 font-light leading-relaxed">{desc}</p>
    </div>
);

export default StoreNavbar;