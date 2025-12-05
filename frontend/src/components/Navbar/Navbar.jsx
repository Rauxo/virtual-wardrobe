import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Shirt, Heart, LogOut, Menu, X, Bell, Trash2, Sparkles
} from "lucide-react";
import { logout } from '../../store/slices/authSlice';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications
} from '../../store/slices/notificationSlice';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: notifications, unreadCount, loading } = useSelector(state => state.notification);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    dispatch(getNotifications());
    const interval = setInterval(() => dispatch(getNotifications()), 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "My Clothes", icon: Shirt, path: "/myclothes" },
    { name: "Donations", icon: Heart, path: "/donations" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/gettingStarted");
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div className="hidden lg:block">
        <aside className="fixed left-0 top-0 h-screen bg-gray-200 w-64 border-r border-gray-100 z-40 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              OurWardrobe
            </h1>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? "text-emerald-600 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="sidebarActive"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-full"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-600">{user?.email || ''}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>
        <div className="w-64" />
      </div>

      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-200 border-b border-gray-100 z-50 flex items-center justify-between px-4 lg:px-6 lg:pl-72 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            OurWardrobe
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold text-[10px]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                </>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsNotifOpen(false)} />
                  
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="fixed inset-x-4 top-20 max-w-sm mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 lg:hidden"
                    style={{ maxHeight: '80vh' }}
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => dispatch(markAllAsRead())}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                      {loading ? (
                        <p className="text-center py-8 text-gray-500">Loading...</p>
                      ) : notifications.length === 0 ? (
                        <p className="text-center py-10 text-gray-500">No notifications yet</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => !notif.read && dispatch(markAsRead(notif._id))}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!notif.read ? "bg-emerald-50/30" : ""}`}
                          >
                            <p className={`font-medium text-sm ${notif.read ? "text-gray-600" : "text-gray-900"}`}>
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatTime(notif.createdAt)}</p>
                            {!notif.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>}
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={() => dispatch(clearAllNotifications())}
                          className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear all
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hidden lg:block absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button onClick={() => dispatch(markAllAsRead())} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif._id} onClick={() => !notif.read && dispatch(markAsRead(notif._id))}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!notif.read ? "bg-emerald-50/40" : ""}`}
                      >
                        {notif.type === 'outfit_suggestion' ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-emerald-500" />
                              <p className="font-bold text-emerald-600 text-sm">{notif.title}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                            {notif.data && (
                              <div className="flex items-center gap-3 mt-3">
                                <div className="text-center">
                                  <div className="w-16 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center border-2 border-dashed border-pink-300">
                                    <span className="text-xs font-bold text-pink-700">{notif.data.top?.color}</span>
                                  </div>
                                  <span className="text-xs mt-1">{notif.data.top?.category}</span>
                                </div>
                                <span className="text-2xl text-gray-400">+</span>
                                <div className="text-center">
                                  <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-300">
                                    <span className="text-xs font-bold text-blue-700">{notif.data.bottom?.color}</span>
                                  </div>
                                  <span className="text-xs mt-1">{notif.data.bottom?.category}</span>
                                </div>
                                {notif.data.matchScore && (
                                  <div className="ml-3 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                    {notif.data.matchScore}
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-3">{formatTime(notif.createdAt)}</p>
                          </>
                        ) : (
                          <>
                            <p className={`font-medium text-sm ${notif.read ? "text-gray-600" : "text-gray-900"}`}>
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatTime(notif.createdAt)}</p>
                          </>
                        )}
                        {!notif.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>}
                      </div>
                    ))}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100">
                      <button onClick={() => dispatch(clearAllNotifications())} className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1">
                        <Trash2 className="w-4 h-4" />
                        Clear all
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getInitials()}
            </div>
          </Link>
          <button onClick={handleLogout} className="lg:hidden p-2 text-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col z-60">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  OurWardrobe
                </h1>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <nav className="flex-1 p-4">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive(item.path)
                            ? "text-emerald-600 font-semibold"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                        {isActive(item.path) && (
                          <motion.div
                            layoutId="mobileActive"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-full"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4 px-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-600">{user?.email || ''}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 lg:hidden" />
    </>
  );
}

export default Navbar;