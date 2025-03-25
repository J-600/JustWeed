import { BadgeCheck, Leaf, FlaskConical, Scale, Download, Clock, ArrowRight, Calendar, Award as Certificate } from "lucide-react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const CertificazioniPage = () => {
  const certifications = [
    {
      title: "GMP Cannabis Production",
      issuer: "European Cannabis Regulatory Authority",
      validity: "2024-2026",
      status: "active",
      icon: <FlaskConical className="text-blue-400" />
    },
    {
      title: "Organic Cannabis Certification",
      issuer: "EU Organic Certification Body",
      validity: "2024-2027",
      status: "active",
      icon: <Leaf className="text-blue-400" />
    },
    {
      title: "ISO 21725:2020 (Cannabis)",
      issuer: "International Organization for Standardization",
      validity: "2022-2025",
      status: "active",
      icon: <Scale className="text-blue-400" />
    },
    {
      title: "Extraction Facility License",
      issuer: "National Cannabis Control Commission",
      validity: "2021-2023",
      status: "expired",
      icon: <Certificate className="text-blue-400" />
    },
    {
      title: "THC Compliance Certification",
      issuer: "Cannabis Quality Assurance Board",
      validity: "2023-2024",
      status: "in-renewal",
      icon: <BadgeCheck className="text-blue-400" />
    }
  ];

  const statusColors = {
    active: "bg-blue-900/20 text-blue-400",
    expired: "bg-red-900/20 text-red-400",
    "in-renewal": "bg-purple-900/20 text-purple-400"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] text-white">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-12 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Certificazioni di Settore
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Compliance totale con le normative e certificazioni internazionali per la produzione di cannabis terapeutica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { 
              title: "Certificazioni Attive", 
              value: "15",
              icon: <BadgeCheck className="text-blue-400" />,
              bg: "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            },
            { 
              title: "Conformità Regolatoria", 
              value: "100%",
              icon: <Scale className="text-blue-400" />,
              bg: "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
            },
            { 
              title: "Ispezioni Annuali", 
              value: "24",
              icon: <Clock className="text-blue-400" />,
              bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
            }
          ].map((metric, i) => (
            <div key={i} className="bg-[#2A3447] p-6 rounded-xl border border-blue-900/30 hover:border-purple-500/50 transition-all shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${metric.bg} p-2 rounded-lg`}>
                  {metric.icon}
                </div>
                <h3 className="font-bold text-lg">{metric.title}</h3>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-8 mb-12 shadow-lg">
          <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Certificazioni Attive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-[#1E2633] p-6 rounded-xl border border-blue-900/30 hover:border-purple-500/50 transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-blue-900/20 p-3 rounded-lg group-hover:bg-purple-900/20 transition-colors">
                    {cert.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{cert.title}</h3>
                    <div className={`badge ${statusColors[cert.status]}`}>
                      {cert.status === "in-renewal" ? "In Rinnovo" : cert.status}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar size={14} className="text-blue-400" />
                    <span>Valida fino al {cert.validity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Certificate size={14} className="text-blue-400" />
                    <span>{cert.issuer}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="btn btn-ghost btn-sm text-blue-400 hover:text-purple-400">
                    <Download size={16} />
                    Documenti
                  </button>
                  <button className="btn btn-ghost btn-sm text-purple-400 hover:text-blue-400">
                    Dettagli <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Processo di Certificazione
            </h2>
            <div className="space-y-6">
              {[
                { step: 1, title: "Analisi Coltivazione", duration: "2-4 settimane" },
                { step: 2, title: "Test di Laboratorio", duration: "1-2 mesi" },
                { step: 3, title: "Ispezione Impianti", duration: "3-5 giorni" },
                { step: 4, title: "Monitoraggio Continuo", duration: "Continuativo" }
              ].map((process, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-blue-900/20 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {process.step}
                  </div>
                  <div>
                    <h4 className="font-bold">{process.title}</h4>
                    <p className="text-sm text-gray-300">{process.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#2A3447] rounded-xl border border-blue-900/30 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cronologia Certificazioni
            </h2>
            <div className="space-y-4">
              {[
                { year: 2024, event: "Certificazione GMP Cannabis Livello 2", type: "success" },
                { year: 2023, event: "Autorizzazione Estrazioni Premium", type: "new" },
                { year: 2022, event: "Certificazione THC Compliance EU", type: "achievement" },
                { year: 2021, event: "Licenza Produzione Base", type: "milestone" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 border-l-2 border-blue-900/30 pl-4 group">
                  <div className="bg-blue-900/20 text-blue-400 px-3 py-1 rounded-full text-sm group-hover:bg-purple-900/20 transition-colors">
                    {item.year}
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-purple-400 transition-colors">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#2A3447] rounded-xl p-8 border border-blue-900/30 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Documentazione Completa
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Accesso riservato a enti regolatori e partner autorizzati
          </p>
          <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white gap-2">
            <Download size={18} />
            Scarica Certificazioni
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CertificazioniPage;