import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import { Plus, Minus, X, ShoppingCart, CreditCard, Home, Truck } from 'lucide-react';

const CheckoutPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productRes = await fetch("http://localhost:3000/api/products/product", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                    credentials: "include"
                });

                if (!productRes.ok) {
                    navigate("/");
                    return;
                }
                const productData = await productRes.json();
                setProduct(productData);

                const [cardsRes, addressesRes] = await Promise.all([
                    fetch("http://localhost:3000/api/user/cardsdata", {
                        credentials: "include"
                    }),
                    fetch("http://localhost:3000/api/user/addresses", {
                        credentials: "include"
                    })
                ]);

                const cardsData = await cardsRes.json();
                const addressesData = await addressesRes.json();

                if (cardsRes.status === 200) setCards(cardsData);
                if (addressesRes.status === 200) setAddresses(addressesData);

            } catch (error) {
                console.error("Errore durante il fetch dei dati:", error);
                setErrorMessage("Si è verificato un errore durante il caricamento dei dati");
            } finally {
                setLoading(false);
                setLoadingData(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleQuantityChange = (value) => {
        const newQuantity = Math.max(1, parseInt(value) || 1);
        setQuantity(newQuantity);
    };

    const total = product ? (product.price * quantity).toFixed(2) : 0;

    const handleCheckout = async () => {

        
        try {
            const res = await fetch("http://localhost:3000/api/user/buy", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    productId: id,
                    quantity: quantity,
                    address: selectedAddress,
                    card: selectedCard
                }),
                credentials: "include"
            })

            const data = res.json();

            if(!res.ok)
                throw new Error(data)

            // navigate("/homepage/products/track/" + id)

        } catch (error) {
            console.error("Errore durante il fetch dei dati:", error);
            setErrorMessage("Si è verificato un errore durante il caricamento dei dati");
        } finally {
            setLoading(false);
            setLoadingData(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
            <TopBar />

            <div className="w-full px-4 sm:px-8 pt-20 pb-14">
                {
                    loading ? (<div className="flex items-center justify-center">
                        <Loader />
                    </div>) :
                        (
                            <div className="max-w-7xl mx-auto">
                                {errorMessage && (
                                    <div className="alert alert-error shadow-lg mb-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="flex items-end justify-between mb-8 pb-4 border-b border-blue-900/30">
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                        Checkout
                                        <ShoppingCart className="inline-block ml-2 mb-2 w-8 h-8 text-purple-500" />
                                    </h1>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="card bg-base-200 border border-blue-900/30">
                                            <div className="card-body">
                                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                                    <Home size={24} className="text-blue-400" />
                                                    Indirizzo di spedizione
                                                </h2>

                                                {loadingData ? (
                                                    <Loader />
                                                ) : addresses.length === 0 ? (
                                                    <div className="text-center py-4">
                                                        <p className="text-gray-400 mb-4">Nessun indirizzo salvato</p>
                                                        <Link to="/profile" className="btn btn-outline btn-sm text-white">
                                                            Aggiungi indirizzo
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="grid gap-4">
                                                        {addresses.map((address) => (
                                                            <div
                                                                key={address.id}
                                                                onClick={() => setSelectedAddress(address.id)}
                                                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddress === address.id
                                                                    ? 'border-blue-500 bg-blue-500/10'
                                                                    : 'border-blue-900/30 hover:border-blue-500'
                                                                    }`}
                                                            >
                                                                <p className="font-semibold text-white">{address.name}</p>
                                                                <p className="text-gray-400">{address.street}</p>
                                                                <p className="text-gray-400">{address.city}, {address.zip}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card bg-base-200 border border-blue-900/30">
                                            <div className="card-body">
                                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                                    <CreditCard size={24} className="text-blue-400" />
                                                    Metodo di pagamento
                                                </h2>

                                                {loadingData ? (
                                                    <Loader />
                                                ) : cards.length === 0 ? (
                                                    <div className="text-center py-4">
                                                        <p className="text-gray-400 mb-4">Nessuna carta salvata</p>
                                                        <Link to="/profile" className="btn btn-outline btn-sm text-white">
                                                            Aggiungi carta
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="grid gap-4">
                                                        {cards.map((card) => (
                                                            <div
                                                                key={card.id}
                                                                onClick={() => setSelectedCard(card.id)}
                                                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedCard === card.id
                                                                    ? 'border-blue-500 bg-blue-500/10'
                                                                    : 'border-blue-900/30 hover:border-blue-500'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-semibold text-white">•••• •••• •••• {card.numero}</p>
                                                                        <p className="text-gray-400">{card.nome_titolare}</p>
                                                                    </div>
                                                                    <span className="text-gray-400">{card.scadenza}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-base-200 border border-blue-900/30 h-fit lg:sticky lg:top-20">
                                        <div className="card-body">
                                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                                <Truck size={24} className="text-blue-400" />
                                                Riepilogo ordine
                                            </h2>

                                            {product && (
                                                <div className="flex flex-col gap-4 mb-6">
                                                    <div className="flex items-start gap-4">
                                                        <img
                                                            src={product.img}
                                                            alt={product.name}
                                                            className="w-20 h-20 object-cover rounded-lg border border-blue-900/30"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="text-white font-semibold">{product.name}</h3>
                                                            <p className="text-gray-400 text-sm">Venduto da: {product.seller}</p>

                                                            <div className="flex items-center gap-2 mt-2">
                                                                <button
                                                                    onClick={() => handleQuantityChange(quantity - 1)}
                                                                    className="btn btn-xs btn-square bg-card-base-100 border border-blue-900/30 text-white"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                                <input
                                                                    type="text"
                                                                    value={quantity}
                                                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                                                    className="input input-xs w-12 text-center bg-card-base-100 border border-blue-900/30 text-white"
                                                                />
                                                                <button
                                                                    onClick={() => handleQuantityChange(quantity + 1)}
                                                                    className="btn btn-xs btn-square bg-card-base-100 border border-blue-900/30 text-white"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-lg font-bold text-white">
                                                            €{(product.price * quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Subtotale:</span>
                                                    <span className="text-white">€{total}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Spedizione:</span>
                                                    <span className="text-white">€0.00</span>
                                                </div>
                                                <div className="h-px w-full rounded-full bg-blue-900/50 my-4"></div>

                                                <div className="flex justify-between text-xl font-bold">
                                                    <span className="text-white">Totale:</span>
                                                    <span className="text-white">€{total}</span>
                                                </div>

                                                <button
                                                    onClick={handleCheckout}
                                                    disabled={!selectedAddress || !selectedCard}
                                                    className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                                                >
                                                    Conferma acquisto
                                                </button>

                                                <Link
                                                    to="/"
                                                    className="btn btn-outline w-full text-white border-blue-500 hover:bg-blue-500 hover:text-white"
                                                >
                                                    Continua gli acquisti
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                }

            </div>
        </div>
    );
};

export default CheckoutPage;