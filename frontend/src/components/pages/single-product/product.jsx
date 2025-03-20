import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight } from 'lucide-react';
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";

function Product() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [product, setProduct] = useState([])
    const [comments, setComments] = useState([])
    const [selectRating, setSelectedRating] = useState('')
    const [recStar, setRecStart] = useState(0.5)
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const id = params.get("id");
                const [productRes, tagsRes, commentsRes] = await Promise.all([fetch("http://localhost:3000/product", {
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
                }), null//await fetch("http://localhost:3000/comments")
            ]);
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
            <div className="w-full px-2 sm:px-4 pt-20 pb-14">
                <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                    <div className="card-body space-y-4">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div key={product.id} className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                                <div className="grid lg:grid-cols-2 grid-cols-1 p-4 sm:p-6 gap-4 sm:gap-8">
                                    <figure className="px-2 sm:px-4 pt-4 pb-2 cursor-pointer">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="w-full h-[20rem] sm:h-[28rem] lg:h-[32rem] object-cover rounded-xl sm:rounded-2xl border border-blue-900/30 hover:scale-[1.02] transition-transform duration-300"
                                        />
                                    </figure>

                                    <div className="card-body px-2 sm:px-4">
                                        <h1 className="card-title text-white text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">
                                            {product.name}
                                        </h1>
                                        <p className="text-gray-400 text-base sm:text-lg mb-2">Venduto da: {product.username}</p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {Array.isArray(tags) && tags.length > 0 && tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="badge badge-outline border-blue-900/30 text-blue-400 text-xs sm:text-sm"
                                                >
                                                    {tag.tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center mb-4 sm:mb-6">
                                            <div className="rating rating-sm rating-half sm:rating-md">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <React.Fragment key={star}>
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            className="mask mask-star-2 mask-half-1 bg-yellow-400"
                                                            value={star - 0.5}
                                                            checked={star - 0.5 === recStar}
                                                            disabled
                                                        />
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            className="mask mask-star-2 mask-half-2 bg-yellow-400"
                                                            value={star}
                                                            checked={star === recStar}
                                                            disabled
                                                        />
                                                    </React.Fragment>
                                                ))}



                                            </div>

                                            <span className="text-gray-400 text-sm sm:text-base ml-2">(123 recensioni)</span>
                                        </div>

                                        <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">
                                            {product.description || "Descrizione del prodotto non disponibile."}
                                        </p>

                                        <div className="flex items-center mb-4 sm:mb-6">
                                            <span className="text-white text-3xl sm:text-4xl font-bold">€{product.price}</span>
                                            <span className="text-gray-400 text-sm sm:text-lg ml-2">(IVA inclusa)</span>
                                        </div>

                                        <div className="flex flex-col space-y-3 sm:space-y-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-full text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                Acquista ora
                                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline w-full text-sm sm:text-base text-white border-blue-500 hover:bg-blue-500 hover:text-white transform transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                Aggiungi al carrello
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body col-span-2 pt-4 sm:pt-8">
                                    <div className="bg-[#2A3447] p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                                        <h2 className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Dettagli del prodotto</h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="text-gray-300 text-sm sm:text-base">
                                                <p><strong>Marca:</strong> {product.username || "N/A"}</p>
                                                <p><strong>Disponibilità:</strong> {product.quantity > 0 ? "In stock" : "Esaurito"}</p>
                                            </div>
                                            <div className="text-gray-300 text-sm sm:text-base">
                                                <p><strong>Spedizione:</strong> Consegna in 2-3 giorni lavorativi</p>
                                                <p><strong>Garanzia:</strong> 2 anni</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                            <div className="card-body space-y-4 pt-4 sm:pt-8">
                                <div className="space-y-6 sm:space-y-8">
                                    <h2 className="text-2xl sm:text-3xl sm:text-left text-center font-bold text-white mb-4 sm:mb-6">Recensioni dei clienti</h2>

                                    <div className="bg-[#2A3447] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                        <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Scrivi una recensione</h3>
                                        <form className="space-y-3 sm:space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                <span className="text-gray-400 text-sm sm:text-base">Valutazione:</span>
                                                <div className="rating rating-sm rating-half sm:rating-md">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <>
                                                            <input
                                                                key={star}
                                                                type="radio"
                                                                name="rating"
                                                                className="mask mask-star-2 mask-half-1 bg-yellow-400"
                                                                onChange={() => setSelectedRating(star)}
                                                            />
                                                            <input
                                                                key={star}
                                                                type="radio"
                                                                name="rating"
                                                                className="mask mask-star-2 mask-half-2 bg-yellow-400"
                                                                onChange={() => setSelectedRating(star + 0.5)}
                                                            />
                                                        </>

                                                    ))}
                                                </div>
                                            </div>
                                            <textarea
                                                className="textarea w-full text-sm sm:text-base bg-[#1E2633] border border-blue-900/30 text-white"
                                                placeholder="Condividi la tua esperienza..."
                                                rows="3"
                                            ></textarea>
                                            <button
                                                type="submit"
                                                className="btn btn-sm sm:btn-md bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                Invia recensione
                                            </button>
                                        </form>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        {comments.length === 0 ? (
                                            <div className="bg-[#2A3447] p-4 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                                <div className="w-full text-center py-4 sm:py-6">
                                                    <p className="text-gray-400 text-base sm:text-lg">Nessuna recensione ancora...</p>
                                                </div>
                                            </div>
                                        ) : (
                                            comments.map((comment, index) => (
                                                <div key={index} className="bg-[#2A3447] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-yellow-400 text-base sm:text-lg">
                                                                {Array.from({ length: 5 }, (_, i) => (
                                                                    <span key={i} className={i < comment.star ? 'text-yellow-400' : 'text-gray-600'}>
                                                                        ★
                                                                    </span>
                                                                ))}
                                                            </span>
                                                            <span className="text-gray-400 text-xs sm:text-sm">• {new Date().toLocaleDateString()}</span>
                                                        </div>
                                                        <span className="text-blue-400 text-xs sm:text-sm">{comment.anon ? ("utente anonimo") : (comment.user)}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm sm:text-base">{comment.description}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;