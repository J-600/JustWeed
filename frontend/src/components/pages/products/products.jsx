import React, { useEffect, useState } from "react";
// import { Dialog } from '@headlessui/react';
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";

function Products() {
  const location = useLocation();
  // const [uploadCartFunction, setUploadCartFunction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [availableTags, setAvailableTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { email, username } = location.state || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const triggerUploadCart = () => {
    window.dispatchEvent(new Event("triggerUploadCart"));
  };

  // const openQuickView = (product) => {
  //   setSelectedProduct(product);
  // };

  // const closeQuickView = () => {
  //   setSelectedProduct(null);
  // };

  useEffect(() => {
    const fetchProductsAndTags = async () => {
      try {
        const [productsRes, tagsRes] = await Promise.all([
          fetch("http://localhost:3000/api/products/products", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/products/view-tags", {
            method: "GET",
            credentials: "include",
          })
        ]);
        console.log(productsRes, tagsRes)

        if (!productsRes.ok || !tagsRes.ok) {
          navigate("/");
          return;
        }

        const productsData = await productsRes.json();
        const tagsData = await tagsRes.json();

        console.log(productsData, tagsData)

        if (tagsData.length > 0) {
          const productsWithTags = productsData.map(product => ({
            ...product,
            tags: tagsData
              .filter(tag => tag.prodotto === product.id)
              .map(tag => tag.tag)
          }));
          setProducts(productsWithTags);
          setAvailableTags([...new Set(tagsData.map(tag => tag.tag))]);
        } else {
          setProducts(productsData)
        }
        setLoading(false);
      } catch (error) {
        console.error("Errore durante la richiesta:", error);
        navigate("/");
      }
    };

    fetchProductsAndTags();
  }, []);

  const handleTagToggle = (tag) => {
    const newTags = new Set(selectedTags);
    newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
    setSelectedTags(newTags);
  };

  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    const matchesTags = selectedTags.size === 0 ||
      product.tags.some(tag => selectedTags.has(tag));

    return matchesName && matchesMinPrice && matchesMaxPrice && matchesTags;
  });

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
        setErrorMessage("prodotto non aggiunto");
        return;
      }



      setSuccessMessage(data);
      setTimeout(() => setSuccessMessage(""), 3000);
      setErrorMessage("");

      triggerUploadCart()
    }
    catch (error) {
      console.error("Errore durante la richiesta:", error);
      setErrorMessage("An error occurred. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
      <TopBar />
      {successMessage && (
        <div className="sticky top-[2em] z-50 mt-[2em] flex justify-center">
          <div role="alert" className=" flex items-center alert alert-success w-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="sticky top-[2em] z-50 mt-[2em] flex justify-center">
          <div role="alert" className=" flex items-center alert alert-error w-1/2">
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
        </div>
      )}


      <div className="flex-grow flex flex-col items-center p-6 pt-[4em]">

        <div className="relative group max-w-2xl mx-auto w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient" />

          <div className="relative flex items-center bg-base-200 rounded-lg border border-blue-900/30">
            <input
              type="text"
              placeholder="Cerca prodotti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
            />

            <div className="flex items-center pr-2 border-r border-blue-900/30">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
            </div>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-base-300 rounded-lg shadow-xl border border-blue-900/30 p-4 z-50">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Filtra per prezzo</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Prezzo minimo</label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-base-200 rounded-md px-3 py-2 text-white border border-blue-900/30"
                        placeholder="€0.00"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Prezzo massimo</label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-base-200 rounded-md px-3 py-2 text-white border border-blue-900/30"
                        placeholder="€999.99"
                        min="0"
                      />
                    </div>
                  </div>
                </div>


                {availableTags.length > 0 && (
                  <div className="border-t border-blue-900/30 pt-4">
                    <h3 className="text-sm font-semibold text-blue-400 mb-2">Filtra per tag</h3>
                    <div className="space-y-2">
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center space-x-2 text-gray-300 hover:bg-blue-900/20 p-2 rounded-md">
                          <input
                            type="checkbox"
                            checked={selectedTags.has(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="checkbox checkbox-xs bg-base-200 border-blue-900/30 checked:bg-purple-500"
                          />
                          <span className="capitalize">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mx-4 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 pt-20">
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : products.length == 0 ? (<div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 animate-particle-flow">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    transform: `scale(${0.5 + Math.random()})`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 backdrop-blur-xl bg-base-200/90 border-2 border-blue-900/30 rounded-2xl p-12 shadow-2xl transform transition-all hover:scale-[1.03] duration-500">
              <div className="text-center space-y-8 max-w-3xl mx-auto">
                <div className="relative w-fit mx-auto group">
                  <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full animate-pulse-slow" />
                  <div className="absolute inset-0 bg-purple-300/20 blur-[60px] rounded-full" />

                  <div className="relative transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-32 w-32 text-purple-400/90 hover:text-purple-300 transition-all duration-300 animate-float"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ filter: 'drop-shadow(0 8px 12px rgba(168, 85, 247, 0.4))' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        className="stroke-purple-400 group-hover:stroke-purple-200"
                      />

                      <path
                        className="opacity-40 stroke-[1.7] animate-pulse"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3"
                        style={{
                          strokeDasharray: 20,
                          strokeDashoffset: 20,
                          animation: 'draw 1.5s ease-out forwards infinite'
                        }}
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent animate-text-shine">
                    Nuovi Arrivi
                    <br />
                    <span className="text-xl font-medium bg-gradient-to-r from-blue-400/80 to-purple-400/80 bg-clip-text text-transparent">
                      in Preparazione
                    </span>
                  </h1>

                  <p className="text-lg text-gray-300/90 leading-relaxed max-w-2xl mx-auto">
                    Stiamo curando ogni dettaglio per garantirti un'esperienza d'acquisto straordinaria.
                    <span className="block mt-2 text-blue-400/90">Iscriviti per ricevere aggiornamenti esclusivi:</span>
                  </p>
                </div>


                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <input
                    type="email"
                    placeholder="La tua email"
                    className="px-6 py-3 bg-base-200 border-2 border-blue-900/30 rounded-lg text-gray-300 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transform transition-all hover:scale-105 active:scale-95 shadow-lg">
                    Ricevi Aggiornamenti
                  </button>
                </div>

                <div className="relative h-2 bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="absolute inset-0 w-full bg-gradient-to-r from-blue-400 to-purple-500 animate-progress-bar" />
                </div>

                <div className="flex justify-center space-x-6 pt-6">
                  {['twitter', 'instagram', 'facebook'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="p-2 rounded-full bg-base-200 border-2 border-blue-900/30 hover:border-purple-500 text-gray-400 hover:text-purple-400 transition-all"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social === 'twitter' ?
                          "M8.29 20c7.547 0 11.675-6.156 11.675-11.495 0-.175 0-.349-.012-.522A8.265 8.265 0 0022 5.892a8.273 8.273 0 01-2.356.637 4.07 4.07 0 001.804-2.235 8.303 8.303 0 01-2.606.98 4.153 4.153 0 00-5.806-.175 4.006 4.006 0 00-1.187 3.86A11.717 11.717 0 013.393 4.75a4.005 4.005 0 001.27 5.524 4.122 4.122 0 01-1.863-.505v.051c0 1.958 1.415 3.591 3.29 3.963a4.132 4.132 0 01-1.852.069c.522 1.6 2.038 2.765 3.833 2.797a8.315 8.315 0 01-5.158 1.746c-.334 0-.663-.019-.986-.057a11.727 11.727 0 006.289 1.812" :
                          social === 'instagram' ?
                            "M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 00-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" :
                            "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>


            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-20 top-1/3 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
              <div className="absolute right-20 bottom-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-float-reverse" />
            </div>
          </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-base-200 rounded-2xl border border-blue-900/30 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-purple-900/20"
                >
                  <figure
                    className="relative h-60 overflow-hidden rounded-t-2xl cursor-pointer"
                    onClick={() => navigate(`/homepage/products/${product.id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 via-transparent to-transparent z-10" />


                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'placeholder-image.jpg';
                      }}
                    />

                    <button
                      className="absolute bottom-4 right-4 z-20 px-3 py-1.5 bg-base-200/90 text-purple-400 rounded-full text-sm backdrop-blur-sm border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                    >
                      Anteprima
                    </button>
                  </figure>

                  <div className="p-5 space-y-4 relative">
                    <div className="flex flex-wrap gap-2 absolute -top-5 left-4 right-4">
                      {product.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-medium bg-blue-900/40 text-blue-300 rounded-full border border-blue-900/30 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 hover:border-transparent transition-all cursor-help"
                          title={`Filtra per: ${tag}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagToggle(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-xl font-semibold text-white hover:text-purple-300 transition-colors truncate">
                        {product.name}
                      </h2>
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary 
                         bg-clip-text text-transparent">
                        €{product.price.toFixed(2)}
                        {/* <span className="text-xs text-blue-400/80 line-through opacity-70">
                          €{(product.price * 1.2).toFixed(2)}
                        </span> */}
                      </div>


                      <button
                        className="btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105 active:scale-95 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 hover:animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>Aggiungi</span>
                        </span>


                        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
                        <div className="absolute inset-0 scale-0 active:scale-100 opacity-30 bg-white/30 transition-transform duration-200" />
                      </button>
                    </div>

                    <div className="absolute top-2 right-4 flex items-center gap-1 text-xs text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>{product.quantity} disponibili</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/10 rounded-2xl pointer-events-none" />

                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400 font-semibold">
                Nessun prodotto trovato con i filtri selezionati
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="modal modal-open">
          <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}></div>
          <div className="modal-box bg-base-200 border border-primary/30 max-w-2xl p-8 relative dark:bg-slate-900">
            <div className="modal-close absolute right-4 top-4">
              <button
                className="btn btn-circle btn-ghost btn-sm"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <figure className="flex-1 relative">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                  onError={(e) => (e.target.src = 'placeholder-image.jpg')}
                  loading="lazy"
                />
                {!selectedProduct.img && <div className="skeleton h-64 w-full"></div>}
              </figure>

              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-base-content dark:text-white">
                  {selectedProduct.name}
                </h3>

                <p className="text-base-content/70 dark:text-gray-300">
                  {selectedProduct.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="badge badge-outline badge-primary badge-lg opacity-90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    €{selectedProduct.price.toFixed(2)}
                  </div>

                  <button
                    className="btn btn-primary btn-lg shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      handleAddToCart(selectedProduct.id)
                      setSelectedProduct(null)
                    }}
                  >
                    Aggiungi al carrello
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Products;