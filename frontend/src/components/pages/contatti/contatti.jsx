import { ArrowRight, MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const Contatti = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    messaggio: "",
    privacy: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("scrivici");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form inviato:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({
      nome: "",
      email: "",
      messaggio: "",
      privacy: false
    });
  };

  const uffici = [
    {
      citta: "Milano",
      indirizzo: "Via Innovazione 42, 20100",
      telefono: "+39 02 1234567",
      email: "milano@justweed.com",
      orari: "Lun-Ven: 9:00-18:00",
      image: "https://images.pexels.com/photos/4161863/pexels-photo-4161863.jpeg"
    },
    {
      citta: "Roma",
      indirizzo: "Piazza Sostenibilità 15, 00100",
      telefono: "+39 06 7654321",
      email: "roma@justweed.com",
      orari: "Lun-Ven: 8:30-17:30",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5"
    }
  ];

  const faqs = [
    {
      id: 1,
      domanda: "Come posso ordinare i vostri prodotti?",
      risposta: "Attualmente i nostri prodotti sono disponibili attraverso una rete di distributori autorizzati. Contattaci per conoscere il punto vendita più vicino a te."
    },
    {
      id: 2,
      domanda: "Offrite servizi B2B?",
      risposta: "Sì, lavoriamo con aziende interessate a soluzioni sostenibili. Il nostro team B2B sarà lieto di valutare le tue esigenze specifiche."
    },
    {
      id: 3,
      domanda: "Qual è la vostra politica sulla sostenibilità?",
      risposta: "La sostenibilità è al centro del nostro business. Utilizziamo solo materiali riciclati, energie rinnovabili e seguiamo rigorosi protocolli di economia circolare."
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Contattaci
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Hai domande, suggerimenti o vuoi collaborare con noi? Siamo qui per aiutarti.
          </p>
        </div>

        <div className="tabs tabs-boxed bg-base-200 border border-blue-900/30 max-w-md mx-auto mb-12">
          <button 
            className={`tab text-gray-500 flex-1 ${activeTab === 'scrivici' ? 'tab-active bg-gradient-to-r from-blue-500/20 to-purple-500/20' : ''}`}
            onClick={() => setActiveTab("scrivici")}
          >
            Scrivici
          </button> 
          <button 
            className={`tab text-gray-500 flex-1 ${activeTab === 'uffici' ? 'tab-active bg-gradient-to-r from-blue-500/20 to-purple-500/20' : ''}`}
            onClick={() => setActiveTab("uffici")}
          >
            Uffici
          </button>
          <button 
            className={`tab text-gray-500 flex-1 ${activeTab === 'faq' ? 'tab-active bg-gradient-to-r from-blue-500/20 to-purple-500/20' : ''}`}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
        </div>

        <div className="bg-base-200 rounded-xl border border-blue-900/30 shadow-lg p-6 md:p-8 mb-12">
          {activeTab === "scrivici" && (
            <div className="max-w-2xl mx-auto">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                  <h3 className="text-2xl font-bold mb-2">Grazie per il tuo messaggio!</h3>
                  <p className="text-gray-300 mb-6">
                    Ti risponderemo al più presto. Nel frattempo, perché non esplorare il nostro blog?
                  </p>
                  <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
                    Vai al blog
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Nome</span>
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="input input-bordered w-full bg-card-base-100 border-blue-900/30 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered w-full bg-card-base-100 border-blue-900/30 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text text-gray-300">Messaggio</span>
                    </label>
                    <textarea
                      name="messaggio"
                      value={formData.messaggio}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full h-32 bg-card-base-100 border-blue-900/30 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                  <div className="form-control mb-8">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        name="privacy"
                        checked={formData.privacy}
                        onChange={handleChange}
                        className="checkbox checkbox-primary bg-card-base-100 border-blue-900/30 checked:border-blue-500"
                        required
                      />
                      <span className="label-text text-gray-300">
                        Acconsento al trattamento dei dati personali secondo la <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 gap-2"
                  >
                    <Send size={18} />
                    Invia messaggio
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === "uffici" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {uffici.map((ufficio, index) => (
                <div key={index} className="bg-card-base-100 rounded-xl border border-blue-900/30 hover:border-blue-500/50 transition-all overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 overflow-hidden">
                    <img 
                      src={ufficio.image} 
                      alt={`Ufficio ${ufficio.citta}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-400">{ufficio.citta}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                        <p className="text-gray-300">{ufficio.indirizzo}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="text-blue-400" size={18} />
                        <a href={`tel:${ufficio.telefono}`} className="text-gray-300 hover:text-blue-400">
                          {ufficio.telefono}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="text-blue-400" size={18} />
                        <a href={`mailto:${ufficio.email}`} className="text-gray-300 hover:text-blue-400">
                          {ufficio.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-blue-400" size={18} />
                        <p className="text-gray-300">{ufficio.orari}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="bg-card-base-100 rounded-xl border border-blue-900/30 overflow-hidden"
                  >
                    <button
                      className="w-full p-5 text-left flex justify-between items-center hover:bg-card-base-100/80 transition-colors"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h3 className="font-medium text-white">{faq.domanda}</h3>
                      <ChevronDown 
                        className={`text-blue-400 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`} 
                        size={20} 
                      />
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-5 pb-5 pt-2 border-t border-blue-900/30">
                        <p className="text-gray-300">{faq.risposta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-900/30">
                <h3 className="text-xl font-bold mb-4 text-white">Non hai trovato quello che cercavi?</h3>
                <p className="text-gray-300 mb-4">Il nostro team di supporto è disponibile per rispondere a tutte le tue domande.</p>
                <button 
                  className="btn btn-ghost text-blue-400 hover:text-white group"
                  onClick={() => setActiveTab("scrivici")}
                >
                  Contattaci ora 
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a 
            href="mailto:info@justweed.com" 
            className="bg-base-200 p-5 rounded-xl border border-blue-900/30 hover:border-blue-500/50 transition-all flex items-center gap-4 group"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
              <Mail className="text-blue-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Email</h4>
              <p className="text-sm text-gray-300">info@justweed.com</p>
            </div>
          </a>
          
          <a 
            href="tel:+390212345678" 
            className="bg-base-200 p-5 rounded-xl border border-blue-900/30 hover:border-blue-500/50 transition-all flex items-center gap-4 group"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
              <Phone className="text-blue-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Telefono</h4>
              <p className="text-sm text-gray-300">+39 02 123 4567</p>
            </div>
          </a>
          
          <div className="bg-base-200 p-5 rounded-xl border border-blue-900/30 flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg">
              <Clock className="text-blue-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Orari</h4>
              <p className="text-sm text-gray-300">Lun-Ven: 9:00-18:00</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contatti;