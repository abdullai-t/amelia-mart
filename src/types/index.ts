// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  unit: string; // kg, pieces, liters, etc.
  rating?: number;
  reviews?: number;
}

// Cart types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

// Order types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "processing" | "delivered";
  createdAt: string;
  estimatedDelivery?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
}
