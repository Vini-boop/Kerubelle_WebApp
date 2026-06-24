export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_TRACKING: '/order/:orderId',
  DASHBOARD: '/dashboard',
  WISHLIST: '/wishlist',
  NEW_ARRIVALS: '/new',
  LIMITED_EDITION: '/limited',
} as const;

export const COLORS = {
  PRIMARY_PINK: '#F8C8DC',
  SECONDARY_PINK: '#D4A5B8',
  BACKGROUND_PINK: '#FFF5F9',
} as const;

export const PRODUCT_TYPES = [
  'Tote',
  'Clutch',
  'Shoulder',
  'Crossbody',
  'Backpack',
  'Mini',
] as const;

export const MATERIAL_TYPES = [
  'Leather',
  'Faux Leather',
  'Fabric',
  'Beaded',
  'Luxury',
] as const;

export const SIZE_TYPES = [
  'Mini',
  'Medium',
  'Large',
] as const;
