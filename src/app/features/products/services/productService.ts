// This service now interfaces with the StoreProvider.
// Components should use the useStore() hook directly for product data.
// This file is kept for backward compatibility with existing imports.

import { Product } from '../../../shared/types/types';

// These functions are no longer the source of truth.
// Use useStore().products and related methods instead.
// Kept as thin wrappers for any non-component code that needs them.

export const productService = {
  // Deprecated — use useStore().products directly
  getAllProducts: (): Promise<Product[]> => {
    const raw = localStorage.getItem('kb_products');
    const products = raw ? JSON.parse(raw) : [];
    return Promise.resolve(products);
  },

  getProductById: (id: string): Promise<Product | undefined> => {
    const raw = localStorage.getItem('kb_products');
    const products: Product[] = raw ? JSON.parse(raw) : [];
    return Promise.resolve(products.find(p => p.id === id));
  },

  getFeaturedProducts: (): Promise<Product[]> => {
    const raw = localStorage.getItem('kb_products');
    const products: Product[] = raw ? JSON.parse(raw) : [];
    return Promise.resolve(products.filter(p => p.featured));
  },

  getNewArrivals: (): Promise<Product[]> => {
    const raw = localStorage.getItem('kb_products');
    const products: Product[] = raw ? JSON.parse(raw) : [];
    return Promise.resolve([...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8));
  },

  getBestSellers: (): Promise<Product[]> => {
    const raw = localStorage.getItem('kb_products');
    const products: Product[] = raw ? JSON.parse(raw) : [];
    return Promise.resolve([...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 8));
  },

  getLimitedEdition: (): Promise<Product[]> => {
    const raw = localStorage.getItem('kb_products');
    const products: Product[] = raw ? JSON.parse(raw) : [];
    return Promise.resolve(products.filter(p => p.limitedEdition));
  },

  getByType: (type: string): Promise<Product[]> => {
    const raw = localStorage.getItem('kb_products');
    const products: Product[] = raw ? JSON.parse(raw) : [];
    return Promise.resolve(products.filter(p => p.type.toLowerCase() === type.toLowerCase()));
  },

  getByMaterial: (material: string): Promise<Product[]> => {
    const raw = localStorage.getItem('kb_products');
    const products: Product[] = raw ? JSON.parse(raw) : [];
    return Promise.resolve(products.filter(p => p.material.toLowerCase() === material.toLowerCase()));
  },
};