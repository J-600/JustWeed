import { ShieldAlert, Lock, Database, Cookie, Mail, ChevronDown } from "lucide-react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 text-white">
      <TopBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full mb-4 border border-blue-900/30">
            <ShieldAlert size={18} className="text-blue-400" />
            <span className="text-blue-400">Ultimo aggiornamento: 25 Maggio 2024</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Privacy & Compliance
          </h1>
          <p className="text-gray-300 text-lg">
            Trasparenza e sicurezza nel trattamento dei dati per il mercato della cannabis legale
          </p>
        </div>
        <div className="bg-card-base-100 rounded-xl border border-blue-900/30 p-6 shadow-lg">
          <div className="space-y-6">
            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <Lock size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Gestione Dati Sensibili
                </span>
              </div>
              <div className="collapse-content">
                <p className="text-gray-300 mb-4">
                  In ottemperanza alle normative sul cannabis legale, gestiamo:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">Dati Primari</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-300">
                      <li>Verifica anagrafica (over 21)</li>
                      <li>Storico acquisti regolamentato</li>
                      <li>Documentazione medica (se applicabile)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">Sicurezza</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-300">
                      <li>Crittografia end-to-end</li>
                      <li>Archiviazione su server EU</li>
                      <li>Audit trimestrali</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <Database size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Utilizzo Dati Regolamentato
                </span>
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">Finalità Obbligatorie</h4>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Compliance normativa cannabis</li>
                      <li>Tracciabilità prodotti</li>
                      <li>Controllo qualità</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">Finalità Opzionali</h4>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Aggiornamenti prodotti (opt-in)</li>
                      <li>Ricerche di mercato anonime</li>
                      <li>Promozioni personalizzate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <Cookie size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Gestione Cookie
                </span>
              </div>
              <div className="collapse-content">
                <div className="overflow-x-auto">
                  <table className="table w-full text-gray-300">
                    <thead className="bg-blue-900/10">
                      <tr>
                        <th className="text-purple-400">Tipo</th>
                        <th className="text-purple-400">Scopo</th>
                        <th className="text-purple-400">Durata</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { type: "Sicurezza", purpose: "Verifica età", duration: "Sessione" },
                        { type: "Preferenze", purpose: "Dosaggio preferito", duration: "30 giorni" },
                        { type: "Analisi", purpose: "Statistiche anonime", duration: "2 anni" }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-blue-900/10 border-b border-blue-900/30">
                          <td>{row.type}</td>
                          <td>{row.purpose}</td>
                          <td>{row.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <ShieldAlert size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Diritti Legali
                </span>
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">GDPR & Cannabis Law</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-300">
                      <li>Accesso dati anonimo</li>
                      <li>Rettifica documentazione</li>
                      <li>Portabilità limitata (per normativa)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">Esercizio Diritti</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-300">
                      <li>Verifica identità obbligatoria</li>
                      <li>Canale dedicato DPO</li>
                      <li>Massimo 30 giorni per risposta</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card-base-100 rounded-xl p-6 border border-blue-900/30 mt-8 shadow-lg">
              <div className="flex items-start gap-4">
                <Mail className="text-purple-400 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Ufficio Compliance Cannabis
                  </h3>
                  <p className="text-gray-300">
                    Responsabile DPO:{" "}
                    <a href="mailto:compliance@justweed.com" className="text-blue-400 hover:text-purple-400 transition-colors">
                      compliance@justweed.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Orari: Lun-Ven 9-18 (CET) | Emergenze: +39 123 456789
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Documento conforme alle normative UE sulla privacy e alla legge 242/2016 sul cannabis legale.
            <br />
            Revisione successiva prevista: Novembre 2024
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;