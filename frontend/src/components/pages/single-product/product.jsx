import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight } from 'lucide-react';
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";

function Product() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [product, setProduct] = useState([])
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const id = params.get("id");
                const [productRes, tagsRes] = await Promise.all([fetch("http://localhost:3000/product", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id
                    }),
                    credentials: "include"
                }), await fetch("http://localhost:3000/tag", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id
                    }),
                    credentials: "include"
                })]);
                if (!productRes.ok || !tagsRes.ok) {
                    // navigate("/");
                    return;
                }

                const productData = await productRes.json();

                const tagsData = await tagsRes.json();

                console.log(productData[0])
                console.log(tagsData)
                setProduct(productData[0])
                setTags(tagsData)
            }
            catch (error) {
                console.error("Errore durante la richiesta:", error);
            } finally {
                setLoading(false)
            }
        }
        fetchProduct();

    }, [])

    return (

        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
            <TopBar />
            <div className="w-full px-4 pt-20 pb-14">
                <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                    <div className="card-body space-y-4">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div key={product.id} className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                                    <figure className="px-4 pt-4 pb-4 cursor-pointer">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="w-full h-[28rem] lg:h-[32rem] object-cover rounded-2xl border border-blue-900/30 hover:scale-[1.02] transition-transform duration-300"
                                        />
                                    </figure>

                                    <div className="card-body">
                                        <h1 className="card-title text-white text-6xl mb-4">{product.name}</h1>
                                        <p className="text-gray-400 text-lg mb-2">Venduto da: {product.username}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">

                                            {Array.isArray(tags) && tags.length > 0 ? (tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="badge badge-outline border-blue-900/30 text-blue-400"
                                                >
                                                    {tag.tag}
                                                </span>

                                            ))) : (<></>)}
                                        </div>
                                        <div className="flex items-center mb-6">

                                            <span className="text-yellow-400 text-2xl">★★★★☆</span>
                                            <span className="text-gray-400 ml-2">(123 recensioni)</span>
                                        </div>
                                        <p className="text-gray-300 text-lg mb-6">
                                            {product.description || "Descrizione del prodotto non disponibile."}
                                        </p>
                                        <div className="flex items-center mb-6">
                                            <span className="text-white text-4xl font-bold">€{product.price}</span>
                                            <span className="text-gray-400 text-lg ml-2">(IVA inclusa)</span>
                                        </div>
                                        <div className="flex flex-col space-y-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                                            >
                                                Acquista ora
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline w-full text-white border-blue-500 hover:bg-blue-500 hover:text-white transform transition-all duration-300 hover:scale-105"
                                            >
                                                Aggiungi al carrello
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body col-span-2 pt-8">
                                    <div className="bg-[#2A3447] p-6 rounded-2xl">
                                        <h2 className="text-white text-2xl font-bold mb-4">Dettagli del prodotto</h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="text-gray-300">
                                                <p><strong>Marca:</strong> {product.username || "N/A"}</p>
                                                <p><strong>Disponibilità:</strong> {product.quantity > 0 ? "In stock" : "Esaurito"}</p>
                                            </div>
                                            <div className="text-gray-300">
                                                <p><strong>Spedizione:</strong> Consegna in 2-3 giorni lavorativi</p>
                                                <p><strong>Garanzia:</strong> 2 anni</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                            <div className="card-body space-y-4">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;