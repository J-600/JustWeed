import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import { ShoppingCart } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customDatePickerStyles = `
  .react-datepicker {
    background: #2A3444;
    border: 1px solid #374151 !important;
    color: white;
    font-family: inherit;
  }
  .react-datepicker__header {
    background: #1E2633;
    border-bottom: 1px solid #374151;
  }
  .react-datepicker__current-month {
    color: #818cf8;
    font-weight: 600;
  }
  .react-datepicker__day {
    color: white !important;
    &:hover {
      background: #4f46e5 !important;
    }
  }
  .react-datepicker__day--selected {
    background: #6366f1 !important;
  }
  .react-datepicker__day--outside-month {
    color: #6b7280 !important;
  }
  .react-datepicker__time-container {
    background: #2A3444;
  }
`;

function Purchase() {
    const [dateKeys, setDateKeys] = useState([]);
    const [purchases, setPurchases] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("recenti");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedTags, setSelectedTags] = useState(new Set());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPurchase = async () => {
            try {
                const res = await fetch("http://localhost:3000/view-purchase", {
                    credentials: "include"
                });
                const data = await res.json();
                if (!res.ok) {
                    navigate("/")
                    return
                }
                if (res.status !== 200) throw new Error(data);

                setDateKeys(Object.keys(data));
                setPurchases(data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };
        fetchPurchase();
    }, []);

    const handleTagToggle = (tag) => {
        const newTags = new Set(selectedTags);
        newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
        setSelectedTags(newTags);
    };

    const filteredDates = dateKeys
        .filter(date => {
            const currentDate = new Date(date);
            return (!startDate || currentDate >= startDate) &&
                (!endDate || currentDate <= endDate);
        })
        .sort((a, b) => sortOrder === "recenti" ?
            new Date(b) - new Date(a) : new Date(a) - new Date(b));

    const filteredPurchases = filteredDates.reduce((acc, date) => {
        const orders = purchases[date];
        if (Array.isArray(orders)) {
            const filteredItems = orders.filter(item => {
                const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesTags = selectedTags.size === 0 || selectedTags.has(item.status);
                return matchesSearch && matchesTags;
            });
            if (filteredItems.length > 0) acc[date] = filteredItems;
        }
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
            <TopBar />
            <style>{customDatePickerStyles}</style>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30 w-full max-w-none md:w-full md:mx-auto">
                    <div className="card-body space-y-6 px-4 md:px-6">
                        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl text-center font-bold mt-4">
                            I Tuoi Ordini
                            <ShoppingCart className="inline-block ml-4 mb-2 w-8 h-8 text-purple-500" />
                        </h1>

                        <div className="relative group max-w-2xl mx-auto w-full">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient" />

                            <div className="relative flex items-center bg-[#1E2633] rounded-lg border border-blue-900/30">
                                <input
                                    type="text"
                                    placeholder="Cerca ordini..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
                                />

                                <div className="flex items-center pr-2 border-r border-blue-900/30">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-purple-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {isFilterOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#2A3444] rounded-lg shadow-xl border border-blue-900/30 p-4 z-50">
                                        <div className="mb-4">
                                            <h3 className="text-sm font-semibold text-blue-400 mb-2">Ordina per</h3>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => setSortOrder("recenti")}
                                                    className={`w-full text-left px-3 py-2 rounded-md ${sortOrder === "recenti"
                                                        ? 'bg-purple-500/20 text-purple-400'
                                                        : 'hover:bg-blue-900/20 text-gray-300'
                                                        }`}
                                                >
                                                    Più recenti
                                                </button>
                                                <button
                                                    onClick={() => setSortOrder("vecchi")}
                                                    className={`w-full text-left px-3 py-2 rounded-md ${sortOrder === "vecchi"
                                                        ? 'bg-purple-500/20 text-purple-400'
                                                        : 'hover:bg-blue-900/20 text-gray-300'
                                                        }`}
                                                >
                                                    Più vecchi
                                                </button>
                                            </div>
                                        </div>
                                        <div className="border-t border-blue-900/30 pt-4">
                                            <h3 className="text-sm font-semibold text-blue-400 mb-2">Intervallo date</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs text-gray-400 block mb-1">Da</label>
                                                    <DatePicker
                                                        selected={startDate}
                                                        onChange={setStartDate}
                                                        className="w-full bg-[#1E2633] rounded-md px-3 py-2 text-white border border-blue-900/30"
                                                        placeholderText="Seleziona data"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400 block mb-1">A</label>
                                                    <DatePicker
                                                        selected={endDate}
                                                        onChange={setEndDate}
                                                        className="w-full bg-[#1E2633] rounded-md px-3 py-2 text-white border border-blue-900/30"
                                                        placeholderText="Seleziona data"
                                                        minDate={startDate}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-blue-900/30 pt-4">
                                            <h3 className="text-sm font-semibold text-blue-400 mb-2">Stato ordine</h3>
                                            <div className="space-y-2">
                                                {["Consegnato", "In elaborazione", "Spedito"].map((tag) => (
                                                    <label key={tag} className="flex items-center space-x-2 text-gray-300 hover:bg-blue-900/20 p-2 rounded-md">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTags.has(tag)}
                                                            onChange={() => handleTagToggle(tag)}
                                                            className="checkbox checkbox-xs bg-[#1E2633] border-blue-900/30 checked:bg-purple-500"
                                                        />
                                                        <span>{tag}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mx-4 text-purple-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <Loader />
                            </div>
                        ) : Object.keys(filteredPurchases).length > 0 ? (
                            <div className="space-y-8">
                                {Object.keys(filteredPurchases).map((date) => (
                                    <div key={date} className="bg-[#1E2633] rounded-xl border border-blue-900/30 md:p-6 p-3 shadow-lg">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                            <h2 className="text-3xl font-bold text-blue-400 mb-2 md:mb-0">
                                                Ordini del {new Date(date).toLocaleDateString()}
                                            </h2>
                                            <div className="bg-[#2C3E50] px-4 py-2 rounded-lg">
                                                <span className="font-semibold text-white">
                                                    Totale: €{filteredPurchases[date]
                                                        .reduce((sum, order) => sum + (order.product_price * order.quantity), 0)
                                                        .toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {filteredPurchases[date].map((item) => (
                                                <div key={item.order_id} className="flex flex-col h-auto md:flex-row md:gap-6 gap-1 p-4 bg-[#2C3E50] rounded-lg border border-blue-900/30">
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
                                                            <p>Stato: <span className={`ml-2 ${item.status === "Consegnato" ? 'text-green-400' : 'text-yellow-400'}`}>
                                                                {item.status}
                                                            </span></p>
                                                            {item.deliveryDate && (
                                                                <p className="text-gray-300">
                                                                    Consegna prevista:{" "}
                                                                    <span className="text-white">
                                                                        {isNaN(new Date(item.deliveryDate).getTime()) ? "Nessuna data prevista" : new Date(item.deliveryDate).toLocaleDateString()}
                                                                    </span>


                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3 md:w-48">
                                                        <button
                                                            className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                                                            onClick={() => navigate("/tracking")}
                                                        >
                                                            Traccia pacco
                                                        </button>
                                                        <button
                                                            className="btn bg-gradient-to-r from-green-500 to-teal-600 text-white border-none hover:from-green-600 hover:to-teal-700 transform transition-all duration-300 hover:scale-105"
                                                            onClick={() => navigate("/products/"+item.id)}
                                                        >
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
                                    {searchQuery ? "Nessun ordine trovato con questi filtri" : "Nessun ordine nella cronologia"}
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