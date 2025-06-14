import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { User, CreditCard, MapPin, Building2, Hash, Pencil, ChevronDown, FileText, IdCard } from "lucide-react";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {  CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import TopBar from "../../navbar/topbar";
// import Loader from "../../loader/loader";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fff',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
        opacity: '0.8'
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

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false)
  const [name, setName] = useState("")
  const [cognome, setCognome] = useState("")
  const [cf, setCf] = useState("")
  const [address, setAddress] = useState("")
  const [cap, setCap] = useState("")
  const [city, setCity] = useState("")
  const [pIva, setPIva] = useState("")
  const [descrizione, setDescrizione] = useState("")
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIsWeeder = async () => {
      try {
        const res = await fetch ("http://localhost:3000/api/auth/weeder", {
          method: "GET",
          credentials: "include"
        })
        if (!res.ok)
          throw new Error(res)
  
        navigate("/seller/weeder/homepage")
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchIsWeeder()
  }, [])

  const handleSubmit = async (e) => {
    const cardholderName = name + " " + cognome

    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setErrorMessage("Errore nel caricamento del modulo di pagamento.");
        setIsProcessing(false);
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name: cardholderName },
      });

      if (error) throw new Error(error.message);
      if (!paymentMethod) throw new Error("Errore nella creazione del metodo di pagamento");


      const verifyResponse = await fetch('http://localhost:3000/api/user/verify-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ paymentMethodId: paymentMethod.id })
      });

      const verifyResult = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyResult.message || 'Errore nella verifica della carta');

      const cardData = {
        last4: paymentMethod.card.last4,
        expiry: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
        name: cardholderName,
        paymentMethodId: paymentMethod.id,
        brand: paymentMethod.card.brand
      };

      const addRes = await fetch("http://localhost:3000/api/user/add-card", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metodoPagamento: cardData.paymentMethodId,
          numero: cardData.last4,
          scadenza: cardData.expiry,
          nome_titolare: cardData.name,
          circuito: cardData.brand
        }),
        credentials: 'include'
      });

      if (!addRes.ok) throw new Error({ error: "Errore nel salvataggio della carta" });


      const addWeeder = await fetch("http://localhost:3000/api/weeder/add-weeder", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metodoPagamento: cardData.paymentMethodId,
          name: name,
          cognome: cognome,
          city: city,
          cap: cap,
          address: address,
          piva: pIva,
          cf: cf,
          descrizione: descrizione
        }),
        credentials: "include"
      })

      if (!addWeeder.ok) {
        throw new Error({ error: "Errore nel salvataggio della carta" });
      }

      const resWeeder = addWeeder.json()

      setSuccessMessage(resWeeder);
      setTimeout(() => setSuccessMessage(""), 3000);
      setTimeout(() => {
        navigate('/seller/weeder/homepage');
      }, 1000);
    } catch (err) {
      setErrorMessage('Si è verificato un errore durante la verifica');
    }
    finally {
      setIsProcessing(false);
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
      <TopBar />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 
              text-4xl md:text-5xl font-bold tracking-tight animate-gradient">
              Diventa Weeder
            </h1>
            <p className="mt-3 text-blue-300/90 text-lg max-w-xl mx-auto">
              Completa il form per entrare a far parte della nostra community professionale
            </p>
          </div>
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

          <div className="space-y-6">
            <SectionCard title="Dati personali" icon={<User className="w-5 h-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={<IdCard />} value={name} setValue={setName} placeholder="Nome *" required />
                <InputField icon={<IdCard />} value={cognome} setValue={setCognome} placeholder="Cognome *" required />
                <div className="md:col-span-2">
                  <InputField icon={<FileText />} value={cf} setValue={setCf} placeholder="Codice Fiscale *" required />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Indirizzo di fatturazione" icon={<MapPin className="w-5 h-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={<MapPin />} value={address} setValue={setAddress} placeholder="Indirizzo *" required />
                <InputField icon={<Hash />} value={cap} setValue={setCap} placeholder="CAP *" required />
                <div className="md:col-span-2">
                  <InputField icon={<Building2 />} value={city} setValue={setCity} placeholder="Città *" required />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Metodo di pagamento" icon={<CreditCard className="w-5 h-5" />}>
              <div className="p-4 bg-base-200 rounded-lg border border-blue-900/30 transition-colors 
                hover:border-blue-600/50">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </SectionCard>

            <SectionCard title="Dati aziendali" icon={<Building2 className="w-5 h-5" />}>
              <div className="space-y-4">
                <InputField icon={<FileText />} value={pIva} setValue={setPIva} placeholder="Partita IVA *" required />
                <div className="relative">
                  <textarea
                    className="w-full bg-base-200 border border-blue-900/30 rounded-lg px-4 py-3 pl-11
                      text-blue-100 placeholder-blue-400/70 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    rows="3"
                    value={descrizione}
                    onChange={(e) => setDescrizione(e.target.value)}
                    placeholder="Descrizione attività..."
                  />
                  <Pencil className="absolute left-3 top-3.5 w-5 h-5 text-blue-400/70" />
                </div>
              </div>
            </SectionCard>

            <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4
              rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all 
              duration-300 hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-blue-500/20
              flex items-center justify-center space-x-2 group"
            >
              <span>Completa Registrazione</span>
              <ChevronDown className="w-5 h-5 transform group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-base-200 rounded-xl border border-blue-900/30 p-6 shadow-xl hover:shadow-blue-900/10 
    transition-shadow">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-blue-200">{title}</h2>
    </div>
    {children}
  </div>
);

const InputField = ({ icon, placeholder, required = false, value, setValue, ...props }) => (
  <div className="relative">
    <input
      className="w-full bg-base-200 border border-blue-900/30 rounded-lg px-4 py-3 pl-11
        text-blue-100 placeholder-blue-400/70 focus:outline-none focus:ring-2 
        focus:ring-blue-500/50 focus:border-blue-500 transition-all"
      placeholder={placeholder + (required ? ' *' : '')}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required={required}
      {...props}
    />
    <div className="absolute left-3 top-3.5 text-blue-400/70">
      {icon}
    </div>
  </div>
);

export default Weeder;