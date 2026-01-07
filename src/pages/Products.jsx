import { ShoppingBag, ArrowRight } from "lucide-react";
import React from 'react';

const products = [
    {
        id: 1,
        name: "Oud Royale",
        price: "$240.00",
        note: "RARE OUD & AMBER",
        image: "https://images.unsplash.com/photo-1585120040315-2241b774ad0f?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        name: "Velvet Rose",
        price: "$180.00",
        note: "DAMASK ROSE & MUSK",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        name: "Midnight Saffron",
        price: "$210.00",
        note: "SAFFRON & LEATHER",
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800"
    },
];

const Products = () => {
    return (
        <section className="py-24 px-[5%] max-w-[1400px] mx-auto bg-[#FCFBFA]">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-20 text-center">
                <span className="text-[#B59410] text-xs tracking-[5px] uppercase mb-4 font-medium">
                    The Collection
                </span>
                <h3 className="text-[#1A1A1A] text-4xl md:text-5xl font-extralight tracking-tight mb-6">
                    Signature <span className="font-serif italic">Scents</span>
                </h3>
                <div className="w-12 h-[1px] bg-[#B59410]"></div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {products.map(product => (
                    <div key={product.id} className="group flex flex-col items-center">
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] w-full bg-[#F5F5F5] overflow-hidden mb-8 border border-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-1000 ease-out"
                            />

                            {/* Sophisticated Hover Overlay */}
                            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8">
                                <button className="bg-[#1A1A1A] text-white px-8 py-3 flex items-center gap-3 hover:bg-[#B59410] transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <ShoppingBag size={14} />
                                    <span className="text-[10px] font-bold tracking-[2px] uppercase">Quick Add</span>
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="text-center w-full">
                            <p className="text-[#B59410] text-[10px] tracking-[3px] mb-3 font-semibold">
                                {product.note}
                            </p>
                            <h4 className="text-[#1A1A1A] text-2xl font-light tracking-wide mb-2 uppercase">
                                {product.name}
                            </h4>
                            <p className="text-gray-400 font-serif italic text-lg">
                                {product.price}
                            </p>

                            {/* Subtle Detail Link */}
                            <div className="mt-4 overflow-hidden h-6">
                                <button className="text-[#1A1A1A] text-[10px] font-bold tracking-[2px] uppercase flex items-center justify-center gap-2 mx-auto translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                    Explore Details <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Products;