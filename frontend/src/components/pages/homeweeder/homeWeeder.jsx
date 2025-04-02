import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import TopBar from "../../navbar/topbar";


function HomeWeeder() {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("account");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col relative overflow-hidden">
            <div className="w-full bg-neutral shadow-2xl border-b border-blue-900/30 p-4 flex items-center justify-center">
                <div
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient cursor-pointer transform transition-all duration-500 hover:scale-105 hover:from-blue-500 hover:to-purple-600"
                >
                    JustWeed
                </div>
            </div>
            <div
                className={`fixed inset-0 z-40 lg:static lg:translate-x-0 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-all duration-300 w-72 bg-neutral p-6 border-r border-blue-900/30 flex flex-col justify-between shadow-2xl `}
            >

                <div className="space-y-6 lg:pt-0 pt-10">

                    <div className="space-y-4">
                        {successMessage && (
                            <div className="p-4 bg-gradient-to-br from-green-500/20 to-teal-600/20 rounded-lg border border-green-900/30 flex items-start gap-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="flex-shrink-0 w-6 h-6 text-green-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-green-200 text-sm">{successMessage}</span>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="p-4 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-lg border border-red-900/30 flex items-start gap-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="flex-shrink-0 w-6 h-6 text-red-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-red-200 text-sm">{errorMessage}</span>
                            </div>
                        )}
                    </div>

                    <nav className="space-y-2">
                        <div
                            onClick={() => { setActiveTab("account"); setIsMenuOpen(false) }}
                            className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "account"
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-900/30"
                                : "hover:bg-base-300"
                                }`}
                        >
                            <div className="p-2 bg-blue-900/20 rounded-md group-hover:bg-gradient-to-r from-blue-400/20 to-purple-500/20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="w-5 h-5 text-blue-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className="text-white group-hover:text-blue-400 transition-colors duration-300">
                                Informazioni Account
                            </span>
                        </div>

                        <div
                            onClick={() => { setActiveTab("payments"); setIsMenuOpen(false) }}
                            className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "payments"
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-900/30"
                                : "hover:bg-base-300"
                                }`}
                        >
                            <div className="p-2 bg-blue-900/20 rounded-md group-hover:bg-gradient-to-r from-blue-400/20 to-purple-500/20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="w-5 h-5 text-purple-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span className="text-white group-hover:text-purple-400 transition-colors duration-300">
                                Metodi di Pagamento
                            </span>
                        </div>

                        <div
                            onClick={() => { setActiveTab("addresses"); setIsMenuOpen(false) }}
                            className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "addresses"
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-900/30"
                                : "hover:bg-base-300"
                                }`}
                        >
                            <div className="p-2 bg-blue-900/20 rounded-md group-hover:bg-gradient-to-r from-blue-400/20 to-purple-500/20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="w-5 h-5 text-blue-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="text-white group-hover:text-blue-400 transition-colors duration-300">
                                I Tuoi Indirizzi
                            </span>
                        </div>
                    </nav>
                </div>
            </div>
            
        </div>
    )
}

export default HomeWeeder;