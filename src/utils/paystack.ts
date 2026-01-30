/**
 * Paystack Integration Utility
 * Ghana Payment Gateway Integration
 */

interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number; // in GHS (whole number for Paystack)
  currency?: string;
  metadata?: Record<string, any>;
  firstName?: string;
  lastName?: string;
  phone?: string;
  reference?: string;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    authorization_url: string;
    access_code: string;
    [key: string]: any;
  };
}

/**
 * Initialize Paystack payment
 * @param config Payment configuration
 * @returns Payment response
 */
export const initializePayment = async (
  config: PaystackConfig
): Promise<PaystackResponse> => {
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.publicKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: config.email,
        amount: Math.round(config.amount * 100), // Convert to kobo (GHS x 100)
        currency: config.currency || "GHS",
        metadata: {
          firstName: config.firstName,
          lastName: config.lastName,
          phone: config.phone,
          ...config.metadata,
        },
        reference: config.reference,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw error;
  }
};

/**
 * Verify payment transaction
 * @param reference Transaction reference
 * @param secretKey Paystack secret key
 * @returns Verification response
 */
export const verifyPayment = async (
  reference: string,
  secretKey: string
): Promise<PaystackResponse> => {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw error;
  }
};

/**
 * Format amount for Paystack (GHS to kobo)
 */
export const formatAmountForPaystack = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Format amount from Paystack (kobo to GHS)
 */
export const formatAmountFromPaystack = (amount: number): number => {
  return amount / 100;
};

/**
 * Paystack payment methods available in Ghana
 */
export const PAYSTACK_METHODS = [
  {
    id: "card",
    name: "Card Payment",
    icon: "💳",
    description: "Visa, Mastercard, Verve",
  },
  {
    id: "mobile",
    name: "Mobile Money",
    icon: "📱",
    description: "MTN Mobile Money, Vodafone Cash, Airtel Money",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: "🏦",
    description: "Direct bank transfer",
  },
];

/**
 * Paystack environment configuration
 */
export const getPaystackConfig = () => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!publicKey) {
    console.warn(
      "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set in environment variables"
    );
  }

  return {
    publicKey,
    secretKey,
    environment: process.env.NODE_ENV || "development",
  };
};

/**
 * Load Paystack script dynamically
 */
export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Paystack script"));
    document.body.appendChild(script);
  });
};

/**
 * Open Paystack payment modal
 */
export const openPaystackModal = async (config: PaystackConfig) => {
  try {
    await loadPaystackScript();
    const paystack = (window as any).PaystackPop;

    if (!paystack) {
      throw new Error("Paystack script not loaded");
    }

    paystack.newTransaction({
      key: config.publicKey,
      email: config.email,
      amount: formatAmountForPaystack(config.amount),
      currency: "GHS",
      firstName: config.firstName,
      lastName: config.lastName,
      phone: config.phone,
      ref: config.reference,
      metadata: config.metadata,
      onClose: () => {
        console.log("Payment window closed");
      },
      callback: (response: any) => {
        console.log("Payment successful:", response);
      },
    });
  } catch (error) {
    console.error("Error opening Paystack modal:", error);
    throw error;
  }
};
