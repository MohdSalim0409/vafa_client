import React, { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        perfume: "",
        size: "",
        sku: "",
        batchNumber: "",
        costPrice: "",
        sellingPrice: "",
        quantity: 0,
        reorderLevel: 5,
    });
    const [perfumes, setPerfumes] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchInventory();
        fetchPerfumes();
    }, []);

    // Handle search filtering
    useEffect(() => {
        const results = inventory.filter(item =>
            item.perfume?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.perfume?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredInventory(results);
    }, [searchTerm, inventory]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/inventory`);
            setInventory(response.data.data);
            setFilteredInventory(response.data.data);
        } catch (error) {
            showMessage("error", "Error fetching inventory");
        } finally {
            setLoading(false);
        }
    };

    const fetchPerfumes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/perfumeMasters/fetchPerfumes");
            setPerfumes(response.data);
        } catch (error) {
            console.error("Error fetching perfumes : ", error);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/inventory/${editingItem._id}`, formData);
                showMessage("success", "Inventory updated successfully");
            } else {
                await axios.post("http://localhost:5000/api/inventory", formData);
                showMessage("success", "Inventory added successfully");
            }
            setShowForm(false);
            setEditingItem(null);
            setFormData({
                perfume: "", size: "", sku: "", batchNumber: "",
                costPrice: "", sellingPrice: "", quantity: 0, reorderLevel: 5,
            });
            fetchInventory();
        } catch (error) {
            showMessage("error", error.response?.data?.message || "Error saving inventory");
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            perfume: item.perfume?._id || item.perfume,
            size: item.size,
            sku: item.sku,
            batchNumber: item.batchNumber,
            costPrice: item.costPrice,
            sellingPrice: item.sellingPrice,
            quantity: item.quantity,
            reorderLevel: item.reorderLevel,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/inventory/${id}`);
            showMessage("success", "Item deleted successfully");
            fetchInventory();
        } catch (error) {
            showMessage("error", "Error deleting item");
        }
    };

    const getStatusBadge = (item) => {
        if (item.quantity <= 0) {
            return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-semibold uppercase tracking-wider">Out of Stock</span>;
        } else if (item.quantity <= item.reorderLevel) {
            return <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-semibold uppercase tracking-wider">Low Stock</span>;
        } else {
            return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-semibold uppercase tracking-wider">In Stock</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
                        <p className="text-slate-500 text-sm">Manage fragrance stock, batch tracking, and pricing.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search by name, brand, or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-10 py-2.5 w-full sm:w-80 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm group-hover:border-gray-300"
                            />
                            <span className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors">
                                🔍
                            </span>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 text-lg"
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setFormData({ perfume: "", size: "", sku: "", batchNumber: "", costPrice: "", sellingPrice: "", quantity: 0, reorderLevel: 5 });
                                setShowForm(true);
                            }}
                            className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                        >
                            <span className="mr-2 text-xl">+</span> Add Item
                        </button>
                    </div>
                </div>

                {/* Notification Area */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-center shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-3 ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}></div>
                        {message.text}
                    </div>
                )}

                {/* Main Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Perfume Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">SKU / Batch</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Level</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">Updating inventory list...</td></tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            {searchTerm ? `No results found for "${searchTerm}"` : "Your inventory is empty."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{item.perfume?.name || "N/A"}</div>
                                                <div className="text-sm text-gray-500 flex items-center mt-0.5">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded mr-2 text-[10px] font-bold uppercase">{item.perfume?.brand}</span>
                                                    {item.size} ml
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mb-1 tracking-tight">{item.sku}</div>
                                                <div className="text-xs text-gray-400">Batch: {item.batchNumber}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm font-semibold ${item.quantity <= item.reorderLevel ? "text-amber-600" : "text-gray-700"}`}>
                                                    {item.quantity} Units
                                                </div>
                                                <div className="text-[10px] text-gray-400 uppercase font-medium">Reorder Level: {item.reorderLevel}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">₹{item.sellingPrice}</div>
                                                <div className="text-xs text-gray-400 line-through">Cost: ₹{item.costPrice}</div>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(item)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center gap-4">
                                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                                    <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-600 text-sm font-medium">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-800">{editingItem ? "Update Stock Item" : "New Inventory Entry"}</h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Perfume Product</label>
                                        <select name="perfume" value={formData.perfume} onChange={handleInputChange} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required>
                                            <option value="">Choose a fragrance...</option>
                                            {perfumes.map((p) => (
                                                <option key={p._id} value={p._id}>{p.name} — {p.brand}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bottle Size</label>
                                        <select name="size" value={formData.size} onChange={handleInputChange} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required>
                                            <option value="">Select ML</option>
                                            {[10, 20, 30, 50, 75, 100, 125, 150, 200].map(s => <option key={s} value={s}>{s} ml</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">SKU Reference</label>
                                        <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="e.g. PERF-001" className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Batch ID</label>
                                        <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Quantity</label>
                                            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Reorder Level</label>
                                            <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleInputChange} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="bg-indigo-50/50 p-5 rounded-2xl grid grid-cols-2 gap-4 md:col-span-2 border border-indigo-100">
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Cost Price (₹)</label>
                                            <input type="number" name="costPrice" value={formData.costPrice} onChange={handleInputChange} className="w-full bg-white border-indigo-100 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Selling Price (₹)</label>
                                            <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} className="w-full bg-white border-indigo-100 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700 transition-colors">Discard</button>
                                    <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                                        {editingItem ? "Update Stock" : "Create Item"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;