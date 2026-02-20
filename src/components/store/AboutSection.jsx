import React from 'react';
import { motion } from 'framer-motion';
import AboutPerfume from '../../assets/AboutPerfume.png';

function AboutSection() {
    
	const vafaImage = "/images/vafa-bottle.jpg";

	return (
		<section id="about" className="py-24 px-6 md:px-20 bg-[#f9f8f4] text-[#2d2d2d]">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

					{/* Visual Column */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 1 }}
						className="relative"
					>
						{/* Frame for the Image */}
						<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
							<img
								src={AboutPerfume}
								alt="Vafa Perfume"
								className="w-full h-full object-cover grayscal-0 hover:grayscale transition-all duration-1000"
							/>
						</div>

						{/* Minimalist Floating Label */}
						<div className="absolute -bottom-6 -right-4 bg-white px-8 py-6 shadow-lg border border-gray-50">
							<p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Origin</p>
							<p className="font-serif italic text-lg">Paris, France</p>
						</div>
					</motion.div>

					{/* Content Column */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="flex flex-col"
					>
						<span className="text-[11px] uppercase tracking-[0.5em] text-amber-700 font-bold mb-6">
							Our Philosophy
						</span>

						<h3 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
							The Alchemy of <br />
							<span className="italic text-slate-800">Temporal Essence</span>
						</h3>

						<div className="space-y-6 max-w-lg text-gray-600 font-light text-lg leading-relaxed">
							<p>
								<span className="text-slate-900 font-medium">Vafa Perfume</span> is a response to the mass-produced. We believe a fragrance is more than a scent—it is a temporal capsule, hand-poured in our private atelier.
							</p>

							<p>
								By sourcing rare botanicals and aging them in small batches, we ensure that every bottle carries its own unique, artisanal fingerprint that evolves on your skin.
							</p>
						</div>

						{/* Technical Details / Specs */}
						<div className="mt-12 pt-10 border-t border-gray-200 flex gap-12">
							<div>
								<p className="text-2xl font-serif text-slate-900">100%</p>
								<p className="text-[10px] uppercase tracking-widest text-gray-400">Organic Base</p>
							</div>
							<div className="w-[1px] h-10 bg-gray-200"></div>
							<div>
								<p className="text-2xl font-serif text-slate-900">24hr</p>
								<p className="text-[10px] uppercase tracking-widest text-gray-400">Diffusion</p>
							</div>
						</div>
					</motion.div>

				</div>
			</div>
		</section>
	);
}

export default AboutSection;