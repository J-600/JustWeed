import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";

function Product() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const id = params.get("id");
                const res = await fetch("http://localhost:3000/product", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: id
                    }),
                    credentials: "include"
                })
                const data = await res.json();
                if (!res.ok)
                    throw new Error(data);
                setProduct(data[0])
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
            <div className="w-full px-4 pt-20">
                <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
                    <div className="card-body space-y-4">
                        {loading ? (<Loader></Loader>) : (
                            <div
                                key={product.id}
                                className="card bg-[#1E2633] shadow-2xl border border-blue-900/30 ">
                                <div className="grid lg:grid-cols-2 grid-cols-1">
                                    <figure className="px-4 pt-4 pb-4 cursor-pointer">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="w-full h-[28rem] lg:h-[32rem] object-cover rounded-2xl border border-blue-900/30 hover:scale-[1.02] transition-transform duration-300"
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <h1 className="card-title text-white text-6xl ">{product.name}</h1>
                                        <p className="text-gray-400"> venduto da: {product.username}</p>
                                    </div>
                                    <div className="card-body col-span-2 pt-16 ">
                                        <div className="flex justify-center">
                                            <h1 className="card-title text-white text-3xl">€{product.price}</h1>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Product;