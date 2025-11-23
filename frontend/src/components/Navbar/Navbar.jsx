// Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Shirt,
  Heart,
  LogOut,
  Menu,
  X,
  Bell,
  Check,
  Trash2,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sample notifications
  const [notifications, setNotifications] = useState([
    { id: "1", title: "New Donation", message: "You received a jacket from Sarah", time: "2 min ago", read: false },
    { id: "2", title: "Item Sent", message: "Your t-shirt was sent to Mike", time: "1 hour ago", read: false },
    { id: "3", title: "Welcome!", message: "Thanks for joining OurWardrobe", time: "2 days ago", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "My Clothes", icon: Shirt, path: "/myclothes" },
    { name: "Donations", icon: Heart, path: "/donations" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate("/login");
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block ">
        <aside className="fixed left-0 top-0 h-screen bg-gray-200 w-64  border-r border-gray-100 z-40 flex flex-col">
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>
        <div className="w-64" />
      </div>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-200 border-b border-gray-100 z-50 flex items-center justify-between px-4 lg:px-6 lg:pl-72 backdrop-blur-sm">
        {/* Left side - Logo for mobile, Menu button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Show on both mobile and desktop */}
          <div className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            OurWardrobe
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">

          {/* Notification Bell + Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <>
                  {/* Mobile Dropdown - Centered */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="lg:hidden fixed inset-x-4 top-20 w-auto max-w-[calc(100vw-2rem)] mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 z-60 overflow-hidden"
                    style={{
                      maxHeight: "calc(100vh - 140px)",
                      width: "calc(100vw - 2rem)",
                    }}
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {hasUnread && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                      {notifications.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition ${
                              !notif.read ? "bg-emerald-50/30" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className={`font-medium ${notif.read ? "text-gray-600" : "text-gray-900"}`}>
                                  {notif.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                              </div>
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="ml-3 text-emerald-600 hover:text-emerald-700"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={clearAll}
                          className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear all
                        </button>
                      </div>
                    )}
                  </motion.div>

                  {/* Desktop Dropdown - Original Design */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="hidden lg:block absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-60 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {hasUnread && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition ${
                              !notif.read ? "bg-emerald-50/30" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className={`font-medium ${notif.read ? "text-gray-600" : "text-gray-900"}`}>
                                  {notif.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                              </div>
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="ml-3 text-emerald-600 hover:text-emerald-700"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={clearAll}
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
          </div>

          {/* Profile */}
          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          </Link>

          {/* Mobile Logout */}
          <button onClick={handleLogout} className="lg:hidden p-2 text-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/30" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
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

              <div className="p-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden" />
    </>
  );
}

export default Navbar;