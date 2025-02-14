import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import { ShoppingCart } from "lucide-react";

function Purchase() {
    const [dateKeys, setDateKeys] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPurchase = async () => {
            try {
                const res = await fetch("http://localhost:3000/view-purchase", {
                    credentials: "include"
                });

                const data = await res.json();
                if (res.status !== 200) throw new Error(data);

                setDateKeys(Object.keys(data));
                setPurchases(data);
                setLoading(false);
            } catch (error) {
                console.error("Errore durante il fetch:", error);
                setLoading(false);
            }
        };
        fetchPurchase();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
            <TopBar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30 mx-auto">
                    <div className="card-body space-y-6">
                        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl text-center font-bold mt-4">
                            I Tuoi Ordini
                            <ShoppingCart className="inline-block ml-4 mb-2 w-8 h-8 text-purple-500" />
                        </h1>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader />
                            </div>
                        ) : Array.isArray(dateKeys) && dateKeys.length > 0 ? (
                            <div className="space-y-8">
                                {dateKeys.map((date, index) => (
                                    <div key={index} className="bg-[#1E2633] rounded-xl border border-blue-900/30 p-6 shadow-lg">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                            <h3 className="text-xl font-bold text-blue-400 mb-2 md:mb-0">
                                                Ordini del {new Date(date).toLocaleDateString()}
                                            </h3>
                                            <div className="bg-[#2C3E50] px-4 py-2 rounded-lg">
                                                <span className="font-semibold text-white">
                                                    Totale: €{purchases[date]
                                                        .reduce((sum, order) => sum + (order.product_price * order.quantity), 0)
                                                        .toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {purchases[date].map((item, idx) => (
                                                <div key={idx} className="flex flex-col md:flex-row gap-6 p-4 bg-[#2C3E50] rounded-lg border border-blue-900/30">
                                                    <img
                                                        src={item.img}
                                                        alt={item.product_name}
                                                        className="w-full md:w-48 h-48 object-cover rounded-lg shadow-md"
                                                    />

                                                    <div className="flex-1 space-y-3">
                                                        <h3 className="text-2xl font-bold text-white">{item.product_name}</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                                                            <p>Quantità: <span className="text-white">{item.quantity}</span></p>
                                                            <p>Prezzo unitario: <span className="text-white">€{item.product_price.toFixed(2)}</span></p>
                                                            <p>Totale: <span className="text-white">€{(item.product_price * item.quantity).toFixed(2)}</span></p>
                                                            <p>Stato:
                                                                <span className={`ml-2 ${item.status === "Consegnato" ? 'text-green-400' : 'text-yellow-400'}`}>
                                                                    {item.status}
                                                                </span>
                                                            </p>
                                                            {item.deliveryDate && (
                                                            <p className="text-gray-300">
                                                                Consegna prevista:
                                                                <span className="text-white">
                                                                {item.deliveryDate && !isNaN(new Date(item.deliveryDate))
                                                                    ? new Date(item.deliveryDate).toLocaleDateString()
                                                                    : " non disponibile..."}
                                                                </span>
                                                                
                                                            </p>
                                                        )}
                                                        </div>
                                                        
                                                    </div>

                                                    <div className="flex flex-col gap-3 md:w-48">
                                                        <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105">
                                                            Traccia pacco
                                                        </button>
                                                        <button className="btn bg-gradient-to-r from-green-500 to-teal-600 text-white border-none hover:from-green-600 hover:to-teal-700 transform transition-all duration-300 hover:scale-105">
                                                            Acquista di nuovo
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-400 font-semibold">
                                    Nessun ordine trovato nella tua cronologia
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Purchase;