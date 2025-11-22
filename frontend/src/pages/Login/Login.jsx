import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6 py-10">

      {/* LEFT :: COMPACT FORM CARD */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm animate-fadeIn">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Floating Label Email */}
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-transparent focus:border-green-500 focus:ring-0 outline-none peer"
            />
            <label className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-sm peer-focus:text-green-600 peer-valid:-top-2 peer-valid:left-2 peer-valid:text-sm peer-valid:text-green-600">
              Email
            </label>
          </div>

          {/* Floating Label Password */}
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-transparent focus:border-green-500 focus:ring-0 outline-none peer"
            />
            <label className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-sm peer-focus:text-green-600 peer-valid:-top-2 peer-valid:left-2 peer-valid:text-sm peer-valid:text-green-600">
              Password
            </label>
          </div>

          {/* Login Button */}
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all shadow-md">
            Login
          </button>
        </form>

        {/* Create account link */}
        <p className="text-center text-gray-600 mt-4">
          New here?{" "}
          <span
            className="text-green-600 font-semibold hover:underline cursor-pointer"
            onClick={() => navigate("/create")}
          >
            Create account
          </span>
        </p>
      </div>

      {/* TOP ON MOBILE / RIGHT ON DESKTOP :: IMAGE */}
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0 md:ml-10 animate-slideUp">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/man-ensures-user-authentication-illustration-svg-download-png-10697190.png"
          alt="login visual"
          className="w-72 md:w-96"
        />
      </div>
    </div>
  );
}

export default Login;
