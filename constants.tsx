
import { Product, ShopSettings } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pro Headphones 700',
    description: 'High-fidelity noise-canceling wireless headphones with up to 40 hours of battery life.',
    price: 38500,
    discountPrice: 32000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 1250,
    isFeatured: true,
    features: ['Active Noise Cancellation', '40-hour Battery', 'Bluetooth 5.2', 'Built-in Mic'],
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'Alice Smith', rating: 5, comment: 'Best headphones I have ever owned! The noise cancellation is magical.', date: '2023-10-15' },
      { id: 'r2', userId: 'u2', userName: 'Bob Jones', rating: 4, comment: 'Great sound quality, though the ear cups get a bit warm after 3 hours.', date: '2023-11-02' }
    ]
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    description: 'Track your health, receive notifications, and stay connected with the most advanced wearable.',
    price: 45000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 890,
    features: ['Heart Rate Monitor', 'Sleep Tracking', 'Water Resistant', 'Always-on Display'],
    reviews: [
      { id: 'r3', userId: 'u3', userName: 'Charlie Brown', rating: 5, comment: 'The health tracking is spot on. Worth every penny.', date: '2023-12-01' }
    ]
  },
  {
    id: '3',
    name: 'Minimalist Leather Wallet',
    description: 'Handcrafted premium leather wallet designed for simplicity and durability.',
    price: 3200,
    discountPrice: 2800,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 430,
    features: ['Genuine Leather', 'RFID Blocking', 'Holds 10 Cards', 'Ultra-slim Design'],
    reviews: []
  },
  {
    id: '4',
    name: 'Artisan Coffee Maker',
    description: 'Brew the perfect cup of coffee with our precision-engineered pour-over station.',
    price: 15500,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1544145945-f904253d0c7e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 620,
    features: ['Precision Drip', 'Heat-resistant Glass', 'Reusable Filter', 'Compact Size'],
    reviews: []
  },
  {
    id: '5',
    name: 'Eco-Friendly Yoga Mat',
    description: 'Non-slip, biodegradable material that provides excellent cushioning for your practice.',
    price: 4800,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1592432676554-21014022986f?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewsCount: 215,
    features: ['Biodegradable', '6mm Cushioning', 'Anti-tear Technology', 'Lightweight'],
    reviews: []
  },
  {
    id: '6',
    name: 'Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with ultra-responsive switches for the ultimate gaming edge.',
    price: 12900,
    discountPrice: 9900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 1540,
    isFeatured: true,
    features: ['Blue Switches', '16.8M RGB Colors', 'Aluminum Frame', 'Full N-Key Rollover'],
    reviews: []
  },
  {
    id: '7',
    name: 'Premium Canvas Backpack',
    description: 'Waterproof canvas backpack with multiple compartments for all your travel needs.',
    price: 6500,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviewsCount: 310,
    features: ['Waterproof', 'Laptop Compartment', 'Breathable Straps', '25L Capacity'],
    reviews: []
  },
  {
    id: '8',
    name: 'Bluetooth Speaker',
    description: 'Deep bass and crystal clear sound in a compact, waterproof design.',
    price: 9500,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608156639585-b3a034ef915a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 780,
    features: ['20W Output', 'IPX7 Waterproof', '15-hour Playtime', 'Stereo Pairing'],
    reviews: []
  }
];

export const INITIAL_CATEGORIES = ['All', 'Electronics', 'Accessories', 'Home & Kitchen', 'Fitness', 'Fashion', 'Beauty', 'Stationery'];

export const INITIAL_SETTINGS: ShopSettings = {
  whatsapp: '88012345678',
  telegram: 'akshop',
  instagram: 'akshop_elite',
  facebook: 'akshop.official',
  email: 'support@akshop.com',
  location: 'Dhaka, Bangladesh'
};
