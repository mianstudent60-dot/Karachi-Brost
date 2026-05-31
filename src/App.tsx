import React, { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Flame, 
  MapPin, 
  Phone, 
  Clock, 
  Sparkles, 
  Menu, 
  X, 
  Heart, 
  Utensils, 
  Award, 
  Car, 
  Accessibility, 
  Leaf, 
  DollarSign, 
  Star, 
  Quote, 
  Send, 
  CheckCircle,
  ThumbsUp,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

// Types for items and reviews
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "broast" | "bbq" | "extras";
  emoji: string;
  badge?: string;
  isSpicy?: boolean;
}

interface Review {
  id: number;
  stars: number;
  text: string;
  author: string;
  city: string;
  date: string;
}

export default function App() {
  // Navigation & Scroll states
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "broast" | "bbq" | "extras">("all");
  
  // Custom cursor position
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  // Parallax factor (hero background scroll shift)
  const [scrollY, setScrollY] = useState(0);

  // 3D tilt state for about card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tiltCardRef = useRef<HTMLDivElement>(null);

  // Stats incremental counters
  const [stats, setStats] = useState({
    customers: 0,
    years: 0,
    items: 0,
    satisfaction: 0
  });

  // Animated embers generation parameters
  const embers = Array.from({ length: 22 }).map((_, i) => {
    const size = Math.floor(Math.random() * 6) + 3; // 3px to 8px
    const left = Math.floor(Math.random() * 100); // 0% to 100%
    const delay = (Math.random() * 12).toFixed(2); // 0s to 12s
    const duration = (Math.random() * 8 + 6).toFixed(2); // 6s to 14s
    const driftX = (Math.random() * 120 - 60).toFixed(0); // -60px to 60px drift
    return { id: i, size, left, delay, duration, driftX };
  });

  // Form states and submission feedback toast
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requestType: "Pre-Order",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
    visible: false,
    message: "",
    type: "success"
  });

  // Intersection Observer for scroll reveal animations
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Scroll event listener for navbar and parallax
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Intersection observers for section fade slide reveals
    const revealCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.15,
    });

    const sections = ["hero", "about", "menu", "why-choose-us", "reviews", "contact", "maps"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Simulated counters incremental tick when about screen rolls in
    const statsInterval = setInterval(() => {
      setStats((prev) => {
        const nextCustomers = prev.customers < 500 ? prev.customers + 10 : 500;
        const nextYears = prev.years < 15 ? prev.years + 1 : 15;
        const nextItems = prev.items < 25 ? prev.items + 1 : 25;
        const nextSatisfaction = prev.satisfaction < 98 ? prev.satisfaction + 1 : 98;
        return {
          customers: nextCustomers,
          years: nextYears,
          items: nextItems,
          satisfaction: nextSatisfaction
        };
      });
    }, 45);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(statsInterval);
      observer.disconnect();
    };
  }, []);

  // Menu items list (9 authentic items)
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Karachi Special Crispy Broast",
      description: "Vehari's ultimate golden crispy quarter chicken broast, deeply injected with secret spice blends. Served with hand-whipped hot garlic paste and premium french fries.",
      price: 420,
      category: "broast",
      emoji: "🍗",
      badge: "BESTSELLER",
      isSpicy: true
    },
    {
      id: 2,
      name: "Sizzling Red Chicken Tikka Boti",
      description: "Quarter cut broiler chicken, dry-rubbed in fiery red Kashmiri red chilly and hand-grilled over flaming hardwood charcoal with lemon baste.",
      price: 290,
      category: "bbq",
      emoji: "🍢",
      badge: "HOT GRILL",
      isSpicy: true
    },
    {
      id: 3,
      name: "Mouth-Watering Seekh Kabab",
      description: "Two long skewered cylinders of moist minced chicken, kneaded with roasted cumin, green bird's-eye chilies, fresh coriander leaves, and house-pressed ghee.",
      price: 380,
      category: "bbq",
      emoji: "🍢",
      badge: "HOUSE SPECIAL"
    },
    {
      id: 4,
      name: "Velvety Chicken Malai Boti Platter",
      description: "Boneless cubes of premium chicken breast tenderly basted with thick dairy cream, strained curd, white pepper dust, and faint cardamom notes.",
      price: 450,
      category: "bbq",
      emoji: "🍡",
      badge: "GOURMET SELECTION"
    },
    {
      id: 5,
      name: "Loaded Golden Broast Boneless",
      description: "Pure tenders of breast strips, twice flour-dreaded, fried to a brilliant crisp, topped with melted cheddar, shredded cabbage, and signature chili garlic glaze.",
      price: 490,
      category: "broast",
      emoji: "🍗",
      isSpicy: true
    },
    {
      id: 6,
      name: "Hefty Double Broast Meal Deal",
      description: "Two crispy golden breast pieces, double hot buns, large seasoned thick-cut crinkle fries, house special coleslaw, and 2 garlic mayo containers.",
      price: 820,
      category: "broast",
      emoji: "📦",
      badge: "FEAST SIZE"
    },
    {
      id: 7,
      name: "Fiery Fire-Glazed Chicken Wings",
      description: "Eight golden winglets hand-tossed in custom pan reduction of crushed hot pods, lemon pulp, and butter sauce. Exceptionally spicy and addictive.",
      price: 320,
      category: "extras",
      emoji: "🌶️",
      badge: "SPICY FAVOURITE",
      isSpicy: true
    },
    {
      id: 8,
      name: "Spicy Garlic Fries Basket",
      description: "Huge bed of hand-cut local potatoes fried twice for ultimate crispiness, heavy dusted with Karachi special peri-peri dust and smothered in fresh garlic cream.",
      price: 190,
      category: "extras",
      emoji: "🍟"
    },
    {
      id: 9,
      name: "Fresh Tandoor Naan & Mint Raita",
      description: "Soft hand-drawn clay tandoor roti/naan paired perfectly with chilled thick mint yogurt raita to soothe the fiery barbecued skewers.",
      price: 90,
      category: "extras",
      emoji: "🫓"
    }
  ];

  // Authentic local feedback reviews
  const reviewsList: Review[] = [
    {
      id: 1,
      stars: 5,
      text: "Absolutely the finest crispy broast in the entire Vehari district! The garlic sauce is outstanding, and the chicken is always juicy to the bone. Exceptional wood smoke taste on the BBQ.",
      author: "Chaudhary Nabeel",
      city: "Vehari",
      date: "2 days ago"
    },
    {
      id: 2,
      stars: 5,
      text: "The Chicken Seekh Kababs were incredibly soft and tender. We order from Jinnah Rd almost every weekend. Authentic Karachi taste right here in D block! Very economical pricing too.",
      author: "Zainab Fatima",
      city: "Vehari Central",
      date: "1 week ago"
    },
    {
      id: 3,
      stars: 5,
      text: "Remarkable service. The Malai Boti literally melts in your mouth. The smoke smell is purely authentic and real coal-grilled. Highly recommended for family events or quick pre-orders.",
      author: "Kamran Shah",
      city: "Multan City",
      date: "3 days ago"
    },
    {
      id: 4,
      stars: 4,
      text: "We placed an order for 25 people table booking. The broast skin is beautifully crispy, not overly oily at all, and highly spiced with distinct garlic dust. Great family ambiance too.",
      author: "Dr. Asim Farooq",
      city: "Vehari Club",
      date: "5 days ago"
    },
    {
      id: 5,
      stars: 5,
      text: "Crispy wings are heavenly and extremely spicy. Very fast prep time even when the joint is fully crowded with families on Sunday night. 10/10 rating for consistency!",
      author: "Hamza Malik",
      city: "Vehari Cantt",
      date: "Just now"
    }
  ];

  // About Section card mouse tilt event
  const handleTiltMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltCardRef.current) return;
    const card = tiltCardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside the element
    const y = e.clientY - rect.top;  // y coordinate inside the element
    
    // Convert coordinate to percentage deviation from the center
    const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
    const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1

    // Scale down the tilt range for smooth, professional effect (e.g., max 15 degrees)
    setTilt({
      x: yPercent * -15, // Rotate X depends on Y mouse movement
      y: xPercent * 15   // Rotate Y depends on X mouse movement
    });
  };

  const handleTiltMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Submit Handler with form validations and visual toast prompt
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Customer name is strictly required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is needed for confirmation";
    } else if (!/^[0-9+\s\-]{9,15}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid Pakistani phone number";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToast({
        visible: true,
        message: "Please complete form values correctly",
        type: "error"
      });
      setTimeout(() => setToast((p) => ({ ...p, visible: false })), 4000);
      return;
    }

    setFormErrors({});
    // Simulate successful API call
    setToast({
      visible: true,
      message: `🔥 ${formData.requestType} Success! Our grill master will call you shortly at ${formData.phone}`,
      type: "success"
    });

    // Reset Form Input State
    setFormData({
      name: "",
      phone: "",
      requestType: "Pre-Order",
      message: ""
    });

    setTimeout(() => {
      setToast((p) => ({ ...p, visible: false }));
    }, 5500);
  };

  // Filter menu items
  const filteredItems = activeTab === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  return (
    <div className="relative min-h-screen font-plus selection:bg-fire-orange selection:text-white overflow-hidden text-[#e4e2df]">
      {/* 1. Custom Mouse Cursor Ring (Disabled on touch screens via index.css media query) */}
      <div 
        className={`custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-fire-orange/85 pointer-events-none transition-transform z-50 duration-75 ease-out -translate-x-1/2 -translate-y-1/2 ${
          cursorHovered ? "scale-175 border-gold bg-fire-orange/20" : "scale-100 bg-transparent"
        }`}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) ${cursorHovered ? "scale(1.75)" : "scale(1)"}`,
        }}
      />

      {/* 2. Floating Sparks/Embers Rising from screen base */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {embers.map((emb) => (
          <div
            key={emb.id}
            className="animate-ember opacity-0"
            style={{
              left: `${emb.left}%`,
              width: `${emb.size}px`,
              height: `${emb.size}px`,
              animationDelay: `${emb.delay}s`,
              animationDuration: `${emb.duration}s`,
              backgroundColor: emb.size > 5 ? "#ff5f1f" : "#fbbf24",
              boxShadow: `0 0 ${emb.size * 2}px ${emb.size > 5 ? "#ff2a00" : "#ffd700"}`,
              "--drift-x": `${emb.driftX}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 3. Fixed Blurred Header Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "bg-[#0c0a0a]/90 backdrop-blur-md border-b border-orange-500/10 py-3 shadow-2xl shadow-black/40" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a 
            href="#hero" 
            className="flex items-center gap-2 group cursor-pointer"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <div className="relative bg-gradient-to-br from-fire-orange to-ember p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-fire-orange/20">
              <Flame className="w-6 h-6 text-gold animate-pulse" />
              <div className="absolute -inset-1 bg-fire-orange/30 rounded-xl blur-sm -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            </div>
            <div>
              <span className="font-bebas text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-fire-orange via-gold to-white bg-clip-text text-transparent block -mb-1">
                KARACHI BROAST
              </span>
              <span className="text-[10px] tracking-widest text-gold font-bold uppercase block">
                &amp; BAR-B-Q • VEHARI
              </span>
            </div>
          </a>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden lg:flex items-center gap-7">
            {["Home", "About", "Menu", "Why Choose Us", "Reviews", "Contact"].map((item) => {
              const elementId = item.toLowerCase().replace(/\s+/g, "-");
              return (
                <a
                  key={item}
                  href={`#${elementId === "home" ? "hero" : elementId}`}
                  className="relative text-sm font-semibold tracking-wider text-stone-300 hover:text-fire-orange transition-colors duration-200"
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                >
                  {item}
                </a>
              );
            })}
          </nav>

          {/* Phone Badge CTA Action button */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:+923002373151" 
              className="group flex items-center gap-2 bg-[#171414] hover:bg-[#1f1919] border border-orange-500/20 hover:border-fire-orange/50 px-4 py-2 rounded-xl transition-all duration-300"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-fire-orange group-hover:scale-110 transition-transform duration-200">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-widest text-[#a8a29e] block font-bold">Call to Pre-Order</span>
                <span className="text-sm font-bold text-gold font-mono tracking-tight">+92 300-2373-151</span>
              </div>
            </a>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#141212] border border-white/5 text-stone-200 hover:text-fire-orange hover:border-fire-orange/40 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0e0c0c]/98 border-b border-orange-500/10 shadow-2xl backdrop-blur-xl px-5 py-6 flex flex-col gap-4 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {["Home", "About", "Menu", "Why Choose Us", "Reviews", "Contact"].map((item) => {
                const elementId = item.toLowerCase().replace(/\s+/g, "-");
                return (
                  <a
                    key={item}
                    href={`#${elementId === "home" ? "hero" : elementId}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold tracking-wider text-stone-200 py-2 border-b border-white/5 hover:text-fire-orange transition-colors"
                  >
                    {item}
                  </a>
                );
              })}
            </nav>
            <div className="pt-2">
              <a 
                href="tel:+923002373151" 
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-fire-orange to-ember hover:from-orange-600 hover:to-red-600 px-4 py-3 rounded-xl font-bold text-white text-center shadow-lg shadow-fire-orange/20"
              >
                <Phone className="w-5 h-5" />
                <span>+92 300-2373-151 (Order Now)</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 4. HERO SECTION */}
      <section 
        id="hero" 
        className="relative min-h-screen grill-texture flex items-center justify-center pt-24 pb-16 overflow-hidden"
      >
        {/* Dynamic Glowing Fire Orb backdrop */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-gradient-to-tr from-[#ff4d00]/30 to-[#ff2a00]/5 rounded-full blur-[100px] animate-fire-glow -z-10"
          style={{
            transform: `translate3d(-50%, -50%, 0) translate3d(${scrollY * 0.15}px, ${scrollY * 0.1}px, 0)`,
          }}
        />

        {/* Diagonal coal grill lines accent backplate */}
        <div className="absolute inset-0 -z-20 opacity-35 mix-blend-overlay grill-diagonal-lines" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
          <div 
            className="text-center transition-transform duration-300"
            style={{
              transform: `translateKeyframe(0px, ${scrollY * 0.25}px)` // Parallax shift on hero content
            } as React.CSSProperties}
          >
            {/* Location Badging */}
            <div className="inline-flex items-center gap-2 bg-[#ff4d00]/10 border border-fire-orange/30 px-4 py-1.5 rounded-full mb-6 animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#fdba74] uppercase font-bebas">
                JINNAH RD, VEHARI, PUNJAB
              </span>
            </div>

            {/* Giant Bold Slogan Heading */}
            <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-wider leading-none mb-6">
              <span className="block text-[#fcfbfa] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                AUTHENTIC KARACHI
              </span>
              <span className="bg-gradient-to-r from-fire-orange via-gold to-orange-500 bg-clip-text text-transparent drop-shadow-[0_3px_25px_rgba(255,77,0,0.3)] block">
                CHICKEN BROAST &amp; BAR-B-Q
              </span>
            </h1>

            {/* Explanatory subtitle */}
            <p className="max-w-xl mx-auto text-base sm:text-lg text-[#ccc6c0] font-medium leading-relaxed mb-10 px-4">
              Savor the legendary hot oil-pressure-fried chicken broast and wood-charcoal barbecue masterpieces grilled to sizzling excellence right in the heart of Vehari. Open daily 11 AM - 11 PM.
            </p>

            {/* Hero Interactive Details Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 text-[#f3f2ef]">
              <div className="bg-[#121010]/95 border border-white/5 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-4 text-left shadow-lg shadow-black/80">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fire-orange to-ember flex items-center justify-center text-white font-black">
                  🍗
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-500 tracking-widest uppercase">Crispy Broast</h4>
                  <p className="text-sm font-extrabold text-[#fff]">PKR 420 (Quarter)</p>
                </div>
              </div>

              <div className="bg-[#121010]/95 border border-white/5 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-4 text-left shadow-lg shadow-black/80">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fire-orange to-ember flex items-center justify-center text-white font-black">
                  🍢
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-500 tracking-widest uppercase">Charcoal BBQ</h4>
                  <p className="text-sm font-extrabold text-[#fff]">Pure Wood smoke authentic</p>
                </div>
              </div>

              <div className="bg-[#121010]/95 border border-white/5 backdrop-blur-sm p-4 rounded-2xl sm:col-span-2 md:col-span-1 flex items-center gap-4 text-left shadow-lg shadow-black/80">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fire-orange to-ember flex items-center justify-center text-white font-black">
                  ⏰
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-500 tracking-widest uppercase">Open Hours</h4>
                  <p className="text-sm font-extrabold text-[#fff]">11:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
              <a
                href="#menu"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-fire-orange via-ember to-orange-600 text-[#fff] font-bold tracking-widest rounded-xl shadow-xl shadow-fire-orange/30 hover:shadow-fire-orange/45 hover:scale-103 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase font-bebas"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <Utensils className="w-5 h-5 text-gold" />
                <span>Explore Sizzling Menu</span>
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 border border-orange-500/30 hover:border-fire-orange text-gold hover:text-white font-bold tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase font-bebas"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <Flame className="w-5 h-5 text-fire-orange animate-pulse" />
                <span>Place Pre-Order Now</span>
              </a>
            </div>
          </div>
        </div>

        {/* Grounding Decorative Charcoal smoke haze bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0e0d0d] via-[#0e0d0d]/40 to-transparent pointer-events-none" />
      </section>

      {/* 5. ABOUT SECTION with dynamic tilt mechanism */}
      <section 
        id="about" 
        className={`py-24 bg-[#0e0d0d] relative overflow-hidden transition-all duration-1000 ${
          visibleSections["about"] ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Story Text details */}
            <div className="lg:col-span-7">
              <span className="text-fire-orange font-bold uppercase tracking-widest text-xs font-mono block mb-2">
                OUR SIZZLING TRADITION
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wider leading-tight text-white mb-6">
                BROUGHT STRAIGHT FROM <br />
                <span className="text-gold">KARACHI’S HISTORIC FOOD STREETS</span> <br />
                TO VEHARI, PUNJAB.
              </h2>
              <p className="text-[#ccc] text-base leading-relaxed mb-6 font-medium">
                For over 15 glorious years, we have mastered the delicate science of Pakistani open-fire culinary arts. Our chicken broast is subjected to signature temperature-pressure cooking to lock in premium poultry moisture, while our skewers are intensely caramelized over burning hardwood coal embers.
              </p>
              
              <div className="bg-[#141212] border-l-4 border-fire-orange p-5 rounded-r-2xl mb-8 shadow-xl">
                <blockquote className="font-playfair italic text-stone-200 text-lg mb-2">
                  "Authentic taste isn't just a recipe. It's the temperature of the coals, the timing of the garlic mayo glaze, and the freshness of the regional ingredients of Vehari."
                </blockquote>
                <p className="text-xs uppercase tracking-widest font-extrabold text-gold font-mono">— Founder &amp; Chef Master, Karachi Broast</p>
              </div>

              {/* Grid bullet points */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-fire-orange/20 flex items-center justify-center text-fire-orange">✓</div>
                  <span className="text-[#fff] text-sm font-bold">100% Halal Meats</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-fire-orange/20 flex items-center justify-center text-fire-orange">✓</div>
                  <span className="text-[#fff] text-sm font-bold">Secret Garlic Sauce Dust</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-fire-orange/20 flex items-center justify-center text-fire-orange">✓</div>
                  <span className="text-[#fff] text-sm font-bold">Authentic Wood Charcoal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-fire-orange/20 flex items-center justify-center text-fire-orange">✓</div>
                  <span className="text-[#fff] text-sm font-bold">Open Daily Till Late</span>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Card showcasing ticking numbers */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                ref={tiltCardRef}
                onMouseMove={handleTiltMouseMove}
                onMouseLeave={handleTiltMouseLeave}
                className="relative bg-gradient-to-b from-[#1c1818] to-[#120f0f] border border-orange-500/10 p-8 sm:p-10 rounded-3xl w-full max-w-[420px] shadow-2xl shadow-black/90 transition-all duration-150 ease-out flex flex-col justify-between overflow-hidden cursor-grab"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                }}
                onMouseEnter={() => setCursorHovered(true)}
              >
                {/* Decorative border hot spot glow reflection based on cursor grid tilt */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-fire-orange/10 rounded-full blur-2xl" />

                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-bebas text-lg tracking-wider text-fire-orange">LIVE KITCHEN MILESTONES</span>
                    <Sparkles className="w-5 h-5 text-gold animate-spin-slow" />
                  </div>

                  {/* Operational stats grids with automated tracking loops */}
                  <div className="space-y-6">
                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <div>
                        <span className="text-stone-400 text-xs font-semibold uppercase block">DAILY CUSTOMERS</span>
                        <span className="text-stone-200 text-sm font-medium">Loves our spicy skin broast</span>
                      </div>
                      <span className="font-bebas text-4xl text-gold tracking-widest">{stats.customers}+</span>
                    </div>

                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <div>
                        <span className="text-stone-400 text-xs font-semibold uppercase block">EXPERIENCE</span>
                        <span className="text-stone-200 text-sm font-medium">Perfecting smoke blends</span>
                      </div>
                      <span className="font-bebas text-4xl text-fire-orange tracking-widest">{stats.years} Years</span>
                    </div>

                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <div>
                        <span className="text-stone-400 text-xs font-semibold uppercase block">UNIQUE RECIPES</span>
                        <span className="text-stone-200 text-sm font-medium">Handcrafted spice blends</span>
                      </div>
                      <span className="font-bebas text-4xl text-gold tracking-widest">{stats.items}+ Items</span>
                    </div>

                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <div>
                        <span className="text-stone-400 text-xs font-semibold uppercase block">CUSTOMER SATISFACTION</span>
                        <span className="text-stone-200 text-sm font-medium">Verified local star reviewers</span>
                      </div>
                      <span className="font-bebas text-4xl text-fire-orange tracking-widest">{stats.satisfaction}%</span>
                    </div>
                  </div>
                </div>

                {/* Opening Hours Info at base */}
                <div className="mt-8 pt-6 border-t border-orange-500/20 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-fire-orange">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bebas text-base text-white tracking-widest">OPEN 7 DAYS A WEEK</h5>
                    <p className="text-xs text-gold font-semibold uppercase font-mono tracking-tight">11:00 AM – 11:00 PM EVERYDAY</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. MENU SECTION */}
      <section 
        id="menu" 
        className={`py-24 bg-[#090808] relative overflow-hidden transition-all duration-1000 ${
          visibleSections["menu"] ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-fire-orange font-bold uppercase tracking-widest text-xs font-mono block mb-2">
              CRISPY &amp; JUICY FLAVOR BURST
            </span>
            <h2 className="font-bebas text-4xl sm:text-6xl tracking-wider text-white">
              SENSATIONAL FARE MENU
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-fire-orange via-gold to-transparent mx-auto mt-4 rounded-full" />
            <p className="text-[#a19c96] text-sm sm:text-base max-w-xl mx-auto mt-4">
              Carefully filtered categories of signature broast, charcoal kababs, and hot sides prepared fresh in Vehari. Prices mentioned are in Pakistani Rupees (PKR).
            </p>
          </div>

          {/* Tab Filters buttons layout */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { id: "all", label: "🔥 All Delicacies" },
              { id: "broast", label: "🍗 Crispy Broast" },
              { id: "bbq", label: "🍢 Wood Bar-B-Q" },
              { id: "extras", label: "🍟 Sides &amp; Extras" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-fire-orange to-ember text-white shadow-lg shadow-fire-orange/25 border-orange-500/20" 
                    : "bg-[#141212] border border-white/5 text-stone-300 hover:text-white hover:border-orange-500/30"
                }`}
                dangerouslySetInnerHTML={{ __html: tab.label }}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              />
            ))}
          </div>

          {/* Cards Portfolio Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-gradient-to-b from-[#121010] to-[#0c0a0a] border border-[#ff4d00]/5 hover:border-fire-orange/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:shadow-fire-orange/5 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
              >
                {/* Simulated Animated Top Border Accent Line which lights up glowing on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-fire-orange/10 to-transparent group-hover:via-fire-orange transition-all duration-500" />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    {/* Emoji circular badge container */}
                    <div className="w-14 h-14 rounded-2xl bg-[#1d1717] flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                      {item.emoji}
                    </div>

                    {/* Ribbon badges */}
                    {item.badge && (
                      <span className="text-[10px] font-bold tracking-widest bg-fire-orange/10 border border-fire-orange/30 text-[#f97316] font-mono px-3 py-1 rounded-full uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title and spicy icon integration */}
                  <h3 className="font-bebas text-2xl tracking-wide font-medium text-[#f5f4f0] group-hover:text-gold transition-colors flex items-center gap-2">
                    {item.name}
                    {item.isSpicy && <span className="text-sm font-bold text-red-500 title-spicy" title="Extremely Hot Spicy!">&#x1F525;</span>}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#ccc3bc] font-medium leading-relaxed mt-2.5 mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Pricing block with hover action CTA */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[11px] font-semibold tracking-widest text-[#a8a29e] block uppercase font-mono">PKR PRICE</span>
                    <span className="font-bebas text-2xl tracking-widest text-white">
                      PKR {item.price}/-
                    </span>
                  </div>
                  
                  <a
                    href="#contact"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 hover:bg-fire-orange text-fire-orange hover:text-white transition-all duration-300 shadow-sm"
                    title="Preorder this plate"
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. WHY CHOOSE US SECTION (6 features in 3-column grid) */}
      <section 
        id="why-choose-us" 
        className={`py-24 bg-[#0d0d0d] relative overflow-hidden transition-all duration-1000 ${
          visibleSections["why-choose-us"] ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-fire-orange font-bold uppercase tracking-widest text-xs font-mono block mb-2">
              WHY THE LOCAL FAMILIES CHOOSE US
            </span>
            <h2 className="font-bebas text-4xl sm:text-6xl tracking-wider text-stone-100">
              VEHARI'S ABSOLUTE FAVORITE JOINT
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-fire-orange via-gold to-transparent mx-auto mt-4 rounded-full" />
            <p className="text-stone-400 max-w-lg mx-auto mt-4 text-sm">
              We never compromise on food quality, temperature control, accessibility, or pricing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-[#121010]/80 p-8 rounded-3xl border border-white/5 hover:border-fire-orange/30 shadow-xl shadow-black/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-fire-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ring-2 ring-transparent group-hover:ring-fire-orange/30">
                <Flame className="w-8 h-8 font-extrabold" />
              </div>
              <h3 className="font-bebas text-2xl text-stone-100 mb-3 tracking-wider group-hover:text-gold transition-colors">
                Fresh Charcoal Fire
              </h3>
              <p className="text-[#bbb3ab] text-xs sm:text-sm leading-relaxed">
                All barbecued items are cooked to pure smokiness using heavy dry logs over an open pit to create rich, caramelized food surfaces.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-[#121010]/80 p-8 rounded-3xl border border-white/5 hover:border-fire-orange/30 shadow-xl shadow-black/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-fire-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ring-2 ring-transparent group-hover:ring-fire-orange/30">
                <DollarSign className="w-8 h-8 font-extrabold" />
              </div>
              <h3 className="font-bebas text-2xl text-stone-100 mb-3 tracking-wider group-hover:text-gold transition-colors">
                Affordable Prices
              </h3>
              <p className="text-[#bbb3ab] text-xs sm:text-sm leading-relaxed">
                Highest food volume per pack with highly reduced profit margins, ensuring that your families enjoy premium dining every single day.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-[#121010]/80 p-8 rounded-3xl border border-white/5 hover:border-fire-orange/30 shadow-xl shadow-black/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-fire-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ring-2 ring-transparent group-hover:ring-fire-orange/30">
                <Car className="w-8 h-8 font-extrabold" />
              </div>
              <h3 className="font-bebas text-2xl text-stone-100 mb-3 tracking-wider group-hover:text-gold transition-colors">
                Free Parking
              </h3>
              <p className="text-[#bbb3ab] text-xs sm:text-sm leading-relaxed">
                Expansive layout spaces dedicated directly alongside Jinnah Road to accommodate both big family automobiles and motorbikes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-[#121010]/80 p-8 rounded-3xl border border-white/5 hover:border-fire-orange/30 shadow-xl shadow-black/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-fire-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ring-2 ring-transparent group-hover:ring-fire-orange/30">
                <Accessibility className="w-8 h-8 font-extrabold" />
              </div>
              <h3 className="font-bebas text-2xl text-stone-100 mb-3 tracking-wider group-hover:text-gold transition-colors">
                Wheelchair Accessible
              </h3>
              <p className="text-[#bbb3ab] text-xs sm:text-sm leading-relaxed">
                Smooth flat street ramps and optimized seating orientations designed meticulously to support special needs guests comfortably.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-[#121010]/80 p-8 rounded-3xl border border-white/5 hover:border-fire-orange/30 shadow-xl shadow-black/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-fire-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ring-2 ring-transparent group-hover:ring-fire-orange/30">
                <Leaf className="w-8 h-8 font-extrabold" />
              </div>
              <h3 className="font-bebas text-2xl text-stone-100 mb-3 tracking-wider group-hover:text-gold transition-colors">
                Vegetarian Options
              </h3>
              <p className="text-[#bbb3ab] text-xs sm:text-sm leading-relaxed">
                Serving freshly tossed green salads, soft tandoori rotis, and cooling spiced mint raitas for non-meat lovers to enjoy food together.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-[#121010]/80 p-8 rounded-3xl border border-white/5 hover:border-fire-orange/30 shadow-xl shadow-black/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-fire-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ring-2 ring-transparent group-hover:ring-fire-orange/30">
                <Clock className="w-8 h-8 font-extrabold" />
              </div>
              <h3 className="font-bebas text-2xl text-stone-100 mb-3 tracking-wider group-hover:text-gold transition-colors">
                Open Till Late
              </h3>
              <p className="text-[#bbb3ab] text-xs sm:text-sm leading-relaxed">
                Operating continuously from 11:00 AM straight to 11:00 PM, satisfying your sudden midnight broast cravings with hot meals.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. REVIEWS SECTION (Infinite scrolling marquee carousel pause on hover) */}
      <section 
        id="reviews" 
        className={`py-24 bg-[#090808] relative overflow-hidden transition-all duration-1000 ${
          visibleSections["reviews"] ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
          <div className="text-center">
            <span className="text-fire-orange font-bold uppercase tracking-widest text-xs font-mono block mb-2">
              WORDS FROM STREET DINERS
            </span>
            <h2 className="font-bebas text-4xl sm:text-6xl tracking-wider text-[#fff]">
              SIZZLING CUSTOMER REVIEWS
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-fire-orange via-gold to-transparent mx-auto mt-4 rounded-full" />
            <p className="text-[#ccc6bf] mt-4 text-xs sm:text-sm max-w-md mx-auto">
              Real testimonials from foodies who love the smoky garlic dust and crisp chicken broast skin.
            </p>
          </div>
        </div>

        {/* Marquee Row scrolling container */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          {/* Subtle gradient side bars to fade reviews on edges gently */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#090808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#090808] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee hover:pause-marquee flex gap-6">
            {/* Run twice to simulate infinite loop continuity */}
            {[...reviewsList, ...reviewsList].map((review, idx) => (
              <div 
                key={`${review.id}-${idx}`}
                className="w-[280px] sm:w-[350px] bg-[#121010] border border-white/5 rounded-3xl p-6 relative flex flex-col justify-between shadow-lg shadow-black/80 shrink-0 select-none hover:border-fire-orange/20 transition-all duration-300"
              >
                <div>
                  {/* Decorative Quotation Mark in top right corner */}
                  <Quote className="absolute right-6 top-6 w-10 h-10 text-orange-500/5 rotate-180" />

                  {/* Stars Rating banner list */}
                  <div className="flex gap-1 mb-4 select-none pointer-events-none">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Comment text */}
                  <p className="text-[#bbb3ab] italic text-xs sm:text-sm leading-relaxed font-playfair font-medium">
                    "{review.text}"
                  </p>
                </div>

                {/* Writer Info metadata line */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-200 text-sm block tracking-widest font-bebas">{review.author}</span>
                    <span className="text-[10px] text-amber-500 font-bold block">{review.city} Diner</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-semibold font-mono">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION with Pre-order submission form */}
      <section 
        id="contact" 
        className={`py-24 bg-[#0d0d0d] relative overflow-hidden transition-all duration-1000 ${
          visibleSections["contact"] ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        {/* Glow backdrop behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fire-orange/5 rounded-full blur-[90px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Coordinates & Information */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-fire-orange font-bold uppercase tracking-widest text-xs font-mono block mb-2">
                  LOCATE US OR INQUIRE
                </span>
                <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wider text-white mb-6">
                  SIZZLING CORRESPONDENCE
                </h2>
                <p className="text-[#cac4bd] text-sm leading-relaxed mb-10 font-medium">
                  Have a complaint, a question, or planning to pre-order our crispiest roasted chicken legs? Fill in the inquiries form or visit our outlet right on Jinnah Road in Vehari.
                </p>

                {/* Details layout list */}
                <div className="space-y-6">
                  {/* Local Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-fire-orange shrink-0 mt-0.5 shadow-sm">
                      <MapPin className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold tracking-widest text-gold uppercase font-mono">RESTAURANT OUTLET</h4>
                      <p className="text-stone-100 text-sm font-bold mt-1">
                        Jinnah Rd, D Block, Vehari, Punjab, Pakistan
                      </p>
                      <span className="text-[11px] text-stone-400 font-semibold">Opposite Local Market Core</span>
                    </div>
                  </div>

                  {/* Operational Telephone number */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-fire-orange shrink-0 mt-0.5 shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold tracking-widest text-gold uppercase font-mono">ORDER HOTLINE</h4>
                      <p className="text-stone-100 text-lg font-bold mt-1 tracking-wider font-mono">
                        +92 300-2373-151
                      </p>
                      <span className="text-[11px] text-stone-400 font-semibold">Available 11 AM to 11 PM</span>
                    </div>
                  </div>

                  {/* Detailed Operational timings */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-fire-orange shrink-0 mt-0.5 shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold tracking-widest text-gold uppercase font-mono">OPEN HOURS</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 font-bold text-xs sm:text-sm text-stone-100 font-mono">
                        <span>Mon – Sun:</span>
                        <span className="text-amber-500">11:00 AM – 11:00 PM</span>
                        <span>Parking space:</span>
                        <span className="text-stone-400 font-semibold">Free Parking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified quality badging block */}
              <div className="mt-12 bg-[#121010]/80 p-5 rounded-3xl border border-white/5 flex items-center gap-4 shadow-lg shadow-black/60">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-gold">
                  <Award className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bebas text-base text-white tracking-widest">100% QUALITY ASSURED</h4>
                  <p className="text-xs text-[#bbb2aa] font-medium leading-normal">
                    Pressure-frying machinery calibrated daily to maintain optimal tenderness.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Styled Submission Form */}
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-b from-[#141212] to-[#0e0c0c] border border-orange-500/10 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/90">
                <h3 className="font-bebas text-2xl sm:text-3xl tracking-widest text-white mb-2">SEND AN INQUIRY</h3>
                <p className="text-[#a19c96] text-xs sm:text-sm mb-6 leading-relaxed">
                  Plan your family meals or submit feedback instantly. We review logs hourly.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Customer Name */}
                    <div>
                      <label className="text-[11px] font-bold tracking-widest text-stone-400 uppercase block mb-2 font-mono">CUSTOMER NAME</label>
                      <input 
                        type="text"
                        placeholder="e.g. Chaudhary Bilal"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full bg-[#1b1919] border rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 transition-all ${
                          formErrors.name 
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                            : "border-white/5 focus:border-fire-orange focus:ring-fire-orange"
                        }`}
                      />
                      {formErrors.name && (
                        <span className="text-[11px] text-red-500 font-semibold mt-1 block font-mono">
                          {formErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Customer Phone */}
                    <div>
                      <label className="text-[11px] font-bold tracking-widest text-stone-400 uppercase block mb-2 font-mono">PHONE NUMBER</label>
                      <input 
                        type="tel"
                        placeholder="e.g. +92 300 2373151"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full bg-[#1b1919] border rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 transition-all ${
                          formErrors.phone 
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                            : "border-white/5 focus:border-fire-orange focus:ring-fire-orange"
                        }`}
                      />
                      {formErrors.phone && (
                        <span className="text-[11px] text-red-500 font-semibold mt-1 block font-mono">
                          {formErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inquiry Request Type category */}
                  <div>
                    <label className="text-[11px] font-bold tracking-widest text-stone-400 uppercase block mb-2 font-mono">REQUEST TYPE</label>
                    <select
                      value={formData.requestType}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                      className="w-full bg-[#1b1919] border border-white/5 rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:border-fire-orange focus:ring-1 focus:ring-fire-orange transition-all cursor-pointer font-bold select-none"
                    >
                      <option value="Pre-Order">🔥 Hot Pre-Order (Fast Pickup)</option>
                      <option value="Table Booking">🍽️ Large Family Table Booking</option>
                      <option value="Inquiry">❓ General Menu Inquiry</option>
                      <option value="Complaint">⚠️ Service Feedback &amp; Complaint</option>
                    </select>
                  </div>

                  {/* Customer Message Context */}
                  <div>
                    <label className="text-[11px] font-bold tracking-widest text-stone-400 uppercase block mb-2 font-mono">MESSAGE DETAILS</label>
                    <textarea 
                      rows={4}
                      placeholder="Mention your preferred items, time, and any extra garlic sauce requests..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#1b1919] border border-white/5 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-fire-orange focus:ring-1 focus:ring-fire-orange transition-all text-sm leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-fire-orange via-ember to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-bold tracking-widest uppercase transition-all duration-300 shadow-xl shadow-fire-orange/20 hover:shadow-fire-orange/45 hover:scale-[1.01] flex items-center justify-center gap-3 text-sm font-bebas cursor-pointer"
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                  >
                    <Send className="w-4 h-4 text-gold animate-bounce" />
                    <span>Submit Request Entry</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. EMBEDDED GOOGLE MAPS AREA with dark overlay mapping filter */}
      <section 
        id="maps" 
        className={`relative w-full h-[450px] bg-[#0c0a0a] transition-all duration-1000 overflow-hidden ${
          visibleSections["maps"] ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13735.632261642279!2d72.3456385!3d30.04014905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393c0ea4bffd251b%3A0xe13baae8e001ba03!2sVehari%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
          className="w-full h-full border-0 grayscale brightness-75 contrast-125"
          style={{ 
            filter: "invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)",
          }}
          loading="lazy" 
          title="Karachi Chicken Broast Vehari Map location"
          allowFullScreen
        />

        {/* Floating details badge overlay in top left corner of maps iframe */}
        <div className="absolute top-8 left-4 sm:left-12 bg-[#0e0c0c]/95 border border-orange-500/20 p-6 rounded-2xl w-full max-w-[280px] shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fire-orange to-ember flex items-center justify-center text-white font-extrabold shrink-0">
              🍗
            </div>
            <div>
              <h3 className="font-bebas text-lg leading-tight text-white tracking-wider">VEHARI OUTLET BRANCH</h3>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest font-mono">ACTIVE HUB</p>
            </div>
          </div>
          <p className="text-xs text-[#ccc3bc] leading-relaxed font-semibold mb-4">
            Jinnah Road, D Block, opposing the main central food strip, Vehari.
          </p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gold hover:text-fire-orange font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <span>Launch Directions GPS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 11. FOOTER SECTION */}
      <footer className="bg-[#080707] border-t border-white/5 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-10 border-b border-white/5">
            {/* Branding Signature block */}
            <div className="text-center md:text-left">
              <span className="font-bebas text-3xl tracking-wider text-white">
                KARACHI CHICKEN <span className="text-fire-orange">BROAST</span>
              </span>
              <p className="text-stone-400 text-xs sm:text-sm mt-2 max-w-sm tracking-wide font-medium">
                Vehari's Authentic Taste — Open Daily 11:00 AM to 11:00 PM. Perfected skewers and signature pressure-fried crispy chicken breast deals.
              </p>
            </div>

            {/* Faster quick navigation footer links block */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold tracking-wider text-stone-400">
              <a href="#hero" className="hover:text-fire-orange transition-colors" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>Home</a>
              <a href="#about" className="hover:text-fire-orange transition-colors" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>About</a>
              <a href="#menu" className="hover:text-fire-orange transition-colors" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>Menu</a>
              <a href="#why-choose-us" className="hover:text-fire-orange transition-colors" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>Why Us</a>
              <a href="#reviews" className="hover:text-fire-orange transition-colors" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>Reviews</a>
              <a href="#contact" className="hover:text-fire-orange transition-colors" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>Contact</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-stone-500 font-mono">
            <p>&copy; {new Date().getFullYear()} Karachi Chicken Broast &amp; Bar-B-Q. All Rights Reserved.</p>
            <p>Jinnah Road, D Block, Vehari, Punjab, Pakistan</p>
          </div>
        </div>
      </footer>

      {/* 12. HIGH ACCENT FIXED FLOATING TOASTS NOTIFICATIONS */}
      {toast.visible && (
        <div 
          className={`fixed bottom-8 right-4 sm:right-8 z-50 flex items-center gap-4 border bg-[#110f0f]/95 p-5 rounded-2xl w-full max-w-[380px] sm:max-w-[420px] shadow-2xl transition-all duration-300 animate-slide-up ${
            toast.type === "success" 
              ? "border-emerald-500/20 text-[#fff]" 
              : "border-red-500/20 text-[#fff]"
          }`}
        >
          {toast.type === "success" ? (
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle className="w-6 h-6 animate-pulse" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
          )}
          <div>
            <h4 className="font-bebas text-lg leading-tight tracking-wider text-white uppercase">
              {toast.type === "success" ? "NOTIFICATION CONFIRMED" : "VALIDATION ALERT"}
            </h4>
            <p className="text-xs text-stone-300 font-semibold leading-relaxed mt-0.5">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
