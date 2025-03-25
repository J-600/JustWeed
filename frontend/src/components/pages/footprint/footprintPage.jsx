import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Leaf, Globe, Fuel as Co2, Factory, TreePine, Recycle, BarChart2, Zap, Clock, ArrowUpRight, Footprints } from "lucide-react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const FootPrintPage = () => {
    const [calculatorInput, setCalculatorInput] = useState({
        energy: '',
        travel: '',
        waste: ''
    });

    const historicalData = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Impronta Carbonio (ton CO₂eq)',
            data: [650, 580, 520, 480, 420],
            borderColor: '#6366f1',
            backgroundColor: '#4338ca',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4
        }]
    };

    const comparisonData = {
        labels: ['JustWeed', 'Media Settore', 'Obiettivo 2025'],
        datasets: [{
            label: 'Emissioni per Unità Prodotta',
            data: [2.1, 3.8, 1.5],
            backgroundColor: ['#6366f1', '#3b82f6', '#94a3b8']
        }]
    };

    const calculateFootprint = () => {
        const energy = parseFloat(calculatorInput.energy) || 0;
        const travel = parseFloat(calculatorInput.travel) || 0;
        const waste = parseFloat(calculatorInput.waste) || 0;
        return (energy * 0.5) + (travel * 0.2) + (waste * 0.3);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] text-white">
            <TopBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center mb-12">
                    <div className=" lg:mr-10 inline-flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full mb-4 border border-blue-900/30">
                        <Leaf size={18} className="text-blue-400" />
                        <span className="text-blue-400">Sostenibilità Misurabile</span>
                    </div>
                    <div className="flex justify-center">
                        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient leading-normal">
                            La Nostra Impronta Ecologica
                        </h1>
                    </div>
                    <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                        Misuriamo, analizziamo e ottimizziamo il nostro impatto ambientale attraverso dati trasparenti e azioni concrete.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            icon: <Co2 size={24} className="text-blue-400" />,
                            title: "Carbon Footprint",
                            value: "420 t",
                            description: "CO₂eq annue",
                            chart: <BarChart2 className="text-purple-400" size={36} />
                        },
                        {
                            icon: <Zap size={24} className="text-blue-400" />,
                            title: "Energia Rinnovabile",
                            value: "100%",
                            description: "del nostro consumo",
                            chart: <Globe className="text-purple-400" size={36} />
                        },
                        {
                            icon: <Recycle size={24} className="text-blue-400" />,
                            title: "Economia Circolare",
                            value: "92%",
                            description: "materiali riciclati",
                            chart: <TreePine className="text-purple-400" size={36} />
                        }
                    ].map((metric, i) => (
                        <div key={i} className="bg-[#2A3447] p-6 rounded-xl border border-blue-900/30 hover:border-purple-500/50 transition-all hover:-translate-y-1 shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                {metric.icon}
                                <h3 className="font-bold text-lg">{metric.title}</h3>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                        {metric.value}
                                    </p>
                                    <p className="text-gray-300 text-sm">{metric.description}</p>
                                </div>
                                {metric.chart}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-8 mb-12 shadow-lg">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <Clock className="text-purple-400" size={28} />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Progresso Storico 2019-2023
                        </span>
                    </h2>
                    <div className="h-64">
                        <Line data={historicalData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#cbd5e1',
                                        font: { size: 14 }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    ticks: { color: '#94a3b8' },
                                    grid: { color: '#1e40af30' },
                                    border: { color: '#334155' }
                                },
                                y: {
                                    ticks: { color: '#94a3b8' },
                                    grid: { color: '#1e40af30' },
                                    border: { color: '#334155' }
                                }
                            }
                        }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Confronto con il Settore
                        </h3>
                        <div className="h-48">
                            <Bar data={comparisonData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { labels: { color: '#cbd5e1' } }
                                },
                                scales: {
                                    x: {
                                        ticks: { color: '#94a3b8' },
                                        grid: { display: false },
                                        border: { color: '#334155' }
                                    },
                                    y: {
                                        ticks: { color: '#94a3b8' },
                                        grid: { color: '#1e40af30' },
                                        border: { color: '#334155' }
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Calcola la Tua Impronta
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Consumo Energetico (kWh)", key: "energy" },
                                { label: "Km Percorsi Annuali", key: "travel" },
                                { label: "Rifiuti Produzione (kg)", key: "waste" }
                            ].map((input, i) => (
                                <div key={i}>
                                    <input
                                        type="number"
                                        placeholder={input.label}
                                        className="input input-bordered w-full bg-[#1E2633] border-blue-900/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                                        value={calculatorInput[input.key]}
                                        onChange={(e) => setCalculatorInput({ ...calculatorInput, [input.key]: e.target.value })}
                                    />
                                </div>
                            ))}
                            <div className="mt-4 p-3 bg-blue-900/10 rounded-lg border border-purple-500/30">
                                <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Impronta Stimata: {calculateFootprint().toFixed(1)} kg CO₂eq
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#2A3447] rounded-xl p-8 border border-blue-900/30 shadow-lg mb-12">
                    <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Strategie di Riduzione
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: "Logistica Sostenibile",
                                icon: <Globe className="text-blue-400" />,
                                impact: "-15% emissioni trasporti"
                            },
                            {
                                title: "Energia Verde",
                                icon: <Zap className="text-blue-400" />,
                                impact: "100% rinnovabile dal 2022"
                            },
                            {
                                title: "Packaging Biodegradabile",
                                icon: <Recycle className="text-blue-400" />,
                                impact: "-40% plastica utilizzata"
                            },
                            {
                                title: "Agricoltura Rigenerativa",
                                icon: <TreePine className="text-blue-400" />,
                                impact: "+20% biodiversità locale"
                            }
                        ].map((strategy, index) => (
                            <div key={index} className="bg-[#1E2633] p-4 rounded-xl border border-blue-900/30 hover:border-purple-500/50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-900/20 p-3 rounded-lg group-hover:bg-purple-900/20 transition-colors">
                                        {strategy.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{strategy.title}</h4>
                                        <p className="text-sm text-gray-300">{strategy.impact}</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="ml-auto text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default FootPrintPage;