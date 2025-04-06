import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Loader from "../../loader/loader";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);




function Progress() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("Sempre");
    const [selectedProductId, setSelectedProductId] = useState("Tutti");
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/weeder/progress", {
                    method: "GET",
                    credentials: "include"
                });
                if (!res.ok)
                    throw new Error("Errore nel fetch dei dati");

                const data = await res.json();
                setProgress(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setErrorMessage("Si è verificato un errore, riprova più tardi");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const uniqueProducts = Array.from(
        new Set((Array.isArray(progress) ? progress : []).map(item => item.id + "-" + item.name))
    ).map(str => {
        const [id, name] = str.split("-");
        return { id, name };
    });


    const processData = (data) => {

        const filteredData = selectedProductId === "Tutti"
            ? data
            : data.filter(item => item.id.toString() === selectedProductId);

        const grouped = filteredData.reduce((acc, { date, quantity, price }) => {
            const earnings = quantity * price;
            if (!acc[date]) {
                acc[date] = { date, earnings, quantity };
            } else {
                acc[date].earnings += earnings;
                acc[date].quantity += quantity;
            }
            return acc;
        }, {});

        return Object.values(grouped)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const filterData = (data, filter) => {
        const now = new Date();
        const cutoff = new Date(now);

        switch (filter) {
            case '1 Anno': cutoff.setFullYear(now.getFullYear() - 1); break;
            case '6 Mesi': cutoff.setMonth(now.getMonth() - 6); break;
            case '3 Mesi': cutoff.setMonth(now.getMonth() - 3); break;
            case '1 Mese': cutoff.setMonth(now.getMonth() - 1); break;
            default: return data;
        }

        return data.filter(item => new Date(item.date) >= cutoff);
    };

    const processedData = processData(progress);
    const filteredData = filterData(processedData, selectedFilter);
    const totalEarnings = filteredData.reduce((acc, curr) => acc + curr.earnings, 0);
    const hasDuplicateNames = new Set(uniqueProducts.map(p => p.name)).size !== uniqueProducts.length;

    return (
        <div className="card bg-emerald-900/80 shadow-2xl border-2 border-emerald-700/30">
            <div className="card-body space-y-4">
                <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
                    Statistiche
                </h2>

                <div className="space-y-6">
                    {successMessage && (
                        <div className="alert alert-success shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="alert alert-error shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {['Sempre', '1 Anno', '6 Mesi', '3 Mesi', '1 Mese'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2 rounded-full text-sm transition-all ${selectedFilter === filter
                                            ? 'bg-gradient-to-r from-emerald-500 to-lime-600 text-white'
                                            : 'bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/40'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {uniqueProducts.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    className="select select-bordered bg-emerald-800/50 text-emerald-200 border-emerald-700/30 focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value="Tutti">Tutti i prodotti</option>
                                    {uniqueProducts.map(({ id, name }) => (
                                        <option key={id} value={id}>
                                            {hasDuplicateNames ? `${name} (ID: ${id})` : name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {!loading && filteredData.length > 0 && (
                        <div className="bg-emerald-800/30 p-4 rounded-lg border border-emerald-700/50">
                            <div className="flex justify-between items-center">
                                <div>
                                <div className="text-emerald-300 text-sm">
                                        {selectedProductId === "Tutti" 
                                            ? "Totale guadagno" 
                                            : `Guadagno da ${uniqueProducts.find(p => p.id === selectedProductId)?.name}`
                                        }
                                    </div>
                                    <div className="text-emerald-100 text-xs">Periodo selezionato: {selectedFilter}</div>
                                </div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-lime-400 bg-clip-text text-transparent">
                                    € {totalEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="h-96 flex items-center justify-center">
                            <span className="loading loading-spinner loading-lg text-emerald-400"></span>
                        </div>
                    ) : progress.length === 0 ? (
                        <div className="h-96 flex flex-col items-center justify-center text-emerald-400/50 gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-lg">Nessun dato disponibile</span>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-outline text-emerald-400 hover:bg-emerald-800/50"
                            >
                                Ricarica i dati
                            </button>
                        </div>
                    ) : (
                        <div className="h-96 relative">
                            <Line
                                data={{
                                    labels: filteredData.map(d => new Date(d.date).toLocaleDateString()),
                                    datasets: [{
                                        label: 'Guadagni (€)',
                                        data: filteredData.map(d => d.earnings),
                                        borderColor: '#34d399',
                                        backgroundColor: 'rgba(52, 211, 153, 0.2)',
                                        borderWidth: 2,
                                        pointBackgroundColor: '#84cc16',
                                        pointRadius: 4,
                                        pointHoverRadius: 6,
                                        tension: 0.3,
                                        fill: true
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => `€ ${context.raw.toFixed(2)}`
                                            },
                                            backgroundColor: '#064e3b',
                                            borderColor: '#047857',
                                            borderWidth: 1,
                                            titleColor: '#34d399',
                                            bodyColor: '#a7f3d0'
                                        }
                                    },
                                    scales: {
                                        x: {
                                            grid: { color: '#04785730' },
                                            ticks: { color: '#6ee7b7' }
                                        },
                                        y: {
                                            grid: { color: '#04785730' },
                                            ticks: {
                                                color: '#6ee7b7',
                                                callback: (value) => `€ ${value}`
                                            },
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


function HomeWeeder() {

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("progress");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    const TopBar = () => {
        return (
            <div className="w-full bg-emerald-900 shadow-2xl border-b border-emerald-700/30 p-4 flex items-center justify-center">
                <div
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-500 animate-gradient cursor-pointer transform transition-all duration-500 hover:scale-105 hover:from-emerald-300 hover:to-lime-400"
                >
                    JustWeed
                </div>
            </div>
        )
    }

    const renderContent = () => {

        switch (activeTab) {
            case "progress":
                return (
                    <Progress />
                );
            case "payments":
                return (<></>);
            case "addresses":
                return (<></>);
            default:
                return (
                    <></>
                );
        }
    };

    // if (loading) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-base-100 to-neutral flex flex-col">
    //             <TopBar />
    //             <div className="flex-grow flex items-center justify-center">
    //                 <Loader />
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-emerald-900 flex flex-col">
            <TopBar />

            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-800 rounded-lg text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex flex-1">
                <div
                    className={`fixed inset-0 z-40 lg:static lg:translate-x-0 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                        } transition-all duration-300 w-72 bg-emerald-900 p-6 border-r border-emerald-700/30 flex flex-col justify-between shadow-2xl `}
                >

                    <div className="space-y-6 lg:pt-0 pt-10">
                        <button
                            onClick={() => navigate("/homepage/products")}
                            className="group flex items-center gap-2 w-full p-3 hover:bg-emerald-800 rounded-lg transition-all duration-300"
                        >
                            <div className="p-2 bg-emerald-800/20 rounded-md group-hover:bg-gradient-to-r from-emerald-400/20 to-lime-500/20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="w-5 h-5 text-emerald-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="bg-gradient-to-r from-emerald-400 to-lime-500 bg-clip-text text-transparent font-semibold">
                                Torna ai prodotti
                            </span>
                        </button>

                        <div className="space-y-4">
                            {successMessage && (
                                <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg border border-emerald-700/30 flex items-start gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="flex-shrink-0 w-6 h-6 text-emerald-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-emerald-100 text-sm">{successMessage}</span>
                                </div>
                            )}

                            {errorMessage && (
                                <div className="p-4 bg-gradient-to-br from-red-500/20 to-amber-600/20 rounded-lg border border-amber-700/30 flex items-start gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="flex-shrink-0 w-6 h-6 text-amber-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-amber-100 text-sm">{errorMessage}</span>
                                </div>
                            )}
                        </div>

                        <nav className="space-y-2">
                            <div
                                onClick={() => { setActiveTab("progress"); setIsMenuOpen(false) }}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "progress"
                                    ? "bg-gradient-to-r from-emerald-500/20 to-lime-600/20 border border-emerald-700/30"
                                    : "hover:bg-emerald-800"
                                    }`}
                            >
                                <div className="p-2 bg-emerald-800/20 rounded-md group-hover:bg-gradient-to-r from-emerald-400/20 to-lime-500/20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="w-5 h-5 text-emerald-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-white group-hover:text-emerald-300 transition-colors duration-300">
                                    Progress
                                </span>
                            </div>

                            <div
                                onClick={() => { setActiveTab("payments"); setIsMenuOpen(false) }}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "payments"
                                    ? "bg-gradient-to-r from-emerald-500/20 to-lime-600/20 border border-emerald-700/30"
                                    : "hover:bg-emerald-800"
                                    }`}
                            >
                                <div className="p-2 bg-emerald-800/20 rounded-md group-hover:bg-gradient-to-r from-emerald-400/20 to-lime-500/20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="w-5 h-5 text-emerald-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <span className="text-white group-hover:text-emerald-300 transition-colors duration-300">
                                    Metodi di Pagamento
                                </span>
                            </div>

                            <div
                                onClick={() => { setActiveTab("addresses"); setIsMenuOpen(false) }}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "addresses"
                                    ? "bg-gradient-to-r from-emerald-500/20 to-lime-600/20 border border-emerald-700/30"
                                    : "hover:bg-emerald-800"
                                    }`}
                            >
                                <div className="p-2 bg-emerald-800/20 rounded-md group-hover:bg-gradient-to-r from-emerald-400/20 to-lime-500/20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="w-5 h-5 text-emerald-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-white group-hover:text-emerald-300 transition-colors duration-300">
                                    I Tuoi Indirizzi
                                </span>
                            </div>
                        </nav>
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default HomeWeeder;