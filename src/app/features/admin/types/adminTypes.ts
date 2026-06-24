export interface SummaryCard {
  title: string;
  value: string;
  icon: string;
  growth: number;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Tote' | 'Shoulder' | 'Crossbody' | 'Clutch' | 'Backpack';
  costPrice: number;
  sellingPrice: number;
  discountPrice: number;
  colors: string[];
  size: 'Small' | 'Medium' | 'Large';
  material: 'Leather' | 'Faux Leather' | 'Fabric';
  stock: number;
  images: string[];
  createdAt: string;
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type OrderStatus = 'Processing' | 'Packed' | 'Shipped' | 'Delivered';
export type PaymentMethod = 'M-Pesa' | 'Card';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: { productName: string; quantity: number; price: number }[];
  date: string;
}

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

export interface InventoryItem {
  id: string;
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
  lastRestocked: string;
  history: { date: string; action: string; quantity: number }[];
}

export interface Expense {
  id: string;
  name: string;
  category: 'Marketing' | 'Delivery' | 'Rent' | 'Packaging';
  amount: number;
  date: string;
}

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

export interface WeeklySalesData {
  day: string;
  sales: number;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

export interface CategorySalesData {
  category: string;
  sales: number;
  fill: string;
}
