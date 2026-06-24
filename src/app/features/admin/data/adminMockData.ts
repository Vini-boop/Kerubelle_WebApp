import type {
    Order, Payment, InventoryItem, Expense, Customer, Promotion,
    WeeklySalesData, MonthlyRevenueData, CategorySalesData, Product
} from '../types/adminTypes';

export const mockProducts: Product[] = [
    {
        id: 'P001', name: 'Rosé Elegance Tote', description: 'Premium leather tote bag in rose pink',
        category: 'Tote', costPrice: 2500, sellingPrice: 4500, discountPrice: 3900,
        colors: ['Baby Pink', 'Blush', 'Rose Gold'], size: 'Large', material: 'Leather',
        stock: 24, images: [], createdAt: '2026-01-15',
    },
    {
        id: 'P002', name: 'Blush Mini Crossbody', description: 'Compact crossbody with gold chain',
        category: 'Crossbody', costPrice: 1200, sellingPrice: 2800, discountPrice: 2400,
        colors: ['Baby Pink', 'White'], size: 'Small', material: 'Faux Leather',
        stock: 38, images: [], createdAt: '2026-01-20',
    },
    {
        id: 'P003', name: 'Pearl Clutch Evening', description: 'Evening clutch with pearl embellishments',
        category: 'Clutch', costPrice: 1800, sellingPrice: 3500, discountPrice: 3200,
        colors: ['Ivory', 'Baby Pink'], size: 'Small', material: 'Fabric',
        stock: 15, images: [], createdAt: '2026-02-01',
    },
    {
        id: 'P004', name: 'Urban Chic Backpack', description: 'Stylish backpack for the modern woman',
        category: 'Backpack', costPrice: 2000, sellingPrice: 3800, discountPrice: 3400,
        colors: ['Mauve', 'Dusty Rose'], size: 'Large', material: 'Leather',
        stock: 3, images: [], createdAt: '2026-02-05',
    },
    {
        id: 'P005', name: 'Shoulder Luxe Bag', description: 'Classic shoulder bag with gold hardware',
        category: 'Shoulder', costPrice: 3000, sellingPrice: 5200, discountPrice: 4800,
        colors: ['Baby Pink', 'Tan', 'Cream'], size: 'Medium', material: 'Leather',
        stock: 12, images: [], createdAt: '2026-02-10',
    },
    {
        id: 'P006', name: 'Petite Bow Clutch', description: 'Adorable bow detail clutch',
        category: 'Clutch', costPrice: 800, sellingPrice: 1800, discountPrice: 1500,
        colors: ['Baby Pink'], size: 'Small', material: 'Faux Leather',
        stock: 2, images: [], createdAt: '2026-02-12',
    },
];

export const mockOrders: Order[] = [
    {
        id: 'ORD-001', customerName: 'Akinyi Atieno', customerEmail: 'akinyi@email.com',
        totalAmount: 4500, paymentStatus: 'Paid', orderStatus: 'Delivered',
        items: [{ productName: 'Rosé Elegance Tote', quantity: 1, price: 4500 }],
        date: '2026-02-18',
    },
    {
        id: 'ORD-002', customerName: 'Wanjiku Mwangi', customerEmail: 'wanjiku@email.com',
        totalAmount: 5600, paymentStatus: 'Paid', orderStatus: 'Shipped',
        items: [{ productName: 'Blush Mini Crossbody', quantity: 2, price: 5600 }],
        date: '2026-02-19',
    },
    {
        id: 'ORD-003', customerName: 'Nafula Wekesa', customerEmail: 'nafula@email.com',
        totalAmount: 3500, paymentStatus: 'Pending', orderStatus: 'Processing',
        items: [{ productName: 'Pearl Clutch Evening', quantity: 1, price: 3500 }],
        date: '2026-02-20',
    },
    {
        id: 'ORD-004', customerName: 'Cherono Bett', customerEmail: 'cherono@email.com',
        totalAmount: 3800, paymentStatus: 'Failed', orderStatus: 'Processing',
        items: [{ productName: 'Urban Chic Backpack', quantity: 1, price: 3800 }],
        date: '2026-02-20',
    },
    {
        id: 'ORD-005', customerName: 'Moraa Nyakundi', customerEmail: 'moraa@email.com',
        totalAmount: 9700, paymentStatus: 'Paid', orderStatus: 'Packed',
        items: [
            { productName: 'Shoulder Luxe Bag', quantity: 1, price: 5200 },
            { productName: 'Rosé Elegance Tote', quantity: 1, price: 4500 },
        ],
        date: '2026-02-21',
    },
    {
        id: 'ORD-006', customerName: 'Adhiambo Odhiambo', customerEmail: 'adhiambo@email.com',
        totalAmount: 2800, paymentStatus: 'Refunded', orderStatus: 'Processing',
        items: [{ productName: 'Blush Mini Crossbody', quantity: 1, price: 2800 }],
        date: '2026-02-22',
    },
];

