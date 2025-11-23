import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Shirt,
  Heart,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "My Clothes", icon: Shirt, path: "/myclothes" },
    { name: "Donations", icon: Heart, path: "/donations" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar - Pure White */}
      <div className="hidden lg:block">
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-50 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              OurWardrobe
            </h1>
          </div>

          {/* Navigation - Only active gets color */}
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

                    {/* Active Indicator Pill */}
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

          {/* Logout */}
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
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-40 flex items-center justify-between px-5 lg:px-8 lg:pl-72 backdrop-blur-sm">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="lg:hidden font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          OurWardrobe
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          </Link>

          <button onClick={handleLogout} className="lg:hidden p-2 text-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu - Same clean style */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
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

      <div className="h-16 lg:hidden" />
    </>
  );
}

export default Navbar;