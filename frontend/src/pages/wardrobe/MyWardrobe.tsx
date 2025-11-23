// src/pages/MyWardrobe.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout/Layout';
import { Plus, X, Upload, Filter, Calendar, Tag, Palette, Shirt, Search, Trash2 } from 'lucide-react';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  gender: string;
  color: string;
  image: string | null;
  addedDate: string;
}

const categories = ["Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessories", "Bag", "Outerwear"];
const genders = ["Men", "Women", "Unisex", "Kids (Boy)", "Kids (Girl)"];

function MyWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([
    { id: "1", name: "Blue Denim Jacket", category: "Jacket", gender: "Unisex", color: "Blue", image: null, addedDate: "2025-04-01" },
    { id: "2", name: "White Cotton T-Shirt", category: "Top", gender: "Men", color: "White", image: null, addedDate: "2025-03-28" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "", gender: "", color: "", image: null as File | null,
  });

  const [filterCategory, setFilterCategory] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setForm({ ...form, image: e.target.files[0] });
  };

  const handleAddItem = () => {
    if (!form.name || !form.category || !form.gender || !form.color || !form.image) return;
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      gender: form.gender,
      color: form.color,
      image: URL.createObjectURL(form.image),
      addedDate: new Date().toISOString().split('T')[0],
    };
    setItems([newItem, ...items]);
    setIsModalOpen(false);
    setForm({ name: "", category: "", gender: "", color: "", image: null });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const filteredItems = items
    .filter(i => !filterCategory || i.category === filterCategory)
    .filter(i => !filterGender || i.gender === filterGender)
    .filter(i => !filterColor || i.color.toLowerCase().includes(filterColor.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest") return b.addedDate.localeCompare(a.addedDate);
      if (sortBy === "oldest") return a.addedDate.localeCompare(b.addedDate);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              My Wardrobe
            </h1>
            <p className="text-lg text-gray-600 mt-3">Curate, organize, and style your perfect collection</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="mt-6 sm:mt-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Add New Item
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Items", value: items.length, color: "emerald" },
            { label: "Tops", value: items.filter(i => i.category === "Top").length, color: "teal" },
            { label: "Women's", value: items.filter(i => i.gender.includes("Women")).length, color: "pink" },
            { label: "Colors", value: new Set(items.map(i => i.color)).size, color: "purple" },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-white/50 p-8 text-center">
              <p className={`text-4xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 p-6 mb-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <Filter className="w-5 h-5" />
              <span>Filter & Sort</span>
            </div>
            <div className="flex flex-wrap gap-3 flex-1">
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>

              <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
                className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition">
                <option value="">All Genders</option>
                {genders.map(g => <option key={g}>{g}</option>)}
              </select>

              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text" placeholder="Search color..." value={filterColor} onChange={e => setFilterColor(e.target.value)}
                  className="pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition w-48"
                />
              </div>

              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
              <div className="bg-gray-100 w-40 h-40 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Shirt className="w-20 h-20 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your wardrobe is empty</h3>
              <p className="text-gray-500">Start building your collection by adding your first item!</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shirt className="w-20 h-20 text-gray-300" />
                        </div>
                      )}

                      {/* Delete Button - Always Visible */}
                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-red-600 p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:text-red-700 hover:scale-110 transition-all duration-200 z-10 border border-gray-200"
                        title="Delete item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 text-lg truncate">{item.name}</h3>
                      <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {item.category}</span>
                        <span className="flex items-center gap-1"><Palette className="w-4 h-4" /> {item.color}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Added {item.addedDate}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto border border-white/30"
              >
                <div className="p-10">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition">
                    <X className="w-7 h-7" />
                  </button>

                  <h2 className="text-3xl font-bold text-gray-800 mb-10">Add New Clothing Item</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Item Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition text-lg" />

                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition text-lg">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>

                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                      className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition text-lg">
                      <option value="">For Whom?</option>
                      {genders.map(g => <option key={g}>{g}</option>)}
                    </select>

                    <input type="text" placeholder="Color (e.g. Navy, Beige)" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                      className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition text-lg" />

                    <div className="md:col-span-2">
                      <label className="block cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-emerald-500 transition-all bg-gray-50/50">
                          {form.image ? (
                            <div className="space-y-4">
                              <img src={URL.createObjectURL(form.image)} alt="Preview" className="mx-auto max-h-48 rounded-xl shadow-md" />
                              <p className="text-emerald-600 font-semibold">{form.image.name}</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                              <p className="text-xl text-gray-700">Drop image or click to upload</p>
                              <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 10MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-6 mt-12">
                    <button onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-5 border-2 border-gray-300 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button onClick={handleAddItem}
                      className="flex-1 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-2xl transition shadow-lg">
                      Add to Wardrobe
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default MyWardrobe;