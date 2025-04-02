
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import TopBar from '../../navbar/topbarLogin';
import Loader from '../../loader/loader';
import CryptoJS from 'crypto-js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [rPassword, setRpassword] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState(null);
  const params = new URLSearchParams(location.search);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rPassword !== password) {
      setResponseMessage('Le password non coincidono...');
      setResponseType('error');
      return;
    }

    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    const token = params.get('token');

    try {
      const res = await fetch(`http://localhost:3000/api/auth/newpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: hashedPassword }),
        credentials: 'include'
      });
      const responseData = await res.json();
      if(res.status !== 200){
        setResponseMessage(responseData || 'err');
        setResponseType('error');
      }else{
        setResponseMessage(responseData.message || 'Password cambiata con successo!');
        setResponseType('success');
  
        await sleep(3000);
        navigate('/');
      }
      
      
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setResponseMessage('Errore durante il cambio della password.');
      setResponseType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col items-center justify-center p-4">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="card w-full max-w-md bg-base-200 shadow-2xl border border-blue-900/30 transform transition-all duration-500 hover:scale-105">
          <div className="card-body space-y-6 p-8">
            <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient leading-normal">
              JustWeed
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="input input-bordered input-info flex items-center gap-2 bg-base-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="password"
                    className="grow text-white placeholder-gray-400"
                    placeholder="Nuova Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="input input-bordered input-info flex items-center gap-2 bg-base-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="password"
                    className="grow text-white placeholder-gray-400"
                    placeholder="Ripeti Nuova Password"
                    value={rPassword}
                    onChange={(e) => setRpassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              {responseMessage && (
                <div
                  className={`alert shadow-lg animate-fade-in ${
                    responseType === 'success' ? 'alert-success' : 'alert-error'
                  }`}
                >
                  {responseType === 'success' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                  <span>{responseMessage}</span>
                </div>
              )}

              <div className="form-control">
                <button
                  type="submit"
                  className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                >
                  Cambia Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;

