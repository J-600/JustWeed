import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useAnimation } from 'framer-motion';
import { 
  FaLeaf, FaLock, FaFlask, FaShieldAlt, 
  FaUser, FaChevronRight, FaBirthdayCake, 
  FaRegEnvelope, FaArrowUp, FaStar
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

// Constants
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

// Original Particle System
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

// Improved Feature Card
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


// Age Verification Modal
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

// Main Component
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
    
    // Simulate API call
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

        <SectionWrapper title="Cosa dicono di noi" bgColor="base-100">
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </SectionWrapper>

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

// Reusable Components
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