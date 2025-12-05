import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6 py-10">
      <div className="flex justify-center mb-8 md:mb-0 md:w-1/2">
        <img
          src="https://getwardrobe.com/images/home/wardrobe.png"
          alt="welcome"
          className="w-72 md:w-96 drop-shadow-xl animate-fadeIn"
        />
      </div>

      <div className="md:w-1/2 text-center md:text-left space-y-6">
        <h1 className="text-4xl font-bold text-green-700">
          Welcome to OurWardrobe
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          Imagine a world where every morning begins with inspiration, not
          frustration. Your closet becomes a world full of possibilities.
          <br />
          <span className="font-semibold text-green-700">
            We transform your dressing experience from ordinary to magical.
          </span>
        </p>

        <button
          onClick={() => navigate("/gettingStarted")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
