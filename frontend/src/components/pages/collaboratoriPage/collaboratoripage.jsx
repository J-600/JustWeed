import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";
import React from 'react';
import { useState } from "react";
import { ChevronUp, ChevronDown, Users, ClipboardList, User } from "lucide-react";

const CollaboratoriPage = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [showDetails, setShowDetails] = useState(null);

    const collaboratori = [
        {
            "id": 1,
            "name": "Jhon Panora",
            "avatar": "",
            "role": "CEO",
            "department": "Direzione Generale",
            "raci": {
                "responsible": ["Visione aziendale", "Strategia di crescita"],
                "accountable": "Successo globale dell'azienda",
                "consulted": ["Consiglio di amministrazione", "Investitori"],
                "informed": ["Top Management", "Dipendenti"]
            }
        },
        {
            id: 2,
            name: "Laura Bianchi",
            avatar: "https://img.daisyui.com/images/profile/demo/3@94.webp",
            role: "Responsabile Qualità",
            department: "Controllo Qualità",
            raci: {
                responsible: ["Test prodotti", "Certificazioni"],
                accountable: "Standard qualitativi",
                consulted: "R&D",
                informed: ["Clienti Premium", "Management"]
            }
        },
        {
            "id": 3,
            "name": "Marco Rossi",
            "avatar": "https://img.daisyui.com/images/profile/demo/4@94.webp",
            "role": "Project Manager",
            "department": "IT",
            "raci": {
                "responsible": ["Gestione progetti", "Coordinamento team"],
                "accountable": "Consegna nei tempi",
                "consulted": ["Stakeholder", "Clienti"],
                "informed": ["Dirigenza", "Sviluppatori"]
            }
        },
        {
            "id": 4,
            "name": "Elena Verdi",
            "avatar": "https://img.daisyui.com/images/profile/demo/5@94.webp",
            "role": "HR Manager",
            "department": "Risorse Umane",
            "raci": {
                "responsible": ["Selezione personale", "Gestione contratti"],
                "accountable": "Politiche aziendali",
                "consulted": "Legale",
                "informed": ["Dipendenti", "Dirigenza"]
            }
        },
        {
            "id": 5,
            "name": "Giovanni Neri",
            "avatar": "https://img.daisyui.com/images/profile/demo/6@94.webp",
            "role": "Analista Finanziario",
            "department": "Finanza",
            "raci": {
                "responsible": ["Analisi investimenti", "Budgeting"],
                "accountable": "Salute finanziaria",
                "consulted": "CEO",
                "informed": ["Investitori", "Consiglio di amministrazione"]
            }
        },
        {
            "id": 6,
            "name": "Sara Gialli",
            "avatar": "https://img.daisyui.com/images/profile/demo/7@94.webp",
            "role": "Marketing Specialist",
            "department": "Marketing",
            "raci": {
                "responsible": ["Campagne pubblicitarie", "SEO"],
                "accountable": "Brand awareness",
                "consulted": "Vendite",
                "informed": ["Clienti", "Direzione"]
            }
        },
        {
            "id": 7,
            "name": "Luca Azzurri",
            "avatar": "https://img.daisyui.com/images/profile/demo/8@94.webp",
            "role": "Ingegnere Software",
            "department": "Sviluppo",
            "raci": {
                "responsible": ["Sviluppo backend", "API"],
                "accountable": "Qualità del codice",
                "consulted": "IT Security",
                "informed": ["Project Manager", "DevOps"]
            }
        },
        {
            "id": 8,
            "name": "Valentina Marroni",
            "avatar": "https://img.daisyui.com/images/profile/demo/9@94.webp",
            "role": "Data Analyst",
            "department": "Business Intelligence",
            "raci": {
                "responsible": ["Analisi dati", "Reportistica"],
                "accountable": "Precisione dati",
                "consulted": "CEO",
                "informed": ["Marketing", "Vendite"]
            }
        },
        {
            "id": 9,
            "name": "Alessandro Bianchi",
            "avatar": "https://img.daisyui.com/images/profile/demo/10@94.webp",
            "role": "Responsabile Produzione",
            "department": "Produzione",
            "raci": {
                "responsible": ["Supervisione impianti", "Gestione operai"],
                "accountable": "Efficienza produttiva",
                "consulted": "Logistica",
                "informed": ["Magazzino", "Direzione"]
            }
        },
        {
            "id": 10,
            "name": "Francesca Viola",
            "avatar": "https://img.daisyui.com/images/profile/demo/11@94.webp",
            "role": "Customer Success Manager",
            "department": "Supporto Clienti",
            "raci": {
                "responsible": ["Assistenza clienti", "Feedback utenti"],
                "accountable": "Soddisfazione clienti",
                "consulted": "Vendite",
                "informed": ["Prodotto", "Direzione"]
            }
        },
        {
            "id": 11,
            "name": "Giorgio Grigi",
            "avatar": "https://img.daisyui.com/images/profile/demo/12@94.webp",
            "role": "Specialista Logistica",
            "department": "Logistica",
            "raci": {
                "responsible": ["Gestione spedizioni", "Ottimizzazione trasporti"],
                "accountable": "Tempi di consegna",
                "consulted": "Produzione",
                "informed": ["Magazzino", "Clienti"]
            }
        },
        {
            "id": 12,
            "name": "Chiara Rossi",
            "avatar": "https://img.daisyui.com/images/profile/demo/13@94.webp",
            "role": "Security Officer",
            "department": "IT Security",
            "raci": {
                "responsible": ["Sicurezza informatica", "Audit"],
                "accountable": "Protezione dati",
                "consulted": "Compliance",
                "informed": ["Sviluppatori", "IT"]
            }
        }
    ];

    const requestSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedData = [...collaboratori].sort((a, b) => {
        const aValue = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key];
        const bValue = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const CollaboratoreAvatar = ({ collaboratore }) => {
        const [imageError, setImageError] = useState(false);

        return (
            <div className="mask mask-squircle h-12 w-12">
                {!imageError && collaboratore.avatar ? (
                    <img
                        src={collaboratore.avatar}
                        alt={collaboratore.name}
                        className="h-12 w-12 rounded-md"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="avatar placeholder">
                        <div className="bg-blue-900/30 text-blue-400 mask mask-squircle h-12 w-12 flex items-center justify-center">
                            <span className="text-lg">
                                {collaboratore.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const toggleRowSelection = (id) => {
        setSelectedRows(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(id)) {
                newSelection.delete(id);
            } else {
                newSelection.add(id);
            }
            return newSelection;
        });
    };

    const toggleDetails = (id) => {
        setShowDetails(prev => prev === id ? null : id);
    };

    const countRaciItems = (items) =>
        Array.isArray(items) ? items.length : typeof items === 'string' ? 1 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
            <TopBar />

            <div className="w-full px-4 sm:px-8 pt-20 pb-14">
                <div className="max-w-7xl mx-auto">
                    <div className="hidden md:block">
                        <div className="card bg-base-200 shadow-2xl border border-blue-900/30">
                            <div className="card-body">
                                <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-purple-400" />
                                    Team Collaboratori
                                </h1>

                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr className="border-b border-blue-900/30">
                                                <th className="bg-card-base-100">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-primary border-blue-900/30"
                                                        checked={selectedRows.size === collaboratori.length}
                                                        onChange={() => {
                                                            if (selectedRows.size === collaboratori.length) {
                                                                setSelectedRows(new Set());
                                                            } else {
                                                                setSelectedRows(new Set(collaboratori.map(c => c.id)));
                                                            }
                                                        }}
                                                    />
                                                </th>
                                                <th className="bg-card-base-100 text-blue-400">
                                                    <button
                                                        className="flex items-center gap-2 hover:text-purple-400"
                                                        onClick={() => requestSort('name')}
                                                    >
                                                        Nome
                                                        {sortConfig.key === 'name' && (
                                                            sortConfig.direction === 'asc'
                                                                ? <ChevronUp className="w-4 h-4" />
                                                                : <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="bg-card-base-100 text-blue-400">Ruolo</th>
                                                <th className="bg-card-base-100 text-blue-400">Dipartimento</th>
                                                <th className="bg-card-base-100 text-blue-400">RACI</th>
                                                <th className="bg-card-base-100 text-blue-400">Azioni</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {sortedData.map((collaboratore) => (
                                                <React.Fragment key={collaboratore.id}>
                                                    <tr className="hover:bg-card-base-100/50 border-b border-blue-900/30">
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className="checkbox checkbox-primary border-blue-900/30"
                                                                checked={selectedRows.has(collaboratore.id)}
                                                                onChange={() => toggleRowSelection(collaboratore.id)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <CollaboratoreAvatar collaboratore={collaboratore} />
                                                                <div>
                                                                    <div className="font-bold text-white">
                                                                        {collaboratore.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-400">
                                                                        ID: {collaboratore.id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-white">
                                                            {collaboratore.role}
                                                            <br />
                                                            <span className="badge badge-sm badge-outline border-blue-900/30 text-blue-400 mt-1">
                                                                {collaboratore.department}
                                                            </span>
                                                        </td>
                                                        <td className="text-gray-300">
                                                            <span className="badge badge-sm bg-card-base-100 border border-blue-900/30">
                                                                {collaboratore.department}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="flex flex-wrap gap-1">
                                                                <span className="badge badge-sm bg-blue-500/10 border border-blue-500/30 text-blue-400">
                                                                    R: {countRaciItems(collaboratore.raci.responsible)}
                                                                </span>
                                                                <span className="badge badge-sm bg-purple-500/10 border border-purple-500/30 text-purple-400">
                                                                    A: {countRaciItems(collaboratore.raci.accountable)}
                                                                </span>
                                                                <span className="badge badge-sm bg-green-500/10 border border-green-500/30 text-green-400">
                                                                    C: {countRaciItems(collaboratore.raci.consulted)}
                                                                </span>
                                                                <span className="badge badge-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                                                                    I: {countRaciItems(collaboratore.raci.informed)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-ghost btn-xs bg-card-base-100 border border-blue-900/30 text-blue-400 hover:text-purple-400 hover:border-purple-400/30"
                                                                onClick={() => toggleDetails(collaboratore.id)}
                                                            >
                                                                {showDetails === collaboratore.id ? 'Nascondi' : 'Mostra'} dettagli
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {showDetails === collaboratore.id && (
                                                        <tr className="bg-card-base-100/50">
                                                            <td colSpan="6" className="p-4">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                    <div>
                                                                        <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-1">
                                                                            <User className="w-4 h-4" />
                                                                            Responsible (R)
                                                                        </h3>
                                                                        <ul className="list-disc pl-4 text-gray-300">
                                                                            {collaboratore.raci.responsible.map((item, i) => (
                                                                                <li key={i}>{item}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-1">
                                                                            <User className="w-4 h-4" />
                                                                            Accountable (A)
                                                                        </h3>
                                                                        <p className="text-gray-300">{collaboratore.raci.accountable}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-green-400 font-bold mb-2 flex items-center gap-1">
                                                                            <User className="w-4 h-4" />
                                                                            Consulted (C)
                                                                        </h3>
                                                                        {Array.isArray(collaboratore.raci.consulted) ? (
                                                                            <ul className="list-disc pl-4 text-gray-300">
                                                                                {collaboratore.raci.consulted.map((item, i) => (
                                                                                    <li key={i}>{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <p className="text-gray-300">{collaboratore.raci.consulted}</p>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-1">
                                                                            <User className="w-4 h-4" />
                                                                            Informed (I)
                                                                        </h3>
                                                                        {Array.isArray(collaboratore.raci.informed) ? (
                                                                            <ul className="list-disc pl-4 text-gray-300">
                                                                                {collaboratore.raci.informed.map((item, i) => (
                                                                                    <li key={i}>{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <p className="text-gray-300">{collaboratore.raci.informed}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layout Mobile */}
                    <div className="block md:hidden">
                        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <Users className="w-8 h-8 text-purple-400" />
                            Team Collaboratori
                        </h1>
                        {/* Se si desidera, è possibile inserire un header con selezione globale */}
                        {sortedData.map((collaboratore) => (
                            <div key={collaboratore.id} className="bg-base-200 border border-blue-900/30 rounded-md p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CollaboratoreAvatar collaboratore={collaboratore} />
                                        <div>
                                            <div className="font-bold text-white">
                                                {collaboratore.name}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                ID: {collaboratore.id}
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary border-blue-900/30"
                                        checked={selectedRows.has(collaboratore.id)}
                                        onChange={() => toggleRowSelection(collaboratore.id)}
                                    />
                                </div>
                                <div className="mt-2 text-gray-300">
                                    <div>
                                        <span className="font-bold text-blue-400">Ruolo:</span> {collaboratore.role}
                                    </div>
                                    <div>
                                        <span className="font-bold text-blue-400">Dipartimento:</span> {collaboratore.department}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <span className="badge badge-sm bg-blue-500/10 border border-blue-500/30 text-blue-400">
                                            R: {countRaciItems(collaboratore.raci.responsible)}
                                        </span>
                                        <span className="badge badge-sm bg-purple-500/10 border border-purple-500/30 text-purple-400">
                                            A: {countRaciItems(collaboratore.raci.accountable)}
                                        </span>
                                        <span className="badge badge-sm bg-green-500/10 border border-green-500/30 text-green-400">
                                            C: {countRaciItems(collaboratore.raci.consulted)}
                                        </span>
                                        <span className="badge badge-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                                            I: {countRaciItems(collaboratore.raci.informed)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <button
                                        className="btn btn-ghost btn-xs bg-card-base-100 border border-blue-900/30 text-blue-400 hover:text-purple-400 hover:border-purple-400/30"
                                        onClick={() => toggleDetails(collaboratore.id)}
                                    >
                                        {showDetails === collaboratore.id ? 'Nascondi' : 'Mostra'} dettagli
                                    </button>
                                </div>
                                {showDetails === collaboratore.id && (
                                    <div className="mt-2 bg-card-base-100 p-2 rounded text-sm">
                                        <div className="mb-2">
                                            <h3 className="text-blue-400 font-bold flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                Responsible (R)
                                            </h3>
                                            <ul className="list-disc pl-4 text-gray-300">
                                                {collaboratore.raci.responsible.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mb-2">
                                            <h3 className="text-purple-400 font-bold flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                Accountable (A)
                                            </h3>
                                            <p className="text-gray-300">{collaboratore.raci.accountable}</p>
                                        </div>
                                        <div className="mb-2">
                                            <h3 className="text-green-400 font-bold flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                Consulted (C)
                                            </h3>
                                            {Array.isArray(collaboratore.raci.consulted) ? (
                                                <ul className="list-disc pl-4 text-gray-300">
                                                    {collaboratore.raci.consulted.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-300">{collaboratore.raci.consulted}</p>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-yellow-400 font-bold flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                Informed (I)
                                            </h3>
                                            {Array.isArray(collaboratore.raci.informed) ? (
                                                <ul className="list-disc pl-4 text-gray-300">
                                                    {collaboratore.raci.informed.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-300">{collaboratore.raci.informed}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CollaboratoriPage;
