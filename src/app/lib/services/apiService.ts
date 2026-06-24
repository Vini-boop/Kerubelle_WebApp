import apiClient from './apiClient';

// Simplified API service that wraps the API client with error handling
export const apiService = {
  // Products
  async getProducts() {
    try {
      return await apiClient.getProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: string) {
    try {
      return await apiClient.getProductById(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async createProduct(productData: any) {
    try {
      return await apiClient.createProduct(productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: any) {
    try {
      return await apiClient.updateProduct(id, productData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      return await apiClient.deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Orders
  async getOrders() {
    try {
      return await apiClient.getOrders();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async createOrder(orderData: any) {
    try {
      return await apiClient.createOrder(orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: string) {
    try {
      return await apiClient.updateOrderStatus(id, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Customers
  async getCustomers() {
    try {
      return await apiClient.getCustomers();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getCustomerByEmail(email: string) {
    try {
      return await apiClient.getCustomerByEmail(email);
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  async createCustomer(customerData: any) {
    try {
      return await apiClient.createCustomer(customerData);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Payments
  async getPayments() {
    try {
      return await apiClient.getPayments();
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  async createPayment(paymentData: any) {
    try {
      return await apiClient.createPayment(paymentData);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Expenses
  async getExpenses() {
    try {
      return await apiClient.getExpenses();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  async createExpense(expenseData: any) {
    try {
      return await apiClient.createExpense(expenseData);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  async deleteExpense(id: string) {
    try {
      return await apiClient.deleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  // Promotions
  async getPromotions() {
    try {
      return await apiClient.getPromotions();
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  },

  async createPromotion(promoData: any) {
    try {
      return await apiClient.createPromotion(promoData);
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  async updatePromotion(id: string, promoData: any) {
    try {
      return await apiClient.updatePromotion(id, promoData);
    } catch (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }
  },

  async deletePromotion(id: string) {
    try {
      return await apiClient.deletePromotion(id);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  },

  async validatePromoCode(code: string) {
    try {
      const promotion = await apiClient.getPromotionByCode(code);
      return {
        valid: true,
        discount: promotion.discountPercent,
        promotion
      };
    } catch (error: any) {
      return {
        valid: false,
        discount: 0,
        error: error.message
      };
    }
  },

  // Inventory
  async getInventory() {
    try {
      return await apiClient.getInventory();
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },

  async getLowStockProducts() {
    try {
      return await apiClient.getLowStockItems();
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  },

  async restockProduct(productId: string, quantity: number) {
    try {
      return await apiClient.restockProduct(productId, quantity);
    } catch (error) {
      console.error('Error restocking product:', error);
      throw error;
    }
  }
};