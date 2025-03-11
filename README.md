# JustWeed

import { useState } from 'react';

const ProductPage = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descrizione');

  // Funzioni di base mantenute dalla logica originale
  const handleAddToCart = () => {
    // Logica aggiunta al carrello
  };

  const handleBuyNow = () => {
    // Logica acquisto diretto
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sezione Immagini */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-base-200 rounded-xl shadow-sm overflow-hidden">
            <img 
              src={product.images[selectedImage]} 
              className="w-full h-full object-contain p-4"
              alt={product.nome}
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto px-1 pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg transition-all ${
                  selectedImage === index 
                    ? 'border-primary shadow-md' 
                    : 'border-base-300 hover:border-base-content/20'
                }`}
              >
                <img 
                  src={img} 
                  className="w-full h-full object-cover rounded-md" 
                  alt="Anteprima prodotto" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Dettagli Prodotto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-base-content">
              {product.nome}
            </h1>
            
            <div className="flex items-center gap-2 my-4">
              <div className="rating rating-md">
                {[...Array(5)].map((_, i) => (
                  <input
                    key={i}
                    type="radio"
                    name="rating"
                    className={`mask mask-star-2 ${
                      i < product.valutazione ? 'bg-yellow-400' : 'bg-gray-300'
                    }`}
                    checked={i === Math.floor(product.valutazione)}
                    readOnly
                  />
                ))}
              </div>
              <span className="text-sm text-base-content/60">
                ({product.recensioni} recensioni)
              </span>
            </div>

            <div className="text-4xl font-bold text-primary my-6">
              €{product.prezzo.toFixed(2)}
            </div>

            <div className="divider my-6" />

            <div className="grid gap-3 mb-8">
              {product.caratteristiche.map((caratteristica, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg 
                    className="w-5 h-5 text-primary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{caratteristica}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sezione Acquisto */}
          <div className="border-t border-base-200 pt-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="font-semibold text-base">Quantità:</span>
              <select 
                className="select select-bordered select-md w-24"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg h-14 text-lg"
              >
                🛒 Aggiungi al Carrello
              </button>
              <button 
                onClick={handleBuyNow}
                className="btn btn-secondary btn-lg h-14 text-lg"
              >
                🚀 Acquista Ora
              </button>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Reso gratuito entro 30 giorni</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>Pagamento sicuro con crittografia SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Descrizione e Dettagli */}
      <div className="mt-12">
        <div className="tabs tabs-boxed bg-base-200 p-2 rounded-xl">
          <button
            className={`tab tab-lg flex-1 ${
              activeTab === 'descrizione' ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab('descrizione')}
          >
            Descrizione Completa
          </button>
          <button
            className={`tab tab-lg flex-1 ${
              activeTab === 'dettagli' ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab('dettagli')}
          >
            Dettagli Tecnici
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'descrizione' && (
            <div className="prose max-w-none">
              <p className="text-base-content/80 leading-relaxed">
                {product.descrizione}
              </p>
            </div>
          )}

          {activeTab === 'dettagli' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(product.specifiche).map(([key, value]) => (
                <div 
                  key={key} 
                  className="bg-base-100 p-4 rounded-lg border border-base-200"
                >
                  <div className="text-sm text-base-content/60">{key}</div>
                  <div className="font-medium text-base-content">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;