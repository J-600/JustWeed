import { useState } from 'react';
import TopBar from "../../navbar/topbar";
import { Link } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";

const CartPage = () => {
  const [inputError, setInputError] = useState(false);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Nome Prodotto 1",
      price: 129.99,
      quantity: 2,
      img: "https://via.placeholder.com/150",
      seller: "Venditore 1"
    },
    {
      id: 2,
      name: "Nome Prodotto 2",
      price: 89.99,
      quantity: 1,
      img: "https://via.placeholder.com/150",
      seller: "Venditore 2"
    }
  ]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Funzioni per gestire le quantità
  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleIncrement = (itemId) => {
    setCartItems(prevItems => prevItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrement = (itemId) => {
    setCartItems(prevItems => prevItems.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleQuantityChange = (itemId, newValue) => {
    const numericValue = newValue.replace(/[^0-9]/g, '');
    const quantity = Math.max(1, Number(numericValue));

    if (!isNaN(quantity)) {
      setCartItems(prevItems => prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
      <TopBar />

      <div className="w-full px-4 sm:px-8 pt-20 pb-14">
        <div className="max-w-7xl mx-auto">
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
            <div className="lg:col-span-2 space-y-6">
              {cartItems.length === 0 ? (
                <div className="card bg-[#1E2633] border border-blue-900/30">
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
              ) : (
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
              )}
            </div>

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