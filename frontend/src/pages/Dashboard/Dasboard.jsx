import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Shirt, Package, HeartHandshake, Plus, Grid3X3, Lightbulb, X, Upload } from 'lucide-react';

function Dashboard() {
  const userName = "Rahul";
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form state
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [forGender, setForGender] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);

  const categories = ["Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessories", "Bag", "Outerwear"];
  const genders = ["Men", "Women", "Unisex", "Kids (Boy)", "Kids (Girl)"];

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!itemName || !category || !forGender || !color || !image) {
      alert("Please fill in all fields and upload an image");
      return;
    }
    console.log("New item added:", { itemName, category, forGender, color, image: image.name });
    // Reset form
    setItemName(""); setCategory(""); setForGender(""); setColor(""); setImage(null);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome back, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{userName}</span>!
          </h1>
          <p className="text-lg text-gray-600">
            Manage your virtual wardrobe and discover new outfit combinations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">127</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Shirt className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">23</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Donation</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">8</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-xl">
                <HeartHandshake className="w-8 h-8 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Rate</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">82%</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-xl">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">82</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <button className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:border-emerald-500 hover:shadow-md transition-all group">
              <Grid3X3 className="w-10 h-10 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="font-semibold text-lg text-gray-800">View Wardrobe</p>
                <p className="text-sm text-gray-600">Browse all items</p>
              </div>
            </button>

            <button className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:border-pink-500 hover:shadow-md transition-all group">
              <HeartHandshake className="w-10 h-10 text-pink-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="font-semibold text-lg text-gray-800">Manage Donations</p>
                <p className="text-sm text-gray-600">Give clothes a new life</p>
              </div>
            </button>
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
              <p className="text-amber-700">Try combining your old denim jacket with that floral dress — unexpected combos often look amazing!</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg text-teal-800 mb-2">Seasonal Refresh</h3>
              <p className="text-teal-700">Mark 5 items as inactive this week. Make room for pieces you actually love wearing.</p>
            </div>
          </div>
        </div>

        {/* MODAL - Perfectly Responsive */}
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
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  />

                  {/* Category */}
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* For (Gender) */}
                  <select
                    value={forGender}
                    onChange={(e) => setForGender(e.target.value)}
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
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
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
                      {image ? (
                        <div className="text-emerald-600">
                          <Upload className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">{image.name}</p>
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
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                  >
                    Add Item
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