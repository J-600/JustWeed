import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import { ArrowLeft, Leaf, FlaskConical, TestTube2, Cannabis } from "lucide-react";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col relative overflow-hidden">
            <TopBar />
            
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <Leaf 
                        key={i}
                        className="absolute text-green-500/20 animate-float"
                        size={24}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`
                        }}
                    />
                ))}
            </div>

            <div className="flex-1 flex items-center justify-center p-8 min-h-[calc(100vh-80px)]">
                <div className="relative z-10 max-w-2xl w-full">
                    <div className="card bg-base-200/90 backdrop-blur-sm shadow-2xl border border-green-900/30 rounded-xl transition-all hover:border-green-500/30 hover:shadow-green-500/10">
                        <div className="card-body space-y-8 p-12">
                            <div className="absolute -top-32 -right-32 opacity-20">
                                <TestTube2 className="w-64 h-64 text-green-500 animate-rotate" />
                            </div>

                            <div className="space-y-8 text-center relative z-20">
                                <div className="relative inline-block">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 animate-gradient text-9xl font-bold tracking-tighter">
                                        404
                                    </span>
                                    <FlaskConical className="absolute -right-20 -top-8 w-16 h-16 text-green-400 animate-bubble" />
                                    <Cannabis className="absolute -left-20 -bottom-8 w-16 h-16 text-emerald-400 animate-float" />
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl font-semibold text-green-100">
                                        Pagina non disponibile 🌱
                                    </h2>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        Questo pagina non è stata trovata<br />
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/homepage/products")}
                                    className="btn bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white border-none group transform transition-all duration-300 hover:scale-105 mx-auto"
                                >
                                    <span className="flex items-center gap-2">
                                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                        Torna allo Shop
                                    </span>
                                    <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-30 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bubble {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px) scale(1.1); }
                }
                .animate-rotate {
                    animation: rotate 40s linear infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-bubble {
                    animation: bubble 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default NotFoundPage;