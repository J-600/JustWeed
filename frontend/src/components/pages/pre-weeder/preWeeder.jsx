import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import TopBar from "../../navbar/topbar";
import { loadStripe } from "@stripe/stripe-js";


function PreWeeder() {

    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
            <TopBar />
            <div className="hero pt-32 justify-center items-center">
                <div className="hero-content flex-col lg:flex-row ">
                    <img
                        src="caps.jpg"
                        alt="caps"
                        className="w-[22em] h-[28em] object-cover rounded-lg shadow-2xl" />
                    <div className="">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">Become a Weeder!</h1>
                        <p className="py-6 text-gray-400">
                            Ciao! Se stai cercando nuove opportunità di collaborazione nel mondo dei prodotti legali, JustWeed è il partner ideale per te. Diventando nostro collaboratore, avrai l'opportunità di entrare a far parte di un settore in crescita, con un prodotto sicuro e legale, che risponde a una domanda sempre più alta. Offriamo un supporto completo per aiutarti a iniziare la tua attività, con un sistema di vendita semplice e vantaggioso. Con JustWeed, potrai accedere a una rete consolidata, a margini competitivi e a risorse per la tua crescita professionale. Se sei pronto a entrare nel mercato con noi, unisciti a JustWeed e inizia a vendere subito!
                        </p>
                        <button
                            className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                            onClick={() => navigate("/weeder")}
                        >
                            Diventa uno Weeder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreWeeder;