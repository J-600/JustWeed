import { Leaf, Users, Shield, Truck, Heart, Instagram, Linkedin, Twitter } from 'lucide-react';
import TopBar from "../../navbar/topbar";
import { useState } from 'react';

const AboutPage = () => {
    const [members, setMembers] = useState([{ "nome": "", "cognome": "", "instagram": "", "linkedin": "", "ruolo": "", "img": "" }, { "nome": "Jhon", "cognome": "Panora", "instagram": "", "linkedin": "", "ruolo": "owner", "img": "" }, { "nome": "", "cognome": "", "instagram": "", "linkedin": "", "ruolo": "", "img": "" }])

    const socialLinks = [
        {
            Icon: Twitter,
            href: "#",
            color: "text-blue-400",
            hoverColor: "bg-blue-500"
        },
        {
            Icon: Instagram,
            href: "#",
            color: "text-pink-500",
            hoverColor: "bg-pink-500"
        },
        {
            Icon: Linkedin,
            href: "#",
            color: "text-blue-400",
            hoverColor: "bg-blue-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
            <TopBar id="start" />

            <div className="w-full px-4 sm:px-8 pt-20 pb-14">
                <div className="max-w-7xl mx-auto">
                    <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                        <div className="card-body space-y-8 py-12">

                            <div className="text-center max-w-3xl mx-auto">
                                <Leaf className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                                    La Nostra Storia
                                </h1>
                                <p className="text-gray-400 text-lg">
                                    Da appassionati a pionieri nel mondo della cannabis di qualità. La nostra missione è fornire
                                    prodotti premium con trasparenza e dedizione alla comunità.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-blue-400" />
                                    <span>Il Nostro Team</span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {members.map((item) => (
                                        <div key={item} className="card bg-[#2A3447] border border-blue-900/30 hover:border-purple-500/50 transition-all group">
                                            <div className="card-body items-center text-center">
                                                <div className="avatar mb-4">
                                                    <div className="w-24 rounded-full border-2 border-blue-500/30">
                                                        <img src={item.img} alt="Team member" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-1">{item.nome + " " + item.cognome}</h3>
                                                <p className="text-blue-400 mb-4">{item.ruolo}</p>
                                                <div className="flex gap-3 justify-center">
                                                    {socialLinks.map(({ Icon, href, color, hoverColor }) => (
                                                        <a
                                                            key={href}
                                                            href={href}
                                                            className={`btn btn-square btn-sm border border-blue-900/30 bg-[#1E2633] ${color} hover:${hoverColor} hover:text-white`}
                                                        >
                                                            <Icon stroke="currentColor" size={18} />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                    <Shield className="w-8 h-8 text-purple-400" />
                                    <span>I Nostri Valori</span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="card bg-[#2A3447] border border-blue-900/30 p-6">
                                        <Truck className="w-12 h-12 text-blue-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Spedizioni Sicure</h3>
                                        <p className="text-gray-400">Consegna discreta e tracciabile in tutta Italia</p>
                                    </div>

                                    <div className="card bg-[#2A3447] border border-blue-900/30 p-6">
                                        <Leaf className="w-12 h-12 text-purple-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Qualità Certificata</h3>
                                        <p className="text-gray-400">Prodotti testati in laboratorio e garantiti</p>
                                    </div>

                                    <div className="card bg-[#2A3447] border border-blue-900/30 p-6">
                                        <Heart className="w-12 h-12 text-red-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Supporto 24/7</h3>
                                        <p className="text-gray-400">Assistenza clienti sempre disponibile</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-[#2A3447] border border-blue-900/30 mt-12">
                                <div className="card-body py-8">
                                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Contattaci</h2>
                                    <form className="max-w-xl mx-auto space-y-4">
                                        <div className="form-control">
                                            <input
                                                type="text"
                                                placeholder="Nome"
                                                className="input bg-[#1E2633] border border-blue-900/30 text-white focus:border-purple-500"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                className="input bg-[#1E2633] border border-blue-900/30 text-white focus:border-purple-500"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <textarea
                                                className="textarea bg-[#1E2633] border border-blue-900/30 text-white focus:border-purple-500 h-32"
                                                placeholder="Messaggio"
                                            ></textarea>
                                        </div>
                                        <button className="btn w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
                                            Invia Messaggio
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-blue-900/30 py-12 mt-auto bg-[#1E2633]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        {/* Sezione Azienda */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Azienda</h3>
                            <ul className="space-y-2">
                                <li><a href="#start" className="text-gray-400 hover:text-white transition-colors">Chi siamo</a></li>
                                <li><a href="/collaboratori" className="text-gray-400 hover:text-white transition-colors">Collaboratori</a></li>
                                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="/contatti" className="text-gray-400 hover:text-white transition-colors">Contatti</a></li>
                            </ul>
                        </div>

                        {/* Sezione Impatto */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Impatto</h3>
                            <ul className="space-y-2">
                                <li><a href="/impatto-ambientale" className="text-gray-400 hover:text-white transition-colors">Report sostenibilità</a></li>
                                <li><a href="/carbon-footprint" className="text-gray-400 hover:text-white transition-colors">Impronta ecologica</a></li>
                                <li><a href="/partnership" className="text-gray-400 hover:text-white transition-colors">Partnership green</a></li>
                                <li><a href="/certificazioni" className="text-gray-400 hover:text-white transition-colors">Certificazioni</a></li>
                            </ul>
                        </div>

                        {/* Sezione Legal */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="/termini" className="text-gray-400 hover:text-white transition-colors">Termini di servizio</a></li>
                                <li><a href="/cookie" className="text-gray-400 hover:text-white transition-colors">Preferenze cookie</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Seguici</h3>
                            <div className="flex gap-2">
                                {socialLinks.map(({ Icon, href, color, hoverColor }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        className={`btn btn-square btn-sm border border-blue-900/30 bg-[#1E2633] ${color} hover:${hoverColor} hover:text-white`}
                                    >
                                        <Icon stroke="currentColor" size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-blue-900/30 pt-8">
                        <div className="text-center text-gray-400">
                            <p>© 2023 JustWeed. Tutti i diritti riservati |
                                <a href="/termini" className="hover:text-white ml-2">Termini e Condizioni</a>
                            </p>
                            <p className="mt-2 text-sm">P.IVA 01234567890 | Registro Imprese Milano</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;