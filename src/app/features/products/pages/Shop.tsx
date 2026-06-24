import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { PageLoader } from '../../../components/common/PageLoader';
import { PageError } from '../../../components/common/PageError';

export function Shop() {
  const { products, loading, error, retry } = useProducts();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const typeFilter = searchParams.get('type');
    const materialFilter = searchParams.get('material');

    let result = products;

    if (typeFilter) {
      result = result.filter(product =>
        product.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    if (materialFilter) {
      result = result.filter(product =>
        product.material.toLowerCase().includes(materialFilter.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, searchParams]);

  if (loading) return <PageLoader />;
  if (error) return <PageError message={error} onRetry={retry} />;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Collection</h1>
        <p className="text-gray-600">Discover our premium selection of luxury handbags</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}