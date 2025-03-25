import { Search, Calendar, Tag, ArrowRight, BookOpen, Star } from "lucide-react";
import { useState } from "react";
import TopBar from "../../navbar/topbar";
import Footer from "../../navbar/footer";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [featuredPostExpanded, setFeaturedPostExpanded] = useState(false);

  const categories = [
    { name: "Sostenibilità", color: "bg-gradient-to-r from-green-500 to-teal-500" },
    { name: "Tecnologia", color: "bg-gradient-to-r from-blue-500 to-purple-500" },
    { name: "Notizie", color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
    { name: "Guide", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { name: "Energia", color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
    { name: "Tecnologia", color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
    { name: "Ambiente", color: "bg-gradient-to-r from-green-500 to-teal-500" },
    { name: "Innovazione", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { name: "Design", color: "bg-gradient-to-r from-red-500 to-orange-500" },
    { name: "Economia", color: "bg-gradient-to-r from-gray-500 to-gray-900" },
    { name: "Alimentazione", color: "bg-gradient-to-r from-yellow-400 to-green-400" },
    { name: "Educazione", color: "bg-gradient-to-r from-blue-400 to-cyan-500" }
  ];

  const posts = [
    {
      id: 1,
      title: "Il futuro della coltivazione sostenibile",
      date: "15 Mag 2024",
      excerpt: "Esploriamo le nuove tecniche di agricoltura a basso impatto ambientale che stiamo implementando nelle nostre coltivazioni...",
      category: "Sostenibilità",
      readTime: "5 min",
      tags: ["Agricoltura", "Innovazione"],
      featured: true,
      content: "...",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae"
    },
    {
      id: 2,
      title: "L'energia solare nelle comunità rurali",
      date: "20 Mag 2024",
      excerpt: "Scopriamo come le comunità rurali stanno adottando l'energia solare per ridurre i costi e l'impatto ambientale...",
      category: "Energia",
      readTime: "6 min",
      tags: ["Energia Rinnovabile", "Comunità"],
      featured: false,
      content: "...",
      image: "https://images.unsplash.com/photo-1604079628045-4e22a5fcf0a9"
    },
    {
      id: 3,
      title: "Il boom della mobilità elettrica",
      date: "25 Mag 2024",
      excerpt: "Le auto elettriche stanno rivoluzionando il settore dei trasporti: quali sono le ultime novità?",
      category: "Tecnologia",
      readTime: "7 min",
      tags: ["Mobilità", "Innovazione"],
      featured: true,
      content: "...",
      image: "https://images.unsplash.com/photo-1592194996308-7b43878e84aa"
    },
    {
      id: 4,
      title: "L'importanza della biodiversità nelle città",
      date: "30 Mag 2024",
      excerpt: "Scopriamo come il verde urbano può migliorare la qualità della vita e favorire la biodiversità...",
      category: "Ambiente",
      readTime: "5 min",
      tags: ["Natura", "Urbanistica"],
      featured: false,
      content: "...",
      image: "https://images.unsplash.com/photo-1541417904950-4b55c13c162a"
    },
    {
      id: 5,
      title: "Tecnologie emergenti nella lotta ai cambiamenti climatici",
      date: "5 Giu 2024",
      excerpt: "Dalle alghe ai droni, ecco le tecnologie più promettenti per combattere il cambiamento climatico...",
      category: "Innovazione",
      readTime: "8 min",
      tags: ["Tecnologia", "Ambiente"],
      featured: true,
      content: "...",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    },
    {
      id: 6,
      title: "L'architettura sostenibile del futuro",
      date: "10 Giu 2024",
      excerpt: "Dagli edifici a energia zero alle case in bioedilizia, ecco il futuro dell’architettura verde...",
      category: "Design",
      readTime: "6 min",
      tags: ["Architettura", "Sostenibilità"],
      featured: false,
      content: "...",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324"
    },
    {
      id: 7,
      title: "L'economia circolare spiegata semplicemente",
      date: "15 Giu 2024",
      excerpt: "Come possiamo ridurre gli sprechi e riutilizzare le risorse? Ecco i principi dell'economia circolare...",
      category: "Economia",
      readTime: "5 min",
      tags: ["Sostenibilità", "Innovazione"],
      featured: true,
      content: "...",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
    },
    {
      id: 8,
      title: "L'intelligenza artificiale al servizio dell’ambiente",
      date: "20 Giu 2024",
      excerpt: "Dai modelli predittivi alla gestione delle risorse, ecco come l'IA sta aiutando il pianeta...",
      category: "Tecnologia",
      readTime: "7 min",
      tags: ["IA", "Ambiente"],
      featured: false,
      content: "...",
      image: "https://images.unsplash.com/photo-1526374870839-e155464bb9c5"
    },
    {
      id: 9,
      title: "Il futuro del cibo: carne coltivata in laboratorio",
      date: "25 Giu 2024",
      excerpt: "Sarà davvero il cibo del futuro? Analizziamo i pro e i contro della carne coltivata...",
      category: "Alimentazione",
      readTime: "6 min",
      tags: ["FoodTech", "Innovazione"],
      featured: true,
      conten: "...",
      image: "https://images.unsplash.com/photo-1608571426849-f5c84279361d"
    },
    {
      id: 10,
      title: "L'importanza dell'educazione ambientale",
      date: "30 Giu 2024",
      excerpt: "Per un futuro più sostenibile, l'educazione ambientale è fondamentale. Scopriamo perché...",
      category: "Educazione",
      readTime: "5 min",
      tags: ["Ambiente", "Scuola"],
      featured: false,
      content: "...",
      image: "https://images.unsplash.com/photo-1562564055-71e051d33c19"
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tutti" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] text-white">
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient leading-normal">
              Blog JustWeed
            </h1>
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Scopri le ultime novità su sostenibilità, tecnologia e innovazione nel nostro settore
          </p>
        </div>

        <div className="bg-[#1E2633] rounded-xl p-6 border border-blue-900/30 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                placeholder="Cerca articoli..."
                className="input input-bordered w-full pl-10 bg-[#2A3447] border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="select select-bordered bg-[#2A3447] border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Tutti">Tutte le categorie</option>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("Tutti")}
              className={`badge gap-2 transition-all ${selectedCategory === "Tutti" ?
                'bg-blue-500/20 border-blue-500 text-blue-400' :
                'bg-[#2A3447] border-blue-900/30 text-gray-300'}`}
            >
              <Tag size={14} />
              Tutti
            </button>
            {categories.map(cat => (
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

        {posts.filter(post => post.featured).map(post => (
          <div
            key={post.id}
            className="bg-[#1E2633] rounded-xl border border-blue-900/30 mb-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-6 sm:p-8 relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`badge gap-2 ${categories.find(c => c.name === post.category)?.color} border-none text-white`}>
                    <Star size={14} className="fill-current" />
                    In evidenza
                  </div>
                  <div className="badge badge-outline border-blue-900/30 text-blue-400">
                    {post.category}
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{post.title}</h2>

                <p className={`text-gray-300 mb-6 ${featuredPostExpanded ? '' : 'line-clamp-3'}`}>
                  {featuredPostExpanded ? post.excerpt + post.content : post.excerpt}
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
                      onClick={() => setFeaturedPostExpanded(!featuredPostExpanded)}
                      className="btn btn-ghost btn-sm text-blue-400 hover:text-white"
                    >
                      {featuredPostExpanded ? 'Mostra meno' : 'Leggi tutto'}
                      <ArrowRight size={16} className={`ml-1 transition-transform ${featuredPostExpanded ? 'rotate-90' : ''}`} />
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
                />
              </div>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.filter(post => !post.featured).map(post => (
            <article
              key={post.id}
              className="bg-[#1E2633] rounded-xl border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${categories.find(c => c.name === post.category)?.color} border-none text-white`}>
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
          ))}
        </div>
        <div className="bg-[#1E2633] rounded-xl p-8 border border-blue-900/30 shadow-lg mb-12">
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
                className="input input-bordered flex-1 bg-[#2A3447] border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
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
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;