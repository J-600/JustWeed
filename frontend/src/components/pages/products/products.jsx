import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";

function Products() {
  const location = useLocation();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
      {/* TopBar */}
      <TopBar username={username} email={email} />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center p-6 pt-[6em]">
        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-8">
          <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50] border border-blue-900/30 rounded-lg">
            <input
              type="text"
              className="grow text-white placeholder-gray-400 bg-transparent focus:outline-none"
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        {/* Products Grid */}
        <div className="w-full max-w-7xl px-4">
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
                      src={product.img || "https://via.placeholder.com/150"}
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