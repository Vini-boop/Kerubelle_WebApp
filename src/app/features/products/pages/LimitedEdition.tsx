import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { PageLoader } from '../../../components/common/PageLoader';
import { PageError } from '../../../components/common/PageError';

export function LimitedEdition() {
  const { products, loading, error, retry } = useProducts();

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={retry} />;

  const limitedEditionProducts = products.filter(product => product.limitedEdition);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Limited Edition</h1>
        <p className="text-gray-600">Exclusive limited edition handbags - available while supplies last</p>
      </div>

      {limitedEditionProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {limitedEditionProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No limited edition products at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}