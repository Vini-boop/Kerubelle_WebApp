// All API calls use a relative path — Vite proxies /api → http://localhost:3001
// In production, you can set VITE_API_URL (e.g. https://kerubelle-backend.onrender.com/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class APIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = sessionStorage.getItem('token');
    const authHeaders: Record<string, string> = {};
    if (token) authHeaders['Authorization'] = `Bearer ${token}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers as Record<string, string> || {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Guard against non-JSON responses (e.g. HTML 404 from proxy)
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          response.status === 404
            ? `API endpoint not found: ${endpoint}`
            : `Backend returned unexpected response (status ${response.status}). Make sure the backend is running on port 3001.`
        );
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ── Products (web_products table) ──────────────────────────
  async getProducts(filters: Record<string, string> = {}) {
    const queryParams = new URLSearchParams(filters);
    const qs = queryParams.toString() ? `?${queryParams}` : '';
    return this.request(`/web-products${qs}`);
  }

  async getProductById(id: string) {
    return this.request(`/web-products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request('/web-products', { method: 'POST', body: JSON.stringify(productData) });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/web-products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
  }

  async deleteProduct(id: string) {
    return this.request(`/web-products/${id}`, { method: 'DELETE' });
  }

  async getBestSellers() {
    return this.request('/web-products/stats/best-sellers');
  }

  async getNewArrivals() {
    return this.request('/web-products/stats/new-arrivals');
  }

  async getFeaturedProducts() {
    return this.request('/web-products/stats/featured');
  }

  async getLimitedEdition() {
    return this.request('/web-products/stats/limited-edition');
  }

  async getLowStockProducts() {
    return this.request('/web-products/stats/low-stock');
  }

  // ── Orders ─────────────────────────────────────────────────
  async getOrders(filters: Record<string, string> = {}) {
    const queryParams = new URLSearchParams(filters);
    const qs = queryParams.toString() ? `?${queryParams}` : '';
    return this.request(`/web-orders${qs}`);
  }

  async getOrderById(id: string) {
    return this.request(`/web-orders/${id}`);
  }

  async createOrder(orderData: any) {
    return this.request('/web-orders', { method: 'POST', body: JSON.stringify(orderData) });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/web-orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  }

  async updatePaymentStatus(id: string, paymentStatus: string, transactionCode: string) {
    return this.request(`/web-orders/${id}/payment-status`, { method: 'PUT', body: JSON.stringify({ paymentStatus, transactionCode }) });
  }

  // ── Customers ──────────────────────────────────────────────
  async getCustomers() {
    return this.request('/customers');
  }

  async getCustomerById(id: string) {
    return this.request(`/customers/${id}`);
  }

  async getCustomerByEmail(email: string) {
    return this.request(`/customers/email/${email}`);
  }

  async createCustomer(customerData: any) {
    return this.request('/customers', { method: 'POST', body: JSON.stringify(customerData) });
  }

  async updateCustomer(id: string, customerData: any) {
    return this.request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(customerData) });
  }

  async deleteCustomer(id: string) {
    return this.request(`/customers/${id}`, { method: 'DELETE' });
  }

  // ── Payments ───────────────────────────────────────────────
  async getPayments(filters: Record<string, string> = {}) {
    const queryParams = new URLSearchParams(filters);
    const qs = queryParams.toString() ? `?${queryParams}` : '';
    return this.request(`/payments${qs}`);
  }

  async getPaymentById(id: string) {
    return this.request(`/payments/${id}`);
  }

  async createPayment(paymentData: any) {
    return this.request('/payments', { method: 'POST', body: JSON.stringify(paymentData) });
  }

  async updatePaymentStatusForPayment(id: string, status: string) {
    return this.request(`/payments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  }

  // ── Expenses ───────────────────────────────────────────────
  async getExpenses(filters: Record<string, string> = {}) {
    const queryParams = new URLSearchParams(filters);
    const qs = queryParams.toString() ? `?${queryParams}` : '';
    return this.request(`/expenses${qs}`);
  }

  async getExpenseById(id: string) {
    return this.request(`/expenses/${id}`);
  }

  async createExpense(expenseData: any) {
    return this.request('/expenses', { method: 'POST', body: JSON.stringify(expenseData) });
  }

  async updateExpense(id: string, expenseData: any) {
    return this.request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(expenseData) });
  }

  async deleteExpense(id: string) {
    return this.request(`/expenses/${id}`, { method: 'DELETE' });
  }

  // ── Promotions ─────────────────────────────────────────────
  async getPromotions(filters: Record<string, string> = {}) {
    const queryParams = new URLSearchParams(filters);
    const qs = queryParams.toString() ? `?${queryParams}` : '';
    return this.request(`/promotions${qs}`);
  }

  async getPromotionById(id: string) {
    return this.request(`/promotions/${id}`);
  }

  async getPromotionByCode(code: string) {
    return this.request(`/promotions/code/${code}`);
  }

  async createPromotion(promoData: any) {
    return this.request('/promotions', { method: 'POST', body: JSON.stringify(promoData) });
  }

  async updatePromotion(id: string, promoData: any) {
    return this.request(`/promotions/${id}`, { method: 'PUT', body: JSON.stringify(promoData) });
  }

  async deletePromotion(id: string) {
    return this.request(`/promotions/${id}`, { method: 'DELETE' });
  }

  async togglePromotion(id: string) {
    return this.request(`/promotions/${id}/toggle`, { method: 'PUT' });
  }

  // ── Inventory ──────────────────────────────────────────────
  async getInventory() {
    return this.request('/inventory');
  }

  async getInventoryByProduct(productId: string) {
    return this.request(`/inventory/${productId}`);
  }

  async restockProduct(productId: string, quantity: number) {
    return this.request(`/inventory/${productId}/restock`, { method: 'POST', body: JSON.stringify({ quantity }) });
  }

  async getLowStockItems() {
    return this.request('/inventory/stats/low-stock');
  }

  async getInventorySummary() {
    return this.request('/inventory/stats/summary');
  }

  // ── Health ─────────────────────────────────────────────────
  async healthCheck() {
    return this.request('/health');
  }
}

const apiClient = new APIClient();
export default apiClient;
