import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, CreditCard, MapPin, Trash2, ArrowLeft } from "lucide-react";
import TopBar from "../../navbar/topbarLogin";
import Loader from "../../loader/loader";

const AccountInfoContent = ({ email, username, type, registeredAt }) => (
  <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
    <div className="card-body space-y-4">
      <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">
        Account Information
      </h2>
      <div className="space-y-4 text-white">
        <div>
          <label className="font-bold">Username</label>
          <p>{username}</p>
        </div>
        <div>
          <label className="font-bold">Email</label>
          <p>{email}</p>
        </div>
        <div>
          <label className="font-bold">Account Type</label>
          <p>{type}</p>
        </div>
        <div>
          <label className="font-bold">Registered At</label>
          <p>{new Date(registeredAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  </div>
);

const PaymentMethods = () => (
  <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
    <div className="card-body space-y-4">
      <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">
        Payment Methods
      </h2>
      <div className="space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
          <div>
            <p className="font-bold">No payment methods added</p>
          </div>
          <button className="btn btn-primary btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105">
            Add Payment
          </button>
        </div>
      </div>
    </div>
  </div>
);

const BillingAddresses = () => (
  <div className="card bg-[#1E2633] shadow-2xl border border-blue-900/30">
    <div className="card-body space-y-4">
      <h2 className="card-title text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">
        Billing Addresses
      </h2>
      <div className="space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
          <div>
            <p className="font-bold">No billing addresses added</p>
          </div>
          <button className="btn btn-primary btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105">
            Add Address
          </button>
        </div>
      </div>
    </div>
  </div>
);

function AccountInfo() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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
        setLoading(false);
      } catch (error) {
        console.error("Errore durante la richiesta:", error);
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <AccountInfoContent
            email={email}
            username={username}
            type={type}
            registeredAt={registeredAt}
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
      {/* TopBar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-[#1E2633] p-4 border-t-0 border-r border-blue-900/30 flex flex-col justify-between">
          <div>
            {/* Back Button */}
            <button
              className="btn btn-ghost w-full flex items-center gap-2 text-white hover:bg-[#2C3E50] mb-4"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {/* Menu */}
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

          {/* Delete Account Button */}
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

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
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
                  // Implement account deletion logic
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