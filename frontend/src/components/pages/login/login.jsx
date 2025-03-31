import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Loader from "../../loader/loader";
import CryptoJS from 'crypto-js';

function Login() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/session', {
          credentials: 'include',
        });

        if (res.ok) {
          const res = await res.json();
          console.log(res.email,res.username,res)
          navigate('/products', {
            state: {
              email: res.email,
              username: res.username
            }
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.log('Not authenticated');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "username": mail, "password": hashedPassword }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error()
      console.log(data)
      if (data.email) {
        setResponseMessage("Benvenuto");
        setResponseType('success');
        const email = data.email;
        const username = data.username;
        setTimeout(() => {
          navigate('/products', { state: { email, username } });
        }, 1000);
      } else {
        setResponseMessage(data);
        setResponseType('error'); 
      }
    } catch (error) {
      // console.error('Request error:', error);
      
      setResponseMessage('Errore di rete');
      setResponseType('error'); 
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col items-center justify-center p-4">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="card w-full max-w-md bg-[#1E2633] shadow-2xl border border-blue-900/30 transform transition-all duration-500 hover:scale-105">
          <div className="card-body space-y-6 p-8">
            <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient leading-normal">
              JustWeed
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="gray"
                    className="h-4 w-4 opacity-70 ">
                    <path
                      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path
                      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="text"
                    className="grow text-white placeholder-gray-400"
                    placeholder="Username or Email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50] ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="gray"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="grow text-white placeholder-gray-400"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="btn btn-ghost btn-sm text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {isPasswordVisible ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
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
                  Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>

            <div className="flex justify-between text-sm text-gray-400">
              <a
                href="/forgotpassword"
                className="hover:text-blue-500 transition-colors"
              >
                Forgot Password?
              </a>
              <a
                href="/signup"
                className="hover:text-blue-500 transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;