import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#1E2633] shadow-2xl border-b border-blue-900/30 p-4 flex items-center justify-center">
      <div
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient cursor-pointer transform transition-all duration-500 hover:scale-105 hover:from-blue-500 hover:to-purple-600"
        onClick={() => navigate("/products")}
      >
        JustWeed
      </div>
    </div>
  );
};

export default TopBar;