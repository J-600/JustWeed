import { Search, Calendar, Tag, ArrowRight, BookOpen, Star } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const CATEGORIES = [
  {
    "name": "Normativa",
    "color": "bg-gradient-to-r from-blue-500 to-indigo-600"
  },
  {
    "name": "Coltivazione",
    "color": "bg-gradient-to-r from-green-500 to-emerald-600"
  },
  {
    "name": "Scienza",
    "color": "bg-gradient-to-r from-purple-500 to-fuchsia-600"
  },
  {
    "name": "Salute",
    "color": "bg-gradient-to-r from-red-500 to-pink-600"
  },
  {
    "name": "Business",
    "color": "bg-gradient-to-r from-amber-500 to-orange-600"
  },
  {
    "name": "Ricette",
    "color": "bg-gradient-to-r from-yellow-500 to-amber-500"
  },
  {
    "name": "Psichedelici",
    "color": "bg-gradient-to-r from-violet-500 to-purple-600"
  },
  {
    "name": "Ricerca",
    "color": "bg-gradient-to-r from-cyan-500 to-blue-500"
  },
  {
    "name": "Internazionale",
    "color": "bg-gradient-to-r from-rose-500 to-red-500"
  },
  {
    "name": "Economia",
    "color": "bg-gradient-to-r from-lime-500 to-green-600"
  }
];

