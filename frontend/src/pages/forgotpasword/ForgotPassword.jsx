import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, CheckCircle, Send, Key } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const demoOtp = "123456";

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setMessage(`OTP sent to ${email}`);
      setIsLoading(false);
      setStep(2);
    }, 1400);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== demoOtp) {
      setError("Invalid OTP. Try: 123456");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setMessage("Password changed successfully! Redirecting...");
      setTimeout(() => navigate("/gettingStarted"), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">

      {/* MAIN CARD - Centered & Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40"
      >
        {/* Back Button */}
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mb-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}

        {/* STEP 1: Enter Email */}
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

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-emerald-600 font-medium text-sm">{message}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isLoading ? "Sending..." : <> <Send className="w-5 h-5" /> Send OTP </>}
              </motion.button>
            </form>
          </div>
        )}

        {/* STEP 2: Verify OTP */}
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
            <p className="text-xs text-gray-500 mb-8">(Demo OTP: <strong>123456</strong>)</p>

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

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                Verify OTP
              </motion.button>
            </form>
          </div>
        )}

        {/* STEP 3: New Password */}
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

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && (
                <p className="text-emerald-600 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {message}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-70"
              >
                {isLoading ? "Saving..." : "Reset Password"}
              </motion.button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;