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
		const user = JSON.parse(sessionStorage.getItem("user"));
		if (user) {
			console.log("Fetching cart for user:", user.phone);
			axios.get(`http://localhost:5000/api/cart/${user.phone}`).then(res => {
				setCartCount(res.data.items.length);
			});
		}
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
		const user = JSON.parse(sessionStorage.getItem("user"));
		const res = await axios.get(`/api/cart/${user._id}`);
		setCartItems(res.data.items);
		setShowCart(true);
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
									<div className="relative">
										<ShoppingBag size={18} />
										{cartCount > 0 && (
											<span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
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
			{showCart && (
				<div className="fixed right-5 top-20 bg-white shadow-lg p-5 w-80 rounded">
					{cartItems.map(item => (
						<div key={item.sku} className="flex gap-3 mb-3">
							<img src={`/uploads/${item.image}`} className="w-12 h-12" />
							<div>
								<p>{item.perfumeName}</p>
								<p>{item.size}ml</p>
							</div>
						</div>
					))}
				</div>
			)}

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