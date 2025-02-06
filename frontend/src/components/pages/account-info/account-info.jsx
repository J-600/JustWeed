import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { User, CreditCard, MapPin, Trash2 } from 'lucide-react';
import TopBar from '../../navbar/topbarLogin';
import Loader from '../../loader/loader';
import styles from '../../styles/accountInfo.module.css';

const AccountInfoContent = ({ email, username, type, registeredAt }) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">Account Information</h2>
      <div className="space-y-4">
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
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">Payment Methods</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <p className="font-bold">No payment methods added</p>
          </div>
          <button className="btn btn-primary btn-sm">Add Payment</button>
        </div>
      </div>
    </div>
  </div>
);

const BillingAddresses = () => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">Billing Addresses</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <p className="font-bold">No billing addresses added</p>
          </div>
          <button className="btn btn-primary btn-sm">Add Address</button>
        </div>
      </div>
    </div>
  </div>
);

function AccountInfo() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [type, setType] = useState('');
    const [registeredAt, setRegisteredAt] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('account');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/account-info", {
                    method:"GET",
                    credentials:"include"
                });
                const data = await res.json()
                if (res.status !== 200){
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
    }, [navigate])

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <AccountInfoContent 
                    email={email} 
                    username={username} 
                    type={type} 
                    registeredAt={registeredAt} 
                />;
            case 'payments':
                return <PaymentMethods />;
            case 'addresses':
                return <BillingAddresses />;
            default:
                return <AccountInfoContent 
                    email={email} 
                    username={username} 
                    type={type} 
                    registeredAt={registeredAt} 
                />;
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <TopBar/>
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-base-200 p-4 flex flex-col justify-between">
                <div>
                    <ul className="menu">
                        <li 
                            className={activeTab === 'account' ? 'active' : ''}
                            onClick={() => setActiveTab('account')}
                        >
                            <a className={activeTab === 'account' ? 'active' : ''}>
                                <User />
                                Account Info
                            </a>
                        </li>
                        <li 
                            className={activeTab === 'payments' ? 'active' : ''}
                            onClick={() => setActiveTab('payments')}
                        >
                            <a className={activeTab === 'payments' ? 'active' : ''}>
                                <CreditCard />
                                Payment Methods
                            </a>
                        </li>
                        <li 
                            className={activeTab === 'addresses' ? 'active' : ''}
                            onClick={() => setActiveTab('addresses')}
                        >
                            <a className={activeTab === 'addresses' ? 'active' : ''}>
                                <MapPin />
                                Billing Addresses
                            </a>
                        </li>
                    </ul>
                </div>
                
                {/* Delete Account Button */}
                <div>
                    <button 
                        className="btn btn-error w-full" 
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <Trash2 className="mr-2" /> Delete Account
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 bg-base-100 overflow-y-auto">
                {renderContent()}
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Account</h3>
                        <p className="py-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="modal-action">
                            <button 
                                className="btn btn-ghost" 
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-error"
                                onClick={() => {
                                    // Implement account deletion logic
                                    alert('Account deleted');
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