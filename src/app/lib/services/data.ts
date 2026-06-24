import { Product, Expense, Promotion, Customer } from '../../shared/types/types';

// ─── Seed Products (KES pricing) ───────────────────────────────
export const seedProducts: Product[] = [
  {
    id: 'P001', name: 'Blush Elegance Tote', type: 'Tote', material: 'Leather',
    sizes: ['Medium', 'Large'], colors: ['Baby Pink', 'Rose Gold', 'White'],
    costPrice: 2500, sellingPrice: 4500, discountPrice: 3900, stock: 24,
    image: 'https://images.unsplash.com/photo-1760624294582-5341f33f9fa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbGVhdGhlciUyMHRvdGUlMjBiYWd8ZW58MXx8fHwxNzcxNDA5OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Classic leather tote with spacious interior, perfect for work and everyday elegance.',
    featured: true, bestSeller: true, salesCount: 45, createdAt: '2026-01-15',
  },
  {
    id: 'P002', name: 'Rose Crystal Clutch', type: 'Clutch', material: 'Beaded',
    sizes: ['Mini'], colors: ['Baby Pink', 'Silver', 'Gold'],
    costPrice: 1800, sellingPrice: 3500, discountPrice: 3200, stock: 15,
    image: 'https://images.unsplash.com/photo-1701252003555-6a6cd8062367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwYmVhZGVkJTIwY2x1dGNoJTIwcHVyc2V8ZW58MXx8fHwxNzcxNDA5OTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Stunning beaded clutch with crystal embellishments, perfect for special occasions.',
    featured: true, limitedEdition: true, salesCount: 28, createdAt: '2026-01-20',
  },
  {
    id: 'P003', name: 'Soft Pink Crossbody', type: 'Crossbody', material: 'Faux Leather',
    sizes: ['Mini', 'Medium'], colors: ['Baby Pink', 'Nude', 'Peach'],
    costPrice: 1200, sellingPrice: 2800, discountPrice: 2400, stock: 38,
    image: 'https://images.unsplash.com/photo-1758499537503-315ca95c010b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwY3Jvc3Nib2R5JTIwYmFnfGVufDF8fHx8MTc3MTQwOTk0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Versatile crossbody bag with adjustable strap, ideal for hands-free convenience.',
    newArrival: true, bestSeller: true, salesCount: 38, createdAt: '2026-02-01',
  },
  {
    id: 'P004', name: 'Luxe Pink Shoulder Bag', type: 'Shoulder', material: 'Luxury',
    sizes: ['Medium', 'Large'], colors: ['Baby Pink', 'Burgundy', 'Black'],
    costPrice: 3000, sellingPrice: 5200, discountPrice: 4800, stock: 12,
    image: 'https://images.unsplash.com/photo-1634419446253-a1da206cf824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwaW5rJTIwaGFuZGJhZ3xlbnwxfHx8fDE3NzE0MDk5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Premium luxury shoulder bag with gold hardware and signature design.',
    featured: true, limitedEdition: true, salesCount: 22, createdAt: '2026-01-10',
  },
  {
    id: 'P005', name: 'Blossom Mini Backpack', type: 'Backpack', material: 'Fabric',
    sizes: ['Mini', 'Medium'], colors: ['Baby Pink', 'Lavender', 'Mint'],
    costPrice: 1000, sellingPrice: 2200, stock: 30,
    image: 'https://images.unsplash.com/photo-1539804967841-9901c6e27c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbWluaSUyMGJhY2twYWNrfGVufDF8fHx8MTc3MTQwOTk0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Cute fabric backpack with floral lining, perfect for casual outings.',
    newArrival: true, salesCount: 10, createdAt: '2026-02-05',
  },
  {
    id: 'P006', name: 'Pink Pearl Mini Bag', type: 'Mini', material: 'Beaded',
    sizes: ['Mini'], colors: ['Baby Pink', 'White', 'Champagne'],
    costPrice: 800, sellingPrice: 1800, discountPrice: 1500, stock: 2,
    image: 'https://images.unsplash.com/photo-1612344025746-8f86cac0be8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBpbmslMjBzaG91bGRlciUyMGJhZ3xlbnwxfHx8fDE3NzE0MDk5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Adorable pearl-embellished mini bag, a perfect statement piece.',
    newArrival: true, bestSeller: true, salesCount: 18, createdAt: '2026-02-12',
  },
  {
    id: 'P007', name: 'Classic Pink Tote', type: 'Tote', material: 'Faux Leather',
    sizes: ['Large'], colors: ['Baby Pink', 'Taupe', 'Grey'],
    costPrice: 1500, sellingPrice: 3200, stock: 20,
    image: 'https://images.unsplash.com/photo-1532948006887-4d8a57c24672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGhhbmRiYWclMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MTQwOTk0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Spacious tote with multiple compartments for organized storage.',
    bestSeller: true, salesCount: 32, createdAt: '2025-12-01',
  },
  {
    id: 'P008', name: 'Evening Rose Clutch', type: 'Clutch', material: 'Luxury',
    sizes: ['Mini'], colors: ['Baby Pink', 'Black', 'Navy'],
    costPrice: 2200, sellingPrice: 4200, stock: 8,
    image: 'https://images.unsplash.com/photo-1591656852283-29bed2fe05ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcGluayUyMHB1cnNlfGVufDF8fHx8MTc3MTQwOTk0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Sophisticated evening clutch with chain strap and elegant closure.',
    featured: true, salesCount: 15, createdAt: '2026-01-25',
  },
  {
    id: 'P009', name: 'Convertible Pink Shoulder', type: 'Shoulder', material: 'Leather',
    sizes: ['Medium'], colors: ['Baby Pink', 'Camel', 'Brown'],
    costPrice: 2000, sellingPrice: 3800, stock: 18,
    image: 'https://images.unsplash.com/photo-1762596958689-74dac544f195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZGVzaWduZXIlMjBoYW5kYmFnfGVufDF8fHx8MTc3MTQwOTk0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Versatile shoulder bag that converts to crossbody with removable strap.',
    newArrival: true, salesCount: 12, createdAt: '2026-02-08',
  },
  {
    id: 'P010', name: 'Blush Crossbody Chain', type: 'Crossbody', material: 'Luxury',
    sizes: ['Mini', 'Medium'], colors: ['Baby Pink', 'Red', 'Beige'],
    costPrice: 2500, sellingPrice: 4800, stock: 10,
    image: 'https://images.unsplash.com/photo-1768033976392-e2085237923a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBwaW5rJTIwYmFnfGVufDF8fHx8MTc3MTQwOTk0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Chic crossbody with gold chain detail and quilted pattern.',
    limitedEdition: true, salesCount: 8, createdAt: '2026-02-10',
  },
  {
    id: 'P011', name: 'Travel Pink Backpack', type: 'Backpack', material: 'Leather',
    sizes: ['Medium', 'Large'], colors: ['Baby Pink', 'Black', 'Brown'],
    costPrice: 2800, sellingPrice: 5000, stock: 14,
    image: 'https://images.unsplash.com/photo-1622560482357-789dc8a50923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbGVhdGhlciUyMGJhY2twYWNrfGVufDF8fHx8MTc3MTQwOTk0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Spacious leather backpack with laptop compartment and multiple pockets.',
    featured: true, salesCount: 6, createdAt: '2026-01-28',
  },
  {
    id: 'P012', name: 'Vintage Pink Mini', type: 'Mini', material: 'Fabric',
    sizes: ['Mini'], colors: ['Baby Pink', 'Cream', 'Floral'],
    costPrice: 600, sellingPrice: 1500, stock: 25,
    image: 'https://images.unsplash.com/photo-1760624294582-5341f33f9fa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbGVhdGhlciUyMHRvdGUlMjBiYWd8ZW58MXx8fHwxNzcxNDA5OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [], description: 'Charming vintage-style mini bag with unique fabric patterns.',
    newArrival: true, salesCount: 5, createdAt: '2026-02-15',
  },
];

