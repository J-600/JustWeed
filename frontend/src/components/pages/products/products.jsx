import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import styles from "../../styles/products.module.css";

function Products() {
  const location = useLocation();
  const { email, username } = location.state || {};
  const [products, setProducts] = useState([]);
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
      } catch (error) {
        console.error("Errore durante la richiesta:", error);
      }
    };
    fetchProduct();
  }, []);

  const convertBlobToImageUrl = (blobData) => {
    if (!blobData) return "https://via.placeholder.com/150";

    try {
      const byteCharacters = atob(blobData);
      const byteNumbers = new Uint8Array(byteCharacters.length).map((_, i) =>
        byteCharacters.charCodeAt(i)
      );
      const blob = new Blob([byteNumbers], { type: "image/png" });

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Errore nella conversione del Blob:", error);
      return "https://via.placeholder.com/150";
    }
  };

  return (
    <div className={styles.page}>
      <TopBar username={username} email={email} />
      <div className={`${styles.main} flex flex-col min-h-screen overflow-y-auto`}>
        <div className="px-6 pt-[6em] pb-8">
          <label className="input input-bordered input-info sticky flex items-center gap-2 w-[37.5%] rounded-[1em] border-[rgb(121,169,236)] border-[0.05em]">
            <input
              type="text"
              className="grow bg-transparent focus:outline-none"
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

        <div className="px-6 pb-[5em] flex-1 overflow-y-auto">
          {Array.isArray(products) && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pr-[4.2em]">
              {products.map((product, index) => (
                <div key={index} className="card card-compact bg-base-100 shadow-xl h-full flex flex-col">
                  <figure>
                    <img
                      src={product.img || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </figure>
                  <div className="card-body flex flex-col flex-1">
                    <h2 className="card-title">{product.name}</h2>
                    <p>{product.description}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h2>{products?.data}</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
