# JustWeed


import { useState } from 'react';

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const product = {
    title: "Cuffie Wireless Premium con Cancellazione del Rumore",
    price: 299.99,
    rating: 4.5,
    reviewsCount: 2458,
    images: [
      '/images/headphones-1.jpg',
      '/images/headphones-2.jpg',
      '/images/headphones-3.jpg',
      '/images/headphones-4.jpg'
    ],
    description: "Cuffie over-ear con cancellazione attiva del rumore, batteria da 40 ore, certificazione IPX4, compatibilità multipla e suono surround ad alta fedeltà.",
    features: [
      'Cancellazione attiva del rumore',
      'Autonomia 40 ore',
      'Ricarica rapida USB-C',
      'Connessione Bluetooth 5.3',
      'Certificazione IPX4'
    ],
    specs: {
      brand: 'AudioPro',
      model: 'XQ-200',
      connectivity: 'Bluetooth',
      battery: '40h',
      weight: '265g'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-base-200 rounded-xl p-4">
            <img 
              src={product.images[selectedImage]} 
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`shrink-0 w-20 h-20 rounded-lg border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-base-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover rounded-md" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="rating rating-half">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <input
                    key={rating}
                    type="radio"
                    className={`mask mask-star-2 ${
                      rating <= product.rating ? 'bg-orange-400' : 'bg-gray-300'
                    }`}
                    checked={rating === Math.round(product.rating)}
                    readOnly
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.reviewsCount} recensioni
              </span>
            </div>
            
            <div className="text-4xl font-bold text-primary mb-4">
              €{product.price.toFixed(2)}
            </div>

            <div className="space-y-2 mb-6">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Quantità:</span>
              <select 
                className="select select-bordered"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-4">
              <button className="btn btn-primary btn-block h-16 text-lg">
                Aggiungi al carrello
              </button>
              <button className="btn btn-accent btn-block h-16 text-lg">
                Acquista ora
              </button>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Consegna gratuita entro 2 giorni lavorativi</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>Pagamento sicuro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <div className="tabs">
          <a 
            className={`tab tab-lg ${activeTab === 'description' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Descrizione
          </a> 
          <a 
            className={`tab tab-lg ${activeTab === 'specs' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifiche
          </a>
        </div>

        <div className="pt-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="bg-base-200 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">{key}</div>
                  <div className="font-semibold">{value}</div>
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