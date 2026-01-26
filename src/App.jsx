import React from 'react'
import { useEffect, useState } from "react";
import Navbar from "./pages/TopBar";
import Hero from "./pages/Hero";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import MobileMenu from "./pages/MobileMenu";

function App() {

	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="min-h-screen font-serif">
			<Navbar
				isScrolled={isScrolled}
				setMobileMenuOpen={setMobileMenuOpen}
			/>
			<main className="pt-[90px]">
				<Hero />
				<Products />
				<Contact />
			</main>
			{mobileMenuOpen && (
				<MobileMenu setMobileMenuOpen={setMobileMenuOpen} />
			)}
		</div>
	);
}

export default App; 