import { Scale, AlertTriangle, Wallet, Shield, Clock, BookOpen, Mail } from "lucide-react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const TerminiPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 text-white">
      <TopBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full mb-4 border border-blue-900/30">
            <Scale size={18} className="text-blue-400" />
            <span className="text-blue-400">Ultimo aggiornamento: 25 Maggio 2024</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Condizioni di Servizio
          </h1>
          <p className="text-gray-300 text-lg">
            Regolamentazione per l'accesso ai prodotti di cannabis legale
          </p>
        </div>

        <div className="bg-card-base-100 rounded-xl border border-blue-900/30 p-6 shadow-lg">
          <div className="space-y-6">
            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <BookOpen size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Accettazione Condizioni
                </span>
              </div>
              <div className="collapse-content">
                <div className="text-gray-300 space-y-4">
                  <p>
                    L'accesso alla piattaforma implica l'accettazione delle normative sul cannabis legale
                    e delle seguenti condizioni:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-900/10 rounded-xl">
                      <h4 className="font-bold text-purple-400 mb-2">Requisiti Legali</h4>
                      <ul className="list-disc pl-4 space-y-2">
                        <li>Età minima 21 anni</li>
                        <li>Residenza in stati autorizzati</li>
                        <li>Assenza di controindicazioni mediche</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-900/10 rounded-xl">
                      <h4 className="font-bold text-purple-400 mb-2">Oblighi</h4>
                      <ul className="list-disc pl-4 space-y-2">
                        <li>Verifica identità</li>
                        <li>Uso personale esclusivo</li>
                        <li>Conservazione appropriata</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <Wallet size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Transazioni Regolamentate
                </span>
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">Pagamenti Sicuri</h4>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Carte accreditate (no prepagate)</li>
                      <li>Transazioni tracciabili</li>
                      <li>Criptovalute selezionate</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-900/10 rounded-xl">
                    <h4 className="font-bold text-purple-400 mb-2">Politiche Commerciali</h4>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Resi entro 7 giorni lavorativi</li>
                      <li>Prodotti sigillati originali</li>
                      <li>Limite acquisto mensile</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <AlertTriangle size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Limitazioni Legali
                </span>
              </div>
              <div className="collapse-content">
                <div className="text-gray-300 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-900/10 rounded-xl">
                      <h4 className="font-bold text-purple-400 mb-2">Responsabilità Utente</h4>
                      <ul className="list-disc pl-4 space-y-2">
                        <li>Dosaggio consapevole</li>
                        <li>Divieto rivendita</li>
                        <li>Uso in aree autorizzate</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-900/10 rounded-xl">
                      <h4 className="font-bold text-purple-400 mb-2">Esclusioni</h4>
                      <ul className="list-disc pl-4 space-y-2">
                        <li>Reazioni individuali</li>
                        <li>Uso improprio dispositivi</li>
                        <li>Contenuto THC variabile</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 border border-blue-900/30 hover:border-purple-500/50 transition-colors">
              <input type="checkbox" />
              <div className="collapse-title font-bold text-xl flex items-center gap-3">
                <Shield size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Proprietà Intellettuale
                </span>
              </div>
              <div className="collapse-content">
                <div className="overflow-x-auto">
                  <table className="table w-full text-gray-300">
                    <thead className="bg-blue-900/10">
                      <tr>
                        <th className="text-purple-400">Elemento</th>
                        <th className="text-purple-400">Protezione</th>
                        <th className="text-purple-400">Licenze</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { element: "Marchi Registrati", protection: "USPTO, EUIPO", license: "All rights reserved" },
                        { element: "Processi Produttivi", protection: "Brevetto #US2022154", license: "Confidenziale" },
                        { element: "Contenuti Didattici", protection: "Creative Commons", license: "CC BY-NC-ND" }
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-blue-900/10 border-b border-blue-900/30">
                          <td>{item.element}</td>
                          <td>{item.protection}</td>
                          <td>{item.license}</td>
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
                <Clock size={20} className="text-purple-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Modifiche Legali
                </span>
              </div>
              <div className="collapse-content">
                <div className="text-gray-300 space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Aggiornamenti in linea con le leggi sulla cannabis</li>
                    <li>Notifica tramite canali ufficiali registrati</li>
                    <li>Obbligo di revisione periodica</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card-base-100 rounded-xl p-6 border border-blue-900/30 mt-8 shadow-lg">
              <div className="flex items-start gap-4">
                <Mail className="text-purple-400 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Ufficio Legale Regolamentato
                  </h3>
                  <p className="text-gray-300">
                    Contatti autorizzati: <br />
                    <a href="mailto:compliance@justweed.com" className="text-blue-400 hover:text-purple-400 transition-colors">
                      legal@justweed.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Autorizzazione n. CAN-IT-2024 | P.IVA 0123456789
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Dispute soggette alla legge dello Stato di registrazione e alla normativa UE sulla cannabis legale.
            <br />
            Foro competente: Corte Arbitrale Specializzata per Cannabis Terapeutica.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TerminiPage;