import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Edit, User, CreditCard, MapPin, Trash2, Building2, Hash, Pencil, ChevronDown, Plus, Calendar } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";


const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fff',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
};

function Weeder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
      <TopBar />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30 w-full max-w-none md:w-full md:mx-auto">
          <div className="card-body space-y-6 px-4 md:px-6">
            <div className="flex justify-center">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl text-center font-bold mt-4">
                Become a Weeder
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              <div className="rounded-xl border border-blue-900/30 md:p-6 p-3 shadow-lg">
                <h1 className="card-title text-2xl text-blue-200 justify-center pb-6">Dati personali</h1>

                <div className="grid xl:grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-2 grid-cols-1">
                  <label className="input input-bordered flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70">
                      <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" className="grow" placeholder="First name * " required />
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70">
                      <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" className="grow" placeholder="Second name * " required />
                  </label>
                  <textarea className="textarea textarea-bordered col-span-2" rows="1" placeholder="Bio"></textarea>
                </div>

              </div>
              <div className="rounded-xl border border-blue-900/30 md:p-6 p-3 shadow-lg">
                <h1 className="card-title text-2xl text-blue-200 justify-center pb-6">Indirizzo di fatturazione</h1>
                <div className="grid xl:grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-2 grid-cols-1">
                  <label className="input input-bordered flex items-center gap-2">
                    <MapPin className="w-4 h-4 opacity-70" />
                    <input type="text" className="grow" placeholder="Indirizzo *" required />
                  </label>

                  <label className="input input-bordered flex items-center gap-2">
                    <Hash className="w-4 h-4 opacity-70" />
                    <input type="text" className="grow" placeholder="Cap *" required />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 col-span-2">

                    <Building2 className="w-4 h-4 opacity-70" />
                    <input type="text" className="grow" placeholder="Città *" required />
                  </label>
                </div>
              </div>
              <div className="rounded-xl border border-blue-900/30 md:p-6 p-3 shadow-lg">
                <h1 className="card-title text-2xl text-blue-200 justify-center pb-6">Metodo di fatturazione</h1>
                <div className="grid xl:grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-2 grid-cols-1">
                {/* <label className="block text-sm font-medium text-blue-400 mb-4">Carta di Credito</label> */}
                        <div className="p-4 bg-[#1E2633] rounded-lg border border-blue-900/30 col-span-2">
                          <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weeder;