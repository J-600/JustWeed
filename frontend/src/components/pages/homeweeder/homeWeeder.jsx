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
import { Cannabis, Upload } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
// import Loader from "../../loader/loader";

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


function Loader() {
    return (
        <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-emerald-400"></span>
        </div>
    )
}

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

                {loading ? (<Loader />) : (
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
                )}


            </div>
        </div>
    );
}

function Prodotti() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([])
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        id: '',
        name: '',
        price: '',
        quantity: '',
        description: '',
        img: ''
    });

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/weeder/products", {
                method: "GET",
                credentials: "include"
            })
            if (!res.ok)
                throw new Error("Errore nel fetch dei dati");

            const data = await res.json();
            console.log(data)

            setProducts(data)

        } catch (error) {
            console.error(error);
            setErrorMessage("Si è verificato un errore, riprova più tardi");

        }
        finally {
            setLoading(false);
        }

    }


    useEffect(() => {

        fetchData()
    }, [])

    const handleDelete = (id) => {
        setDeletingProduct(id);
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/weeder/products/${deletingProduct}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!res.ok) throw new Error("Errore nell'eliminazione");

            setProducts(products.filter(product => product.id !== deletingProduct));
            setSuccessMessage("Prodotto eliminato con successo");
            setTimeout(() => setSuccessMessage(""), 3000);
            setDeletingProduct(null)
        } catch (error) {
            console.error(error);
            setErrorMessage("Errore durante l'eliminazione");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({
                    ...prev,
                    img: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
            img: product.img
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('price', editForm.price.toString());
        formData.append('quantity', editForm.quantity.toString());
        formData.append('description', editForm.description);

        if (editForm.img) {
            formData.append('img', editForm.img);
        }

        try {
            const res = await fetch(`http://localhost:3000/api/weeder/products/${editingProduct.id}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            if (!res.ok) throw new Error("Errore nella modifica");

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === editingProduct?.id
                        ? {
                            ...product,
                            ...editForm,
                            img: editForm.img || product.img
                        }
                        : product
                )
            );
            setEditingProduct(null);
            setSuccessMessage("Prodotto modificato con successo");
            setTimeout(() => setSuccessMessage(""), 3000);
            fetchData()
        } catch (error) {
            console.error(error);
            setErrorMessage("Errore durante la modifica");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="card bg-emerald-900/80 shadow-2xl border-2 border-emerald-700/30">
            <div className="card-body space-y-4">
                <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
                    Gestione Prodotti
                </h2>

                {successMessage && (
                    <div className="alert alert-success shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="alert alert-error shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {loading ? (
                    <Loader />
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-emerald-400/50 gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        <span className="text-lg">Nessun prodotto disponibile</span>
                    </div>
                ) : (
                    <>
                        {editingProduct && (
                            <div className="modal modal-open">
                                <div className="modal-box bg-emerald-900 border border-emerald-700/30 max-w-2xl">
                                    <h3 className="font-bold text-2xl text-emerald-300 mb-4">Modifica Prodotto</h3>
                                    <form onSubmit={handleEditSubmit} className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex flex-col items-center w-full md:w-1/3">
                                                <div className="relative group">
                                                    <img
                                                        src={editForm.img || '/placeholder-product.jpg'}
                                                        className="w-48 h-48 object-cover rounded-xl border-2 border-emerald-700/30"
                                                        alt="Anteprima immagine"
                                                    />
                                                    <label className="absolute bottom-2 right-2 bg-emerald-800/80 p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                                                        <input
                                                            type="file"
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                            accept="image/*"
                                                        />
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-300" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text text-emerald-200">Nome Prodotto</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editForm.name}
                                                        onChange={handleEditChange}
                                                        className="input input-bordered bg-emerald-800/50 text-emerald-100 border-emerald-700/30 focus:border-emerald-400"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text text-emerald-200">Prezzo (€)</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            value={editForm.price}
                                                            onChange={handleEditChange}
                                                            className="input input-bordered bg-emerald-800/50 text-emerald-100 border-emerald-700/30"
                                                            min="0"
                                                            step="0.01"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text text-emerald-200">Quantità</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="quantity"
                                                            value={editForm.quantity}
                                                            onChange={handleEditChange}
                                                            className="input input-bordered bg-emerald-800/50 text-emerald-100 border-emerald-700/30"
                                                            min="0"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text text-emerald-200">Descrizione</span>
                                                    </label>
                                                    <textarea
                                                        name="description"
                                                        value={editForm.description}
                                                        onChange={handleEditChange}
                                                        className="textarea textarea-bordered bg-emerald-800/50 text-emerald-100 border-emerald-700/30 h-32"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-action">
                                            <button
                                                type="button"
                                                onClick={() => setEditingProduct(null)}
                                                className="btn btn-ghost text-emerald-400 hover:bg-emerald-800/50"
                                            >
                                                Annulla
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn bg-gradient-to-r from-emerald-500 to-lime-600 text-white border-none hover:opacity-90 transition-opacity"
                                            >
                                                Salva Modifiche
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {deletingProduct && (
                            <div className="modal modal-open">
                                <div className="modal-box bg-emerald-900 border border-emerald-500/30 max-w-md">
                                    <h3 className="font-bold text-2xl text-emerald-300 mb-4">Conferma Eliminazione</h3>

                                    <div className="text-center py-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400/80 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>

                                        <p className="text-emerald-200 mb-2">
                                            Sei sicuro di voler eliminare definitivamente
                                            <span className="font-bold text-emerald-100 block mt-1">
                                                {products.find(p => p.id === deletingProduct)?.name}
                                            </span>
                                        </p>
                                        <p className="text-sm text-emerald-400/70">Questa azione non può essere annullata</p>
                                    </div>

                                    <div className="modal-action">
                                        <button
                                            type="button"
                                            onClick={() => setDeletingProduct(null)}
                                            className="btn btn-ghost text-emerald-400 hover:bg-emerald-800/50"
                                        >
                                            Annulla
                                        </button>
                                        <button
                                            onClick={handleConfirmDelete}
                                            className="btn bg-gradient-to-r from-red-500 to-orange-600 text-white border-none hover:scale-[1.02] transition-transform"
                                        >
                                            Conferma Eliminazione
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-emerald-900/50 rounded-xl p-4 border-2 border-emerald-700/30 hover:border-emerald-500/40 transition-all duration-300">
                                    <div className="relative mb-4">
                                        <img
                                            src={product.img || '/placeholder-product.jpg'}
                                            className="w-full h-48 object-cover rounded-lg"
                                            alt={product.name}
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn btn-sm bg-emerald-800/80 text-emerald-200 hover:bg-emerald-700 border-emerald-700/30"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn btn-sm bg-red-800/80 text-red-200 hover:bg-red-700 border-red-700/30"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-emerald-300 truncate">{product.name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-emerald-400">€{product.price}</span>
                                            <span className="text-emerald-400 bg-emerald-800/30 px-2 py-1 rounded">
                                                {product.quantity} disponibili
                                            </span>
                                        </div>
                                        <p className="text-emerald-400/80 text-sm line-clamp-3">
                                            {product.description || "Nessuna descrizione"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function UploadProdotto() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        img: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, img: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            if (!formData.name || !formData.price || !formData.quantity) {
                throw new Error('Compila tutti i campi obbligatori');
            }

            const formUploadData = new FormData();
            formUploadData.append('name', formData.name);
            formUploadData.append('price', formData.price.toString());
            formUploadData.append('quantity', formData.quantity.toString());
            formUploadData.append('description', formData.description);
            if (formData.img) {
                formUploadData.append('img', formData.img );
            }

            const response = await fetch('http://localhost:3000/api/weeder/products/upload', {
                method: 'POST',
                body: formUploadData,
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Errore server');

            setSuccessMessage('Prodotto caricato!');
            setFormData({
                name: '',
                price: '',
                quantity: '',
                description: '',
                img: null
            });
            setImagePreview(null);


        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const convertToBase64 = async (file) => {
        const MAX_WIDTH = 800; // Larghezza massima
        const QUALITY = 0.7; // Qualità compressa

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(
                        (blob) => {
                            const compressedReader = new FileReader();
                            compressedReader.readAsDataURL(blob);
                            compressedReader.onloadend = () => {
                                resolve(compressedReader.result.split(',')[1]);
                            };
                        },
                        'image/*',
                        QUALITY
                    );
                };
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="card bg-emerald-900/80 shadow-2xl border-2 border-emerald-700/30">
            <div className="card-body space-y-4">
                <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-500 animate-gradient text-4xl font-bold mb-6">
                    Nuovo Prodotto
                </h2>

                {successMessage && (
                    <div className="alert alert-success shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="alert alert-error shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-emerald-200">Immagine del Prodotto</span>
                        </label>
                        <div className="group relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-emerald-700/30 hover:border-emerald-500 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required
                            />
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Anteprima"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-emerald-500/50 group-hover:text-emerald-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 mb-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm">Trascina un'immagine o clicca per selezionare</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-emerald-200">Nome Prodotto</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered bg-emerald-900/50 border-emerald-700/30 text-emerald-100"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-emerald-200">Prezzo (€)</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="input input-bordered bg-emerald-900/50 border-emerald-700/30 text-emerald-100"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-emerald-200">Quantità</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="input input-bordered bg-emerald-900/50 border-emerald-700/30 text-emerald-100"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-emerald-200">Descrizione</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered bg-emerald-900/50 border-emerald-700/30 text-emerald-100 h-32"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-control mt-8">
                        <button
                            type="submit"
                            className="btn bg-gradient-to-r from-emerald-500 to-lime-600 text-white border-none hover:scale-[1.02] transition-transform"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Carica Prodotto'
                            )}
                        </button>
                    </div>
                </form>
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

    useEffect(() => {
        const fetchSession = async () => {
            const res = await fetch("http://localhost:3000/api/auth/session", {
                credentials: "include"
            })

            if (!res.ok)
                navigate("/")
        }

        fetchSession()
    }, [])

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
            case "prodotti":
                return (
                    <Prodotti />
                );
            case "upload":
                return (<UploadProdotto />);
            default:
                return (
                    <Progress />
                );
        }
    };


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
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M4 4V20M4 20H20
                                                M8 16V8
                                                M12 16V12
                                                M16 16V4"
                                        />
                                    </svg>
                                </div>
                                <span className="text-white group-hover:text-emerald-300 transition-colors duration-300">
                                    Trends
                                </span>
                            </div>

                            <div
                                onClick={() => { setActiveTab("prodotti"); setIsMenuOpen(false) }}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "prodotti"
                                    ? "bg-gradient-to-r from-emerald-500/20 to-lime-600/20 border border-emerald-700/30"
                                    : "hover:bg-emerald-800"
                                    }`}
                            >
                                <div className="p-2 bg-emerald-800/20 rounded-md group-hover:bg-gradient-to-r from-emerald-400/20 to-lime-500/20">
                                    <Cannabis className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-white group-hover:text-emerald-300 transition-colors duration-300">
                                    Prodotti
                                </span>
                            </div>

                            <div
                                onClick={() => { setActiveTab("upload"); setIsMenuOpen(false) }}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "upload"
                                    ? "bg-gradient-to-r from-emerald-500/20 to-lime-600/20 border border-emerald-700/30"
                                    : "hover:bg-emerald-800"
                                    }`}
                            >
                                <div className="p-2 bg-emerald-800/20 rounded-md group-hover:bg-gradient-to-r from-emerald-400/20 to-lime-500/20">
                                    <Upload className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-white group-hover:text-emerald-300 transition-colors duration-300">
                                    Upload prodotto
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