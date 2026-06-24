import { useStore } from '../../../providers/StoreProvider';

export const useProducts = () => {
  const store = useStore();
  return {
    products: store.products,
    loading: store.loading,
    error: store.error,
    retry: store.refreshData,
  };
};
