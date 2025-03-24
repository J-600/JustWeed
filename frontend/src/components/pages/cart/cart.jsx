import { useEffect, useState } from 'react';
import TopBar from "../../navbar/topbar";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import Loader from "../../loader/loader";

const CartPage = () => {
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/view-cart", {
        credentials: "include"
      })

      if (!res.ok) {
        navigate("/")
        return
      }

      const data = await res.json()
      setCartItems(data)
    }
    catch (error) {
      console.error("Errore durante la richiesta:", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);


  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveItem = async(itemId) => {

    try {
      const res = await fetch("http://localhost:3000/update-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          qnt: 0,
          del: 0
        }),
        credentials: "include"
      })

      if (!res.ok)
        throw new Error("Errore nella modifica")

      const data = await res.json();
      console.log(data)

      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

    } catch (error) {
      setErrorMessage(error.message);
    }
    
  };

  const handleIncrement = async (itemId) => {
    try {
      const itemCart = cartItems.find(item => item.id === itemId);
      const qnt = itemCart.quantity + 1

      const res = await fetch("http://localhost:3000/update-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          qnt: qnt,
          del: 1
        }),
        credentials: "include"
      })

      if (!res.ok)
        throw new Error("Errore nella modifica")

      const data = await res.json();
      console.log(data)

      setCartItems(prevItems => prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDecrement = async (itemId) => {

    try {
      const itemCart = cartItems.find(item => item.id === itemId);
      const qnt = itemCart.quantity - 1

      const res = await fetch("http://localhost:3000/update-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          qnt: qnt,
          del: 1
        }),
        credentials: "include"
      })

      if (!res.ok)
        throw new Error("Errore nella modifica")

      const data = await res.json();
      console.log(data)

      setCartItems(prevItems => prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      ));
    } catch (error) {
      setErrorMessage(error.message);
    }
    
  };

  const handleQuantityChange = async(itemId, newValue) => {
    const numericValue = newValue.replace(/[^0-9]/g, '');
    const quantity = Math.max(1, Number(numericValue));

    if (!isNaN(quantity)) {
      try {
        const res = await fetch("http://localhost:3000/update-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: itemId,
            qnt: quantity,
            del: 1
          }),
          credentials: "include"
        })
  
        if (!res.ok)
          throw new Error("Errore nella modifica")
  
        const data = await res.json();
        console.log(data)
  
        setCartItems(prevItems => prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        ));
        
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setInputError(false);
      }
    } else {
      setInputError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
      <TopBar />

      <div className="w-full px-4 sm:px-8 pt-20 pb-14">

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
              Carrello
              <ShoppingCart className="inline-block ml-2 mb-2 w-8 h-8 text-purple-500" />
              <span className="text-xl text-gray-400 block mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'articolo' : 'articoli'}
              </span>
            </h1>

            <div className="hidden sm:block">
              <span className="badge badge-lg bg-[#2A3447] border border-blue-900/30 text-blue-400">
                Prezzo
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3">
                <Loader />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="lg:col-span-3 flex justify-center">
                <div className="card bg-[#1E2633] border border-blue-900/30 w-full">
                  <div className="card-body items-center text-center py-16">
                    <h2 className="text-2xl text-gray-400 mb-4">Il tuo carrello è vuoto</h2>
                    <Link
                      to="/"
                      className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
                    >
                      Continua gli acquisti
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 space-y-6">
                {
                  cartItems.map((item) => (
                    <div key={item.id} className="card bg-[#1E2633] border border-blue-900/30 group">
                      <div className="card-body">
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="relative w-full sm:w-48 flex-shrink-0">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-32 sm:h-48 object-cover rounded-xl border border-blue-900/30"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl text-white font-semibold hover:text-blue-400 transition-colors">
                                  <Link to={`/product?id=${item.id}`}>{item.name}</Link>
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">Venduto da: {item.seller}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-500/10 transition-colors"
                              >
                                <X size={20} />
                              </button>
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDecrement(item.id)}
                                  className="btn btn-sm btn-square bg-[#2A3447] border border-blue-900/30 text-white hover:bg-blue-500 disabled:opacity-50"
                                  disabled={item.quantity === 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                                      e.preventDefault();
                                      setInputError(true);
                                    }
                                  }}
                                  min="1"
                                  className="input input-sm w-20 text-center bg-[#2A3447] border border-blue-900/30 text-white focus:border-blue-500"
                                />
                                <button
                                  onClick={() => handleIncrement(item.id)}
                                  className="btn btn-sm btn-square bg-[#2A3447] border border-blue-900/30 text-white hover:bg-blue-500"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                  €{(item.price * item.quantity).toFixed(2)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-sm text-gray-400 mt-1">
                                    {item.quantity} × €{item.price.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>

            )}


            {cartItems.length > 0 && (
              <div className="card bg-[#1E2633] border border-blue-900/30 h-fit lg:sticky lg:top-20">
                <div className="card-body">
                  <h2 className="text-2xl font-bold text-white mb-4">Riepilogo ordine</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotale:</span>
                      <span className="text-white">€{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Spedizione:</span>
                      <span className="text-white">€0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tasse:</span>
                      <span className="text-white">€{(total * 0.22).toFixed(2)}</span>
                    </div>
                    <div className="divider my-4 border-blue-900/30"></div>
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Totale:</span>
                      <span className="text-white">€{(total * 1.22).toFixed(2)}</span>
                    </div>

                    <button className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 mt-6">
                      Procedi all'acquisto
                    </button>

                    <Link
                      to="/"
                      className="btn btn-outline w-full text-white border-blue-500 hover:bg-blue-500 hover:text-white mt-2"
                    >
                      Continua gli acquisti
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;