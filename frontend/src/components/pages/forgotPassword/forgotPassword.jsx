import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader/loader";
import { AlertCircle, CheckCircle } from 'lucide-react';

function ForgotPassword() {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mail }),
        credentials: "include",
      });
      const data = await res.json();
      setResponseMessage(data.message || data);
      setResponseType('success');
    } catch (error) {
      console.error("Errore durante la richiesta:", error);
      setResponseMessage("Errore durante la richiesta");
      setResponseType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] flex flex-col items-center justify-center p-4">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="card w-full max-w-md bg-[#1E2633] shadow-2xl border border-blue-900/30 transform transition-all duration-500 hover:scale-105">
          <div className="card-body space-y-6 p-8">
            <div className="relative w-full pb-6">
              <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient leading-normal">
                Forgot Password
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="input input-bordered input-info flex items-center gap-2 bg-[#2C3E50]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="email"
                    className="grow text-white placeholder-gray-400"
                    placeholder="Email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                </label>
              </div>

              {responseMessage && (
                <div className={`alert shadow-lg animate-fade-in ${
                  responseType === 'success' ? 'alert-success' : 'alert-error'
                }`}>
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
                  disabled={loading}
                >
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      Invia email
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 ml-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
            <div className="flex justify-center text-sm text-gray-400">
              <a
                href="/login"
                className="hover:text-blue-500 transition-colors"
              >
                Remembered your password? Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;