const POSTS = [
  {
    "id": 1,
    "title": "Cannabis legale in Italia: tutto quello che c'è da sapere nel 2024",
    "date": "10 Gen 2024",
    "excerpt": "Guida completa sulla normativa italiana riguardante la cannabis light, THC e CBD, con le ultime novità legislative...",
    "category": "Normativa",
    "readTime": "6 min",
    "tags": ["Cannabis", "Legale", "Italia"],
    "featured": true,
    "content": "...",
    "image": "https://images.pexels.com/photos/2178565/pexels-photo-2178565.jpeg"
  },
  {
    "id": 2,
    "title": "Coltivazione domestica di cannabis: i segreti per iniziare",
    "date": "22 Feb 2024",
    "excerpt": "Manuale pratico per coltivare cannabis in casa rispettando i limiti di legge, dalla scelta delle sementi alla raccolta...",
    "category": "Coltivazione",
    "readTime": "8 min",
    "tags": ["Guida", "Fai-da-te", "Indoor"],
    "featured": true,
    "content": "...",
    "image": "https://images.pexels.com/photos/8139707/pexels-photo-8139707.jpeg"
  },
  {
    "id": 3,
    "title": "CBD vs THC: differenze, effetti e usi terapeutici",
    "date": "5 Mar 2024",
    "excerpt": "Analisi scientifica dei due principali cannabinoidi, con una comparazione degli effetti e delle applicazioni mediche...",
    "category": "Scienza",
    "readTime": "7 min",
    "tags": ["Cannabinoidi", "Salute", "Terapia"],
    "featured": false,
    "content": "...",
    "image": "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg"
  },
  {
    "id": 4,
    "title": "I Paesi più avanzati nella legalizzazione: modelli a confronto",
    "date": "18 Apr 2024",
    "excerpt": "Dall'Olanda al Canada, passando per alcuni stati USA: come funzionano i diversi modelli di regolamentazione...",
    "category": "Internazionale",
    "readTime": "9 min",
    "tags": ["Legalizzazione", "Confronto", "Global"],
    "featured": true,
    "content": "...",
    "image": "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
  },
  {
    "id": 5,
    "title": "Cannabis terapeutica: come ottenerla e a cosa serve",
    "date": "30 Mag 2024",
    "excerpt": "Procedura completa per accedere alla cannabis medica in Italia, con l'elenco delle patologie coperte...",
    "category": "Salute",
    "readTime": "5 min",
    "tags": ["Medicina", "Ricetta", "Pazienti"],
    "featured": false,
    "content": "...",
    "image": "https://images.unsplash.com/photo-1576086213369-97a306d36557"
  },
  {
    "id": 6,
    "title": "Le nuove frontiere degli edibles: ricette e dosaggi",
    "date": "12 Giu 2024",
    "excerpt": "Dai brownies alle caramelle gommose, come preparare alimenti con cannabis rispettando le dosi sicure...",
    "category": "Ricette",
    "readTime": "10 min",
    "tags": ["Cucina", "Dosi", "Fai-da-te"],
    "featured": false,
    "content": "...",
    "image": "https://images.unsplash.com/photo-1497534446932-c925b458314e"
  },
  {
    "id": 7,
    "title": "Psilocibina legalizzata: la rivoluzione dell'Oregon",
    "date": "25 Lug 2024",
    "excerpt": "Reportage dallo stato americano pioniere nella depenalizzazione dei funghi allucinogeni a scopo terapeutico...",
    "category": "Psichedelici",
    "readTime": "6 min",
    "tags": ["Funghi", "Legale", "USA"],
    "featured": true,
    "content": "...",
    "image": "https://images.pexels.com/photos/6257470/pexels-photo-6257470.jpeg"
  },
  {
    "id": 8,
    "title": "Come aprire un cannabis shop in Italia: requisiti e burocrazia",
    "date": "8 Ago 2024",
    "excerpt": "Guida pratica per avviare un'attività nel settore della cannabis light, con i dettagli legali e fiscali...",
    "category": "Business",
    "readTime": "8 min",
    "tags": ["Negozio", "Startup", "Regole"],
    "featured": false,
    "content": "...",
    "image": "https://media.istockphoto.com/id/1403657533/it/foto/piccolo-caffè-allaperto.jpg?b=1&s=612x612&w=0&k=20&c=JIchVq6wT-KuaLLdTDrO3tfMgvtkdS-cepVOhd_kQGo="
  },
  {
    "id": 9,
    "title": "Ketamina: da anestetico a trattamento per la depressione",
    "date": "20 Set 2024",
    "excerpt": "Come la sostanza è passata dall'uso ospedaliero alla terapia per disturbi mentali in contesti controllati...",
    "category": "Ricerca",
    "readTime": "7 min",
    "tags": ["Ketamina", "Depressione", "Terapia"],
    "featured": false,
    "content": "...",
    "image": "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb"
  },
  {
    "id": 10,
    "title": "L'impatto economico della legalizzazione: dati e statistiche",
    "date": "3 Ott 2024",
    "excerpt": "Analisi dei benefici economici nei Paesi che hanno legalizzato, tra aumento del PIL e riduzione dei costi sociali...",
    "category": "Economia",
    "readTime": "9 min",
    "tags": ["Soldi", "Tasse", "Mercato"],
    "featured": true,
    "content": "...",
    "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
  }
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [featuredPostExpanded, setFeaturedPostExpanded] = useState(false);

  const filteredPosts = useMemo(() => {
    return POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Tutti" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const featuredPosts = useMemo(() => filteredPosts.filter(post => post.featured), [filteredPosts]);
  const regularPosts = useMemo(() => filteredPosts.filter(post => !post.featured), [filteredPosts]);

  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleCategoryChange = useCallback((e) => setSelectedCategory(e.target.value), []);
  const toggleFeaturedPost = useCallback(() => setFeaturedPostExpanded(prev => !prev), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-neutral text-white">
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-normal">
              Blog JustWeed
            </h1>
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Scopri le ultime novità su sostenibilità, tecnologia e innovazione nel nostro settore
          </p>
        </div>

        <div className="bg-neutral rounded-xl p-6 border border-blue-900/30 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                placeholder="Cerca articoli..."
                className="input input-bordered w-full pl-10 bg-card-base-100 border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <select
              className="select select-bordered bg-card-base-100 border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="Tutti">Tutte le categorie</option>
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("Tutti")}
              className={`badge gap-2 transition-all ${selectedCategory === "Tutti" ?
                'bg-blue-500/20 border-blue-500 text-blue-400' :
                'bg-card-base-100 border-blue-900/30 text-gray-300'}`}
            >
              <Tag size={14} />
              Tutti
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`badge gap-2 border-none ${cat.color} text-white ${selectedCategory === cat.name ? 'badge-outline border-white/30' : ''}`}
              >
                <Tag size={14} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {featuredPosts.map(post => (
          <FeaturedPost
            key={post.id}
            post={post}
            isExpanded={featuredPostExpanded}
            onToggle={toggleFeaturedPost}
            categoryColor={CATEGORIES.find(c => c.name === post.category)?.color}
          />
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {regularPosts.map(post => (
            <RegularPost
              key={post.id}
              post={post}
              categoryColor={CATEGORIES.find(c => c.name === post.category)?.color}
            />
          ))}
        </div>

        <NewsletterSection />
      </div>

      <Footer />
    </div>
  );
};

const FeaturedPost = ({ post, isExpanded, onToggle, categoryColor }) => (
  <div className="bg-neutral rounded-xl border border-blue-900/30 mb-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-6 sm:p-8 relative">
        <div className="flex items-center gap-2 mb-4">
          <div className={`badge gap-2 ${categoryColor} border-none text-white`}>
            <Star size={14} className="fill-current" />
            In evidenza
          </div>
          <div className="badge badge-outline border-blue-900/30 text-blue-400">
            {post.category}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-4">{post.title}</h2>

        <p className={`text-gray-300 mb-6 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {isExpanded ? post.excerpt + post.content : post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <span key={tag} className="badge badge-outline border-blue-900/30 text-blue-400">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-blue-400" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={16} className="text-purple-400" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onToggle}
              className="btn btn-ghost btn-sm text-blue-400 hover:text-white"
            >
              {isExpanded ? 'Mostra meno' : 'Leggi tutto'}
              <ArrowRight size={16} className={`ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
            <button className="btn btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
              Leggi articolo
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center p-4">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full max-h-96 object-cover rounded-lg shadow-md"
          loading="lazy"
          width={500}
          height={300}
        />
      </div>
    </div>
  </div>
);

const RegularPost = ({ post, categoryColor }) => (
  <article className="bg-neutral rounded-xl border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden">
    <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 overflow-hidden">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover"
        loading="lazy"
        width={400}
        height={200}
      />
    </div>

    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <span className={`badge ${categoryColor} border-none text-white`}>
          {post.category}
        </span>
        <span className="text-sm text-gray-400 flex items-center gap-1">
          <BookOpen size={14} />
          {post.readTime}
        </span>
      </div>

      <h3 className="font-bold text-xl mb-3">{post.title}</h3>
      <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map(tag => (
          <span key={tag} className="badge badge-outline border-blue-900/30 text-blue-400">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400 flex items-center gap-1">
          <Calendar size={14} className="text-blue-400" />
          {post.date}
        </div>
        <button className="btn btn-ghost btn-sm text-blue-400 hover:text-white group">
          Leggi tutto
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </article>
);

const NewsletterSection = () => (
  <div className="bg-neutral rounded-xl p-8 border border-blue-900/30 shadow-lg mb-12">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Rimani aggiornato
      </h2>
      <p className="text-gray-300 mb-6 text-lg">
        Iscriviti alla nostra newsletter per ricevere gli ultimi articoli e aggiornamenti
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="email"
          placeholder="La tua email"
          className="input input-bordered flex-1 bg-card-base-100 border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
        <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
          Iscriviti
        </button>
      </div>
      <p className="text-gray-500 text-sm mt-4">
        Non condividiamo la tua email con nessuno. Cancellati quando vuoi.
      </p>
    </div>
  </div>
);

export default BlogPage;