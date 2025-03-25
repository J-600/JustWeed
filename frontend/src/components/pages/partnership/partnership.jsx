import { Cannabis, FlaskConical, Truck, Scale, BookOpen, Handshake, Download, Send } from "lucide-react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const PartnershipPage = () => {
    const partners = [
        { name: "CannaLabs", sector: "Analisi cannabinoidi", icon: <FlaskConical className="text-purple-400" /> },
        { name: "GreenGrow Co-op", sector: "Cultivazione premium", icon: <Cannabis className="text-purple-400" /> },
        { name: "LegalDistro", sector: "Logistica certificata", icon: <Truck className="text-purple-400" /> },
        { name: "CannaCare", sector: "Prodotti wellness", icon: <Scale className="text-purple-400" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] text-white">
            <TopBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                <div className="text-center mb-12">
                    <div className=" lg:mr-10 inline-flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full mb-4 border border-blue-900/30">
                        <Cannabis size={18} className="text-blue-400" />
                        <span className="text-blue-400">Network Professionale</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Partnership di Settore
                    </h1>
                    <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                        Collaborazioni selezionate con i migliori professionisti della cannabis legale per qualità e compliance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { 
                            title: "Cultivatori Certificati", 
                            value: "25+",
                            icon: <Cannabis className="text-blue-400" />,
                            bg: "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                        },
                        { 
                            title: "Prodotti Sviluppati", 
                            value: "120+",
                            icon: <FlaskConical className="text-blue-400" />,
                            bg: "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                        },
                        { 
                            title: "Certificazioni", 
                            value: "ISO 9001:2023",
                            icon: <Scale className="text-blue-400" />,
                            bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
                        }
                    ].map((metric, i) => (
                        <div key={i} className="bg-[#2A3447] p-6 rounded-xl border border-blue-900/30 hover:border-purple-500/50 transition-all shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`${metric.bg} p-2 rounded-lg`}>
                                    {metric.icon}
                                </div>
                                <h3 className="font-bold text-lg">{metric.title}</h3>
                            </div>
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                {metric.value}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-8 mb-12 shadow-lg">
                    <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Modelli Collaborativi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Cultivazione",
                                icon: <Cannabis className="text-blue-400" />,
                                features: ["Genetiche esclusive", "Coltivazione indoor", "Controllo qualità"]
                            },
                            {
                                title: "Ricerca & Sviluppo",
                                icon: <FlaskConical className="text-blue-400" />,
                                features: ["Estrazioni premium", "Formulazioni wellness", "Analisi di laboratorio"]
                            },
                            {
                                title: "Distribuzione",
                                icon: <Truck className="text-blue-400" />,
                                features: ["Logistica tracciata", "Supply chain sicura", "Distribuzione B2B"]
                            }
                        ].map((type, index) => (
                            <div key={index} className="bg-[#1E2633] p-6 rounded-xl border border-blue-900/30 hover:border-purple-500/50 transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-blue-900/20 p-2 rounded-lg group-hover:bg-purple-900/20 transition-colors">
                                        {type.icon}
                                    </div>
                                    <h3 className="font-bold text-lg">{type.title}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {type.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center gap-2 text-gray-300">
                                            <span className="text-blue-400">▸</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Network Certificato
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {partners.map((partner, index) => (
                            <div key={index} className="bg-[#2A3447] p-6 rounded-xl border border-blue-900/30 hover:border-purple-500/50 transition-all shadow-md">
                                <div className="bg-blue-900/10 p-4 rounded-lg mb-3 flex justify-center">
                                    {partner.icon}
                                </div>
                                <h4 className="font-bold text-center mb-1">{partner.name}</h4>
                                <p className="text-sm text-gray-300 text-center">{partner.sector}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-8 shadow-lg mb-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Richiesta Partnership
                        </h2>
                        <p className="text-gray-300 mb-8">Riservato ad operatori autorizzati e certificati</p>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    placeholder="Ragione Sociale"
                                    className="input input-bordered w-full bg-[#1E2633] border-blue-900/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Certificata"
                                    className="input input-bordered w-full bg-[#1E2633] border-blue-900/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                                />
                            </div>

                            <select className="select select-bordered w-full bg-[#1E2633] border-blue-900/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30">
                                <option disabled value="">Tipo di Richiesta</option>
                                <option>Fornitura Materia Prima</option>
                                <option>Co-Sviluppo Prodotto</option>
                                <option>Distribuzione Esclusiva</option>
                                <option>Analisi di Laboratorio</option>
                            </select>

                            <textarea
                                placeholder="Descrivi la tua proposta (include numero licenza operativa)"
                                className="textarea textarea-bordered w-full h-32 bg-[#1E2633] border-blue-900/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                                minLength={200}
                                required
                            ></textarea>

                            <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white gap-2 w-full">
                                <Send size={18} />
                                Invia Documentazione
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Documentazione
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: "Linee Guida Compliance", format: "PDF", size: "2.1MB" },
                            { title: "Manuale Qualità", format: "ZIP", size: "4.7MB" },
                            { title: "Regolamentazione Attuale", format: "PDF", size: "1.3MB" }
                        ].map((resource, index) => (
                            <div key={index} className="bg-[#1E2633] p-4 rounded-xl flex items-center justify-between border border-blue-900/30 hover:border-purple-500/50 transition-all group">
                                <div>
                                    <h4 className="font-bold mb-1">{resource.title}</h4>
                                    <p className="text-sm text-gray-300">{resource.format} • {resource.size}</p>
                                </div>
                                <button className="btn btn-ghost btn-sm text-purple-400 hover:text-white">
                                    <Download size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PartnershipPage;