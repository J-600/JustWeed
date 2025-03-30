import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaLeaf,
  FaLock,
  FaFlask,
  FaShieldAlt,
  FaUser,
  FaChevronRight,
  FaBirthdayCake
} from 'react-icons/fa';

const LandingPage = () => {
  const [showAgeModal, setShowAgeModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('ageVerified')) {
      setShowAgeModal(true);
    }
  }, []);

  const handleAgeVerification = useCallback((accepted) => {
    if (accepted) {
      setShowAgeModal(false);
      localStorage.setItem('ageVerified', 'true');
    } else {
      window.location.href = 'https://google.com';
    }
  }, []);

  const features = [
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Prodotti Certificati",
      description: "Tutti gli articoli sono testati in laboratorio e conformi alla legge italiana"
    },
    {
      icon: <FaFlask className="w-8 h-8" />,
      title: "Analisi Dettagliate",
      description: "Report completi su THC, CBD e composizione per ogni prodotto"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Acquisto Sicuro",
      description: "Pagamenti criptati e consegna anonima con tracciamento in tempo reale"
    }
  ];

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <dialog open={showAgeModal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-neutral text-neutral-content">
          <div className="flex flex-col items-center text-center">
            <FaBirthdayCake className="w-16 h-16 text-primary mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold mb-4">Verifica dell'età</h3>
            <p className="mb-6">
              Per accedere a Justweed devi avere almeno 21 anni.
              <br />
              Confermi di essere maggiorenne?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleAgeVerification(true)}
                className="btn btn-primary gap-2"
              >
                Sì, ho più di 21 anni
                <FaChevronRight />
              </button>
              <button
                onClick={() => handleAgeVerification(false)}
                className="btn btn-ghost"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <nav className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-50">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="btn btn-ghost px-2">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full">
                  <FaLeaf className="w-6 h-6 text-base-100" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Justweed
                </span>
              </div>
            </div>
            <span className="hidden md:inline text-sm opacity-70">
              • Marketplace legale per cannabis
            </span>
          </div>
        </div>
        <div className="flex-none gap-2">
          <button
            className="btn btn-sm bg-gradient-to-r from-blue-600 to-purple-700 border-none text-white flex items-center gap-2 hover:scale-[1.02] transition-transform"
            onClick={() => navigate('/login')}
            aria-label="Accedi al sito"
          >
            <FaUser className="w-4 h-4" aria-hidden="true" />
            Accedi
          </button>
        </div>
      </nav>

      <main>
        <section className="hero min-h-[80vh] bg-gradient-to-b from-base-200 to-base-300">
          <div className="hero-content text-center">
            <div className="max-w-4xl space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Justweed
                </span>
              </h1>

              <p className="text-xl opacity-90">
                Il primo marketplace italiano per cannabis legale. Acquista in modo sicuro e discreto
                prodotti certificati, con consegna rapida e supporto dedicato.
              </p>

              <div className="space-y-6">
                <button
                  className="btn btn-lg bg-gradient-to-r from-blue-600 to-purple-700 border-none text-white hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mx-auto"
                  onClick={() => navigate('/login')}
                  aria-label="Accedi per visualizzare i prodotti"
                >
                  <FaLock className="w-5 h-5" aria-hidden="true" />
                  Accedi per visualizzare i prodotti
                </button>

                <div className="flex items-center justify-center gap-2 text-sm opacity-70">
                  <FaShieldAlt />
                  <span>Transazioni crittate • Verifica anagrafica • Pagamenti sicuri</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="card-body items-center text-center">
                    <div className="text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h2 className="card-title">{feature.title}</h2>
                    <p className="opacity-80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default LandingPage;