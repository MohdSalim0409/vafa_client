import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ShoppingBag, LogOut, X, ArrowRight, User as UserIcon } from 'lucide-react';
import VafaPerfume from '../../assets/VafaPerfume.jpeg';

function StoreNavbar() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [authView, setAuthView] = useState('login');
	const [loginData, setLoginData] = useState({ phone: '', password: '' });
	const [signupData, setSignupData] = useState({ name: '', phone: '', address: '', password: '' });
	const [cartCount, setCartCount] = useState(0);
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	useEffect(() => {
		const fetchCart = async () => {
			try {
				const userData = sessionStorage.getItem("user");

				if (!userData) {
					return;
				}

				const user = JSON.parse(userData);

				if (!user.phone) {
					return;
				}


				const res = await axios.get(`http://localhost:5000/api/cart/${user.phone}`);


				setCartCount(res.data.items.length);

			} catch (error) {
				console.error("Error fetching cart data:", error);
			}
		};

		fetchCart();
	}, []);



	useEffect(() => {
		const storedUser = sessionStorage.getItem('user');
		if (storedUser) {
			const parsedUser = JSON.parse(storedUser);
			setIsLoggedIn(true);
			setUserRole(parsedUser.role);
		}
	}, []);

	const handleLoginChange = (e) => {
		setLoginData({ ...loginData, [e.target.name]: e.target.value });
	};

	const handleSignupChange = (e) => {
		setSignupData({ ...signupData, [e.target.name]: e.target.value });
	};

	const handleClose = () => {
		setShowLoginModal(false);
		setTimeout(() => setAuthView('login'), 300);
	};

	const handleRegister = async () => {
		try {
			const res = await axios.post('http://localhost:5000/api/auth/register', signupData);
			if (res.data.success) {
				setIsLoggedIn(true);
				handleClose();
			}
		} catch (err) {
			console.log(err);
			alert('Registration Failed');
		}
	};

	const handleLogin = async () => {
		try {
			const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
			if (res.data.success) {
				const user = res.data.user;
				sessionStorage.setItem('user', JSON.stringify(user));
				setUserRole(user.role);
				setIsLoggedIn(true);
				handleClose();
				window.location.reload();
			} else alert(res.data.message);
		} catch (err) {
			console.log(err);
			alert('Login Failed');
		}
	};

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.95, y: 20 },
		visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
		exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
	};
	const openCart = async () => {
		try {
			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user?.phone) return;

			const res = await axios.get(`http://localhost:5000/api/cart/${user.phone}`);
			setCartItems(res.data.items || []);
			setShowCart(true);
		} catch (err) {
			console.error("Cart open error:", err);
		}
	};
	const handleCheckout = async () => {
		console.log("Initiating checkout...");
		try {
			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user?.phone) return alert("Login required");

			const res = await axios.post("http://localhost:5000/api/order/checkout", {
				phone: user.phone
			});

			if (res.data.success) {
				alert("Order Placed Successfully 🎉");
				setCartItems([]);
				setCartCount(0);
				setShowCart(false);
			}
		} catch (err) {
			console.error("Checkout error:", err);
			alert("Checkout Failed");
		}
	};




	return (
		<>
			<nav className="fixed top-0 w-full z-50 px-6 md:px-10 py-6">
				<div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-sm">
					<div className="hidden md:flex gap-8 text-[10px] uppercase font-bold tracking-[0.25em] text-gray-800">
						<a href="#shop" className="hover:text-neutral-400 transition-colors">Collection</a>
						<a href="#story" className="hover:text-neutral-400 transition-colors">The Atelier</a>
					</div>
					<div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
						<h1 className="text-lg font-serif tracking-[1em] uppercase font-light text-neutral-800 transition-opacity duration-500 hover:opacity-60">
							VAFAPERFUME
						</h1>
					</div>
					<div className="flex items-center gap-6">
						<AnimatePresence mode="wait">
							{!isLoggedIn ? (
								<motion.div key="auth-btns" className="flex items-center gap-6">
									<button onClick={() => { setAuthView('login'); setShowLoginModal(true); }} className="text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-50 transition-all">Login</button>
									<button onClick={() => { setAuthView('signup'); setShowLoginModal(true); }} className="text-[10px] uppercase tracking-[0.2em] font-bold bg-black text-white px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-all">Register</button>
								</motion.div>
							) : (
								<motion.div key="user-btns" className="flex items-center gap-5">
									<UserIcon size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
										<div className="relative cursor-pointer" onClick={openCart}>
											<ShoppingBag size={18} />
											{cartCount > 0 && (
												<span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
													{cartCount}
												</span>
											)}
										</div>

									<button onClick={() => { sessionStorage.removeItem('user'); setIsLoggedIn(false); setUserRole(null); window.location.reload(); }} className="text-neutral-300 hover:text-black transition-colors"><LogOut size={18} /></button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</nav>

			<AnimatePresence>
				{showLoginModal && (
					<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" />

						<motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="relative w-full max-w-[850px] h-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
							<div className="hidden md:flex w-7/12 bg-neutral-900 relative p-12 flex-col justify-between text-white">
								<div
									className="absolute inset-0 opacity-40 bg-cover bg-center"
									style={{ backgroundImage: `url(${VafaPerfume})` }}
								/>
								<div className="relative z-10">
									<h3 className="text-2xl font-serif tracking-[0.2em] uppercase font-light leading-tight">Pure Essence</h3>
									<div className="mt-4 h-[1px] w-8 bg-white/40" />
								</div>
								<p className="relative z-10 text-[9px] tracking-[0.3em] uppercase opacity-50">Private Collection 2026</p>
							</div>

							<div className="w-full md:w-7/12 p-12 flex flex-col justify-center relative bg-white">
								<button onClick={handleClose} className="absolute top-8 right-8 text-neutral-300 hover:text-black transition-colors"><X size={20} strokeWidth={1.5} /></button>

								<AnimatePresence mode="wait">
									<motion.div key={authView} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="w-full">
										<div className="mb-10">
											<h2 className="text-2xl font-serif tracking-widest uppercase text-neutral-800">{authView === 'login' ? 'Sign In' : 'Register'}</h2>
											<p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mt-2">{authView === 'login' ? 'Access your account' : 'Become a member'}</p>
										</div>

										<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
											{authView === 'login' ? (
												<div className="space-y-6">
													<InputField label="Phone Number" name="phone" placeholder="+91" onChange={handleLoginChange} />
													<InputField label="Password" type="password" name="password" placeholder="••••••••" onChange={handleLoginChange} />
												</div>
											) : (
												<div className="grid grid-cols-2 gap-x-6 gap-y-6">
													<InputField label="Name" name="name" onChange={handleSignupChange} />
													<InputField label="Phone" name="phone" placeholder="+91" onChange={handleSignupChange} />
													<div className="col-span-2"><InputField label="Address" name="address" onChange={handleSignupChange} /></div>
													<div className="col-span-2"><InputField label="Password" name="password" type="password" placeholder="••••••••" onChange={handleSignupChange} /></div>
												</div>
											)}

											<button onClick={authView === 'login' ? handleLogin : handleRegister} className="w-full bg-neutral-900 text-white py-4 mt-10 hover:bg-black transition-all flex items-center justify-center gap-3 group">
												<span className="text-[10px] uppercase tracking-[0.3em] font-bold">{authView === 'login' ? 'Login' : 'Register'}</span>
												<ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
											</button>
										</form>

										<div className="mt-8 text-center">
											<button onClick={() => setAuthView(authView === 'login' ? 'signup' : 'login')} className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors">
												{authView === 'login' ? 'Create an account' : 'Back to login'}
											</button>
										</div>
									</motion.div>
								</AnimatePresence>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
			{/* --- Cart Sidebar Drawer --- */}
<AnimatePresence>
				{showCart && (
					<>
						{/* Backdrop - Lighter blur for a cleaner glass effect */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowCart(false)}
							className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-[110]"
						/>

						{/* Side Drawer */}
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 30, stiffness: 200 }}
							className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[120] shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col"
						>
							{/* Cart Header - Refined Spacing */}
							<div className="px-10 py-12 flex justify-between items-end">
								<div className="space-y-1">
									<h2 className="text-2xl font-light tracking-[0.15em] uppercase text-neutral-900">The Archive</h2>
									<p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
										{cartItems.length} {cartItems.length === 1 ? 'Selection' : 'Selections'}
									</p>
								</div>
								<button
									onClick={() => setShowCart(false)}
									className="p-2 -mr-2 hover:scale-110 transition-all duration-300 group"
								>
									<X size={20} strokeWidth={1} className="text-neutral-400 group-hover:text-black" />
								</button>
							</div>

							{/* Cart Items List */}
							<div className="flex-1 overflow-y-auto px-10 space-y-10 scrollbar-hide">
								{cartItems.length > 0 ? (
									cartItems.map((item, idx) => (
										<motion.div
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: idx * 0.05 }}
											key={item.sku || idx}
											className="flex gap-8 items-start group"
										>
											{/* Image Container - Square, Minimalist */}
											<div className="relative w-24 aspect-[3/4] bg-[#F9F9F9] overflow-hidden">
												<img
													src={`http://localhost:5000/uploads/${item.image}`}
													alt={item.perfumeName}
													className="w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-105 transition-transform duration-700"
												/>
											</div>

											<div className="flex-1 flex flex-col min-h-full py-1">
												<div className="flex justify-between items-start">
													<div>
														<h4 className="text-[12px] uppercase tracking-[0.15em] font-semibold text-neutral-900 leading-tight">
															{item.perfumeName}
														</h4>
														<p className="text-[9px] text-neutral-400 mt-1.5 tracking-widest font-medium">
															{item.size}ML / EAU DE PARFUM
														</p>
													</div>
													<span className="text-[12px] font-light text-neutral-900">${item.price || '0.00'}</span>
												</div>

												<div className="flex justify-between items-end mt-auto pt-4">
													<div className="flex items-center border border-neutral-100 px-3 py-1 gap-4">
														<button className="text-xs hover:text-neutral-400">-</button>
														<span className="text-[10px] font-medium w-4 text-center">{item.quantity || 1}</span>
														<button className="text-xs hover:text-neutral-400">+</button>
													</div>
													<button className="text-[9px] uppercase tracking-widest text-neutral-400 hover:text-black border-b border-transparent hover:border-black transition-all pb-0.5">
														Remove
													</button>
												</div>
											</div>
										</motion.div>
									))
								) : (
									<div className="h-full flex flex-col items-center justify-center space-y-6">
										<div className="w-px h-12 bg-neutral-200" />
										<p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 italic">Your collection is empty</p>
										<div className="w-px h-12 bg-neutral-200" />
									</div>
								)}
							</div>

							{/* Cart Footer - Luxury Summary */}
							{cartItems.length > 0 && (
								<div className="px-10 py-10 bg-white border-t border-neutral-50">
									<div className="flex justify-between mb-8">
										<span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Subtotal</span>
										<span className="text-sm font-light tracking-wider">$1234</span>
									</div>
									<button onClick={handleCheckout} className="w-full bg-neutral-900 text-white py-6 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all relative overflow-hidden group">
										<span className="relative z-10">Proceed to Checkout</span>
										<div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
									</button>
									<p className="text-center mt-6 text-[9px] text-neutral-400 tracking-widest italic">
										Complimentary shipping on all artisan orders.
									</p>
								</div>
							)}
						</motion.div>
					</>
				)}
</AnimatePresence>

		</>
	);
}

const InputField = ({ label, ...props }) => (
	<div className="relative group">
		<label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-2 group-focus-within:text-black transition-colors">{label}</label>
		<input {...props} className="w-full border-b border-neutral-200 py-2 text-sm tracking-wide focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-300 font-light" />
	</div>
);

export default StoreNavbar;