import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import type {
    Product, Order, OrderItem, Payment, Expense, Customer, Promotion,
    InventoryItem, InventoryLog, DashboardSummary, OrderStatus, PaymentStatus,
    PaymentMethod, Size, BagType,
} from '../shared/types/types';
import { apiService } from '../lib/services/apiService';

// ─── Context Type ──────────────────────────────────────────────
interface StoreContextType {
    // Data
    products: Product[];
    orders: Order[];
    payments: Payment[];
    expenses: Expense[];
    customers: Customer[];
    promotions: Promotion[];
    loading: boolean;
    error: string | null;

    // Product actions
    addProduct: (product: Omit<Product, 'id' | 'salesCount' | 'createdAt'>) => Promise<Product>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProductById: (id: string) => Product | undefined;

    // Order actions
    createOrder: (params: {
        items: { productId: string; quantity: number; color: string; size: Size }[];
        address: string;
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        paymentMethod: PaymentMethod;
        discountCode?: string;
    }) => Promise<Order>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

    // Payment actions
    processPayment: (orderId: string) => Promise<{ success: boolean; payment?: Payment }>;
    markPaymentFailed: (orderId: string) => Promise<void>;

    // Inventory actions
    getInventory: () => InventoryItem[];
    restockProduct: (productId: string, quantity: number) => Promise<void>;
    getLowStockProducts: () => Product[];

    // Expense actions
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;

    // Customer actions
    getCustomer: (email: string) => Customer | undefined;

    // Promotion actions
    addPromotion: (promo: Omit<Promotion, 'id'>) => Promise<void>;
    updatePromotion: (id: string, updates: Partial<Promotion>) => Promise<void>;
    deletePromotion: (id: string) => Promise<void>;
    validatePromoCode: (code: string) => Promise<{ valid: boolean; discount: number }>;

    // Computed
    getDashboardSummary: () => DashboardSummary;
    getBestSellers: () => Product[];
    getNewArrivals: () => Product[];
    getFeaturedProducts: () => Product[];
    getLimitedEdition: () => Product[];
    getRevenueByMonth: () => { month: string; revenue: number }[];
    getSalesByCategory: () => { category: string; sales: number; fill: string }[];
    getWeeklySales: () => { day: string; sales: number }[];
    getProfitTrend: () => { month: string; profit: number }[];
    getCustomerGrowth: () => { month: string; customers: number }[];
    getPaymentMethodBreakdown: () => { name: string; value: number }[];
    
