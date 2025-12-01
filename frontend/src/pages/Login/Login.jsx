import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-8">
      {/* COMPACT PREMIUM LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs sm:max-w-sm bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30"
      >
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
          Welcome Back
        </h1>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {/* Forgot Password? */}
          <div className="text-right">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-emerald-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-5">
          New here?{" "}
          <span
            onClick={() => navigate("/create")}
            className="text-emerald-600 font-semibold hover:underline cursor-pointer"
          >
            Create account
          </span>
        </p>
      </motion.div>

      {/* HERO IMAGE */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 lg:mb-0 lg:ml-12"
      >
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/man-ensures-user-authentication-illustration-svg-download-png-10697190.png"
          alt="Organized wardrobe"
          className="w-56 sm:w-64 lg:w-80 rounded-2xl "
        />
      </motion.div>
    </div>
  );
}

export default Login;