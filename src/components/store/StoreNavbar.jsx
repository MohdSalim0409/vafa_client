import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import {
	ShoppingBag, User, LogOut, X, ArrowRight,
	ArrowLeft, CheckCircle2, Sparkles, MapPin,
	Phone, Lock, User as UserIcon
} from 'lucide-react';

function StoreNavbar() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [authView, setAuthView] = useState('login'); // 'login' or 'signup'

	const [signupData, setSignupData] = useState({
		name: "",
		phone: "",
		address: "",
		password: ""
	});

	const handleClose = () => {
		setShowLoginModal(false);
		// Reset to login view after modal closes
		setTimeout(() => setAuthView('login'), 300);
	};

	// Animation Variants
	const modalVariants = {
		hidden: { opacity: 0, scale: 0.95, y: 20 },
		visible: {
			opacity: 1, scale: 1, y: 0,
			transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
		},
		exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
	};

	const handleSignupChange = (e) => {
		setSignupData({
			...signupData,
			[e.target.name]: e.target.value
		});
	};
	const handleRegister = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/users/register",
      signupData
    );

    if (res.data.success) {
      setIsLoggedIn(true);
      handleClose();
    }
  } catch (err) {
    console.log(err);
    alert("Registration Failed");
  }
};



	return (
		<>
			{/* --- NAVIGATION BAR --- */}
			<nav className="fixed top-0 w-full z-50 px-6 md:px-10 py-6">
				<div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-sm">
					{/* Left Links */}
					<div className="hidden md:flex gap-8 text-[10px] uppercase font-bold tracking-[0.25em] text-gray-800">
						<a href="#shop" className="hover:text-neutral-400 transition-colors">Collection</a>
						<a href="#story" className="hover:text-neutral-400 transition-colors">The Atelier</a>
					</div>

					{/* Branding */}
					<h1 className="text-xl font-serif tracking-[0.6em] uppercase absolute left-1/2 -translate-x-1/2 cursor-default font-light">
						VAFAPERFUME
					</h1>

					{/* Right Actions */}
					<div className="flex items-center gap-6">
						<AnimatePresence mode="wait">
							{!isLoggedIn ? (
								<motion.div key="auth-btns" className="flex items-center gap-6">
									<button
										onClick={() => { setAuthView('login'); setShowLoginModal(true); }}
										className="text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-50 transition-all"
									>
										Login
									</button>
									<button
										onClick={() => { setAuthView('signup'); setShowLoginModal(true); }}
										className="text-[10px] uppercase tracking-[0.2em] font-bold bg-black text-white px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-all"
									>
										Sign Up
									</button>
								</motion.div>
							) : (
								<motion.div key="user-btns" className="flex items-center gap-5">
									<UserIcon size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
									<ShoppingBag size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
									<button onClick={() => setIsLoggedIn(false)} className="text-neutral-300 hover:text-black transition-colors">
										<LogOut size={18} />
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</nav>

			{/* --- AUTHENTICATION MODAL --- */}
			<AnimatePresence>
				{showLoginModal && (
					<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={handleClose}
							className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						/>

						{/* Modal Container */}
						<motion.div
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="relative w-full max-w-[850px] min-h-[550px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex"
						>
							{/* Visual Panel (Left) */}
							<div className="hidden md:flex w-5/12 bg-neutral-900 relative p-12 flex-col justify-between text-white">
								<div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80')] bg-cover bg-center" />
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

								<div className="relative z-10">
									<Sparkles className="mb-4 opacity-50" size={24} />
									<h3 className="text-3xl font-serif tracking-widest uppercase font-light leading-tight">
										Pure <br /> Essence
									</h3>
								</div>

								<div className="relative z-10">
									<p className="text-[11px] font-light leading-relaxed tracking-[0.1em] italic opacity-70 uppercase">
										"Crafting memories into bottled art."
									</p>
									<div className="mt-4 h-[1px] w-8 bg-white/40" />
								</div>
							</div>

							{/* Form Panel (Right) */}
							<div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col relative bg-white">
								<button
									onClick={handleClose}
									className="absolute top-8 right-8 text-neutral-300 hover:text-black transition-colors"
								>
									<X size={20} />
								</button>

								<AnimatePresence mode="wait">
									{authView === 'login' ? (
										/* --- LOGIN VIEW --- */
										<motion.div
											key="login-view"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="my-auto"
										>
											<div className="mb-10">
												<h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-2">Welcome</h2>
												<p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">Sign in to your account</p>
											</div>

											<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
												<input
													type="email"
													placeholder="EMAIL"
													className="w-full border-b border-neutral-100 py-3 text-[11px] tracking-widest focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-300"
												/>
												<input
													type="password"
													placeholder="PASSWORD"
													className="w-full border-b border-neutral-100 py-3 text-[11px] tracking-widest focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-300"
												/>
												<button
													onClick={() => { setIsLoggedIn(true); handleClose(); }}
													className="w-full bg-black text-white py-4 rounded-full flex items-center justify-center gap-3 group transition-all"
												>
													<span className="text-[10px] uppercase tracking-[0.3em] font-bold">Sign In</span>
													<ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
												</button>
											</form>

											<p className="mt-10 text-center text-[9px] uppercase tracking-widest text-neutral-400">
												Don't have an account?
												<button onClick={() => setAuthView('signup')} className="ml-2 text-black font-bold border-b border-black/20">Sign Up</button>
											</p>
										</motion.div>
									) : (
										/* --- SIGNUP VIEW (REFINED) --- */
										<motion.div
											key="signup-view"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="my-auto"
										>
											<div className="mb-8">
												<h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-1">Register</h2>
												<p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 italic">Enter your shipping details</p>
											</div>

											<form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
												{/* Field: Name */}
												<div className="relative group">
													<label className="text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-1 flex items-center gap-2">
														<UserIcon size={10} /> Full Name
													</label>
													<input
														type="text"
														placeholder="NAME"
														name="name"
														onChange={handleSignupChange}
														className="w-full border-b border-neutral-100 py-2 text-[11px] tracking-widest focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-200"
													/>
												</div>

												{/* Field: Phone */}
												<div className="relative group">
													<label className="text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-1 flex items-center gap-2">
														<Phone size={10} /> Phone Number
													</label>
													<input
														type="tel"
														placeholder="+1 000 000 000"
														name="phone"
														onChange={handleSignupChange}
														className="w-full border-b border-neutral-100 py-2 text-[11px] tracking-widest focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-200"
													/>
												</div>

												{/* Field: Address */}
												<div className="relative group">
													<label className="text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-1 flex items-center gap-2">
														<MapPin size={10} /> Shipping Address
													</label>
													<input
														type="text"
														placeholder="STREET, CITY, COUNTRY"
														name="address"
														onChange={handleSignupChange}
														className="w-full border-b border-neutral-100 py-2 text-[11px] tracking-widest focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-200"
													/>
												</div>

												{/* Field: Password */}
												<div className="relative group">
													<label className="text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-1 flex items-center gap-2">
														<Lock size={10} /> Password
													</label>
													<input
														type="password"
														placeholder="••••••••"
														name="password"
														onChange={handleSignupChange}	
														className="w-full border-b border-neutral-100 py-2 text-[11px] tracking-widest focus:outline-none focus:border-black transition-all bg-transparent placeholder:text-neutral-200"
													/>
												</div>

												<button
													onClick={handleRegister}
													className="w-full bg-black text-white py-4 rounded-full mt-4 flex items-center justify-center gap-3 group transition-all hover:bg-neutral-800"
												>
													<span className="text-[10px] uppercase tracking-[0.3em] font-bold">Register</span>
													<CheckCircle2 size={14} />
												</button>
											</form>

											<button
												onClick={() => setAuthView('login')}
												className="mt-8 flex items-center gap-2 mx-auto text-[9px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
											>
												<ArrowLeft size={12} /> Already a member? <span className="text-black font-bold">Login</span>
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}

export default StoreNavbar;
