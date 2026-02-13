import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure you have axios installed: npm install axios

export default function PerfumeList() {
    const [perfumes, setPerfumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfumes = async () => {
            try {
                // Adjust this URL to your actual backend server address
                const response = await axios.get('http://localhost:5000/api/inventory');
                setPerfumes(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchPerfumes();
    }, []);

    if (loading) return <div className="text-center py-20">Loading our collection...</div>;

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-4xl font-serif text-gray-900 italic">The Boutique</h2>
                        <p className="text-gray-500 mt-2">Live Inventory from our Vault.</p>
                    </div>
                </div>

                <div className="flex overflow-x-auto space-x-6 pb-10 scrollbar-hide snap-x snap-mandatory">
                    {perfumes.map((item) => (
                        <div key={item._id} className="min-w-[300px] md:min-w-[350px] snap-center group">
                            <div className="relative h-[450px] w-full rounded-2xl overflow-hidden mb-4">
                                {/* Use image from PerfumeMaster model */}
                                <img
                                    src={item.perfume.images || 'placeholder.jpg'}
                                    alt={item.perfume.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <span className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 text-xs font-medium rounded-full">
                                    {item.perfume.fragranceFamily}
                                </span>
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                                    {item.perfume.brand}
                                </p>
                                <h3 className="text-lg font-medium text-gray-800">
                                    {item.perfume.name} — {item.size}ml
                                </h3>
                                <p className="text-gray-900 font-semibold mt-1">
                                    ${item.sellingPrice}
                                </p>

                                {/* Show stock status based on DB value */}
                                <p className={`text-[10px] mt-1 ${item.quantity < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                    {item.status} ({item.quantity} left)
                                </p>

                                <button
                                    disabled={item.quantity === 0}
                                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white px-8 py-2 text-sm uppercase tracking-tighter hover:bg-gray-800 disabled:bg-gray-300"
                                >
                                    {item.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* ... styles remain same ... */}
        </div>
    );
}