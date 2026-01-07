import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const GOLD = "#8C7355";

const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
	}
};

const PerfumeHeroEditorial = () => {
	return (
		<section className="relative min-h-[100svh] bg-black/50 text-white overflow-hidden">

			{/* BACKGROUND */}
			<div className="absolute inset-0">
				<img
					src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80"
					alt=""
					className="w-full h-full object-cover opacity-25"
				/>
				<div className="absolute inset-0 bg-black/60" />
			</div>

			{/* CONTENT */}
			<div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 min-h-[100svh] grid grid-cols-1 lg:grid-cols-12 items-center">

				{/* LEFT — TEXT */}
				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="show"
					className="lg:col-span-5"
				>
					<p
						className="text-[10px] tracking-[0.35em] uppercase mb-8 sm:mb-10"
						style={{ color: GOLD }}
					>
					
					</p>

					<h1 className="font-serif leading-tight mb-6 sm:mb-8">
						<span className="block text-5xl sm:text-6xl lg:text-7xl">
							MOST
						</span>
						<span
							className="block text-3xl sm:text-4xl lg:text-5xl italic font-light mt-2"
							style={{ color: GOLD }}
						>
							BEAUTY PERFUME
						</span>
					</h1>

					<p className="max-w-md text-[13px] sm:text-sm leading-relaxed text-white/60 mb-10 sm:mb-12">
						A refined fragrance crafted with rare botanicals and deep
						woody accords — designed to unfold slowly, leaving a lasting
						impression.
					</p>

					<div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">
						<button className="text-[11px] tracking-[0.3em] uppercase border-b border-white/40 pb-2 hover:border-white transition w-fit">
							Purchase — $240
						</button>

						<button className="flex items-center gap-4 group w-fit">
							<span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition">
								<Play size={14} />
							</span>
							<span className="text-[10px] tracking-[0.3em] uppercase text-white/70 group-hover:text-white transition">
								Film
							</span>
						</button>
					</div>
				</motion.div>

				{/* CENTER — PRODUCT */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
					className="lg:col-span-4 flex justify-center my-16 sm:my-20 lg:my-0"
				>
					<img
						src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80"
						alt="Noir Éternel Perfume"
						className="max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
					/>
				</motion.div>

				{/* RIGHT — DETAILS */}
				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.2 }}
					className="lg:col-span-3 hidden lg:block"
				>
					<p
						className="text-[9px] tracking-[0.3em] uppercase mb-6"
						style={{ color: GOLD }}
					>
						Olfactive Profile
					</p>

					<ul className="space-y-4 text-sm text-white/60">
						<li>Midnight Jasmine</li>
						<li>Sandalwood Absolute</li>
						<li>Amber Resin</li>
					</ul>

					<div className="mt-12 h-px w-12 bg-white/20" />
				</motion.div>

			</div>

			{/* FOOTER INDEX */}
			<div className="absolute bottom-6 sm:bottom-10 left-5 sm:left-6 lg:left-16 text-white/15 text-5xl sm:text-6xl font-serif">
				01
			</div>
		</section>
	);
};

export default PerfumeHeroEditorial;
