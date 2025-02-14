import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import DatePicker from "react-datepicker";

function Products() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recenti");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { email, username } = location.state || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:3000/products", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.status !== 200) {
          navigate("/");
        }
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Errore durante la richiesta:", error);
      }
    };
    fetchProduct();
  }, []);

  const handleTagToggle = (tag) => {
    const newTags = new Set(selectedTags);
    newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
    setSelectedTags(newTags);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
      <TopBar username={username} email={email} />
      <div className="flex-grow flex flex-col items-center p-6 pt-[6em]">
        <div className="relative group max-w-2xl mx-auto w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient " />

          <div className="relative flex items-center bg-[#1E2633] rounded-lg border border-blue-900/30">
            <input
              type="text"
              placeholder="Cerca ordini..."
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
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Ordina per</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSortOrder("recenti")}
                      className={`w-full text-left px-3 py-2 rounded-md ${sortOrder === "recenti"
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'hover:bg-blue-900/20 text-gray-300'
                        }`}
                    >
                      Più recenti
                    </button>
                    <button
                      onClick={() => setSortOrder("vecchi")}
                      className={`w-full text-left px-3 py-2 rounded-md ${sortOrder === "vecchi"
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'hover:bg-blue-900/20 text-gray-300'
                        }`}
                    >
                      Più vecchi
                    </button>
                  </div>
                </div>
                <div className="border-t border-blue-900/30 pt-4">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Intervallo date</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Da</label>
                      <DatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        className="w-full bg-[#1E2633] rounded-md px-3 py-2 text-white border border-blue-900/30"
                        placeholderText="Seleziona data"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">A</label>
                      <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        className="w-full bg-[#1E2633] rounded-md px-3 py-2 text-white border border-blue-900/30"
                        placeholderText="Seleziona data"
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-900/30 pt-4">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Stato ordine</h3>
                  <div className="space-y-2">
                    {["Consegnato", "In elaborazione", "Spedito"].map((tag) => (
                      <label key={tag} className="flex items-center space-x-2 text-gray-300 hover:bg-blue-900/20 p-2 rounded-md">
                        <input
                          type="checkbox"
                          checked={selectedTags.has(tag)}
                          onChange={() => handleTagToggle(tag)}
                          className="checkbox checkbox-xs bg-[#1E2633] border-blue-900/30 checked:bg-purple-500"
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
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
          ) : Array.isArray(products) && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="card bg-[#1E2633] shadow-2xl border border-blue-900/30 transform transition-all duration-500 hover:scale-105"
                >
                  <figure className="px-4 pt-4">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-white">{product.name}</h2>
                    <p className="text-gray-400">{product.description}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h2 className="text-white text-center">{products?.data}</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;