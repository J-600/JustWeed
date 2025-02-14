import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
// import { Edit, User, CreditCard, MapPin, Trash2, Building2, Hash, Globe, FileDigit, ArrowLeft, Pencil, Lock, ChevronDown, Plus, Calendar } from "lucide-react";
import Loader from "../../loader/loader";
import { ShoppingCart, ChevronDown, ArrowLeft } from "lucide-react";

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
                })

                const data = await res.json()
                if (res.status !== 200)
                    throw new Error(data)
                setDateKeys(Object.keys(data))
                setPurchases(data)
                console.log(purchases)
                console.log(dateKeys)
                setLoading(false)
            } catch (error) {

            }
        }
        fetchPurchase()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
            <TopBar />
            <div className="flex-1 p-8 overflow-y-auto">

                <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                    <div className="card-body space-y-4">
                        <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
                            I Tuoi Ordini
                        </h2>
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : Array.isArray(dateKeys) && dateKeys.length > 0 ? (
                            <div className="space-y-6">

                                {dateKeys.map((date, index) => (
                                    <div key={index} className="border border-blue-900/30 rounded-lg p-6 bg-[#1E2633]">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-semibold text-blue-300">Ordini del {new Date(date).toLocaleDateString()}</h3>
                                            <div>
                                                <p className="text-white">Totale: <span className="text-white font-bold">€{purchases[date]
                                                    .reduce((sum, order) => sum + order.product_price * order.quantity, 0)
                                                    .toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {purchases[date].map((item, index) => (
                                                <div key={index} className="flex items-start gap-4 border-b border-blue-900/30 pb-4 last:border-b-0">
                                                    <img
                                                        src={item.img}
                                                        alt={item.product_name}
                                                        className="w-40 h-40 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-white">{item.name}</h3>
                                                        <p className="text-sm text-gray-400">Nome: {item.product_name}</p>
                                                        <p className="text-sm text-gray-400">Quantità: {item.quantity}</p>
                                                        <p className="text-sm text-gray-400">Prezzo: €{(item.product_price * item.quantity).toFixed(2)}</p>
                                                        <p className="text-sm text-gray-400">Stato: <span className={`${item.status === "Consegnato" ? 'text-green-400' : 'text-yellow-400'}`}>{item.status}</span></p>
                                                        <p className="text-sm text-gray-400">Data di consegna: {new Date(item.deliveryDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <button className="btn btn-sm bg-gradient-to-r from-green-500 to-teal-600 text-white border-none hover:from-green-600 hover:to-teal-700">
                                                        Traccia pacco
                                                    </button>
                                                    <button className="btn btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
                                                        Acquista di nuovo
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center border-b border-blue-900/30 pb-2">
                                <p className="font-semibold text-gray-400">{purchases}</p>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};


export default Purchase