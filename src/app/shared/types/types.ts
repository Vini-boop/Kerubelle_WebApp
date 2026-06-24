// ─── Core Enums ────────────────────────────────────────────────
export type BagType = 'Tote' | 'Clutch' | 'Shoulder' | 'Crossbody' | 'Backpack' | 'Mini';
export type Material = 'Leather' | 'Faux Leather' | 'Fabric' | 'Beaded' | 'Luxury';
export type Size = 'Mini' | 'Small' | 'Medium' | 'Large';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type OrderStatus = 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
export type PaymentMethod = 'M-Pesa' | 'Card';
export type ExpenseCategory = 'Marketing' | 'Delivery' | 'Rent' | 'Packaging' | 'Other';

// ─── Product ───────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  type: BagType;
  material: Material;
  sizes: Size[];
  colors: string[];
  costPrice: number;       // In KES
  sellingPrice: number;    // In KES
  discountPrice?: number;  // Optional sale price in KES
  stock: number;
  image: string;
  images: string[];
  description: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  limitedEdition?: boolean;
  salesCount: number;
  createdAt: string;       // ISO date
}

// ─── Cart ──────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  color: string;
  size: Size;
  quantity: number;
}

// ─── Order ─────────────────────────────────────────────────────
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  color: string;
  size: Size;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionCode?: string;
  address: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  statusHistory: { status: OrderStatus; date: string }[];
}

// ─── Payment ───────────────────────────────────────────────────
export interface Payment {
  id: string;
  orderId: string;
  customer: string;
  method: PaymentMethod;
  transactionCode: string;
  amount: number;
  status: PaymentStatus;
  date: string;
}

// ─── Inventory ─────────────────────────────────────────────────
export interface InventoryLog {
  date: string;
  action: 'Restocked' | 'Sold' | 'Adjusted';
  quantity: number;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
  lastRestocked: string;
  history: InventoryLog[];
}

// ─── Expense ───────────────────────────────────────────────────
export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
}

// ─── Customer ──────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  lastOrder: string;
}

// ─── Promotion ─────────────────────────────────────────────────
export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  usageCount: number;
  maxUsage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

// ─── Wishlist ──────────────────────────────────────────────────
export interface WishlistItem {
  product: Product;
}

// ─── Dashboard Summary (computed) ──────────────────────────────
export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  netProfit: number;
  pendingPayments: number;
  totalCostOfGoods: number;
  totalExpenses: number;
  refundedAmount: number;
}
