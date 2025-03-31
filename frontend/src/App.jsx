import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useAnimation } from 'framer-motion';
import { 
  FaLeaf, FaLock, FaFlask, FaShieldAlt, 
  FaUser, FaChevronRight, FaBirthdayCake, 
  FaRegEnvelope, FaArrowUp, FaStar,
  FaGooglePlay, FaApple, FaEye
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const FEATURES = [
  {
    icon: <FaLeaf className="w-12 h-12" />,
    title: "Prodotti Certificati",
    description: "Tutti gli articoli sono testati in laboratorio e conformi alla legge italiana"
  },
  {
    icon: <FaFlask className="w-12 h-12" />,
    title: "Analisi Dettagliate",
    description: "Report completi su THC, CBD e composizione per ogni prodotto"
  },
  {
    icon: <FaShieldAlt className="w-12 h-12" />,
    title: "Acquisto Sicuro",
    description: "Pagamenti criptati e consegna anonima con tracciamento in tempo reale"
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Marco R.",
    text: "Servizio eccellente e prodotti di altissima qualità. La spedizione è arrivata in 24 ore!",
    rating: 5
  },
  {
    id: 2,
    name: "Laura B.",
    text: "Finalmente un marketplace affidabile con tutti i certificati necessari. Consigliatissimo!",
    rating: 4
  },
  {
    id: 3,
    name: "Alessio P.",
    text: "L'esperienza d'acquisto più sicura e discreta che abbia mai provato. Tornerò sicuramente.",
    rating: 5
  }
];

const ParticleSystem = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    const colors = ['hsla(168, 76%, 42%, 0.3)', 'hsla(262, 73%, 58%, 0.3)', 'hsla(210, 100%, 56%, 0.3)'];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
        this.velocity = {
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1
        };
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.3 + 0.1;
        this.baseSize = this.size;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.angle += 0.005;
        this.x += Math.cos(this.angle) * 0.3 + this.velocity.x;
        this.y += Math.sin(this.angle) * 0.3 + this.velocity.y;
        
        if (this.x > canvas.width + 20 || this.x < -20 || 
            this.y > canvas.height + 20 || this.y < -20) {
          this.reset();
        }
        
        this.size = this.baseSize * (0.5 + Math.abs(Math.sin(this.angle * 2)) * 5);
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      handleResize();
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

const FeatureCard = ({ icon, title, description, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative p-[2px] bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl hover:shadow-2xl transition-all"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm rounded-xl" />
      
      <div className="relative z-10 card bg-transparent h-full">
        <div className="card-body items-center text-center space-y-4">
          <motion.div
            className="text-primary mb-4"
            animate={{
              rotate: isHovered ? [-15, 15, -15, 15, 0] : 0,
              scale: isHovered ? 1.2 : 1
            }}
            transition={{
              rotate: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.25, 0.5, 0.75, 1]
              },
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 10
              }
            }}
          >
            {icon}
          </motion.div>
          
          <h2 className="card-title text-2xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h2>
          
          <p className="opacity-80 min-h-[60px]">{description}</p>
          
          <motion.div
            className="w-full overflow-hidden"
            initial={{ maxHeight: 0 }}
            animate={{ maxHeight: isHovered ? 100 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="btn btn-sm btn-outline btn-primary w-full transform hover:-translate-y-0.5 transition-all"
              aria-label={`Scopri di più su ${title}`}
            >
              Scopri di più
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const AgeVerificationModal = ({ onVerify }) => {
  return (
    <motion.dialog
      open
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="modal modal-bottom sm:modal-middle"
      role="dialog"
      aria-labelledby="ageVerificationTitle"
    >
      <div className="modal-box bg-neutral text-neutral-content relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaBirthdayCake className="w-16 h-16 text-primary" />
          </motion.div>
          
          <h3 id="ageVerificationTitle" className="text-2xl font-bold">
            Verifica dell'età
          </h3>
          
          <p className="mb-6">
            Per accedere a Justweed devi avere almeno 21 anni.
            <br />
            Confermi di essere maggiorenne?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onVerify(true)}
              className="btn btn-primary gap-2 flex-1 max-w-xs"
            >
              Sì, ho più di 21 anni
              <FaChevronRight />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onVerify(false)}
              className="btn btn-ghost flex-1 max-w-xs"
            >
              Esci
            </motion.button>
          </div>
        </div>
      </div>
    </motion.dialog>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState({
    views: 0,
    users: 0,
    rating: 0
  });

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      // Animazione counter per le views
      const viewsInterval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          views: prev.views >= 12345 ? 12345 : prev.views + 137
        }));
      }, 20);

      // Animazione counter per gli users
      const usersInterval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          users: prev.users >= 15000 ? 15000 : prev.users + 150
        }));
      }, 10);

      // Animazione counter per il rating
      const ratingInterval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          rating: prev.rating >= 4.9 ? 4.9 : +(prev.rating + 0.1).toFixed(1)
        }));
      }, 100);

      return () => {
        clearInterval(viewsInterval);
        clearInterval(usersInterval);
        clearInterval(ratingInterval);
      };
    }
  }, [inView]);

  return (
    <SectionWrapper title="La Nostra Comunità" bgColor="base-100">
      <div className="grid md:grid-cols-3 gap-6" ref={ref}>
        {/* Stat 1 - Utenti Attivi */}
        <motion.div
          className="card bg-base-200 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="card-body relative z-10">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-full w-12 h-12">
                  <FaUser className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Utenti Attivi</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stats.users >= 15000 ? '15K+' : stats.users.toLocaleString()}
                  </span>
                  <span className="text-sm opacity-70">+23% ultimo mese</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="radial-progress text-primary" 
                   style={{"--value":100,"--size":"3rem","--thickness":"6px"}}>
                <span className="text-xs">100%</span>
              </div>
              <p className="text-xs mt-2 opacity-70">Soddisfazione clienti</p>
            </div>
          </div>
        </motion.div>

        {/* Stat 2 - Visualizzazioni */}
        <motion.div
          className="card bg-base-200 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10" />
          <div className="card-body relative z-10">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-gradient-to-r from-secondary to-accent text-secondary-content rounded-full w-12 h-12">
                  <FaEye className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Visualizzazioni</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    {stats.views.toLocaleString()}
                  </span>
                  <span className="text-sm opacity-70">+45% ultimo mese</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="radial-progress text-secondary" 
                   style={{"--value":85,"--size":"3rem","--thickness":"6px"}}>
                <span className="text-xs">85%</span>
              </div>
              <p className="text-xs mt-2 opacity-70">Tasso di crescita</p>
            </div>
          </div>
        </motion.div>

        {/* Stat 3 - Valutazioni */}
        <motion.div
          className="card bg-base-200 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />
          <div className="card-body relative z-10">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-gradient-to-r from-accent to-primary text-accent-content rounded-full w-12 h-12">
                  <FaStar className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Valutazioni</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    {stats.rating}
                  </span>
                  <span className="text-sm opacity-70">/5 su 340+ recensioni</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="rating rating-md">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating-2"
                    className={`mask mask-star-2 ${star <= Math.round(stats.rating) ? 'bg-accent' : 'bg-accent/20'}`}
                    checked={star === Math.round(stats.rating)}
                    readOnly
                  />
                ))}
              </div>
              <p className="text-xs mt-2 opacity-70">Media delle valutazioni</p>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

const AppDownloadSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <SectionWrapper title="Scarica l'App" bgColor="base-200">
      <div className="flex flex-col md:flex-row items-center gap-12" ref={ref}>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Esperienza Mobile Premium
            </h3>
            <p className="text-lg opacity-90">
              Acquista in modo ancora più semplice e veloce con la nostra app dedicata. 
              Ricevi notifiche in tempo reale, sblocca offerte esclusive e gestisci 
              i tuoi ordini ovunque ti trovi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn btn-lg btn-primary gap-2"
              >
                <FaApple className="w-6 h-6" />
                App Store
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn btn-lg btn-secondary gap-2"
              >
                <FaGooglePlay className="w-6 h-6" />
                Google Play
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mockup-phone border-primary">
            <div className="camera"></div> 
            <div className="display">
              <div className="artboard artboard-demo phone-1 bg-base-100">
                <img 
                  src="/screenshots/app-preview.jpg" 
                  alt="Anteprima app" 
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

const LandingPage = () => {
  const [state, setState] = useState({
    showAgeModal: !localStorage.getItem('ageVerified'),
    navScrolled: false,
    email: '',
    isSubscribing: false,
    subscribeError: '',
    subscribeSuccess: false
  });

  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      setState(prev => ({ ...prev, navScrolled: window.scrollY > 50 }));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAgeVerification = useCallback((accepted) => {
    if (accepted) {
      setState(prev => ({ ...prev, showAgeModal: false }));
      localStorage.setItem('ageVerified', 'true');
    } else {
      window.location.href = 'https://google.com';
    }
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!state.email || !/\S+@\S+\.\S+/.test(state.email)) {
      setState(prev => ({ ...prev, subscribeError: 'Inserisci un indirizzo email valido' }));
      return;
    }

    setState(prev => ({ ...prev, isSubscribing: true, subscribeError: '' }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setState(prev => ({
      ...prev,
      isSubscribing: false,
      subscribeSuccess: true,
      email: ''
    }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, subscribeSuccess: false }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-primary/20 z-50 origin-left"
        style={{ scaleX }}
      />

      <AnimatePresence>
        {state.showAgeModal && (
          <AgeVerificationModal onVerify={handleAgeVerification} />
        )}
      </AnimatePresence>

      <motion.nav
        className={`navbar sticky top-0 z-50 transition-all duration-300 ${
          state.navScrolled 
            ? 'py-3 bg-base-200/90 backdrop-blur-md border-b border-base-300 shadow-lg'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="flex-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="btn btn-ghost px-2"
            role="banner"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full">
                <FaLeaf className="w-6 h-6 text-base-100" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Justweed
              </h1>
            </div>
          </motion.div>
        </div>
        
        <div className="flex-none gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-sm bg-gradient-to-r from-blue-600 to-purple-700 border-none text-white"
            onClick={() => navigate('/login')}
            aria-label="Accedi al tuo account"
          >
            <FaUser className="w-4 h-4" />
            Accedi
          </motion.button>
        </div>
      </motion.nav>

      <main>
        <section className="hero min-h-[80vh] relative overflow-hidden">
          <ParticleSystem />
          
          <div className="hero-content text-center relative z-10">
            <div className="max-w-4xl space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Justweed
                  </span>
                </h1>
                
                <motion.p
                  className="text-xl opacity-90 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Il primo marketplace italiano per cannabis legale. Acquista in modo sicuro e discreto
                  prodotti certificati, con consegna rapida e supporto dedicato.
                </motion.p>
              </motion.div>

              <div className="space-y-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-lg bg-gradient-to-r from-blue-600 to-purple-700 border-none text-white"
                  onClick={() => navigate('/login')}
                >
                  <FaLock className="w-5 h-5" />
                  Accedi per visualizzare i prodotti
                </motion.button>

                <div className="flex items-center justify-center gap-2 text-sm opacity-70">
                  <FaShieldAlt className="text-primary animate-pulse" />
                  <span>Transazioni crittate • Verifica anagrafica • Pagamenti sicuri</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionWrapper title="Perché Scegliere Noi" bgColor="base-200">
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </SectionWrapper>

        <StatsSection />

        <SectionWrapper title="Cosa dicono di noi" bgColor="base-100">
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </SectionWrapper>

        <AppDownloadSection />

        <SectionWrapper title="Rimani Aggiornato" bgColor="base-200">
          <form onSubmit={handleSubscribe} className="max-w-2xl mx-auto space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="La tua email"
                className="input input-bordered flex-1"
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                aria-label="Inserisci la tua email per iscriverti"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary gap-2"
                type="submit"
                disabled={state.isSubscribing}
              >
                {state.isSubscribing ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <>
                    <FaRegEnvelope />
                    Iscriviti
                  </>
                )}
              </motion.button>
            </div>
            
            {state.subscribeError && (
              <p className="text-error text-sm">{state.subscribeError}</p>
            )}
            
            {state.subscribeSuccess && (
              <motion.p
                className="text-success text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Iscrizione avvenuta con successo!
              </motion.p>
            )}
          </form>
        </SectionWrapper>

        <ScrollToTopButton />
      </main>

      <footer className="bg-base-200 text-base-content py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-70">
            © {new Date().getFullYear()} Justweed. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

const SectionWrapper = ({ title, children, bgColor }) => (
  <section className={`py-16 bg-${bgColor}`}>
    <div className="container mx-auto px-4">
      <motion.h2 
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {title}
      </motion.h2>
      {children}
    </div>
  </section>
);

const TestimonialCard = ({ testimonial }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      className="card bg-base-200 p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400" />
        ))}
      </div>
      <p className="mb-4 italic">"{testimonial.text}"</p>
      <p className="font-bold text-primary">{testimonial.name}</p>
    </motion.div>
  );
};

const ScrollToTopButton = () => (
  <motion.button
    className="btn btn-circle btn-primary fixed bottom-8 right-8 shadow-lg"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
    aria-label="Torna all'inizio"
  >
    <FaArrowUp />
  </motion.button>
);

export default LandingPage;