import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const calculateStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirm) {
      setLocalError("Passwords don't match");
      return;
    }
    
    if (strength < 3) {
      setLocalError("Use a stronger password");
      return;
    }
    
    setLocalError("");
    
    const result = await dispatch(signup({ name, email, password, confirmPassword: confirm }));
    if (signup.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs sm:max-w-sm bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30"
      >
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
          Create Account
        </h1>

        {localError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2 mb-4"
          >
            <XCircle className="w-4 h-4" />
            {localError}
          </motion.p>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
          </div>

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

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLocalError(""); }}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3.5"
            >
              {showPass ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
            </button>
          </div>

          {password && (
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(strength / 4) * 100}%` }}
                className={`h-full transition-all duration-300 ${
                  strength <= 2 ? "bg-red-500" : strength === 3 ? "bg-yellow-500" : "bg-green-500"
                }`}
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setLocalError(""); }}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3.5"
            >
              {showConfirm ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
            </button>
          </div>

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
                Creating account...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Register
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-5">
          Have an account?{" "}
          <span
            onClick={() => navigate("/gettingStarted")}
            className="text-emerald-600 font-semibold hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 lg:mb-0 lg:ml-12"
      >
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/man-demonstrates-his-clothing-using-a-mobile-app-showcasing-various-outfits-on-his-smartphone-screen-illustration-svg-download-png-12487914.png"
          alt="Wardrobe"
          className="w-56 sm:w-64 lg:w-80 rounded-2xl "
        />
      </motion.div>
    </div>
  );
}

export default Register;