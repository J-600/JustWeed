import React, { useState, useEffect } from "react";

const Loader = ({ size = "medium" }) => {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-20 h-20"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-600/30 blur-[6px] animate-pulse"></div>

        <div className={`relative ${sizeClasses[size]}`}>
          <div className="absolute inset-0 border-[3px] border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
          <div 
            className="absolute inset-1 border-[3px] border-transparent border-b-blue-400 border-l-purple-400 rounded-full"
            style={{
              animation: 'spin-reverse 1s linear infinite'
            }}
          ></div>
        </div>
      </div>

      <div className={`font-semibold ${textSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500`}>
        Caricamento{'.'.repeat(dots)}
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;