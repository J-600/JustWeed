import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, CreditCard, MapPin, Trash2, ArrowLeft, Pencil, Lock, ChevronDown, Plus } from "lucide-react";
import TopBar from "../../navbar/topbarLogin";
import Loader from "../../loader/loader";
import CryptoJS from 'crypto-js';


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
        <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6">
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

const PaymentMethods = ({ cards }) => {
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: ''
  });

  const toggleCardExpansion = (index) => {
    setExpandedCard(prev => prev === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    console.log("Nuova carta aggiunta:", formData);
    setShowAddCardModal(false);
  };

  return (
    <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
      <div className="card-body space-y-4">
        <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6 leading-normal">
          Metodi di pagamento
        </h2>

        {cards.length === 0 ? (
          <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
            <p className="font-semibold text-gray-400">Nessun metodo di pagamento</p>
            <button 
              onClick={() => setShowAddCardModal(true)}
              className="btn btn-primary btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
            >
              Aggiungi metodo di pagamento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card, index) => (
              <div 
                key={index}
                className={`border border-blue-900/30 rounded-lg p-4 transition-all duration-300 ${
                  expandedCard === index ? 'bg-[#2C3E50]' : 'bg-[#1E2633] hover:bg-[#2C3E50]'
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCardExpansion(index)}
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="font-bold text-white">
                        {card.type}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Intestatario: {card.registered_at}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    expandedCard === index ? 'rotate-180' : ''
                  }`}/>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${
                  expandedCard === index ? 'max-h-96 mt-4' : 'max-h-0'
                }`}>
                  <div className="pt-4 border-t border-blue-900/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-blue-400">number</label>
                        <p className="text-white">••••••••••••{card.email.slice(11,16)}</p>
                      </div>
                      <div>
                        <label className="text-sm text-blue-400">Scadenza</label>
                        <p className="text-white">{card.username}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => console.log("Elimina carta", index)}
                      className="btn btn-error btn-sm w-full bg-gradient-to-r from-red-500 to-pink-600 text-white border-none hover:from-red-600 hover:to-pink-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Rimuovi Carta
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => setShowAddCardModal(true)}
              className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 mt-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Aggiungi Nuova Carta
            </button>
          </div>
        )}

        {showAddCardModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-[#1E2633] border border-blue-900/30 p-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Aggiungi Nuova Carta
              </h3>
              <form onSubmit={handleAddCard} className="space-y-6">
                <div className="form-control">
                  <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                    <CreditCard className="w-4 h-4 opacity-70" />
                    <input
                      type="text"
                      name="cardNumber"
                      className="grow text-white placeholder-gray-400"
                      placeholder="Numero Carta"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                      <Lock className="w-4 h-4 opacity-70" />
                      <input
                        type="text"
                        name="expiryDate"
                        className="grow text-white placeholder-gray-400"
                        placeholder="MM/AA"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                      <Lock className="w-4 h-4 opacity-70" />
                      <input
                        type="text"
                        name="cvc"
                        className="grow text-white placeholder-gray-400"
                        placeholder="CVC"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="form-control">
                  <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                    <User className="w-4 h-4 opacity-70" />
                    <input
                      type="text"
                      name="cardholderName"
                      className="grow text-white placeholder-gray-400"
                      placeholder="Intestatario Carta"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost text-white hover:bg-[#2C3E50]"
                    onClick={() => setShowAddCardModal(false)}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                  >
                    Aggiungi Carta
                  </button>
                </div>
              </form>
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
    <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient text-4xl font-bold mb-6">
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
  const [accountData, setAccountData] = useState([]);
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
        setEmail(data[0].email);
        setUsername(data[0].username);
        setType(data[0].type);
        setRegisteredAt(data[0].registered_at);
        setAccountData(data.slice(1));
        setLoading(false);
      } catch (error) {
        console.error("Errore durante la richiesta:", error);
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  const paymentMethods = accountData.filter(item => item.type === 'Mastercard');

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
        return <PaymentMethods cards = {accountData}/>;
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
                  Account Info
                </a>
              </li>
              <li
                className={`mb-2 ${activeTab === "payments" ? "bg-[#2C3E50] rounded-lg" : ""}`}
                onClick={() => setActiveTab("payments")}
              >
                <a className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </a>
              </li>
              <li
                className={`mb-2 ${activeTab === "addresses" ? "bg-[#2C3E50] rounded-lg" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                <a className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300">
                  <MapPin className="w-5 h-5" />
                  Billing Addresses
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