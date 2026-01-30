// Format currency for Ghanaian Cedis
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Generate random order ID
export const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Ghanaian format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[235]\d{8}$/; // Ghana: starts with 2, 3, or 5 + 8 digits
  const cleaned = phone.replace(/\D/g, "");
  return phoneRegex.test(cleaned) || phoneRegex.test(cleaned.slice(-9));
};

// Format date
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) {
    return "N/A";
  }
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return "N/A";
  }
  return new Intl.DateTimeFormat("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
};

// Get estimated delivery date (3-5 days from now)
export const getEstimatedDelivery = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 4); // 4 days for Ghana delivery
  return date.toISOString().split("T")[0];
};

// Truncate text
export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
