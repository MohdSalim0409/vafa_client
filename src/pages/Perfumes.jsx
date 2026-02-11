import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus, Droplets, Edit, Trash2, X } from "lucide-react";

function Perfumes() {

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialFormState = {
        name: "",
        brand: "",
        category: "",
        concentration: "",
        fragranceFamily: "",
        topNotes: "",
        middleNotes: "",
        baseNotes: "",
        description: "",
        images: "",
        status: true
    };

    const [formData, setFormData] = useState(initialFormState);
    const [perfumes, setPerfumes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        getPerfumes();
    }, []);

    const getPerfumes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/perfumes");
            setPerfumes(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deletePerfume = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/perfumes/${deleteId}`);
            setPerfumes(perfumes.filter((p) => p._id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name || "",
            brand: item.brand || "",
            category: item.category || "",
            concentration: item.concentration || "",
            fragranceFamily: item.fragranceFamily || "",
            topNotes: Array.isArray(item.topNotes) ? item.topNotes.join(",") : item.topNotes || "",
            middleNotes: Array.isArray(item.middleNotes) ? item.middleNotes.join(",") : item.middleNotes || "",
            baseNotes: Array.isArray(item.baseNotes) ? item.baseNotes.join(",") : item.baseNotes || "",
            description: item.description || "",
            images: "", // IMPORTANT
            status: item.status ?? true
        });

        setEditId(item._id);
        setIsEdit(true);
        setShowModal(true);
    };


    const resetModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setEditId(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === "images" && !formData.images) return; // skip empty image
                data.append(key, formData[key]);
            });

            if (isEdit) {
                const res = await axios.put(
                    `http://localhost:5000/api/perfumes/${editId}`,
                    data,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                setPerfumes(perfumes.map(p => p._id === editId ? res.data : p));
            } else {
                const res = await axios.post(
                    "http://localhost:5000/api/perfumes",
                    data,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                setPerfumes([...perfumes, res.data]);
            }

            resetModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <div className="mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Perfume Catalog</h1>
                        <p className="text-slate-500 text-sm">Manage master product details and brand information.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search perfumes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => { resetModal(); setShowModal(true); }}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 transition-all"
                        >
                            <Plus size={16} />
                            New Perfume
                        </button>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Product Details</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Brand</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Category</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Concentration</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {perfumes.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 pl-16 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                    <Droplets size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium">{item.fragranceFamily}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-slate-700">{item.brand}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-tight">
                                                {item.concentration}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-1">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => setDeleteId(item._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[110] flex items-center bg-black/60 backdrop-blur-sm justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-2">Confirm Delete</h2>
                        <p className="text-sm text-slate-500 mb-6">Are you sure you want to remove this perfume? This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                            <button onClick={deletePerfume} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-md shadow-red-100">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Modal Header - shrink-0 keeps it from compressing */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {isEdit ? 'Edit Perfume' : 'Add New Perfume'}
                                </h2>
                                <p className="text-sm text-slate-500">Enter the fragrance profile and specifications.</p>
                            </div>
                            <button
                                onClick={resetModal}
                                className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                                {/* Perfume Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Perfume Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 mt-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                        placeholder="e.g. Bleu de Chanel"
                                    />
                                </div>

                                {/* Brand */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Brand</label>
                                    <input
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 mt-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                        placeholder="e.g. Chanel"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 mt-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                    >
                                        <option value="">Select Category</option>
                                        <option>Men</option>
                                        <option>Women</option>
                                        <option>Unisex</option>
                                    </select>
                                </div>

                                {/* Concentration */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Concentration</label>
                                    <select
                                        name="concentration"
                                        value={formData.concentration}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 mt-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                    >
                                        <option value="">Select Concentration</option>
                                        <option>EDT</option>
                                        <option>EDP</option>
                                        <option>Parfum</option>
                                        <option>Eau Fraiche</option>
                                    </select>
                                </div>

                                {/* Fragrance Family */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Fragrance Family</label>
                                    <select
                                        name="fragranceFamily"
                                        value={formData.fragranceFamily}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 mt-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                    >
                                        <option value="">Select Family</option>
                                        <option>Floral</option>
                                        <option>Woody</option>
                                        <option>Fresh</option>
                                        <option>Oriental</option>
                                        <option>Citrus</option>
                                    </select>
                                </div>

                                {/* Notes Grid */}
                                <div className="md:col-span-2 py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Top Notes</label>
                                            <input name="topNotes" value={formData.topNotes} onChange={handleChange} className="w-full bg-slate-50 border mt-2 border-slate-200 p-2 rounded-lg text-sm" placeholder="Lemon, Mint" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Middle Notes</label>
                                            <input name="middleNotes" value={formData.middleNotes} onChange={handleChange} className="w-full bg-slate-50 border mt-2 border-slate-200 p-2 rounded-lg text-sm" placeholder="Ginger, Jasmine" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Base Notes</label>
                                            <input name="baseNotes" value={formData.baseNotes} onChange={handleChange} className="w-full mt-2 bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm" placeholder="Cedar, Amber" />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 mt-2 focus:ring-indigo-500/20 outline-none text-sm"
                                        placeholder="Tell us about the scent..."
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Product Image</label>
                                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-10 w-10 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-slate-600">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-1">
                                                    <span>Upload a file</span>
                                                    <input
                                                        type="file"
                                                        name="images"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => setFormData({ ...formData, images: e.target.files[0] })}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Checkbox */}
                                <div className="md:col-span-2 flex items-center gap-2 px-1 pt-2">
                                    <input
                                        type="checkbox"
                                        name="status"
                                        checked={formData.status}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                        id="status-check"
                                    />
                                    <label htmlFor="status-check" className="text-sm font-medium text-slate-700 cursor-pointer">
                                        Set as Active in Catalog
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - shrink-0 keeps it visible at the bottom */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={resetModal}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md shadow-indigo-100 transition-all active:scale-95"
                            >
                                {isEdit ? "Update Perfume" : "Save Perfume"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Perfumes;