// ─── Seed Expenses ─────────────────────────────────────────────
export const seedExpenses: Expense[] = [
  { id: 'EXP-001', name: 'Instagram Ads Campaign', category: 'Marketing', amount: 5000, date: '2026-02-01' },
  { id: 'EXP-002', name: 'Courier Delivery Service', category: 'Delivery', amount: 3200, date: '2026-02-05' },
  { id: 'EXP-003', name: 'Office Rent – February', category: 'Rent', amount: 15000, date: '2026-02-01' },
  { id: 'EXP-004', name: 'Gift Wrapping Supplies', category: 'Packaging', amount: 1800, date: '2026-02-10' },
  { id: 'EXP-005', name: 'TikTok Promo', category: 'Marketing', amount: 3500, date: '2026-02-15' },
  { id: 'EXP-006', name: 'Same-Day Delivery Riders', category: 'Delivery', amount: 2400, date: '2026-02-18' },
];

// ─── Seed Promotions ───────────────────────────────────────────
export const seedPromotions: Promotion[] = [
  { id: 'PROMO-001', code: 'LOVE20', description: '20% off Valentine\'s collection', discountPercent: 20, usageCount: 45, maxUsage: 100, startDate: '2026-02-01', endDate: '2026-02-28', active: true },
  { id: 'PROMO-002', code: 'NEWBAG10', description: '10% off first purchase', discountPercent: 10, usageCount: 120, maxUsage: 500, startDate: '2025-12-01', endDate: '2026-06-30', active: true },
  { id: 'PROMO-003', code: 'FLASH30', description: '30% flash sale weekend', discountPercent: 30, usageCount: 80, maxUsage: 80, startDate: '2026-02-15', endDate: '2026-02-16', active: false },
  { id: 'PROMO-004', code: 'FREESHIP', description: 'Free shipping on orders over KES 5000', discountPercent: 0, usageCount: 33, maxUsage: 200, startDate: '2026-01-01', endDate: '2026-03-31', active: true },
];

// ─── Seed Customers ────────────────────────────────────────────
export const seedCustomers: Customer[] = [
  { id: 'C001', name: 'Akinyi Atieno', email: 'akinyi@email.com', phone: '+254712345678', totalOrders: 5, totalSpent: 22500, joinDate: '2025-11-10', lastOrder: '2026-02-18' },
  { id: 'C002', name: 'Wanjiku Mwangi', email: 'wanjiku@email.com', phone: '+254723456789', totalOrders: 3, totalSpent: 14200, joinDate: '2025-12-05', lastOrder: '2026-02-19' },
  { id: 'C003', name: 'Nafula Wekesa', email: 'nafula@email.com', phone: '+254734567890', totalOrders: 2, totalSpent: 7000, joinDate: '2026-01-15', lastOrder: '2026-02-20' },
  { id: 'C004', name: 'Cherono Bett', email: 'cherono@email.com', phone: '+254745678901', totalOrders: 1, totalSpent: 3800, joinDate: '2026-02-01', lastOrder: '2026-02-20' },
  { id: 'C005', name: 'Moraa Nyakundi', email: 'moraa@email.com', phone: '+254756789012', totalOrders: 8, totalSpent: 41600, joinDate: '2025-09-20', lastOrder: '2026-02-21' },
  { id: 'C006', name: 'Adhiambo Odhiambo', email: 'adhiambo@email.com', phone: '+254767890123', totalOrders: 2, totalSpent: 6800, joinDate: '2026-01-25', lastOrder: '2026-02-22' },
];

