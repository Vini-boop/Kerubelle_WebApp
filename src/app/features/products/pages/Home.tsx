import { Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Sparkles, ArrowRight, Star, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageError } from '../../../components/common/PageError';
import { PageLoader } from '../../../components/common/PageLoader';

const CATEGORY_DATA = [
  { name: 'Tote', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', desc: 'Spacious & Elegant' },
  { name: 'Clutch', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80', desc: 'Evening Essentials' },
  { name: 'Shoulder', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80', desc: 'Everyday Luxury' },
  { name: 'Crossbody', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', desc: 'Hands-Free Style' },
];

export function Home() {
  const { products, loading, error, retry } = useProducts();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={retry} />;

  const sorted = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
  const featured = products.filter(p => p.featured).length > 0
    ? products.filter(p => p.featured).slice(0, 8)
    : sorted.slice(0, 8);
  const newArrivals = products.filter(p => p.newArrival).length > 0
    ? products.filter(p => p.newArrival).slice(0, 4)
    : sorted.slice(0, 4);
  const bestSellers = products.filter(p => p.bestSeller).length > 0
    ? products.filter(p => p.bestSeller).slice(0, 4)
    : sorted.slice(4, 8);

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(145deg, #FFF0F7 0%, #FFFFFF 40%, #FDF4F8 100%)' }}>

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large soft gradient orb top-right */}
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, #F8C8DC 0%, #F0D0E8 35%, transparent 70%)' }} />
          {/* Small orb bottom-left */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #D4A5B8 0%, transparent 70%)' }} />
          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9939F 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          {/* Diagonal accent line */}
          <div className="absolute top-0 right-[38%] w-px h-full bg-gradient-to-b from-transparent via-[#F8C8DC]/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24 pb-16 lg:pt-0 lg:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 min-h-screen items-center">

            {/* ── LEFT — Copy ── */}
            <div className={`transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-7">
                <div className="flex -space-x-1.5">
                  {['#F8C8DC', '#D4A5B8', '#C9939F'].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <div className="h-px w-6 bg-[#F8C8DC]" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4A5B8]">New Collection 2026</span>
                <Sparkles className="w-3.5 h-3.5 text-[#F8C8DC]" />
              </div>

              {/* Headline */}
              <h1 className="text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] font-bold text-gray-900 leading-[1.0] tracking-tight mb-4">
                Where
                <br />
                <span className="relative inline-block">
                  <span style={{
                    background: 'linear-gradient(135deg, #F8C8DC 0%, #D4A5B8 45%, #C9939F 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    Elegance
                  </span>
                  {/* Underline accent */}
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <path d="M0 5 Q50 0 100 3 Q150 6 200 1" stroke="url(#ug)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <defs><linearGradient id="ug" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F8C8DC" /><stop offset="100%" stopColor="#C9939F" />
                    </linearGradient></defs>
                  </svg>
                </span>
                <br />
                Meets You
              </h1>

              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-[420px]">
                Handcrafted luxury handbags for the modern woman — designed to carry your story with grace.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/shop"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-white shadow-lg shadow-[#F8C8DC]/40 hover:shadow-xl hover:shadow-[#F8C8DC]/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 text-sm"
                  style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8, #C9939F)' }}>
                  Shop Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/limited"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-[#C9939F] bg-white border border-[#F8C8DC]/60 hover:border-[#D4A5B8] hover:scale-105 transition-all duration-300 shadow-sm text-sm">
                  <Star className="w-4 h-4 fill-[#F8C8DC] text-[#F8C8DC]" />
                  Limited Edition
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {['#F8C8DC', '#D4A5B8', '#E8B4C8', '#C9939F'].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold" style={{ background: c }}>
                        {['A', 'G', 'F', 'N'][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-[#F8C8DC] text-[#F8C8DC]" />)}
                    </div>
                    <p className="text-xs text-gray-400"><span className="font-semibold text-gray-700">500+</span> happy customers</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex flex-col gap-1">
                  {['Free delivery over KES 5,000', '100% authentic leather'].map(t => (
                    <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8C8DC] flex-shrink-0" />{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT — Visual ── */}
            <div className={`relative flex items-center justify-center min-h-[520px] transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

              {/* Concentric rings */}
              {[480, 560, 640].map((size, i) => (
                <div key={i} className="absolute rounded-full border border-[#F8C8DC]/20 pointer-events-none"
                  style={{ width: size, height: size, opacity: 1 - i * 0.25 }} />
              ))}

              {/* Pink glow disk */}
              <div className="absolute w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(248,200,220,0.55) 0%, rgba(212,165,184,0.25) 50%, transparent 75%)' }} />

              {/* Bag */}
              <div className="relative z-10 group">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-10 rounded-[50%] blur-2xl opacity-40"
                  style={{ background: '#D4A5B8' }} />
                <img
                  src="/pink-handbags_1203-7829.png"
                  alt="KeruBelle Luxury Handbag"
                  className="w-[280px] md:w-[360px] lg:w-[440px] object-contain relative z-10 group-hover:scale-[1.04] transition-all duration-700"
                  style={{
                    animation: 'bagFloat 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 32px 48px rgba(212,165,184,0.45))',
                  }}
                />
              </div>

              {/* Floating card — top left */}
              <div className="absolute top-10 left-2 md:left-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-3.5 border border-[#F8C8DC]/20 min-w-[130px]"
                style={{ animation: 'badgeFloat 4.5s ease-in-out infinite' }}>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Bestseller</p>
                <p className="text-sm font-bold text-gray-800">Leather Tote</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-[#F8C8DC] text-[#F8C8DC]" />)}
                  </div>
                  <span className="text-[10px] text-gray-400">(7,403)</span>
                </div>
              </div>

              {/* Floating card — top right */}
              <div className="absolute top-10 right-2 md:-right-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-3 border border-[#F8C8DC]/20"
                style={{ animation: 'badgeFloat 3.5s ease-in-out infinite 0.8s' }}>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">From only</p>
                <p className="text-base font-extrabold" style={{ background: 'linear-gradient(135deg, #F8C8DC, #C9939F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  KES 480
                </p>
              </div>

              {/* Floating card — bottom right */}
              <div className="absolute bottom-14 right-2 md:-right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-3.5 border border-[#F8C8DC]/20 min-w-[140px]"
                style={{ animation: 'badgeFloat 5s ease-in-out infinite 1.2s' }}>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5">New Arrival</p>
                <p className="text-sm font-bold text-gray-800">2026 Collection</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-medium">In stock now</span>
                </div>
              </div>

              {/* Floating pill — left center */}
              <div className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full shadow-xl pl-2 pr-4 py-2 border border-[#F8C8DC]/20"
                style={{ animation: 'badgeFloat 4s ease-in-out infinite 2s' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>✓</div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-700">Genuine Leather</p>
                  <p className="text-[9px] text-gray-400">100% authentic</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      <style>{`
        @keyframes bagFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      `}</style>

      {/* ══════════════════ MARQUEE STRIP ══════════════════ */}
      <section className="bg-gray-900 py-4 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap" style={{ animation: 'marquee 22s linear infinite' }}>
          {[...Array(3)].flatMap(() => ['✦ New Collection 2026', '✦ Free Delivery over KES 5,000', '✦ 100% Genuine Leather', '✦ Handcrafted Luxury', '✦ 500+ Happy Customers', '✦ Limited Edition Pieces']).map((t, i) => (
            <span key={i} className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60 flex-shrink-0"
              style={t.includes('New') || t.includes('Limited') ? { color: '#F8C8DC' } : {}}>{t}</span>
          ))}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}`}</style>
      </section>

      {/* ══════════════════ WHY CHOOSE US ══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4A5B8] font-medium mb-2">The KeruBelle Promise</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Women Love Us</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {[
              { img: '/Quality.png', title: 'Premium Quality', desc: 'Handcrafted with the finest materials and meticulous attention to detail.' },
              { img: '/Delivery.webp', title: 'Free Delivery', desc: 'Complimentary delivery on all orders over KES 5,000 nationwide.' },
              { img: '/Luxury Packaging.png', title: 'Luxury Packaging', desc: 'Every order arrives in our signature gift-ready packaging.' },
              { img: '/Personalization.png', title: 'Personalization', desc: 'Custom monogramming and engraving services available.' },
            ].map(({ img, title, desc }) => (
              <div key={title} className="group flex flex-col items-center text-center">
                {/* Image — no card, no border, just the image */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 mb-5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
                {/* Soft divider line */}
                <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] mb-4 group-hover:w-14 transition-all duration-300" />
                <h3 className="font-semibold text-gray-800 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[180px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURED COLLECTION ══════════════════ */}
      <section className="py-20 bg-[#FFF5F9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4A5B8] font-medium mb-2">Curated For You</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Collection</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-[#D4A5B8] hover:text-[#C9939F] font-medium text-sm transition-colors group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ SHOP BY CATEGORY ══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4A5B8] font-medium mb-2">Browse</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop By Style</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORY_DATA.map(cat => (
              <Link key={cat.name} to={`/shop?type=${cat.name.toLowerCase()}`}>
                <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-xs uppercase tracking-widest text-white/70 mb-1">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{cat.name}</h3>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#F8C8DC] transition-colors duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ NEW ARRIVALS ══════════════════ */}
      <section className="py-20 bg-[#FFF5F9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4A5B8] font-medium mb-2">Just Landed</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">New Arrivals</h2>
            </div>
            <Link to="/new" className="hidden sm:flex items-center gap-1.5 text-[#D4A5B8] hover:text-[#C9939F] font-medium text-sm transition-colors group">
              See All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BANNER ══════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-[#F8C8DC] font-medium mb-4">Exclusive Offer</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Free Delivery on Orders Over
              <span className="block" style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>KES 5,000</span>
            </h2>
            <p className="text-white/70 text-lg mb-8">Shop our full collection and enjoy complimentary nationwide delivery.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white hover:scale-105 hover:shadow-xl transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ BEST SELLERS ══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4A5B8] font-medium mb-2">Most Loved</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Best Sellers</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-[#D4A5B8] hover:text-[#C9939F] font-medium text-sm transition-colors group">
              See All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-20 bg-[#FFF5F9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4A5B8] font-medium mb-2">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Amina W.', location: 'Nairobi', text: 'The quality is absolutely stunning. My Brown Leather Tote gets compliments everywhere I go. Worth every shilling!', rating: 5 },
              { name: 'Grace M.', location: 'Mombasa', text: "Fast delivery and the packaging was so beautiful I almost didn't want to open it. The bag is even better in person.", rating: 5 },
              { name: 'Fatuma A.', location: 'Eldoret', text: "I've bought three bags now and each one is perfect. KeruBelle is my go-to for luxury handbags in Kenya.", rating: 5 },
            ].map(review => (
              <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-[#F8C8DC]/10">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F8C8DC] text-[#F8C8DC]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                    <p className="text-gray-400 text-xs">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ JOIN CTA ══════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F8C8DC 0%, #D4A5B8 50%, #C9939F 100%)' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center text-white">
          <Sparkles className="w-10 h-10 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Join the KeruBelle Family</h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Create an account to unlock exclusive offers, track your orders, and get early access to new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-[#D4A5B8] rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Sparkles className="w-4 h-4" />
              Create Account
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/15 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
