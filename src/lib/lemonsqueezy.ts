import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// Setup Lemon Squeezy with API key
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => {
    console.error('Lemon Squeezy API Error:', error);
  },
});

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  checkoutUrl: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: '£29',
    period: '/year',
    description: 'Best value - save £19',
    features: [
      'Unlimited file renaming and downloads',
      'Additional formatting controls',
      'No ads',
      'Technical support'
    ],
    checkoutUrl: `${process.env.LEMONSQUEEZY_CHECKOUT_URL || 'https://filefixer.lemonsqueezy.com/checkout/buy'}/${process.env.LEMONSQUEEZY_YEARLY_PRODUCT_ID || 'placeholder-yearly-id'}`
  },
  {
    id: 'lifetime',
    name: 'Pro Lifetime',
    price: '£59.99',
    period: 'one-time',
    description: 'Pay once, use forever',
    features: [
      'Unlimited file renaming and downloads',
      'Additional formatting controls',
      'No ads',
      'Technical support'
    ],
    checkoutUrl: `${process.env.LEMONSQUEEZY_CHECKOUT_URL || 'https://filefixer.lemonsqueezy.com/checkout/buy'}/${process.env.LEMONSQUEEZY_LIFETIME_PRODUCT_ID || 'placeholder-lifetime-id'}`
  }
];

export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.id === planId);
}

// Helper to generate checkout URLs with user data
export function createCheckoutUrl(planId: string, userId?: string, userEmail?: string): string {
  const plan = getPlanById(planId);
  if (!plan) {
    throw new Error(`Plan with ID ${planId} not found`);
  }

  let url = plan.checkoutUrl;
  
  // Add checkout data if user info is provided
  const checkoutData: Record<string, string> = {};
  
  if (userId) {
    checkoutData['checkout[custom][user_id]'] = userId;
  }
  
  if (userEmail) {
    checkoutData['checkout[email]'] = userEmail;
  }

  if (Object.keys(checkoutData).length > 0) {
    const params = new URLSearchParams(checkoutData);
    url += `?${params.toString()}`;
  }

  return url;
}
