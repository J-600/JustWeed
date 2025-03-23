import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";

function Products() {
  const location = useLocation();
  const [uploadCartFunction, setUploadCartFunction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    const fetchProductsAndTags = async () => {
      try {
        const [productsRes, tagsRes] = await Promise.all([
          fetch("http://localhost:3000/products", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:3000/view-tags", {
            method: "GET",
            credentials: "include",
          })
        ]);

        if (!productsRes.ok || !tagsRes.ok) {
          navigate("/");
          return;
        }

        const productsData = await productsRes.json();
        const tagsData = await tagsRes.json();

        const productsWithTags = productsData.map(product => ({
          ...product,
          tags: tagsData
            .filter(tag => tag.prodotto === product.id)
            .map(tag => tag.tag)
        }));

        setProducts(productsWithTags);
        setAvailableTags([...new Set(tagsData.map(tag => tag.tag))]);
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
    try{
      const res = await fetch("http://localhost:3000/insert-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productId,
          qnt: 1
        }),
        credentials: "include"
      })
      const data = await res.json();
      console.log(data,res)
      if (res.status !== 200) {
        setErrorMessage("prodotto non aggiunto");
        return;
      }

      

      setSuccessMessage(data);
      setTimeout(() => setSuccessMessage(""), 3000);
      setErrorMessage("");
    }
    catch (error) {
      console.error("Errore durante la richiesta:", error);
      setErrorMessage("An error occurred. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
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

      <div className="flex-grow flex flex-col items-center p-6 pt-[3em]">

        <div className="relative group max-w-2xl mx-auto w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient" />

          <div className="relative flex items-center bg-[#1E2633] rounded-lg border border-blue-900/30">
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
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#2A3444] rounded-lg shadow-xl border border-blue-900/30 p-4 z-50">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Filtra per prezzo</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Prezzo minimo</label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-[#1E2633] rounded-md px-3 py-2 text-white border border-blue-900/30"
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
                        className="w-full bg-[#1E2633] rounded-md px-3 py-2 text-white border border-blue-900/30"
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
                            className="checkbox checkbox-xs bg-[#1E2633] border-blue-900/30 checked:bg-purple-500"
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
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="card bg-[#1E2633] shadow-2xl border border-blue-900/30 transform transition-all duration-500 hover:scale-105"
                >
                  <figure className="px-4 pt-4 cursor-pointer" onClick={() => navigate(`/product?id=${product.id}`)}>
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-white">{product.name}</h2>
                    <p className="text-gray-400">{product.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="badge badge-outline border-blue-900/30 text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="card-actions justify-between items-center mt-4">
                      <div className="text-lg font-bold text-purple-400">
                        €{product.price.toFixed(2)}
                      </div>
                      <button
                        className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Aggiungi al carrello
                      </button>
                    </div>
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
    </div>
  );
}

export default Products;