export const mockPayments: Payment[] = [
    { id: 'PAY-001', orderId: 'ORD-001', customer: 'Akinyi Atieno', method: 'M-Pesa', transactionCode: 'SHK7X2N9LP', amount: 4500, status: 'Paid', date: '2026-02-18' },
    { id: 'PAY-002', orderId: 'ORD-002', customer: 'Wanjiku Mwangi', method: 'Card', transactionCode: 'CRD4M8T3FQ', amount: 5600, status: 'Paid', date: '2026-02-19' },
    { id: 'PAY-003', orderId: 'ORD-003', customer: 'Nafula Wekesa', method: 'M-Pesa', transactionCode: 'SHK3P1R7YZ', amount: 3500, status: 'Pending', date: '2026-02-20' },
    { id: 'PAY-004', orderId: 'ORD-004', customer: 'Cherono Bett', method: 'Card', transactionCode: 'CRD9W5H2BN', amount: 3800, status: 'Failed', date: '2026-02-20' },
    { id: 'PAY-005', orderId: 'ORD-005', customer: 'Moraa Nyakundi', method: 'M-Pesa', transactionCode: 'SHK6L4K8DJ', amount: 9700, status: 'Paid', date: '2026-02-21' },
    { id: 'PAY-006', orderId: 'ORD-006', customer: 'Adhiambo Odhiambo', method: 'M-Pesa', transactionCode: 'SHK2V7C5RT', amount: 2800, status: 'Refunded', date: '2026-02-22' },
];

export const mockInventory: InventoryItem[] = [
    {
        id: 'P001', productName: 'Rosé Elegance Tote', currentStock: 24, lowStockThreshold: 5,
        lastRestocked: '2026-02-10',
        history: [
            { date: '2026-02-10', action: 'Restocked', quantity: 30 },
            { date: '2026-02-18', action: 'Sold', quantity: -3 },
            { date: '2026-02-21', action: 'Sold', quantity: -3 },
        ],
    },
    {
        id: 'P002', productName: 'Blush Mini Crossbody', currentStock: 38, lowStockThreshold: 5,
        lastRestocked: '2026-02-05',
        history: [
            { date: '2026-02-05', action: 'Restocked', quantity: 50 },
            { date: '2026-02-19', action: 'Sold', quantity: -12 },
        ],
    },
    {
        id: 'P003', productName: 'Pearl Clutch Evening', currentStock: 15, lowStockThreshold: 5,
        lastRestocked: '2026-02-01',
        history: [{ date: '2026-02-01', action: 'Restocked', quantity: 20 }],
    },
    {
        id: 'P004', productName: 'Urban Chic Backpack', currentStock: 3, lowStockThreshold: 5,
        lastRestocked: '2026-01-28',
        history: [
            { date: '2026-01-28', action: 'Restocked', quantity: 15 },
            { date: '2026-02-15', action: 'Sold', quantity: -12 },
        ],
    },
    {
        id: 'P005', productName: 'Shoulder Luxe Bag', currentStock: 12, lowStockThreshold: 5,
        lastRestocked: '2026-02-08',
        history: [{ date: '2026-02-08', action: 'Restocked', quantity: 20 }],
    },
    {
        id: 'P006', productName: 'Petite Bow Clutch', currentStock: 2, lowStockThreshold: 5,
        lastRestocked: '2026-01-20',
        history: [
            { date: '2026-01-20', action: 'Restocked', quantity: 10 },
            { date: '2026-02-10', action: 'Sold', quantity: -8 },
        ],
    },
];

export const mockExpenses: Expense[] = [
    { id: 'EXP-001', name: 'Instagram Ads Campaign', category: 'Marketing', amount: 5000, date: '2026-02-01' },
    { id: 'EXP-002', name: 'Courier Delivery Service', category: 'Delivery', amount: 3200, date: '2026-02-05' },
    { id: 'EXP-003', name: 'Office Rent – February', category: 'Rent', amount: 15000, date: '2026-02-01' },
    { id: 'EXP-004', name: 'Gift Wrapping Supplies', category: 'Packaging', amount: 1800, date: '2026-02-10' },
    { id: 'EXP-005', name: 'TikTok Promo', category: 'Marketing', amount: 3500, date: '2026-02-15' },
    { id: 'EXP-006', name: 'Same-Day Delivery Riders', category: 'Delivery', amount: 2400, date: '2026-02-18' },
];

