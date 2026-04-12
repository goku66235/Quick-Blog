import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black/5">
      <div className="relative flex items-center justify-center">
        
        {/* Outer glow ring */}
        <div className="absolute h-20 w-20 rounded-full bg-linear-to-r from-purple-500 via-pink-500 to-cyan-500 blur-xl opacity-60 animate-pulse"></div>

        {/* Spinning ring */}
        <div className="h-16 w-16 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>

        {/* Inner dot */}
        <div className="absolute h-3 w-3 bg-white rounded-full animate-ping"></div>

      </div>
    </div>
  );
};

export default Loader;