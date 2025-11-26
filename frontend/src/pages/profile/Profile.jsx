import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { User, Mail, Edit2, Save, X, Lock } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    initials: "AJ"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleSaveProfile = () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      alert("Name and email cannot be empty");
      return;
    }
    setUser({
      name: editedName.trim(),
      email: editedEmail.trim(),
      initials: editedName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user.name);
    setEditedEmail(user.email);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordSuccess("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Page Title - Responsive */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-10 text-center sm:text-left">
          My Profile
        </h1>

        {/* Profile Card - Fully Responsive */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg flex-shrink-0">
                {user.initials}
              </div>

              {/* Name & Email */}
              <div className="flex-1 w-full">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-3 text-xl sm:text-2xl font-bold text-gray-800 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                      autoFocus
                    />
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-4 py-3 text-base sm:text-lg text-gray-600 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-2">
                      {user.name}
                      <User className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 hidden sm:inline" />
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <Mail className="w-5 h-5" />
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Edit / Save Buttons */}
            <div className="flex gap-3 justify-center sm:justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-5 h-5" />
                    <span className="hidden xs:inline">Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition flex items-center gap-2 text-sm sm:text-base"
                >
                  <Edit2 className="w-5 h-5" />
                  <span className="hidden xs:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Section - Responsive */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Change Password</h2>
          </div>

          <div className="max-w-md mx-auto sm:mx-0 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                placeholder="Repeat new password"
              />
            </div>

            {passwordError && (
              <p className="text-red-600 text-sm font-medium text-center sm:text-left">{passwordError}</p>
            )}

            {passwordSuccess && (
              <p className="text-emerald-600 text-sm font-medium flex items-center justify-center sm:justify-start gap-2">
                <span>Check</span> {passwordSuccess}
              </p>
            )}

            <button
              onClick={handleChangePassword}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl transition transform hover:scale-105 mt-6"
            >
              Update Password
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Profile;