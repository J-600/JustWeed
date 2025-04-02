import { Cookie, ShieldCheck, Lock, ChartBar, Megaphone, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const CookiePage = () => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false
  });

  const [thirdParty, setThirdParty] = useState({
    googleAnalytics: false,
    facebookPixel: false,
    hotjar: false
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookiePreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    localStorage.setItem('thirdPartyCookies', JSON.stringify(thirdParty));
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const handleRejectAll = () => {
    setPreferences({
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false
    });
    setThirdParty({
      googleAnalytics: false,
      facebookPixel: false,
      hotjar: false
    });
    handleSave();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 text-white">
      <TopBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full mb-4 border border-blue-900/30">
            <Cookie size={18} className="text-blue-400" />
            <span className="text-blue-400">Gestione Consenso Cookie</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Preferenze Cookie
          </h1>
          <p className="text-gray-300 text-lg">
            Personalizza il tracciamento per una esperienza ottimale
          </p>
        </div>

        <div className="bg-card-base-100 rounded-xl border border-blue-900/30 p-6 shadow-lg">
          <div className="space-y-6">
            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <Lock size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Essenziali
                </span>
                <span className="badge badge-sm bg-blue-900/20 text-blue-400 p-2.5">Obbligatori</span>
              </div>
              <div className="collapse-content">
                <div className="text-gray-300 space-y-4">
                  <p>
                    Funzionalità base necessarie per l'accesso ai prodotti regolamentati
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-blue-400" />
                    <span>Verifica età (21+)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-blue-400" />
                    <span>Sicurezza transazioni</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <ShieldCheck size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Personalizzazione
                </span>
              </div>
              <div className="collapse-content">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Memorizza dosaggi e preferenze</span>
                  <input 
                    type="checkbox" 
                    className="toggle bg-card-base-100 border-blue-900/30 hover:border-purple-500 checked:bg-purple-500"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences({...preferences, preferences: e.target.checked})}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  <X size={14} className="inline mr-1 text-purple-400" />
                  Nessun dato personale raccolto
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <ChartBar size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Analisi
                </span>
              </div>
              <div className="collapse-content">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Statistiche d'uso anonime</span>
                  <input 
                    type="checkbox" 
                    className="toggle bg-card-base-100 border-blue-900/30 hover:border-purple-500 checked:bg-purple-500"
                    checked={preferences.statistics}
                    onChange={(e) => setPreferences({...preferences, statistics: e.target.checked})}
                  />
                </div>
                <div className="bg-blue-900/10 p-4 rounded-xl">
                  <h4 className="font-bold text-purple-400 mb-3">Servizi Terze Parti</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-xs border-blue-900/30 checked:border-purple-500 checked:bg-purple-500"
                        checked={thirdParty.googleAnalytics}
                        onChange={(e) => setThirdParty({...thirdParty, googleAnalytics: e.target.checked})}
                      />
                      <span className="text-gray-300">Google Analytics</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-xs border-blue-900/30 checked:border-purple-500 checked:bg-purple-500"
                        checked={thirdParty.hotjar}
                        onChange={(e) => setThirdParty({...thirdParty, hotjar: e.target.checked})}
                      />
                      <span className="text-gray-300">Hotjar</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <Megaphone size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Marketing
                </span>
              </div>
              <div className="collapse-content">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Contenuti personalizzati</span>
                  <input 
                    type="checkbox" 
                    className="toggle bg-card-base-100 border-blue-900/30 hover:border-purple-500 checked:bg-purple-500"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  <X size={14} className="inline mr-1 text-purple-400" />
                  Solo per utenti registrati over 21
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white flex-1"
                onClick={handleSave}
              >
                Conferma Scelte
              </button>
              <button 
                className="btn btn-outline border-blue-900/30 hover:bg-blue-900/20 hover:border-purple-500 text-gray-300 flex-1"
                onClick={handleRejectAll}
              >
                Rifiuta Non Essenziali
              </button>
            </div>

            {showConfirmation && (
              <div className="toast toast-center">
                <div className="alert bg-purple-900/30 border border-purple-500/50 text-purple-400">
                  <Check size={20} className="text-purple-400" />
                  <span>Impostazioni aggiornate</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Consulta la nostra{' '}
            <a href="/about/privacy" className="text-blue-400 hover:text-purple-400 transition-colors">
              Privacy Policy Completa
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePage;