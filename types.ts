
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  mockupImage?: string; 
  imageFit?: 'cover' | 'contain';
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  features?: string[];
  options?: ProductOption[];
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
  password?: string;
}

export interface Order {
  id: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

export interface ShopSettings {
  whatsapp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  email: string;
  location: string;
  adminPassword?: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