export const mockCustomers: Customer[] = [
    { id: 'C001', name: 'Akinyi Atieno', email: 'akinyi@email.com', phone: '+254712345678', totalOrders: 5, totalSpent: 22500, joinDate: '2025-11-10', lastOrder: '2026-02-18' },
    { id: 'C002', name: 'Wanjiku Mwangi', email: 'wanjiku@email.com', phone: '+254723456789', totalOrders: 3, totalSpent: 14200, joinDate: '2025-12-05', lastOrder: '2026-02-19' },
    { id: 'C003', name: 'Nafula Wekesa', email: 'nafula@email.com', phone: '+254734567890', totalOrders: 2, totalSpent: 7000, joinDate: '2026-01-15', lastOrder: '2026-02-20' },
    { id: 'C004', name: 'Cherono Bett', email: 'cherono@email.com', phone: '+254745678901', totalOrders: 1, totalSpent: 3800, joinDate: '2026-02-01', lastOrder: '2026-02-20' },
    { id: 'C005', name: 'Moraa Nyakundi', email: 'moraa@email.com', phone: '+254756789012', totalOrders: 8, totalSpent: 41600, joinDate: '2025-09-20', lastOrder: '2026-02-21' },
    { id: 'C006', name: 'Adhiambo Odhiambo', email: 'adhiambo@email.com', phone: '+254767890123', totalOrders: 2, totalSpent: 6800, joinDate: '2026-01-25', lastOrder: '2026-02-22' },
];

export const mockPromotions: Promotion[] = [
    { id: 'PROMO-001', code: 'LOVE20', description: '20% off Valentine\'s collection', discountPercent: 20, usageCount: 45, maxUsage: 100, startDate: '2026-02-01', endDate: '2026-02-28', active: true },
    { id: 'PROMO-002', code: 'NEWBAG10', description: '10% off first purchase', discountPercent: 10, usageCount: 120, maxUsage: 500, startDate: '2025-12-01', endDate: '2026-06-30', active: true },
    { id: 'PROMO-003', code: 'FLASH30', description: '30% flash sale weekend', discountPercent: 30, usageCount: 80, maxUsage: 80, startDate: '2026-02-15', endDate: '2026-02-16', active: false },
    { id: 'PROMO-004', code: 'FREE SHIP', description: 'Free shipping on orders over KES 5000', discountPercent: 0, usageCount: 33, maxUsage: 200, startDate: '2026-01-01', endDate: '2026-03-31', active: true },
];

export const weeklySalesData: WeeklySalesData[] = [
    { day: 'Sunday', sales: 12000 },
    { day: 'Monday', sales: 18500 },
    { day: 'Tuesday', sales: 14200 },
    { day: 'Wednesday', sales: 22800 },
    { day: 'Thursday', sales: 19600 },
    { day: 'Friday', sales: 31400 },
    { day: 'Saturday', sales: 28900 },
];

export const monthlyRevenueData: MonthlyRevenueData[] = [
    { month: 'Sep', revenue: 120000 },
    { month: 'Oct', revenue: 185000 },
    { month: 'Nov', revenue: 210000 },
    { month: 'Dec', revenue: 340000 },
    { month: 'Jan', revenue: 280000 },
    { month: 'Feb', revenue: 195000 },
];

export const categorySalesData: CategorySalesData[] = [
    { category: 'Tote', sales: 42, fill: '#F8C8DC' },
    { category: 'Crossbody', sales: 28, fill: '#D4A5B8' },
    { category: 'Clutch', sales: 18, fill: '#E8B4C8' },
    { category: 'Shoulder', sales: 15, fill: '#C9939F' },
    { category: 'Backpack', sales: 10, fill: '#F5E0E8' },
];

export const paymentMethodData = [
    { name: 'M-Pesa', value: 65, fill: '#F8C8DC' },
    { name: 'Card', value: 35, fill: '#D4A5B8' },
];

export const customerGrowthData = [
    { month: 'Sep', customers: 12 },
    { month: 'Oct', customers: 28 },
    { month: 'Nov', customers: 45 },
    { month: 'Dec', customers: 72 },
    { month: 'Jan', customers: 95 },
    { month: 'Feb', customers: 118 },
];

export const profitTrendData = [
    { month: 'Sep', profit: 45000 },
    { month: 'Oct', profit: 72000 },
    { month: 'Nov', profit: 88000 },
    { month: 'Dec', profit: 152000 },
    { month: 'Jan', profit: 120000 },
    { month: 'Feb', profit: 89000 },
];

export const bestSellingData = [
    { name: 'Rosé Tote', sold: 45 },
    { name: 'Blush Crossbody', sold: 38 },
    { name: 'Pearl Clutch', sold: 28 },
    { name: 'Luxe Shoulder', sold: 22 },
    { name: 'Bow Clutch', sold: 18 },
];

// Summary calculations
export const dashboardSummary = {
    totalRevenue: 29900,
    totalOrders: 6,
    totalProducts: 6,
    totalCustomers: 6,
    netProfit: 19580,
    pendingPayments: 3500,
    totalCostOfGoods: 10320,
    refundedAmount: 2800,
    totalExpenses: 30900,
};
