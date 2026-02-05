import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Package, Edit, Trash2, AlertCircle } from "lucide-react";

function Inventory() {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        perfume: "",   // ADD THIS
        sku: "",
        batchNumber: "",
        size: "",
        status: "In Stock",
        quantity: "",
        sellingPrice: "",
        costPrice: "",
        reorderLevel: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteId, setDeleteId] = useState(null);

    const getInventory = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/inventory");
            setItems(res.data);
        } catch (err) {
            console.error("Error fetching inventory:", err);
        }
    };

    useEffect(() => {
        getInventory();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case "In Stock": return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
            case "Low Stock": return "bg-amber-50 text-amber-700 ring-amber-600/20";
            case "Out Of Stock": return "bg-rose-50 text-rose-700 ring-rose-600/20";
            default: return "bg-slate-50 text-slate-700 ring-slate-600/20";
        }
    };

    const deleteInventory = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/inventory/${deleteId}`);
            setDeleteId(null);
            getInventory();
        } catch (err) {
            console.error("Delete error : ", err);
        }
    };
    const updateInventory = async () => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/inventory/${editId}`,
                formData
            );

            setItems(items.map(i => i._id === editId ? res.data : i));
            setShowModal(false);
            setIsEdit(false);
            setEditId(null);
        } catch (err) {
            console.error(err);
        }
    };
    const addInventory = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/inventory",
                formData
            );

            setItems([...items, res.data]);
            setShowModal(false);

        } catch (err) {
            console.error("ADD ERROR:", err.response?.data || err.message);
        }
    };
    const [perfumes, setPerfumes] = useState([]);

    const getPerfumes = async () => {
        const res = await axios.get("http://localhost:5000/api/perfumes");
        setPerfumes(res.data);
    };

    useEffect(() => {
        getInventory();
        getPerfumes();
    }, []);
    const handleEdit = (item) => {
        setFormData({
            perfume: item.perfume,   // ADD THIS
            sku: item.sku,
            batchNumber: item.batchNumber,
            size: item.size,
            status: item.status,
            quantity: item.quantity,
            sellingPrice: item.sellingPrice,
            costPrice: item.costPrice,
            reorderLevel: item.reorderLevel
        });
        setIsEdit(true);
        setShowModal(true);
    };  


    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <div className="mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Perfume Inventory</h1>
                        <p className="text-slate-500 text-sm">Manage stock levels, pricing, and warehouse locations.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search SKU or Batch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setFormData({
                                    sku: "",
                                    batchNumber: "",
                                    size: "",
                                    status: "In Stock",
                                    quantity: "",
                                    sellingPrice: "",
                                    costPrice: "",
                                    reorderLevel: ""
                                });
                                setIsEdit(false);
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
                        >
                            <Plus size={16} />
                            Add Item
                        </button>

                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Product Details</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Size</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Stock Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Quantity</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Price</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 pl-16 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{item.sku}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium">Batch: {item.batchNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-slate-600">{item.size}ml</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ring-1 ring-inset ${getStatusStyles(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`text-sm font-bold ${item.quantity <= item.reorderLevel ? 'text-red-500' : 'text-slate-700'}`}>
                                                {item.quantity}
                                            </div>
                                            {item.quantity <= item.reorderLevel && (
                                                <div className="text-[10px] text-red-400 flex items-center justify-center gap-1">
                                                    <AlertCircle size={10} /> Reorder
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm font-bold text-slate-900">₹{item.sellingPrice}</div>
                                            <div className="text-[10px] text-slate-400 line-through">₹{item.costPrice}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                                <button
                                                    onClick={() => setDeleteId(item._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {items.length === 0 && (
                        <div className="py-20 text-center">
                            <Package className="mx-auto text-slate-200 mb-4" size={48} />
                            <h3 className="text-slate-900 font-semibold">No inventory found</h3>
                            <p className="text-slate-500 text-sm">Get started by adding your first perfume stock.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center bg-black/80 justify-center">
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
                                onClick={deleteInventory}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
                    <div className="bg-white w-96 rounded-xl p-6 space-y-3">

                        <h2 className="font-bold text-lg">
                            {isEdit ? "Edit Item" : "Add Item"}
                        </h2>

                        <input name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="inputStyle" />
                        <input name="batchNumber" value={formData.batchNumber} onChange={handleChange} placeholder="Batch" className="inputStyle" />
                        <input name="size" value={formData.size} onChange={handleChange} placeholder="Size" className="inputStyle" />
                        <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="inputStyle" />
                        <input name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} placeholder="Selling Price" className="inputStyle" />
                        <input name="costPrice" value={formData.costPrice} onChange={handleChange} placeholder="Cost Price" className="inputStyle" />

                        <div className="flex justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={isEdit ? updateInventory : addInventory}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                            >
                                {isEdit ? "Update" : "Save"}
                            </button>
                            


                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Inventory