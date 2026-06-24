import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageLoader } from '../../../components/common/PageLoader';
import { PageError } from '../../../components/common/PageError';

export function NewArrivals() {
  const { products, loading, error, retry } = useProducts();
  const navigate = useNavigate();

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={retry} />;

  const newArrivalProducts = products.filter(product => product.newArrival);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative flex items-center justify-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-2 text-gray-500 hover:text-gray-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className="text-4xl font-bold text-gray-800">New Arrivals</h1>
        </div>
        <div className="text-center mb-12">
          <p className="text-gray-600">Check out our latest collection of stunning handbags</p>
        </div>

        {newArrivalProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {newArrivalProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No new arrivals at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
