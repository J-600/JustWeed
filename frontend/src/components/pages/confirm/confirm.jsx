import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../loader/loader';
import { CheckCircle, AlertCircle } from 'lucide-react';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState(null);

  useEffect(() => {
    const fetchConfirm = async () => {
      const token = params.get("token");
      let responseData;
      try {
        const res = await fetch(`http://localhost:3000/api/auth/confirm?token=${token}`, {
          method: "GET",
          credentials: 'include',
        });
        responseData = await res.json();
        setData(responseData);

        if (responseData.message) {
          setEmail(responseData.email);
          setUsername(responseData.username);
          setResponseMessage(responseData.data);
          setResponseType('success');
        } else {
          setResponseMessage(responseData.error || "Errore durante la conferma.");
          setResponseType('error');
        }
      } catch (error) {
        console.error('Errore durante la richiesta:', error);
        setResponseMessage('Network error. Please try again.');
        setResponseType('error');
      } finally {
        setLoading(false);

        if (responseData?.message) {
          await sleep(3000);
          navigate('/products', { state: { email: responseData.email, username: responseData.username } });
        }
      }
    };
    fetchConfirm();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col items-center justify-center p-4">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="card w-full max-w-md bg-base-200 shadow-2xl border border-blue-900/30 transform transition-all duration-500 hover:scale-105">
          <div className="card-body space-y-6 p-8">
            <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient leading-normal">
              JustWeed
            </h1>

            {responseMessage && (
              <div
                className={`alert shadow-lg animate-fade-in ${responseType === 'success' ? 'alert-success' : 'alert-error'
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

            {responseType === 'success' && (
              <div className="text-center text-gray-400">
                <p>Verrai reindirizzato alla pagina dei prodotti tra pochi secondi...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirm;