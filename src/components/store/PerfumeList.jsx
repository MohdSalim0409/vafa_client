import React from 'react';

const perfumes = [
    { id: 1, name: "Midnight Rose", brand: "Luxe Parfums", price: "$120", tag: "Floral", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500" },
    { id: 2, name: "Bleu de Mer", brand: "Oceanic", price: "$95", tag: "Fresh", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500" },
    { id: 3, name: "Santal 33", brand: "Le Labo", price: "$310", tag: "Woody", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500" },
    { id: 4, name: "Velvet Oud", brand: "Desert Bloom", price: "$150", tag: "Oriental", image: "https://images.unsplash.com/photo-1583445013765-48c220450215?w=500" },
    { id: 5, name: "Citrus Grove", brand: "Soleil", price: "$85", tag: "Citrus", image: "https://images.unsplash.com/photo-1512777576244-b846ac3d816f?w=500" }
];

export default function PerfumeList() {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-4xl font-serif text-gray-900 italic">The Boutique</h2>
                        <p className="text-gray-500 mt-2">Hand-picked fragrances for your collection.</p>
                    </div>
                    {/* Visual Hint for Desktop */}
                    <span className="hidden md:block text-xs uppercase tracking-widest text-gray-400">Scroll to explore →</span>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto space-x-6 pb-10 scrollbar-hide snap-x snap-mandatory">
                    {perfumes.map((perfume) => (
                        <div
                            key={perfume.id}
                            className="min-w-[300px] md:min-w-[350px] snap-center group"
                        >
                            {/* Image Wrapper */}
                            <div className="relative h-[450px] w-full rounded-2xl overflow-hidden mb-4">
                                <img
                                    src={perfume.image}
                                    alt={perfume.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
                                <span className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 text-xs font-medium rounded-full">
                                    {perfume.tag}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">{perfume.brand}</p>
                                <h3 className="text-lg font-medium text-gray-800">{perfume.name}</h3>
                                <p className="text-gray-900 font-semibold mt-1">{perfume.price}</p>

                                <button className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white px-8 py-2 text-sm uppercase tracking-tighter hover:bg-gray-800">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Global CSS to hide scrollbar (Tailwind doesn't have a native class for this) */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}