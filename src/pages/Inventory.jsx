import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Edit, Trash2, X, Package } from "lucide-react";

const Inventory = () => {

    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
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

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/inventory/${deleteId}`);
            showMessage("success", "Item deleted successfully");
            fetchInventory();
            setDeleteId(null);
        } catch (error) {
            showMessage("error", "Error deleting item");
        }
    };

    const getStatusBadge = (item) => {
        if (item.quantity <= 0) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-tight bg-red-50 text-red-700 ring-1 ring-inset ring-red-700/10">Out of Stock</span>;
        } else if (item.quantity <= item.reorderLevel) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-tight bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/10">Low Stock</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-tight bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10">In Stock</span>;
        }
    };

    const resetModal = () => {
        setShowForm(false);
        setEditingItem(null);
        setFormData({
            perfume: "", size: "", sku: "", batchNumber: "",
            costPrice: "", sellingPrice: "", quantity: 0, reorderLevel: 5,
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <div className="mx-auto max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
                        <p className="text-slate-500 text-sm">Manage fragrance stock, batch tracking, and pricing.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, brand, or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setFormData({ perfume: "", size: "", sku: "", batchNumber: "", costPrice: "", sellingPrice: "", quantity: 0, reorderLevel: 5 });
                                setShowForm(true);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-indigo-200"
                        >
                            <Plus size={16} />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Notification Banner */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-center shadow-sm ${message.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-800"
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-3 ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"
                            }`}></div>
                        {message.text}
                    </div>
                )}

                {/* Main Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Perfume Details</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">SKU / Batch</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Stock Level</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Pricing</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                                            Updating inventory list...
                                        </td>
                                    </tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <Package className="text-slate-200 mb-4" size={48} />
                                                <h3 className="text-slate-900 font-semibold">No items found</h3>
                                                <p className="text-slate-500 text-sm">
                                                    {searchTerm ? `No results for "${searchTerm}"` : "Your inventory is empty."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 text-center">
                                                <div className="font-bold text-slate-900">{item.perfume?.name || "N/A"}</div>
                                                <div className="text-sm text-slate-500">
                                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded mr-2 text-[10px] font-bold uppercase">{item.perfume?.brand}</span>
                                                    {item.size} ml
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mb-1 tracking-tight">{item.sku}</div>
                                                <div className="text-xs text-slate-400">Batch: {item.batchNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`text-sm font-semibold ${item.quantity <= item.reorderLevel ? "text-amber-600" : "text-slate-700"}`}>
                                                    {item.quantity} Units
                                                </div>
                                                <div className="text-[10px] text-slate-400 uppercase font-medium">Reorder: {item.reorderLevel}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm font-bold text-slate-900">₹{item.sellingPrice}</div>
                                                <div className="text-xs text-slate-400 line-through">₹{item.costPrice}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">{getStatusBadge(item)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(item._id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center bg-black/80 justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                    <div className="bg-white rounded-xl shadow-xl w-80 p-6 text-center">
                        <h2 className="text-lg font-semibold mb-2">Delete Item</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete this inventory item?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center bg-black/80 justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingItem ? "Update Stock Item" : "New Inventory Entry"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {editingItem ? "Edit the details below." : "Fill in the details to add a new item."}
                            </p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                {/* Perfume Select - Full Width */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                        Select Perfume Product
                                    </label>
                                    <select
                                        name="perfume"
                                        value={formData.perfume}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                        required
                                    >
                                        <option value="">Choose a fragrance...</option>
                                        {perfumes.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name} — {p.brand}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Size */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                            Bottle Size (ml)
                                        </label>
                                        <select
                                            name="size"
                                            value={formData.size}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                            required
                                        >
                                            <option value="">Select ML</option>
                                            {[10, 20, 30, 50, 75, 100, 125, 150, 200].map(s => (
                                                <option key={s} value={s}>{s} ml</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* SKU */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                            SKU Reference
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleInputChange}
                                            placeholder="e.g. PERF-001"
                                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Batch Number */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                            Batch ID
                                        </label>
                                        <input
                                            type="text"
                                            name="batchNumber"
                                            value={formData.batchNumber}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                            Stock Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Reorder Level */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                                            Reorder Level
                                        </label>
                                        <input
                                            type="number"
                                            name="reorderLevel"
                                            value={formData.reorderLevel}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Placeholder for alignment */}
                                    <div></div>
                                </div>

                                {/* Pricing Section - Light indigo background */}
                                <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 px-1">
                                                Cost Price (₹)
                                            </label>
                                            <input
                                                type="number"
                                                name="costPrice"
                                                value={formData.costPrice}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                className="w-full bg-white border border-indigo-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 px-1">
                                                Selling Price (₹)
                                            </label>
                                            <input
                                                type="number"
                                                name="sellingPrice"
                                                value={formData.sellingPrice}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                className="w-full bg-white border border-indigo-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetModal}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-95"
                                >
                                    {editingItem ? "Update Item" : "Save Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;