    // Refresh data
    refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────
export function StoreProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load initial data
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsData, ordersData, paymentsData, expensesData, customersData, promotionsData] = await Promise.all([
                apiService.getProducts(),
                apiService.getOrders(),
                apiService.getPayments(),
                apiService.getExpenses(),
                apiService.getCustomers(),
                apiService.getPromotions()
            ]);
            
            setProducts(productsData);
            setOrders(ordersData);
            setPayments(paymentsData);
            setExpenses(expensesData);
            setCustomers(customersData);
            setPromotions(promotionsData);
        } catch (err: any) {
            setError(err.message || 'Failed to load data');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ─── Product Actions ───────────────────────────────────────
    const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'salesCount' | 'createdAt'>): Promise<Product> => {
        try {
            const newProduct = await apiService.createProduct({
                ...productData,
                salesCount: 0,
                createdAt: new Date().toISOString().split('T')[0],
            });
            setProducts(prev => [newProduct, ...prev]);
            return newProduct;
        } catch (err: any) {
            setError(err.message || 'Failed to create product');
            throw err;
        }
    }, []);

    const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
        try {
            const updatedProduct = await apiService.updateProduct(id, updates);
            setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        } catch (err: any) {
            setError(err.message || 'Failed to update product');
            throw err;
        }
    }, []);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            await apiService.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
            throw err;
        }
    }, []);

    const getProductById = useCallback((id: string) => {
        return products.find(p => p.id === id);
    }, [products]);

    // ─── Order Actions ─────────────────────────────────────────
    const createOrder = useCallback(async (params: {
        items: { productId: string; quantity: number; color: string; size: Size }[];
        address: string;
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        paymentMethod: PaymentMethod;
        discountCode?: string;
    }): Promise<Order> => {
        try {
            // Build order items from product data
            const orderItems = params.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) throw new Error(`Product ${item.productId} not found`);
                return {
                    productId: item.productId,
                    productName: product.name,
                    quantity: item.quantity,
                    unitPrice: product.discountPrice || product.sellingPrice,
                    costPrice: product.costPrice,
                    color: item.color,
                    size: item.size,
                };
            });

            const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

            // Apply discount
            let discount = 0;
            if (params.discountCode) {
                const result = await validatePromoCode(params.discountCode);
                if (result.valid) {
                    discount = subtotal * (result.discount / 100);
                }
            }

            // Delivery fee (free over KES 5000)
            const afterDiscount = subtotal - discount;
            const delivery = afterDiscount >= 5000 ? 0 : 250;
            const total = afterDiscount + delivery;

            const orderData = {
                customerName: params.customerName,
                customerEmail: params.customerEmail,
                customerPhone: params.customerPhone,
                address: params.address,
                items: orderItems,
                subtotal,
                discount,
                delivery,
                total,
                paymentMethod: params.paymentMethod,
                discountCode: params.discountCode
            };

            const order = await apiService.createOrder(orderData);
            setOrders(prev => [order, ...prev]);

            // Update customer data
            const customer = customers.find(c => c.email === params.customerEmail);
            if (customer) {
                setCustomers(prev => prev.map(c => 
                    c.email === params.customerEmail 
                        ? { ...c, totalOrders: c.totalOrders + 1, totalSpent: c.totalSpent + total, lastOrder: order.date }
                        : c
                ));
            } else {
                const newCustomer: Customer = {
                    id: `C-${Date.now()}`,
                    name: params.customerName,
                    email: params.customerEmail,
                    phone: params.customerPhone || '',
                    totalOrders: 1,
                    totalSpent: total,
                    joinDate: order.date,
                    lastOrder: order.date,
                };
                setCustomers(prev => [...prev, newCustomer]);
            }

            // Fire notification event
            window.dispatchEvent(new CustomEvent('kerubelle:new-order', {
                detail: { orderId: order.id, customerName: params.customerName, total: order.total },
            }));

            return order;
        } catch (err: any) {
            setError(err.message || 'Failed to create order');
            throw err;
        }
    }, [products, customers]);

    const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
        try {
            await apiService.updateOrderStatus(orderId, status);
            setOrders(prev => prev.map(o => 
                o.id === orderId 
                    ? { ...o, status, statusHistory: [...o.statusHistory, { status, date: new Date().toISOString() }] }
                    : o
            ));
        } catch (err: any) {
            setError(err.message || 'Failed to update order status');
            throw err;
        }
    }, []);

    // ─── Payment Actions ───────────────────────────────────────
    const processPayment = useCallback(async (orderId: string): Promise<{ success: boolean; payment?: Payment }> => {
        const order = orders.find(o => o.id === orderId);
        if (!order) {
            setError('Order not found');
            return { success: false };
        }

        try {
            const txCode = generateTransactionCode(order.paymentMethod || 'M-Pesa');
            const paymentData = {
                orderId: order.id,
                customerName: order.customerName,
                method: order.paymentMethod || 'M-Pesa',
                transactionCode: txCode,
                amount: order.total,
            };

            const payment = await apiService.createPayment(paymentData);
            setPayments(prev => [payment, ...prev]);

            // Update order payment status
            setOrders(prev => prev.map(o => 
                o.id === orderId 
                    ? { ...o, paymentStatus: 'Paid', transactionCode: txCode }
                    : o
            ));

            return { success: true, payment };
        } catch (err: any) {
            setError(err.message || 'Failed to process payment');
            return { success: false };
        }
    }, [orders]);

    const markPaymentFailed = useCallback(async (orderId: string) => {
        setOrders(prev => prev.map(o => 
            o.id === orderId ? { ...o, paymentStatus: 'Failed' } : o
        ));
    }, []);

    // ─── Inventory Actions ─────────────────────────────────────
    const getInventory = useCallback((): InventoryItem[] => {
        return products.map(p => {
            const history: InventoryLog[] = [];
            orders.forEach(o => {
                if (o.paymentStatus === 'Paid') {
                    o.items.forEach(item => {
                        if (item.productId === p.id) {
                            history.push({ date: o.date, action: 'Sold', quantity: -item.quantity });
                        }
                    });
                }
            });

            return {
                productId: p.id,
                productName: p.name,
                currentStock: p.stock,
                lowStockThreshold: 5,
                lastRestocked: p.createdAt,
                history,
            };
        });
    }, [products, orders]);

    const restockProduct = useCallback(async (productId: string, quantity: number) => {
        try {
            await apiService.restockProduct(productId, quantity);
            setProducts(prev => prev.map(p => 
                p.id === productId ? { ...p, stock: p.stock + quantity } : p
            ));
        } catch (err: any) {
            setError(err.message || 'Failed to restock product');
            throw err;
        }
    }, []);

    const getLowStockProducts = useCallback((): Product[] => {
        return products.filter(p => p.stock <= 5);
    }, [products]);

    // ─── Expense Actions ───────────────────────────────────────
    const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
        try {
            const newExpense = await apiService.createExpense(expense);
            setExpenses(prev => [newExpense, ...prev]);
        } catch (err: any) {
            setError(err.message || 'Failed to add expense');
            throw err;
        }
    }, []);

    const deleteExpense = useCallback(async (id: string) => {
        try {
            await apiService.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete expense');
            throw err;
        }
    }, []);

    // ─── Customer Actions ──────────────────────────────────────
    const getCustomer = useCallback((email: string) => {
        return customers.find(c => c.email === email);
    }, [customers]);

    // ─── Promotion Actions ─────────────────────────────────────
    const addPromotion = useCallback(async (promo: Omit<Promotion, 'id'>) => {
        try {
            const newPromo = await apiService.createPromotion(promo);
            setPromotions(prev => [newPromo, ...prev]);
        } catch (err: any) {
            setError(err.message || 'Failed to add promotion');
            throw err;
        }
    }, []);

    const updatePromotion = useCallback(async (id: string, updates: Partial<Promotion>) => {
        try {
            const updatedPromo = await apiService.updatePromotion(id, updates);
            setPromotions(prev => prev.map(p => p.id === id ? updatedPromo : p));
        } catch (err: any) {
            setError(err.message || 'Failed to update promotion');
            throw err;
        }
    }, []);

    const deletePromotion = useCallback(async (id: string) => {
        try {
            await apiService.deletePromotion(id);
            setPromotions(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete promotion');
            throw err;
        }
    }, []);

    const validatePromoCode = useCallback(async (code: string): Promise<{ valid: boolean; discount: number }> => {
        try {
            const result = await apiService.validatePromoCode(code);
            return result;
        } catch (err) {
            return { valid: false, discount: 0 };
        }
    }, []);

    // ─── Helper Functions ──────────────────────────────────────
    function generateTransactionCode(method: PaymentMethod): string {
        const prefix = method === 'M-Pesa' ? 'SHK' : 'CRD';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = prefix;
        for (let i = 0; i < 7; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    }

    // ─── Computed Values ───────────────────────────────────────
    const getDashboardSummary = useCallback((): DashboardSummary => {
        const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
        const totalCostOfGoods = paidOrders.reduce((sum, o) =>
            sum + o.items.reduce((s, i) => s + i.costPrice * i.quantity, 0), 0
        );
        const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
        const refundedAmount = orders
            .filter(o => o.paymentStatus === 'Refunded')
            .reduce((sum, o) => sum + o.total, 0);
        const pendingPayments = orders
            .filter(o => o.paymentStatus === 'Pending')
            .reduce((sum, o) => sum + o.total, 0);

        return {
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalCustomers: customers.length,
            netProfit: totalRevenue - totalCostOfGoods - totalExpensesAmount,
            pendingPayments,
            totalCostOfGoods,
            totalExpenses: totalExpensesAmount,
            refundedAmount,
        };
    }, [orders, products, expenses, customers]);

    const getBestSellers = useCallback((): Product[] => {
        return [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 8);
    }, [products]);

    const getNewArrivals = useCallback((): Product[] => {
        return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
    }, [products]);

    const getFeaturedProducts = useCallback((): Product[] => {
        return products.filter(p => p.featured);
    }, [products]);

    const getLimitedEdition = useCallback((): Product[] => {
        return products.filter(p => p.limitedEdition);
    }, [products]);

    const getRevenueByMonth = useCallback(() => {
        const monthMap: Record<string, number> = {};
        const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
        paidOrders.forEach(o => {
            const d = new Date(o.date);
            const key = d.toLocaleString('default', { month: 'short' });
            monthMap[key] = (monthMap[key] || 0) + o.total;
        });
        return Object.entries(monthMap).map(([month, revenue]) => ({ month, revenue }));
    }, [orders]);

    const CATEGORY_COLORS: Record<string, string> = {
        Tote: '#F8C8DC', Crossbody: '#D4A5B8', Clutch: '#E8B4C8',
        Shoulder: '#C9939F', Backpack: '#F5E0E8', Mini: '#E0B0C8',
    };

    const getSalesByCategory = useCallback(() => {
        const catMap: Record<string, number> = {};
        products.forEach(p => {
            catMap[p.type] = (catMap[p.type] || 0) + p.salesCount;
        });
        return Object.entries(catMap).map(([category, sales]) => ({
            category,
            sales,
            fill: CATEGORY_COLORS[category] || '#F8C8DC',
        }));
    }, [products]);

    const getWeeklySales = useCallback(() => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayMap: Record<string, number> = {};
        dayNames.forEach(d => { dayMap[d] = 0; });

        const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
        paidOrders.forEach(o => {
            const d = new Date(o.date);
            const dayName = dayNames[d.getDay()];
            dayMap[dayName] += o.total;
        });

        return dayNames.map(day => ({ day, sales: dayMap[day] }));
    }, [orders]);

    const getProfitTrend = useCallback(() => {
        const monthMap: Record<string, number> = {};
        const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
        paidOrders.forEach(o => {
            const d = new Date(o.date);
            const key = d.toLocaleString('default', { month: 'short' });
            const orderProfit = o.items.reduce((sum, i) =>
                sum + (i.unitPrice - i.costPrice) * i.quantity, 0
            );
            monthMap[key] = (monthMap[key] || 0) + orderProfit;
        });
        return Object.entries(monthMap).map(([month, profit]) => ({ month, profit }));
    }, [orders]);

    const getCustomerGrowth = useCallback(() => {
        const monthMap: Record<string, number> = {};
        customers.forEach(c => {
            const d = new Date(c.joinDate);
            const key = d.toLocaleString('default', { month: 'short' });
            monthMap[key] = (monthMap[key] || 0) + 1;
        });
        let cumulative = 0;
        return Object.entries(monthMap).map(([month, count]) => {
            cumulative += count;
            return { month, customers: cumulative };
        });
    }, [customers]);

    const getPaymentMethodBreakdown = useCallback(() => {
        const paidPayments = payments.filter(p => p.status === 'Paid');
        const total = paidPayments.length || 1;
        const mpesa = paidPayments.filter(p => p.method === 'M-Pesa').length;
        const card = total - mpesa;
        return [
            { name: 'M-Pesa', value: Math.round((mpesa / total) * 100) },
            { name: 'Card', value: Math.round((card / total) * 100) },
        ];
    }, [payments]);

    const refreshData = useCallback(async () => {
        await loadData();
    }, [loadData]);

    // ─── Context Value ─────────────────────────────────────────
    const value = useMemo<StoreContextType>(() => ({
        products, orders, payments, expenses, customers, promotions,
        loading, error,
        addProduct, updateProduct, deleteProduct, getProductById,
        createOrder, updateOrderStatus,
        processPayment, markPaymentFailed,
        getInventory, restockProduct, getLowStockProducts,
        addExpense, deleteExpense,
        getCustomer,
        addPromotion, updatePromotion, deletePromotion, validatePromoCode,
        getDashboardSummary, getBestSellers, getNewArrivals, getFeaturedProducts,
        getLimitedEdition, getRevenueByMonth, getSalesByCategory, getWeeklySales,
        getProfitTrend, getCustomerGrowth, getPaymentMethodBreakdown,
        refreshData,
    }), [
        products, orders, payments, expenses, customers, promotions,
        loading, error,
        addProduct, updateProduct, deleteProduct, getProductById,
        createOrder, updateOrderStatus,
        processPayment, markPaymentFailed,
        getInventory, restockProduct, getLowStockProducts,
        addExpense, deleteExpense,
        getCustomer,
        addPromotion, updatePromotion, deletePromotion, validatePromoCode,
        getDashboardSummary, getBestSellers, getNewArrivals, getFeaturedProducts,
        getLimitedEdition, getRevenueByMonth, getSalesByCategory, getWeeklySales,
        getProfitTrend, getCustomerGrowth, getPaymentMethodBreakdown,
        refreshData,
    ]);

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────
export function useStore() {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within a StoreProvider');
    return context;
}