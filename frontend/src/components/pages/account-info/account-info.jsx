import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, User, CreditCard, MapPin, Trash2, ArrowLeft, Pencil, Lock, ChevronDown, Plus, Calendar } from "lucide-react";
import TopBar from "../../navbar/topbarLogin";
import Loader from "../../loader/loader";
import CryptoJS from 'crypto-js';
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51Qqap7J0BPVuq51Y7Bp15pmKU75gD8W6jjBXlXZLWzSbRQjnUGOrDp0cbR6LVWmFDmYl88OiKuSYnbubSMbvmGBB00iqVsYVpf");
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


const AccountInfoContent = ({ email, username, type, registeredAt, onUpdateEmail, onUpdateUsername }) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedEmail, setEditedEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSave = async () => {
    if (!password) {
      setErrorMessage("Password richiesta");
      return;
    }

    try {
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      const res = await fetch("http://localhost:3000/updateData", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: hashedPassword, new_email: editedEmail, new_username: editedUsername, new_password: null }),
        credentials: 'include'
      });
      const responseData = await res.json();

      if (res.status !== 200) {
        setErrorMessage(responseData.message || "Errore nell'upload dei dati.");
        setEditedUsername(username);
        setEditedEmail(email);
        return;
      }
      onUpdateEmail(editedEmail);
      onUpdateUsername(editedUsername);
      setSuccessMessage(responseData);
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditingUsername(false);
      setIsEditingEmail(false);
      setPassword("");

    } catch (error) {
      console.error("Errore durante la richiesta:", error);
      setErrorMessage("An error occurred. Please try again.");
      setEditedUsername(username);
      setEditedEmail(email);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Le password non coincidono.");
      return;
    }
    const hashedPassword = CryptoJS.SHA256(oldPassword).toString(CryptoJS.enc.Hex);
    const newhashedPassword = CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex);

    try {
      const res = await fetch("http://localhost:3000/updateData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: hashedPassword, new_password: newhashedPassword }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.status !== 200) {
        setErrorMessage(data || "Errore");
        return;
      }

      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPasswordModal(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Errore durante la richiesta:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
      <div className="card-body space-y-4">
        <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
          Infomazione dell'account
        </h2>
        <div className="space-y-6">
          {successMessage && (
            <div className="alert alert-success shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-error shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
          <div>
            <label className="font-bold text-lg text-blue-400">Username</label>
            <div className="flex items-center gap-2 mt-1">
              {isEditingUsername ? (
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="text-white bg-transparent border-b border-blue-500 focus:outline-none flex-1"
                />
              ) : (
                <p className="text-white flex-1">{username}</p>
              )}
              <button
                onClick={() => {
                  if (!isEditingUsername) {
                    setEditedUsername(username);
                  }
                  setIsEditingUsername(!isEditingUsername);
                }}
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-lg text-blue-400">Email</label>
            <div className="flex items-center gap-2 mt-1">
              {isEditingEmail ? (
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="text-white bg-transparent border-b border-blue-500 focus:outline-none flex-1"
                />
              ) : (
                <p className="text-white flex-1">{email}</p>
              )}
              <button
                onClick={() => {
                  if (!isEditingEmail) {
                    setEditedEmail(email);
                  }
                  setIsEditingEmail(!isEditingEmail);
                }}
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(isEditingUsername || isEditingEmail) && (
            <div>
              <label className="font-bold text-lg text-blue-400">Conferma Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-white bg-transparent border-b border-blue-500 focus:outline-none w-full mt-1"
                placeholder="Enter your password to confirm changes"
              />
            </div>
          )}

          {(isEditingUsername || isEditingEmail) && (
            <button
              onClick={handleSave}
              className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
            >
              Conferma
            </button>
          )}

          <div>
            <label className="font-bold text-lg text-blue-400">Registered At</label>
            <p className="text-white">{new Date(registeredAt).toLocaleDateString()}</p>
          </div>

          <div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
            >
              Modifica Password
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-[#1E2633] border border-blue-900/30">
            <h3 className="font-bold text-lg text-white">Cambia Password</h3>
            <div className="space-y-4 mt-4">
              <div>
                <label className="font-bold text-lg text-blue-400">Vecchia password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="text-white bg-transparent border-b border-blue-500 focus:outline-none w-full mt-1"
                  placeholder="Enter your old password"
                />
              </div>
              <div>
                <label className="font-bold text-lg text-blue-400">Nuova Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-white bg-transparent border-b border-blue-500 focus:outline-none w-full mt-1"
                  placeholder="Enter your new password"
                />
              </div>
              <div>
                <label className="font-bold text-lg text-blue-400">Conferma password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="text-white bg-transparent border-b border-blue-500 focus:outline-none w-full mt-1"
                  placeholder="Confirm your new password"
                />
              </div>
              {errorMessage && (
                <div className="alert alert-error shadow-lg mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
            <div className="modal-action">
              <button
                className="btn btn-ghost text-white hover:bg-[#2C3E50]"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StripeCardForm = ({ onSuccess, onCancel, setErrorMessage, setIsProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (e) => {
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


      const verifyResponse = await fetch('http://localhost:3000/verify-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ paymentMethodId: paymentMethod.id })
      });

      const verifyResult = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyResult.message || 'Errore nella verifica della carta');

      onSuccess({
        last4: paymentMethod.card.last4,
        expiry: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
        name: cardholderName,
        paymentMethodId: paymentMethod.id,
        brand: paymentMethod.card.brand
      });

    } catch (err) {
      setErrorMessage(err.message || 'Si è verificato un errore durante la verifica');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
          <User className="w-4 h-4 opacity-70" />
          <input
            type="text"
            className="grow text-white placeholder-gray-400 bg-transparent border-none focus:outline-none"
            placeholder="Cardholder Name"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-control">
        <div className="input input-bordered input-info bg-[#2C3E50] p-3">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="modal-action">
        <button type="button" className="btn btn-ghost text-white hover:bg-[#2C3E50]" onClick={onCancel}>
          Annulla
        </button>
        <button type="submit" className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700" disabled={!stripe}>
          Verifica carta
        </button>
      </div>
    </form>
  );
};


const PaymentMethods = () => {
  const [cards, setCards] = useState([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showRemoveCardModal, setShowRemoveCardModal] = useState(false);
  const [removingCardIndex, setRemovingCardIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    expiryDate: '',
    cardholderName: ''
  });

  const navigate = useNavigate();

  const fetchCardsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/cardsdata", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data)
      console.log(res)

      if (res.status !== 200)
        setErrorMessage("errore nel loading dei dati")
      setCards(data);
    } catch (error) {
      console.error("Error loading data:", error);
      // navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCardsData(); }, [navigate]);

  const handleCardSuccess = async (cardData) => {
    try {
      // console.log(cardData) 
      const addRes = await fetch("http://localhost:3000/add-card", {
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

      // console.log(addRes)
      const data = await addRes.json()
      // console.log(data)
      if (addRes.status !== 200) throw new Error({error: "Errore nel salvataggio della carta"});

      setErrorMessage("");
      setSuccessMessage(data)
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowAddCardModal(false);
      fetchCardsData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEditCard = async (e) => {
    e.preventDefault();
    try {
      console.log(cardToEdit)
      const res = await fetch("http://localhost:3000/update-card", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: cardToEdit.id,
          scadenza: formData.expiryDate,
          nome_titolare: formData.cardholderName
        }),
        credentials: 'include'
      });
      const data = res.json();
      if (res.status !== 200)
        setErrorMessage("Errore nella modifica dei dati");

      setErrorMessage("");
      setSuccessMessage(data)
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowEditCardModal(false);
      fetchCardsData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleConfirmRemove = async () => {
    try {
      const res = await fetch("http://localhost:3000/delete-card", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: cards[removingCardIndex].id }),
        credentials: 'include'
      });

      // if (!res.ok) throw new Error("Failed to delete card");

      // setSuccessMessage("Card removed successfully!");
      // setShowRemoveCardModal(false);
      fetchCardsData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "scadenza") {
      value = value.replace(/\D/g, "");

      if (value.length > 4) value = value.slice(0, 4);
      if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
      <div className="card-body space-y-4">
        <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
          Metodi di pagamento
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
        ) : Array.isArray(cards) && cards.length > 0 ? (
          <div className="space-y-4">
            {cards.map((card, index) => (
              <div key={index} className={`border border-blue-900/30 rounded-lg p-4 transition-all duration-300 ${expandedCard === index ? 'bg-[#2C3E50]' : 'bg-[#1E2633] hover:bg-[#2C3E50]'}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedCard(prev => prev === index ? null : index)}>
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="font-bold text-white">{card.circuito} n. ••••••••••••{card.numero}</h3>
                      <p className="text-sm text-gray-400">Aggiunta il {new Date(card.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCard === index ? 'rotate-180' : ''}`} />
                </div>

                <div className={`overflow-hidden transition-all ${expandedCard === index ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                  <div className="pt-4 border-t border-blue-900/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-blue-400">scadenza</label>
                        <p className="text-white">{card.scadenza.split("/")[0]}/{card.scadenza.split("/")[1]}</p>
                      </div>
                      <div>
                        <label className="text-sm text-blue-400">Propietario</label>
                        <p className="text-white">{card.nome_titolare}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => {
                        setFormData({
                          scadenza: `${String(card.scadenza.split("/")[0]).padStart(2, '0')}/${String(card.scadenza.split("/")[1]).slice(-2)}`,
                          nome_titolare: card.nome_titolare
                        });
                        setCardToEdit(card);
                        setShowEditCardModal(true);
                      }} className="btn btn-info btn-sm flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white border-none hover:from-green-600 hover:to-teal-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Modifica
                      </button>

                      <button onClick={() => {
                        setRemovingCardIndex(index);
                        setShowRemoveCardModal(true);
                      }} className="btn btn-error btn-sm flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white border-none hover:from-red-600 hover:to-pink-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => setShowAddCardModal(true)} className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 mt-6">
              <Plus className="w-5 h-5 mr-2" />
              Aggiungi carta
            </button>
          </div>


        ) : (
          <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
            <p className="font-semibold text-gray-400">Nessun metodo di pagamento</p>
            <button onClick={() => setShowAddCardModal(true)} className="btn btn-primary btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
              aggiungi metodo di pagamento
            </button>
          </div>
        )}

        {showAddCardModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-[#1E2633] border border-blue-900/30 p-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Aggiungi carta
              </h3>
              <Elements stripe={stripePromise}>
                <StripeCardForm
                  onSuccess={handleCardSuccess}
                  onCancel={() => setShowAddCardModal(false)}
                  setErrorMessage={setErrorMessage}
                  setIsProcessing={setIsProcessing}
                />
              </Elements>
            </div>
          </div>
        )}

        {showEditCardModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-[#1E2633] border border-blue-900/30 p-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Modifica carta
              </h3>
              <form onSubmit={handleEditCard} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-control">
                    <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                      <Calendar className="w-4 h-4 opacity-70" />
                      <input
                        type="text"
                        name="scadenza"
                        className="grow text-white placeholder-gray-400"
                        placeholder="MM/YY"
                        value={formData.scadenza}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                      <User className="w-4 h-4 opacity-70" />
                      <input
                        type="text"
                        name="nome_titolare"
                        className="grow text-white placeholder-gray-400"
                        placeholder="Cardholder Name"
                        value={formData.nome_titolare}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost text-white hover:bg-[#2C3E50]"
                    onClick={() => setShowEditCardModal(false)}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
                  >
                    Salva
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRemoveCardModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-[#1E2633] border border-blue-900/30">
              <h3 className="font-bold text-lg text-white">Confirm Removal</h3>
              <p className="py-4 text-gray-400">Sei sicuro di voler rimuovere questa carta??</p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost text-white hover:bg-[#2C3E50]"
                  onClick={() => setShowRemoveCardModal(false)}
                >
                  Annulla
                </button>
                <button
                  className="btn btn-error bg-gradient-to-r from-red-500 to-pink-600 text-white border-none hover:from-red-600 hover:to-pink-700"
                  onClick={handleConfirmRemove}
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const BillingAddresses = () => (
  <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
    <div className="card-body space-y-4">
      <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
        Indirizzo di fatturazione
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">

          <div>
            <p className="font-semibold text-gray-400">Nessun indirizzo di fatturazione</p>
          </div>
          <button className="btn btn-primary btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105">
            Aggiungi indirizzo
          </button>
        </div>
      </div>
    </div>
  </div>
);

function AccountInfo() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  // const [accountData, setAccountData] = useState([]);
  const [type, setType] = useState("");
  const [registeredAt, setRegisteredAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/account-info", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.status !== 200) {
          navigate("/");
        }
        setEmail(data.email);
        setUsername(data.username);
        setType(data.type);
        setRegisteredAt(data.registered_at);
        // setAccountData(data);
        setLoading(false);
      } catch (error) {
        console.error("Errore durante la richiesta:", error);
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  // const paymentMethods = accountData.filter(item => item.circuito === 'Mastercard');

  const handleUpdateEmail = (newEmail) => {
    setEmail(newEmail);
  };

  const handleUpdateUsername = (newUsername) => {
    setUsername(newUsername);
  };


  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <AccountInfoContent
            email={email}
            username={username}
            type={type}
            registeredAt={registeredAt}
            onUpdateEmail={handleUpdateEmail}
            onUpdateUsername={handleUpdateUsername}
          />
        );
      case "payments":
        return <PaymentMethods />;
      case "addresses":
        return <BillingAddresses />;
      default:
        return (
          <AccountInfoContent
            email={email}
            username={username}
            type={type}
            registeredAt={registeredAt}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
        <TopBar />
        <div className="flex-grow flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col">
      <TopBar />

      <div className="flex flex-1">
        <div className="w-64 bg-[#1E2633] p-4 border-t-0 border-r border-blue-900/30 flex flex-col justify-between">
          <div>
            <button
              className="btn btn-ghost w-full flex items-center gap-2 text-white hover:bg-[#2C3E50] mb-4"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <ul className="menu">
              <li
                className={`mb-2 ${activeTab === "account" ? "bg-[#2C3E50] rounded-lg" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <a className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300">
                  <User className="w-5 h-5" />
                  Informazioni dell'account
                </a>
              </li>
              <li
                className={`mb-2 ${activeTab === "payments" ? "bg-[#2C3E50] rounded-lg" : ""}`}
                onClick={() => setActiveTab("payments")}
              >
                <a className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300">
                  <CreditCard className="w-5 h-5" />
                  Metodi di pagamento
                </a>
              </li>
              <li
                className={`mb-2 ${activeTab === "addresses" ? "bg-[#2C3E50] rounded-lg" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                <a className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300">
                  <MapPin className="w-5 h-5" />
                  Indirizzi di fatturazione
                </a>
              </li>
            </ul>
          </div>
          <div>
            <button
              className="btn btn-error w-full bg-gradient-to-r from-red-500 to-pink-600 text-white border-none hover:from-red-600 hover:to-pink-700 transform transition-all duration-300 hover:scale-105"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Account
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box bg-[#1E2633] border border-blue-900/30">
            <h3 className="font-bold text-lg text-white">Delete Account</h3>
            <p className="py-4 text-gray-400">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost text-white hover:bg-[#2C3E50]"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error bg-gradient-to-r from-red-500 to-pink-600 text-white border-none hover:from-red-600 hover:to-pink-700 transform transition-all duration-300 hover:scale-105"
                onClick={() => {
                  alert("Account deleted");
                  setShowDeleteConfirm(false);
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountInfo;