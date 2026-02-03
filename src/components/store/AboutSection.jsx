import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Menu, User, Search, Plus, Heart,
    Package, Users, LayoutDashboard, LogOut,
    Trash2, Edit, ChevronRight, X, CreditCard, MapPin, Send, CheckCircle
} from 'lucide-react';

function AboutSection() {
	return (
		<section id="about" className="py-32 px-10 max-w-4xl mx-auto text-center">
			<h3 className="text-4xl font-serif mb-8 italic">Crafted in Small Batches</h3>
			<p className="text-gray-500 text-lg leading-relaxed font-light">Aetheria is a response to the mass-produced. We believe a fragrance is a temporal capsule, hand-poured in our private atelier in Paris.</p>
		</section>
	)
}

export default AboutSection