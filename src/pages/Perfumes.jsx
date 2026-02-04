import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus, Droplets, Edit, Trash2, Filter } from "lucide-react";

function Perfumes() {
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


    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <div className=" mx-auto">

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
                                placeholder="Search perfumes or brands..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-indigo-200">
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
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Perfume Name</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Brand</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Category</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Concentration</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {perfumes.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                                                    <Droplets size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium">ID: {item._id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-700">{item.brand}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-600/20">
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
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
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
                    {perfumes.length === 0 && (
                        <div className="py-20 text-center">
                            <Droplets className="mx-auto text-slate-200 mb-4" size={48} />
                            <h3 className="text-slate-900 font-semibold">No perfumes in catalog</h3>
                            <p className="text-slate-500 text-sm">Start by adding your first fragrance to the master list.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center bg-black/80 justify-center">
                    <div className="bg-white rounded-xl shadow-xl w-80 p-6 text-center">
                        <h2 className="text-lg font-semibold mb-2">Delete Perfume</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete this perfume?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                // onClick={deletePerfume}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Perfumes;