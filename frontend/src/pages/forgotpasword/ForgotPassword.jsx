import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, CheckCircle, Send, Key } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, verifyOtp, resetPassword, clearError, clearOtpState } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message, otpSent, otpVerified } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message, dispatch]);

  useEffect(() => {
    if (otpSent && step === 1) {
      setStep(2);
    }
    if (otpVerified && step === 2) {
      setStep(3);
    }
  }, [otpSent, otpVerified, step]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setLocalError("Please enter a valid email");
      return;
    }
    setLocalError("");
    await dispatch(forgotPassword(email));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP");
      return;
    }
    setLocalError("");
    await dispatch(verifyOtp({ email, otp }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setLocalError("");
    const result = await dispatch(resetPassword({ email, otp, newPassword, confirmPassword }));
    if (resetPassword.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(clearOtpState());
        navigate("/gettingStarted");
      }, 2000);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        dispatch(clearOtpState());
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40"
      >
        {step > 1 && (
          <button
            onClick={goBack}
            className="mb-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}

        {step === 1 && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Forgot Password?
            </h1>
            <p className="text-gray-600 mb-8">Enter your email to reset your password</p>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition text-base"
                  required
                />
              </div>

              {localError && <p className="text-red-500 text-sm">{localError}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send OTP
                  </>
                )}
              </motion.button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
              <Key className="w-10 h-10 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Enter OTP
            </h1>
            <p className="text-gray-600 text-sm mb-2">Check your email</p>
            <p className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg inline-block mb-6">
              {email}
            </p>

            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full text-center text-4xl font-mono tracking-widest py-5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                required
              />

              {localError && <p className="text-red-500 text-sm mt-4">{localError}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Set New Password
            </h1>
            <p className="text-gray-600 mb-8">Choose a strong password</p>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
                  required
                />
              </div>

              {localError && <p className="text-red-500 text-sm">{localError}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Reset Password"}
              </motion.button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;