import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import TopBar from "../../navbar/topbar";
import { loadStripe } from "@stripe/stripe-js";


function PreWeeder() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
            <TopBar />
            <div className="hero pt-32">
                <div className="hero-content flex-col lg:flex-row">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                        className="max-w-m rounded-lg shadow-2xl" />
                    <div className="">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">Become a Weeder!</h1>
                        <p className="py-6 text-gray-400">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        <button className="btn btn-primary">Become a weeder</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreWeeder;