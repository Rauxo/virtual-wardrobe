import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout/Layout';
import { 
  Plus, X, Upload, Filter, Calendar, Tag, Palette, Shirt, Search, 
  Trash2, Loader2, Grid3X3, Users, Package, TrendingUp, Edit2, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getItems, 
  addItem, 
  deleteItem, 
  updateItemStatus,
  clearWardrobeError 
} from '../../store/slices/wardrobeSlice';

const categories = ["Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessories", "Bag", "Outerwear"];
const genders = ["Men", "Women", "Unisex", "Kids (Boy)", "Kids (Girl)"];
const statuses = ["active", "inactive", "donated"];

function MyWardrobe() {
  const dispatch = useDispatch();
  
  const { items, stats, loading, error } = useSelector((state) => state.wardrobe);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", 
    category: "", 
    gender: "", 
    color: "", 
    image: null,
  });
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    status: "active",
    sortBy: "newest"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearWardrobeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const queryFilters = {
      ...filters,
      status: showInactive ? '' : 'active' 
    };
    dispatch(getItems(queryFilters));
  }, [dispatch, filters, showInactive]);

  const calculateStats = () => {
    const activeItems = items.filter(item => item.status === 'active').length;
    const inactiveItems = items.filter(item => item.status === 'inactive').length;
    const donatedItems = items.filter(item => item.status === 'donated').length;
    const uniqueColors = new Set(items.map(item => item.color)).size;
    
    const categoryBreakdown = categories.map(cat => ({
      category: cat,
      count: items.filter(item => item.category === cat).length
    })).filter(item => item.count > 0);

    return {
      total: items.length,
      active: activeItems,
      inactive: inactiveItems,
      donated: donatedItems,
      uniqueColors,
      categoryBreakdown
    };
  };

  const statsData = calculateStats();

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setForm({ ...form, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddItem = async () => {
    if (!form.name || !form.category || !form.gender || !form.color || !form.image) {
      toast.error("Please fill in all fields and upload an image");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('gender', form.gender);
    formData.append('color', form.color);
    formData.append('image', form.image);

    try {
      const result = await dispatch(addItem(formData));
      if (addItem.fulfilled.match(result)) {
        toast.success('Item added successfully!');
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const result = await dispatch(deleteItem(itemId));
      if (deleteItem.fulfilled.match(result)) {
        toast.success('Item deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      const result = await dispatch(updateItemStatus({ itemId, status: newStatus }));
      if (updateItemStatus.fulfilled.match(result)) {
        const statusMsg = newStatus === 'active' ? 'activated' : 'marked as inactive';
        toast.success(`Item ${statusMsg} successfully!`);
      }
    } catch (error) {
      toast.error('Failed to update item status');
    }
  };

  const resetForm = () => {
    setForm({
      name: "", 
      category: "", 
      gender: "", 
      color: "", 
      image: null
    });
    setPreviewImage(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-800',
      inactive: 'bg-amber-100 text-amber-800',
      donated: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredItems = items.filter(item => {
    if (!showInactive && item.status === 'inactive') return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.gender && item.gender !== filters.gender) return false;
    if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
    if (filters.status && item.status !== filters.status) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'newest') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    if (filters.sortBy === 'oldest') return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
    if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              My Wardrobe
            </h1>
            <p className="text-lg text-gray-600 mt-3">
              Curate, organize, and style your perfect collection
            </p>
          </div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                showInactive 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showInactive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              <span className="ml-2 hidden sm:inline">
                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
              </span>
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add New Item</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.div whileHover={{ y: -4 }} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-white/50 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shirt className="w-8 h-8 text-emerald-600" />
              <p className="text-4xl font-bold text-emerald-600">{statsData.total}</p>
            </div>
            <p className="text-gray-600">Total Items</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-white/50 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <p className="text-4xl font-bold text-teal-600">{statsData.active}</p>
            </div>
            <p className="text-gray-600">Active Items</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-white/50 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Package className="w-8 h-8 text-purple-600" />
              <p className="text-4xl font-bold text-purple-600">{statsData.donated}</p>
            </div>
            <p className="text-gray-600">Donated</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-white/50 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Palette className="w-8 h-8 text-pink-600" />
              <p className="text-4xl font-bold text-pink-600">{statsData.uniqueColors}</p>
            </div>
            <p className="text-gray-600">Colors</p>
          </motion.div>
        </motion.div>

        {statsData.categoryBreakdown.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {statsData.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="bg-white rounded-xl p-4 text-center shadow-sm border">
                  <p className="text-2xl font-bold text-emerald-600">{cat.count}</p>
                  <p className="text-sm text-gray-600 mt-1">{cat.category}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 p-6 mb-10"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <Filter className="w-5 h-5" />
              <span>Filter & Sort</span>
            </div>
            <div className="flex flex-wrap gap-3 flex-1">
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                value={filters.gender} 
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
              >
                <option value="">All Genders</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text" 
                  placeholder="Search color..." 
                  value={filters.color}
                  onChange={(e) => setFilters({...filters, color: e.target.value})}
                  className="pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition w-40"
                />
              </div>

              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="donated">Donated</option>
              </select>

              <select 
                value={filters.sortBy} 
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <div className="w-5 h-5 flex flex-col justify-between">
                    <div className="h-1 w-full bg-current rounded"></div>
                    <div className="h-1 w-full bg-current rounded"></div>
                    <div className="h-1 w-full bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-32"
            >
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your wardrobe...</p>
            </motion.div>
          ) : filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-32"
            >
              <div className="bg-gray-100 w-40 h-40 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Shirt className="w-20 h-20 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your wardrobe is empty</h3>
              <p className="text-gray-500 mb-6">Start building your collection by adding your first item!</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition"
              >
                Add Your First Item
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={`http://localhost:8080${item.imageUrl}`} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shirt className="w-20 h-20 text-gray-300" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item._id);
                          }}
                          className="bg-white/90 backdrop-blur-md text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-700 hover:scale-110 transition-all duration-200 z-10 border border-gray-200"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {item.status !== 'donated' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(
                                item._id, 
                                item.status === 'active' ? 'inactive' : 'active'
                              );
                            }}
                            className="bg-white/90 backdrop-blur-md text-emerald-600 p-2 rounded-full shadow-lg hover:bg-emerald-50 hover:text-emerald-700 hover:scale-110 transition-all duration-200 z-10 border border-gray-200"
                            title={item.status === 'active' ? 'Mark as inactive' : 'Mark as active'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 text-lg truncate">{item.name}</h3>
                      <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" /> {item.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {item.gender}
                        </span>
                        <span className="flex items-center gap-1">
                          <Palette className="w-4 h-4" /> {item.color}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> 
                        Added {formatDate(item.addedDate)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <img 
                          src={`http://localhost:8080${item.imageUrl}`} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shirt className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800 text-lg truncate">{item.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Tag className="w-4 h-4" />
                          <span>{item.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{item.gender}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Palette className="w-4 h-4" />
                          <span>{item.color}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Added {formatDate(item.addedDate)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {item.status !== 'donated' && (
                        <button
                          onClick={() => handleUpdateStatus(
                            item._id, 
                            item.status === 'active' ? 'inactive' : 'active'
                          )}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title={item.status === 'active' ? 'Mark as inactive' : 'Mark as active'}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Add New Clothing Item</h2>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-700 transition"
                      disabled={isSubmitting}
                    >
                      <X className="w-7 h-7" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name
                      </label>
                      <input
                        type="text"
                        placeholder="Blue Denim Jacket"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
                        disabled={isSubmitting}
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        For Whom?
                      </label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
                        disabled={isSubmitting}
                      >
                        <option value="">Select Gender</option>
                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        placeholder="Navy Blue, Beige, etc."
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                      </label>
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-500 transition-all bg-gray-50/50">
                          {previewImage ? (
                            <div className="space-y-4">
                              <div className="mx-auto max-h-48 rounded-xl overflow-hidden">
                                <img 
                                  src={previewImage} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-emerald-600 font-semibold">
                                {form.image?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Click to change image
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                              <p className="text-lg text-gray-700">Drop image or click to upload</p>
                              <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 10MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddItem}
                      disabled={isSubmitting || !form.name || !form.category || !form.gender || !form.color || !form.image}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-2xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add to Wardrobe'
                      )}
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