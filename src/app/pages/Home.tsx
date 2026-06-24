import { Link } from 'react-router-dom';
import { products } from '../lib/services/data';
import { ProductCard } from '../features/products/components/ProductCard';
import { Sparkles, Shield, Gift, Truck, ArrowRight } from 'lucide-react';

export function Home() {
  const featuredProducts = products.filter((p: any) => p.featured);
  const newArrivals = products.filter((p: any) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p: any) => p.bestSeller).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-[#FFF5F9] via-white to-[#F8E8EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm border border-[#F8C8DC]/30">
              <Sparkles className="w-4 h-4 text-[#F8C8DC] mr-2" />
              <span className="text-sm text-gray-700 font-medium">New Collection 2026</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Elegance in
              <span className="block bg-gradient-to-r from-[#F8C8DC] via-[#D4A5B8] to-[#F8C8DC] bg-clip-text text-transparent font-bold">
                Every Stitch
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Discover our curated collection of luxury handbags designed for the modern woman
              who values style, quality, and confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="px-8 py-4 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/limited"
                className="px-8 py-4 border-2 border-[#F8C8DC] text-[#F8C8DC] rounded-full hover:bg-[#F8C8DC]/10 hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Limited Edition
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">
                Handcrafted with finest materials
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">
                On orders over $100
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Gift Wrapping</h3>
              <p className="text-sm text-gray-600">
                Complimentary luxury packaging
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Personalization</h3>
              <p className="text-sm text-gray-600">
                Custom name engraving available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-[#FFF5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites that define elegance and sophistication
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                New Arrivals
              </h2>
              <p className="text-gray-600">
                Just landed: Fresh styles for your collection
              </p>
            </div>
            <Link
              to="/new"
              className="hidden sm:flex items-center gap-2 text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors"
            >
              See All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gradient-to-b from-white to-[#FFF5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Best Sellers
              </h2>
              <p className="text-gray-600">
                Customer favorites that keep selling out
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors"
            >
              See All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Join the Pink Bliss Family
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get exclusive access to new collections, special offers, and style inspiration.
            Plus, earn loyalty points with every purchase!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#F8C8DC] rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
