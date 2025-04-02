import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import { FaCannabis, FaSeedling, FaChartLine, FaHandshake } from "react-icons/fa";

function PreWeeder() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col overflow-x-hidden">
            <TopBar />
            <div className="flex-1 pt-24 pb-12 px-4 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-1 w-full">
                            <img
                                src="/caps.jpg"
                                alt="Collaborazione Weeder"
                                className="w-full h-[28rem] lg:h-[32rem] object-cover rounded-2xl shadow-2xl border border-blue-900/30 hover:scale-[1.02] transition-transform duration-300"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-8">
                            <div className="flex items-start gap-4">
                                <FaSeedling className="w-10 h-10 text-purple-500 mt-1" />
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">
                                        Diventa Weeder
                                    </h1>
                                    <span className="badge badge-lg badge-primary mt-2">Nuova Opportunità</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-start gap-3">
                                        <FaChartLine className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                                        <p>Entra in un mercato in crescita esponenziale con prodotti legali e certificati</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FaHandshake className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                                        <p>Sistema di collaborazione semplice e vantaggioso con margini competitivi</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FaCannabis className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                        <p>Supporto completo per l'avvio dell'attività e formazione continua</p>
                                    </li>
                                </ul>

                                <button
                                    className="btn btn-lg btn-primary w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none transform transition-all duration-300 hover:scale-[1.02] group"
                                    onClick={() => navigate("/homepage/preWeeder/become-weeder")}
                                >
                                    <span className="group-hover:scale-110 transition-transform">Inizia Ora</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="stats bg-base-200 border border-blue-900/30 shadow">
                                    <div className="stat">
                                        <div className="stat-title text-gray-400">Partner Attivi</div>
                                        <div className="stat-value text-blue-400">150+</div>
                                    </div>
                                </div>
                                <div className="stats bg-base-200 border border-blue-900/30 shadow">
                                    <div className="stat">
                                        <div className="stat-title text-gray-400">Margine Medio</div>
                                        <div className="stat-value text-purple-400">35%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreWeeder;