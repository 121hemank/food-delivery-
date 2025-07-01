
// Payment service utility functions
export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customer_email?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  sessionId?: string;
  error?: string;
  checkoutUrl?: string;
}

// Initialize Stripe payment session
export const createPaymentSession = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  try {
    const response = await fetch('/api/payment/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...paymentData,
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment session');
    }

    const data = await response.json();
    return {
      success: true,
      sessionId: data.sessionId,
      checkoutUrl: data.url,
    };
  } catch (error) {
    console.error('Payment session creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Verify payment status
export const verifyPayment = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/payment/verify/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    return data.paid === true;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
};

// Mock Stripe integration for development (fallback)
export const mockStripePayment = async (amount: number): Promise<PaymentResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock successful payment
  return {
    success: true,
    sessionId: `cs_mock_${Date.now()}`,
    checkoutUrl: 'https://checkout.stripe.com/mock-session',
  };
};
