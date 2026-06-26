export const BRAND = {
  name: 'Peppery House',
  tagline: 'Brewed with love, served with warmth',
  colors: {
    caramel: '#C87740',
    raisin: '#2E1F26',
    cream: '#F5ECD8',
    espresso: '#8B5A3A',
    dusk: '#4A3040',
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'DM Sans',
    accent: 'Cormorant Garamond',
  },
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_STEPS = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
];

export const GST_RATE = 0.05;
export const DELIVERY_CHARGE = 30;
export const FREE_DELIVERY_ABOVE = 299;
