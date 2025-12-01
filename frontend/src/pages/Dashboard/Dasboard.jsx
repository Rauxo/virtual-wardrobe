import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { 
  Shirt, 
  Package, 
  HeartHandshake, 
  Plus, 
  Grid3X3, 
  Lightbulb, 
  X, 
  Upload,
  TrendingUp,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { getDashboardStats, addItem, getItems } from '../../store/slices/wardrobeSlice';
import { toast } from 'react-toastify';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  const { items, stats, loading } = useSelector((state) => state.wardrobe);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gender: "",
    color: "",
    image: null
  });

  const categories = ["Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessories", "Bag", "Outerwear"];
  const genders = ["Men", "Women", "Unisex", "Kids (Boy)", "Kids (Girl)"];

  useEffect(() => {
    // Fetch dashboard stats when component mounts
    dispatch(getDashboardStats());
    // Fetch recent items
    dispatch(getItems({ limit: 5, sortBy: 'newest' }));
  }, [dispatch]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.gender || !formData.color || !formData.image) {
      toast.error("Please fill in all fields and upload an image");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('color', formData.color);
    formDataToSend.append('image', formData.image);

    const result = await dispatch(addItem(formDataToSend));
    if (addItem.fulfilled.match(result)) {
      toast.success('Item added successfully!');
      // Reset form
      setFormData({
        name: "",
        category: "",
        gender: "",
        color: "",
        image: null
      });
      setIsModalOpen(false);
      // Refresh stats
      dispatch(getDashboardStats());
    }
  };

  // Get user's first name
  const getUserFirstName = () => {
    if (!user?.name) return 'User';
    return user.name.split(' ')[0];
  };

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Get recent items (limit to 3 for dashboard)
  const recentItems = items.slice(0, 3);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section with User's Name */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome back, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {getUserFirstName()}
            </span>!
          </h1>
          <p className="text-lg text-gray-600">
            Manage your virtual wardrobe and discover new outfit combinations
          </p>
        </div>

        {/* Stats Cards - Now using real data from Redux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loading ? '...' : stats.totalItems}
                </p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Your collection
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Shirt className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Inactive Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loading ? '...' : stats.inactiveItems}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {stats.totalItems > 0 
                    ? `${Math.round((stats.inactiveItems / stats.totalItems) * 100)}% of total`
                    : 'No items yet'
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Pending Donations */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Donation</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loading ? '...' : stats.pendingDonations}
                </p>
                <p className="text-xs text-pink-600 mt-1">
                  {stats.pendingDonations > 0 ? 'Needs attention' : 'All clear'}
                </p>
              </div>
              <div className="p-3 bg-pink-100 rounded-xl">
                <HeartHandshake className="w-8 h-8 text-pink-600" />
              </div>
            </div>
          </div>

          {/* Active Rate */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Rate</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loading ? '...' : `${stats.activeRate}%`}
                </p>
                <p className="text-xs text-teal-600 mt-1">
                  {stats.activeItems} active items
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-xl">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {stats.activeRate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Items & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Actions - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Add New Item - Opens Modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus className="w-10 h-10" />
                <div className="text-left">
                  <p className="font-semibold text-lg">Add New Item</p>
                  <p className="text-sm opacity-90">Upload clothing photos</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/myclothes')}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <Grid3X3 className="w-10 h-10 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="font-semibold text-lg text-gray-800">View Wardrobe</p>
                  <p className="text-sm text-gray-600">Browse all items</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/donations')}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:border-pink-500 hover:shadow-md transition-all group"
              >
                <HeartHandshake className="w-10 h-10 text-pink-600 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="font-semibold text-lg text-gray-800">Manage Donations</p>
                  <p className="text-sm text-gray-600">Give clothes a new life</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/profile')}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                  {getUserFirstName().charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg text-gray-800">View Profile</p>
                  <p className="text-sm text-gray-600">Update your details</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Items - Takes 1 column */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Items</h2>
              <button 
                onClick={() => navigate('/myclothes')}
                className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-20 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            ) : recentItems.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
                <Shirt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No items yet</p>
                <p className="text-sm text-gray-500 mt-1">Add your first item to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-emerald-600 text-sm font-medium hover:text-emerald-700"
                >
                  Add Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {item.imageUrl ? (
                          <img 
                            src={`http://localhost:8080${item.imageUrl}`} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Shirt className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            {item.category}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            {item.color}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Added {formatRelativeTime(item.addedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wardrobe Tips */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            Wardrobe Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg text-amber-800 mb-2">Mix & Match Magic</h3>
              <p className="text-amber-700">
                Try combining your old denim jacket with that floral dress — unexpected combos often look amazing!
              </p>
              <p className="text-xs text-amber-600 mt-3">
                You have {stats.totalItems} items to experiment with!
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg text-teal-800 mb-2">Seasonal Refresh</h3>
              <p className="text-teal-700">
                Mark {Math.min(5, stats.inactiveItems)} items as inactive this week. Make room for pieces you actually love wearing.
              </p>
              <p className="text-xs text-teal-600 mt-3">
                {stats.inactiveItems} items marked as inactive
              </p>
            </div>
          </div>
        </div>

        {/* MODAL - Add New Item */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
              <div className="p-8">
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-8">Add New Clothing Item</h2>

                <div className="space-y-6">
                  {/* Item Name */}
                  <input
                    type="text"
                    placeholder="Item Name (e.g. Blue Denim Jacket)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  />

                  {/* Category */}
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* For (Gender) */}
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  >
                    <option value="">For Whom?</option>
                    {genders.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>

                  {/* Color */}
                  <input
                    type="text"
                    placeholder="Color (e.g. Navy Blue, Beige)"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  />

                  {/* Image Upload */}
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-emerald-500 transition">
                      {formData.image ? (
                        <div className="text-emerald-600">
                          <div className="w-24 h-24 mx-auto mb-3 overflow-hidden rounded-lg">
                            <img 
                              src={URL.createObjectURL(formData.image)} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-medium truncate">{formData.image.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-gray-600">Click to upload photo</p>
                          <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-10">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Add Item'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Dashboard;