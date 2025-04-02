import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onUploadCart }) {
  const [cartItems, setCartItems] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const userButtonRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };




  const logOut = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "GET",
        credentials: "include"
      })
      if (!res.ok)
        throw new Error(res)
      navigate("/")
    } catch (error) {
      console.log(error.message)
    }

  }

  const uploadCart = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products/view-cart", {
        credentials: "include"
      })

      const data = await res.json()

      if (!res.ok) {
        return
      }
      setCartItems(data)

    } catch (error) {
      console.log(error.message)
    }
  }
  )


  useEffect(() => {
    const handleCartUpdate = () => {
      uploadCart();
    };

    window.addEventListener("triggerUploadCart", handleCartUpdate);

    return () => {
      window.removeEventListener("triggerUploadCart", handleCartUpdate);
    };
  }, [uploadCart]);

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

    uploadCart()

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="w-full bg-neutral shadow-lg border-b border-blue-900/30 p-4 flex items-center justify-between rounded-b-3xl">
        <div className="relative group">
          <button
            onClick={logOut}
            className="p-2 rounded-full hover:bg-red-500/10 transition-all duration-300 transform hover:rotate-180"
          >
            <FaSignOutAlt className="text-2xl text-red-400 hover:text-red-300 transition-colors duration-300" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-base-300 text-red-400 text-sm rounded-lg border border-red-900/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
            Logout
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-base-300 border-l border-t border-red-900/30 transform rotate-45" />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient cursor-pointer transform transition-all duration-500 hover:scale-105 hover:from-blue-500 hover:to-purple-600"
            onClick={() => navigate("/homepage/products")}
          >
            JustWeed
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button
              onClick={() => navigate("/homepage/products/cart")}
              className="p-2 rounded-full hover:bg-blue-500/10 transition-colors duration-300 relative"
            >
              <FaShoppingCart
                className={`text-2xl ${isSidebarOpen ? "text-purple-400" : "text-blue-400"} hover:text-purple-300 transition-colors duration-300`}
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-bounce">
                  {cartItems.length}
                </span>
              )}
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-base-300 text-blue-400 text-sm rounded-lg border border-blue-900/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
              Carrello
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-base-300 border-l border-t border-blue-900/30 transform rotate-45" />
            </div>
          </div>

          <div className="relative group">
            <button
              ref={userButtonRef}
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-blue-500/10 transition-colors duration-300"
            >
              <FaUser
                className={`text-2xl ${isSidebarOpen ? "text-purple-400" : "text-blue-400"} hover:text-purple-300 transition-colors duration-300`}
              />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-base-300 text-blue-400 text-sm rounded-lg border border-blue-900/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
              Profilo
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-base-300 border-l border-t border-blue-900/30 transform rotate-45" />
            </div>
          </div>
        </div>
      </div>
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-screen bg-neutral shadow-2xl border-l border-blue-900/30 transform transition-all duration-500 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ width: "300px", zIndex: 1000 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-blue-900/30">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Menu Utente
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-blue-900/20 rounded-full transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-400 h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <nav className="space-y-4">
              <div
                onClick={() => navigate("/homepage/account-info")}
                className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 cursor-pointer transition-all duration-300"
              >
                <div className="p-2 bg-blue-900/20 rounded-lg group-hover:bg-gradient-to-r from-blue-400/20 to-purple-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 text-purple-400"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-white group-hover:text-blue-400 transition-colors duration-300">
                  Informazioni Account
                </span>
              </div>

              <div
                onClick={() => navigate("/homepage/products/purchase")}
                className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 cursor-pointer transition-all duration-300"
              >
                <div className="p-2 bg-blue-900/20 rounded-lg group-hover:bg-gradient-to-r from-blue-400/20 to-purple-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 text-purple-400"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-white group-hover:text-purple-400 transition-colors duration-300">
                  Acquisti Recenti
                </span>
              </div>
              <div
  onClick={() => navigate("/homepage/about")}
  className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 cursor-pointer transition-all duration-300"
>
  <div className="p-2 bg-blue-900/20 rounded-lg group-hover:bg-gradient-to-r from-blue-400/20 to-purple-500/20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5 text-purple-400"
    >
      {/* <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> */}

      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg> 
  </div>
  <span className="text-white group-hover:text-purple-400 transition-colors duration-300">
    About us
  </span>
</div>
            </nav>
          </div>

          <div className="p-6">
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold
                   hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-[1.02]
                   shadow-lg hover:shadow-[0_5px_30px_-5px_rgba(99,102,241,0.3)] relative overflow-hidden
                   before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400/20 before:to-purple-500/20 
                   before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
              onClick={() => navigate("/homepage/preWeeder")}
            >
              <span className="relative z-10">Diventa uno Weeder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}