// ─── Seed Orders ───────────────────────────────────────────────
export const seedOrders: import('../../shared/types/types').Order[] = [
  {
    id: 'ORD-001', date: '2026-02-18', subtotal: 4500, discount: 0, delivery: 250, total: 4750,
    status: 'Delivered', paymentStatus: 'Paid', paymentMethod: 'M-Pesa', transactionCode: 'SHK7X2N9LP',
    address: '123 Rose Avenue, Nairobi', customerName: 'Akinyi Atieno', customerEmail: 'akinyi@email.com',
    statusHistory: [
      { status: 'Processing', date: '2026-02-18' }, { status: 'Packed', date: '2026-02-18' },
      { status: 'Shipped', date: '2026-02-19' }, { status: 'Delivered', date: '2026-02-20' },
    ],
    items: [{ productId: 'P001', productName: 'Blush Elegance Tote', quantity: 1, unitPrice: 4500, costPrice: 2500, color: 'Baby Pink', size: 'Large' }],
  },
  {
    id: 'ORD-002', date: '2026-02-19', subtotal: 5600, discount: 0, delivery: 250, total: 5850,
    status: 'Shipped', paymentStatus: 'Paid', paymentMethod: 'Card', transactionCode: 'CRD4M8T3FQ',
    address: '45 Pink Boulevard, Mombasa', customerName: 'Wanjiku Mwangi', customerEmail: 'wanjiku@email.com',
    statusHistory: [
      { status: 'Processing', date: '2026-02-19' }, { status: 'Packed', date: '2026-02-19' },
      { status: 'Shipped', date: '2026-02-20' },
    ],
    items: [{ productId: 'P003', productName: 'Soft Pink Crossbody', quantity: 2, unitPrice: 2800, costPrice: 1200, color: 'Baby Pink', size: 'Medium' }],
  },
  {
    id: 'ORD-003', date: '2026-02-20', subtotal: 3500, discount: 0, delivery: 250, total: 3750,
    status: 'Processing', paymentStatus: 'Pending', paymentMethod: 'M-Pesa', transactionCode: 'SHK3P1R7YZ',
    address: '789 Blossom Street, Kisumu', customerName: 'Nafula Wekesa', customerEmail: 'nafula@email.com',
    statusHistory: [{ status: 'Processing', date: '2026-02-20' }],
    items: [{ productId: 'P002', productName: 'Rose Crystal Clutch', quantity: 1, unitPrice: 3500, costPrice: 1800, color: 'Baby Pink', size: 'Mini' }],
  },
  {
    id: 'ORD-004', date: '2026-02-20', subtotal: 3800, discount: 0, delivery: 250, total: 4050,
    status: 'Processing', paymentStatus: 'Failed', paymentMethod: 'Card', transactionCode: 'CRD9W5H2BN',
    address: '12 Sunset Lane, Eldoret', customerName: 'Cherono Bett', customerEmail: 'cherono@email.com',
    statusHistory: [{ status: 'Processing', date: '2026-02-20' }],
    items: [{ productId: 'P009', productName: 'Convertible Pink Shoulder', quantity: 1, unitPrice: 3800, costPrice: 2000, color: 'Camel', size: 'Medium' }],
  },
  {
    id: 'ORD-005', date: '2026-02-21', subtotal: 9700, discount: 0, delivery: 0, total: 9700,
    status: 'Packed', paymentStatus: 'Paid', paymentMethod: 'M-Pesa', transactionCode: 'SHK6L4K8DJ',
    address: '56 Jasmine Road, Nakuru', customerName: 'Moraa Nyakundi', customerEmail: 'moraa@email.com',
    statusHistory: [{ status: 'Processing', date: '2026-02-21' }, { status: 'Packed', date: '2026-02-22' }],
    items: [
      { productId: 'P004', productName: 'Luxe Pink Shoulder Bag', quantity: 1, unitPrice: 5200, costPrice: 3000, color: 'Baby Pink', size: 'Large' },
      { productId: 'P001', productName: 'Blush Elegance Tote', quantity: 1, unitPrice: 4500, costPrice: 2500, color: 'Rose Gold', size: 'Medium' },
    ],
  },
  {
    id: 'ORD-006', date: '2026-02-22', subtotal: 2800, discount: 0, delivery: 250, total: 3050,
    status: 'Processing', paymentStatus: 'Refunded', paymentMethod: 'M-Pesa', transactionCode: 'SHK2V7C5RT',
    address: '88 Lily Avenue, Nairobi', customerName: 'Adhiambo Odhiambo', customerEmail: 'adhiambo@email.com',
    statusHistory: [{ status: 'Processing', date: '2026-02-22' }],
    items: [{ productId: 'P003', productName: 'Soft Pink Crossbody', quantity: 1, unitPrice: 2800, costPrice: 1200, color: 'Nude', size: 'Mini' }],
  },
];

// ─── Seed Payments ─────────────────────────────────────────────
export const seedPayments: import('../../shared/types/types').Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-001', customer: 'Akinyi Atieno', method: 'M-Pesa', transactionCode: 'SHK7X2N9LP', amount: 4750, status: 'Paid', date: '2026-02-18' },
  { id: 'PAY-002', orderId: 'ORD-002', customer: 'Wanjiku Mwangi', method: 'Card', transactionCode: 'CRD4M8T3FQ', amount: 5850, status: 'Paid', date: '2026-02-19' },
  { id: 'PAY-003', orderId: 'ORD-003', customer: 'Nafula Wekesa', method: 'M-Pesa', transactionCode: 'SHK3P1R7YZ', amount: 3750, status: 'Pending', date: '2026-02-20' },
  { id: 'PAY-004', orderId: 'ORD-004', customer: 'Cherono Bett', method: 'Card', transactionCode: 'CRD9W5H2BN', amount: 4050, status: 'Failed', date: '2026-02-20' },
  { id: 'PAY-005', orderId: 'ORD-005', customer: 'Moraa Nyakundi', method: 'M-Pesa', transactionCode: 'SHK6L4K8DJ', amount: 9700, status: 'Paid', date: '2026-02-21' },
  { id: 'PAY-006', orderId: 'ORD-006', customer: 'Adhiambo Odhiambo', method: 'M-Pesa', transactionCode: 'SHK2V7C5RT', amount: 3050, status: 'Refunded', date: '2026-02-22' },
];

export const mockAddresses = [
  '123 Rose Avenue, Nairobi, Kenya',
  '45 Pink Boulevard, Mombasa, Kenya',
  '789 Blossom Street, Kisumu, Kenya',
];

// Export products array with alias for backward compatibility
export const products = seedProducts;