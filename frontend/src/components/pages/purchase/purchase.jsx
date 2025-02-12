import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import { ShoppingCart, ChevronDown } from "lucide-react";

function Purchase() {
    const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const mockData = [
          {
            id: 1,
            date: "2023-10-15",
            total: 120.50,
            items: [
              { 
                name: "Cuffie Wireless", 
                quantity: 2, 
                price: 30.00, 
                image: "https://via.placeholder.com/100", 
                deliveryDate: "2023-10-20",
                status: "Consegnato"
              },
              { 
                name: "Smartwatch", 
                quantity: 1, 
                price: 60.50, 
                image: "https://via.placeholder.com/100", 
                deliveryDate: "2023-10-18",
                status: "Consegnato"
              },
            ],
          },
          {
            id: 2,
            date: "2023-10-10",
            total: 89.99,
            items: [
              { 
                name: "Tastiera Meccanica", 
                quantity: 1, 
                price: 89.99, 
                image: "https://via.placeholder.com/100", 
                deliveryDate: "2023-10-15",
                status: "In transito"
              },
            ],
          },
        ];
        setPurchases(mockData);
        setSuccessMessage("Acquisti caricati con successo!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage("Errore nel caricamento degli acquisti");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
        <TopBar></TopBar>
      <div className="card-body space-y-4">
        
        <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
          I Tuoi Ordini
        </h2>

        {successMessage && (
          <div className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : purchases.length > 0 ? (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border border-blue-900/30 rounded-lg p-6 bg-[#1E2633]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Ordine effettuato il {new Date(purchase.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400">Totale: <span className="text-white font-bold">€{purchase.total.toFixed(2)}</span></p>
                  </div>
                  <button className="btn btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
                    Acquista di nuovo
                  </button>
                </div>

                <div className="space-y-4">
                  {purchase.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 border-b border-blue-900/30 pb-4 last:border-b-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="text-sm text-gray-400">Quantità: {item.quantity}</p>
                        <p className="text-sm text-gray-400">Prezzo: €{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-400">Stato: <span className={`${item.status === "Consegnato" ? 'text-green-400' : 'text-yellow-400'}`}>{item.status}</span></p>
                        <p className="text-sm text-gray-400">Data di consegna: {new Date(item.deliveryDate).toLocaleDateString()}</p>
                      </div>
                      <button className="btn btn-sm bg-gradient-to-r from-green-500 to-teal-600 text-white border-none hover:from-green-600 hover:to-teal-700">
                        Traccia pacco
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center border-b border-blue-900/30 pb-2">
            <p className="font-semibold text-gray-400">Nessun acquisto trovato</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default Purchase