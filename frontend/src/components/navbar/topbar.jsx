import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaUser, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const userButtonRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="w-full bg-[#1E2633] shadow-lg border-b border-blue-900/30 p-4 flex items-center justify-between rounded-b-3xl">
        <FaBars
          className="text-2xl text-blue-400 cursor-pointer hover:text-purple-500 transition-colors duration-300"
          onClick={() => navigate("/")}
        />
        <div
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient cursor-pointer transform transition-all duration-500 hover:scale-105 hover:from-blue-500 hover:to-purple-600"
        onClick={() => navigate("/")}
      >
        JustWeed
      </div>
        <FaUser
          ref={userButtonRef}
          className={`text-2xl text-blue-400 cursor-pointer hover:text-purple-500 transition-colors duration-300 ${
            isSidebarOpen ? "text-purple-500" : ""
          }`}
          onClick={toggleSidebar}
        />
      </div>
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-screen bg-[#1E2633] shadow-2xl border-l border-blue-900/30 transform transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "250px", zIndex: 1000 }}
      >
        <div className="flex justify-end p-4">
          <FaTimes
            className="text-2xl text-blue-400 cursor-pointer hover:text-purple-500 transition-colors duration-300"
            onClick={toggleSidebar}
          />
        </div>
        <div className="p-6 space-y-6">
          <ul className="space-y-4">
            <li
              className="text-white hover:text-blue-400 cursor-pointer transition-colors duration-300"
              onClick={() => navigate("/account-info")}
            >
              Informazioni Account
            </li>
            <li
              className="text-white hover:text-blue-400 cursor-pointer transition-colors duration-300"
              onClick={() => navigate("/purchase")}
            >
              Acquisti Recenti
            </li>
            <li
              className="text-white hover:text-blue-400 cursor-pointer transition-colors duration-300"
              onClick={() => navigate("/payment-methods")}
            >
              Modalità di Pagamento
            </li>
          </ul>
          <button
            className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/become-weeder")}
          >
            Diventa uno Weeder
          </button>
        </div>
      </div>
    </div>
  );
}