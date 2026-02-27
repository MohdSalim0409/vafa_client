import React, { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {

    const [inventory, setInventory] = useState([]);
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

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/inventory`);
            setInventory(response.data.data);
        } catch (error) {
            console.log(error);
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
                perfume: "",
                size: "",
                sku: "",
                batchNumber: "",
                costPrice: "",
                sellingPrice: "",
                quantity: 0,
                reorderLevel: 5,
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
            return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Out of Stock</span>;
        } else if (item.quantity <= item.reorderLevel) {
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Low Stock</span>;
        } else {
            return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">In Stock</span>;
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({
                            perfume: "",
                            size: "",
                            sku: "",
                            batchNumber: "",
                            costPrice: "",
                            sellingPrice: "",
                            quantity: 0,
                            reorderLevel: 5,
                        });
                        setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Add New Item
                </button>
            </div>

            {/* Message */}
            {message.text && <div className={`mb-4 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message.text}</div>}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Perfume *</label>
                                    <select name="perfume" value={formData.perfume} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">Select Perfume</option>
                                        {perfumes.map((perfume) => (
                                            <option key={perfume._id} value={perfume._id}>
                                                {perfume.name} - {perfume.brand}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Size (ml) *</label>
                                    <select name="size" value={formData.size} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">Select Size</option>
                                        {[10, 20, 30, 50, 75, 100, 125, 150, 200].map((size) => (
                                            <option key={size} value={size}>
                                                {size} ml
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                    <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
                                    <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price *</label>
                                    <input type="number" name="costPrice" value={formData.costPrice} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                                    <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                                    <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    {editingItem ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : inventory.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                    No inventory items found
                                </td>
                            </tr>
                        ) : (
                            inventory.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{item.perfume?.name}</div>
                                        <div className="text-sm text-gray-500">{item.perfume?.brand}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.size} ml</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.sku}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.batchNumber}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <span className={item.quantity <= item.reorderLevel ? "text-yellow-600 font-bold" : ""}>{item.quantity}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">₹{item.sellingPrice}</td>
                                    <td className="px-6 py-4">{getStatusBadge(item)}</td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
