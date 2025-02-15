import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51Qqap7J0BPVuq51Y7Bp15pmKU75gD8W6jjBXlXZLWzSbRQjnUGOrDp0cbR6LVWmFDmYl88OiKuSYnbubSMbvmGBB00iqVsYVpf");

function Weeder() {
  const stripe = useStripe();
  const elements = useElements();
  const [newAddress, setNewAddress] = useState({
      name: '',
      street: '',
      city: '',
      zip: '',
    });
  const navigate = useNavigate();
  const [isCheckingCap, setIsCheckingCap] = useState(false);
  const [capError, setCapError] = useState("");
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    vatNumber: "",
    companyName: "",
    description: "",
    address: "",
    postalCode: "",
    city: "",
    province: ""
  });

  useEffect(() => {
      const verifyCap = async () => {
        if (formData.postalCode.length === 5 && !isNaN(formData.postalCode)) {
          setIsCheckingCap(true);
          setCapError("");
          try {
            const response = await fetch(`https://api.zippopotam.us/it/${formData.postalCode}`);
  
            if (!response.ok) {
              setCapError("CAP non valido");
              setCities([]);
              return;
            }
  
            const data = await response.json();
            const citiesList = data.places.map(place => place['place name']);
            setCities(citiesList);
  
            if (citiesList.length === 1) {
              setNewAddress(prev => ({
                ...prev,
                city: citiesList[0],
              }));
            }
          } catch (error) {
            setCapError("Errore nella verifica del CAP");
            setCities([]);
          } finally {
            setIsCheckingCap(false);
          }
        }
      };
  
      const debounceTimer = setTimeout(() => {
        verifyCap();
      }, 500);
  
      return () => clearTimeout(debounceTimer);
    }, [formData.postalCode]);

  const [cardError, setCardError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  

  useEffect(() => {
    if (!stripe) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [stripe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Validazione campi base
    if (!formData.firstName) newErrors.firstName = "Campo obbligatorio";
    if (!formData.lastName) newErrors.lastName = "Campo obbligatorio";
    if (!formData.vatNumber.match(/^\d{11}$/)) newErrors.vatNumber = "Partita IVA non valida";
    if (!formData.postalCode.match(/^\d{5}$/)) newErrors.postalCode = "CAP non valido";
    if (formData.description.length < 100) newErrors.description = "Descrizione troppo breve (min 100 caratteri)";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !stripe || !elements) return;

    setLoading(true);
    
    try {
      // Creazione PaymentMethod Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: {
            postal_code: formData.postalCode,
            city: formData.city,
            country: "IT"
          }
        }
      });

      if (stripeError) {
        setCardError(stripeError.message);
        return;
      }

      // Simulazione richiesta API
      const response = await fetch("/api/become-weeder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentMethodId: paymentMethod.id
        })
      });

      if (!response.ok) throw new Error("Errore durante la registrazione");
      navigate("/weeder-success");

    } catch (error) {
      console.error("Registration error:", error);
      setCardError("Errore durante l'elaborazione del pagamento");
    } finally {
      setLoading(false);
    }
  };

  const stripeElementOptions = {
    style: {
      base: {
        color: "#ffffff",
        fontSize: "16px",
        fontFamily: "inherit",
        "::placeholder": {
          color: "#93c5fd"
        },
        backgroundColor: "#1E2633"
      },
      invalid: {
        color: "#f87171",
        iconColor: "#f87171"
      },
      complete: {
        color: "#4ade80",
        iconColor: "#4ade80"
      }
    },
    hidePostalCode: true
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
      <TopBar />
      
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1E2633] rounded-2xl border border-blue-900/30 shadow-2xl p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                Registrazione Venditore
              </h1>
              <p className="text-blue-300">Compila tutti i campi per registrarti come venditore certificato</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-blue-400 border-b border-blue-900/30 pb-2">
                  Informazioni Personali
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">Nome</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border ${
                        errors.firstName ? "border-red-500" : "border-blue-900/30"
                      } focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-2">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">Cognome</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border ${
                        errors.lastName ? "border-red-500" : "border-blue-900/30"
                      } focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-2">{errors.lastName}</p>}
                  </div>
                </div>
              </div>

              {/* Sezione Aziendale */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-blue-400 border-b border-blue-900/30 pb-2">
                  Dati Aziendali
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">Partita IVA</label>
                    <input
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      placeholder="12345678901"
                      className={`w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border ${
                        errors.vatNumber ? "border-red-500" : "border-blue-900/30"
                      } focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.vatNumber && <p className="text-red-400 text-sm mt-2">{errors.vatNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">Ragione Sociale</label>
                    <input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border border-blue-900/30 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2">Descrizione Attività</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border ${
                      errors.description ? "border-red-500" : "border-blue-900/30"
                    } focus:ring-2 focus:ring-blue-500 transition-all`}
                    placeholder="Descrivi la tua attività in dettaglio..."
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-2">{errors.description}</p>}
                </div>
              </div>

              {/* Sezione Indirizzo */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-blue-400 border-b border-blue-900/30 pb-2">
                  Indirizzo di Fatturazione
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">Indirizzo</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border border-blue-900/30 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">CAP</label>
                    <input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="12345"
                      className={`w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border ${
                        errors.postalCode ? "border-red-500" : "border-blue-900/30"
                      } focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.postalCode && <p className="text-red-400 text-sm mt-2">{errors.postalCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">Città</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#2A3444] rounded-lg px-4 py-3 text-white border border-blue-900/30 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sezione Pagamento */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-blue-400 border-b border-blue-900/30 pb-2">
                  Metodo di Pagamento
                </h3>

                <div className="bg-[#2A3444] p-6 rounded-xl border border-blue-900/30">
                  <label className="block text-sm font-medium text-blue-400 mb-4">Carta di Credito</label>
                  <div className="space-y-4">
                    <CardElement
                      options={stripeElementOptions}
                      className="p-3 bg-[#1E2633] rounded-lg border border-blue-900/30"
                    />
                    {cardError && <p className="text-red-400 text-sm">{cardError}</p>}
                  </div>
                </div>
              </div>

              {/* Pulsante di Invio */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading || !stripe}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Registrazione in corso...</span>
                    </div>
                  ) : (
                    "Completa Registrazione"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weeder;