import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { AlertCircle, ArrowRight } from 'lucide-react';
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
// import { set } from "mongoose";

function Product() {
    // const location = useLocation();
    // const params = new URLSearchParams(location.search);
    const { id } = useParams()
    const [product, setProduct] = useState([])
    const [comments, setComments] = useState([])
    const [reviewTitle, setReviewTitle] = useState([])
    const [cartSuccess, setCartSuccess] = useState("");
    const [cartError, setCartError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectRating, setSelectedRating] = useState(5)
    const [selectComment, setSelectComment] = useState('');
    const [recStar, setRecStar] = useState(0.5)
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const navigate = useNavigate();

    function updateRating(comments) {
        const somma = comments.reduce((acc, commento) => acc + commento.star, 0);
        const media = somma / comments.length;
        const mediaArrotondata = Math.round(media * 2) / 2;
        setRecStar(mediaArrotondata);
    }
    const triggerUploadCart = () => {
        window.dispatchEvent(new Event("triggerUploadCart"));
    };


    const handleAddToCart = async (productId) => {
        try {
            const res = await fetch("http://localhost:3000/api/products/insert-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product: productId,
                    qnt: 1
                }),
                credentials: "include"
            })
            const data = await res.json();
            // console.log(data,res)
            if (res.status !== 200) {
                setCartError("prodotto non aggiunto");
                return;
            }



            setCartSuccess(data);
            setTimeout(() => setCartSuccess(""), 3000);
            setCartError("");

            triggerUploadCart()
        }
        catch (error) {
            console.error("Errore durante la richiesta:", error);
            setCartError("An error occurred. Please try again.");
            setTimeout(() => setCartError(""), 3000);
        }
    };


    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const [productRes, tagsRes, commentsRes] = await Promise.all([fetch("http://localhost:3000/api/products/product", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id
                    }),
                    credentials: "include"
                }), fetch("http://localhost:3000/api/products/tag", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id
                    }),
                    credentials: "include"
                }), fetch("http://localhost:3000/api/products/comments", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id
                    }),
                    credentials: "include"
                })
                ]);
                if (!productRes.ok || !tagsRes.ok || !commentsRes.ok) {
                    navigate("/");
                    return;
                }


                const productData = await productRes.json();

                const tagsData = await tagsRes.json();
                const commentsData = await commentsRes.json();


                setProduct(productData)
                setComments(commentsData)
                setTags(tagsData)
                updateRating(commentsData)


            }
            catch (error) {
                console.error("Errore durante la richiesta:", error);
            } finally {
                setLoadingComments(false)
                setLoading(false)
            }
        }
        fetchProduct();

    }, [])

    const handleAddComment = async (e) => {
        e.preventDefault();
        console.log(selectRating, selectComment, isAnonymous);

        try {
            const response = await fetch("http://localhost:3000/api/products/add-comment", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    title: reviewTitle,
                    user: isAnonymous,
                    comment: selectComment,
                    star: selectRating
                }),
                credentials: "include"
            });


            if (response.ok) {
                const data = await response.json()
                setErrorMessage("");
                setSuccessMessage(data);
                setSelectComment("");
                setReviewTitle("");
                setTimeout(() => setSuccessMessage(""), 3000);
                setLoadingComments(true)
                const commentsRes = await fetch("http://localhost:3000/api/products/comments", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                    credentials: "include"
                });
                const commentsData = await commentsRes.json();
                setComments(commentsData);
                setLoadingComments(false)
                updateRating(commentsData)
            }

        } catch (error) {
            console.error("Errore durante l'invio del commento:", error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
            <TopBar />
            <div className="w-full px-2 sm:px-4 pt-20 pb-14">
                <div className="card bg-base-200 shadow-2xl border border-blue-900/30">
                    <div className="card-body space-y-4">
                        {cartSuccess && (
                            <div className="alert alert-success shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{cartSuccess}</span>
                            </div>
                        )}

                        {cartError && (
                            <div className="alert alert-error shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{cartError}</span>
                            </div>
                        )}
                        {loading ? (
                            <Loader />
                        ) : product.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-card-base-100 rounded-xl border border-red-900/30 text-center">
                                <svg
                                    className="w-12 h-12 text-red-400 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <h3 className="text-xl font-bold text-red-400 mb-2">Prodotto non disponibile</h3>
                                <p className="text-gray-400 mb-4">Questo articolo non è più disponibile per l'acquisto</p>
                                <Link
                                    to="/products"
                                    className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16m-7 6h7"
                                        />
                                    </svg>
                                    Vedi altri prodotti
                                </Link>
                            </div>
                        ) : (
                            <React.Fragment>
                                <div key={product.id} className="card bg-base-200 shadow-2xl border border-blue-900/30">
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
                                                                className="mask mask-star-2 mask-half-1 bg-yellow-400 cursor-default"
                                                                value={star - 0.5}
                                                                checked={star - 0.5 === recStar}
                                                                disabled
                                                            />
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                className="mask mask-star-2 mask-half-2 bg-yellow-400 cursor-default"
                                                                value={star}
                                                                checked={star === recStar}
                                                                disabled
                                                            />
                                                        </React.Fragment>
                                                    ))}



                                                </div>

                                                <span className="text-gray-400 text-sm sm:text-base ml-2">{
                                                    comments.length === 0 ? (
                                                        <p>Nessun commento</p>
                                                    ) : comments.length === 1 && comments[0].description === "" ? (
                                                        <p>Non ci sono recensioni</p>
                                                    ) : comments.length === 1 ? (
                                                        <p> ({comments.length} recensione)</p>
                                                    ) : (
                                                        <p> ({comments.length} recensioni)</p>
                                                    )
                                                }</span>
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
                                                    onClick={() => navigate("/homepage/products/checkout/"+product.id)}
                                                    className="btn btn-primary w-full text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-[1.02]"
                                                >
                                                    Acquista ora
                                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                                                </button>
                                                <button
                                                    onClick={() => handleAddToCart(product.id)}
                                                    type="button"
                                                    className="btn btn-outline w-full text-sm sm:text-base text-white border-blue-500 hover:bg-blue-500 hover:text-white transform transition-all duration-300 hover:scale-[1.02]"
                                                >
                                                    Aggiungi al carrello
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body col-span-2 pt-4 sm:pt-8">
                                        <div className="bg-card-base-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
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


                                <div className="card bg-base-200 shadow-2xl border border-blue-900/30">
                                    <div className="card-body space-y-4 pt-4 sm:pt-8">
                                        <div className="space-y-6 sm:space-y-8">
                                            <h2 className="text-2xl sm:text-3xl sm:text-left text-center font-bold text-white mb-4 sm:mb-6">Recensioni dei clienti</h2>
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

                                            <div className="bg-card-base-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                                <h3 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Scrivi una recensione</h3>
                                                <form onSubmit={handleAddComment} className="space-y-3 sm:space-y-4">

                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                        <span className="text-gray-400 text-sm sm:text-base">Valutazione:</span>
                                                        <div className="rating rating-sm rating-half sm:rating-md">
                                                            
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <React.Fragment key = { 10 +star}>
                                                                    <input
                                                                        // key={10 + star}
                                                                        type="radio"
                                                                        name="rating"
                                                                        className="mask mask-star-2 mask-half-1 bg-yellow-400"
                                                                        onChange={() => setSelectedRating(star - 0.5)}
                                                                        aria-label= {star - 0.5}
                                                                    />
                                                                    <input
                                                                        // key={10 + star + 0.5}
                                                                        type="radio"
                                                                        name="rating"
                                                                        className="mask mask-star-2 mask-half-2 bg-yellow-400"
                                                                        onChange={() => setSelectedRating(star)}
                                                                        aria-label= {star}
                                                                    />
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="text-gray-400 text-sm sm:text-base">Recensione: </span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Aggiungi un titolo..."
                                                            className="input input-bordered w-full bg-base-200 border border-blue-900/30 text-white focus:border-blue-500"
                                                            value={reviewTitle}
                                                            onChange={(e) => setReviewTitle(e.target.value)}
                                                        />
                                                    </div>
                                                    <textarea
                                                        required
                                                        className="textarea w-full text-sm sm:text-base bg-base-200 border border-blue-900/30 text-white mb-4"
                                                        placeholder="Condividi la tua esperienza..."
                                                        value={selectComment}
                                                        onChange={(e) => setSelectComment(e.target.value)}
                                                        rows="3" />


                                                    <div className="flex items-center justify-end space-x-3">
                                                        <label className="text-gray-300 text-sm sm:text-base cursor-pointer">
                                                            Invia come anonimo
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            className="toggle toggle-md checked:[--tglbg:theme(colors.blue.500)] 
                                                                checked:bg-gradient-to-r from-blue-500 to-purple-600
                                                                border-blue-900/30 bg-base-200"
                                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="btn btn-sm sm:btn-md bg-gradient-to-r from-blue-500 to-purple-600 
                                                            text-white border-none hover:from-blue-600 hover:to-purple-700 
                                                            transform transition-all duration-300 hover:scale-[1.02]"
                                                    >
                                                        Invia recensione
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="space-y-4 sm:space-y-6">
                                                {loadingComments ? (
                                                    <div className="bg-card-base-100 p-4 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                                        <div className="w-full text-center py-4 sm:py-6">
                                                            <Loader />
                                                        </div>
                                                    </div>
                                                ) : comments.length === 0 ?
                                                    (
                                                        <div className="bg-card-base-100 p-4 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                                            <div className="w-full text-center py-4 sm:py-6">
                                                                <p className="text-gray-400 text-base sm:text-lg">Nessuna recensione ancora...</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        comments.map((comment, index) => (
                                                            <div key={index} className="bg-card-base-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="pl-2 sm:pl-3 text-white text-sm font-bold sm:text-lg">{comment.user} </span>
                                                                        <span className="text-yellow-400 text-base sm:text-lg">
                                                                            {Array.from({ length: 5 }, (_, i) => {
                                                                                const fullStars = Math.floor(comment.star);
                                                                                const hasHalfStar = comment.star % 1 >= 0.5;

                                                                                return (
                                                                                    <span key={i} className="relative inline-block">
                                                                                        <span className="text-gray-600">★</span>
                                                                                        <span className={`absolute left-0 top-0 overflow-hidden ${i < fullStars ? 'w-full' : hasHalfStar && i === fullStars ? 'w-1/2' : 'w-0'}`}>
                                                                                            <span className="text-yellow-400">★</span>
                                                                                        </span>
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </span>
                                                                        <span className="text-gray-400 text-xs sm:text-sm">• {new Date(comment.date).toLocaleDateString()}</span>
                                                                    </div>

                                                                </div>
                                                                <div className="bg-card-base-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-900/30">
                                                                    <h4 className="text-lg font-bold text-white mb-2">{comment.title}</h4>
                                                                    <p className="text-gray-300">{comment.description}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;