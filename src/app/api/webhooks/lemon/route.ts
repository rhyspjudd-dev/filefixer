import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { addProUserWithDetails, removeProUser } from '@/lib/proStorage';

// Types for Lemon Squeezy webhook payloads
interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      user_email?: string;
      product_id?: string;
      variant_id?: string;
      order_number?: string;
      status?: string;
      status_formatted?: string;
      total?: number;
      subtotal?: number;
      tax?: number;
      created_at?: string;
      updated_at?: string;
      [key: string]: unknown;
    };
  };
}

// Map of product IDs to plan names
const PRODUCT_PLAN_MAP: Record<string, string> = {
  [process.env.LEMONSQUEEZY_MONTHLY_PRODUCT_ID || '']: 'monthly',
  [process.env.LEMONSQUEEZY_YEARLY_PRODUCT_ID || '']: 'yearly',
  [process.env.LEMONSQUEEZY_LIFETIME_PRODUCT_ID || '']: 'lifetime',
};

// Verify webhook signature
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');
    
    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Get user JWT token and update it with Pro status
async function updateUserProStatus(
  userEmail: string, 
  planType: string, 
  orderId?: string, 
  subscriptionId?: string
): Promise<void> {
  try {
    console.log(`Updating user ${userEmail} to Pro (${planType}) - Order: ${orderId || 'N/A'} - Subscription: ${subscriptionId || 'N/A'}`);
    
    // Add user to pro storage with enhanced details
    await addProUserWithDetails(
      userEmail, 
      planType as 'monthly' | 'yearly' | 'lifetime',
      orderId,
      subscriptionId
    );
    
    console.log(`Successfully updated ${userEmail} to Pro status`);
  } catch (error) {
    console.error('Error updating user pro status:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as string for signature verification
    const body = await request.text();
    
    // Get the webhook signature from headers
    const signature = request.headers.get('x-signature');
    
    if (!signature) {
      console.error('No signature found in webhook headers');
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Verify the webhook signature
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the webhook payload
    const payload: LemonSqueezyWebhookPayload = JSON.parse(body);
    
    console.log('Received Lemon Squeezy webhook:', {
      event: payload.meta.event_name,
      orderId: payload.data.id,
      productId: payload.data.attributes.product_id
    });

    // Handle different webhook events
    switch (payload.meta.event_name) {
      case 'order_created':
        await handleOrderCreated(payload);
        break;
        
      case 'subscription_created':
        await handleSubscriptionCreated(payload);
        break;
        
      case 'subscription_updated':
        await handleSubscriptionUpdated(payload);
        break;
        
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(payload);
        break;
        
      default:
        console.log(`Unhandled webhook event: ${payload.meta.event_name}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleOrderCreated(payload: LemonSqueezyWebhookPayload) {
  const { data } = payload;
  const productId = data.attributes.product_id;
  const userEmail = data.attributes.user_email;
  const status = data.attributes.status;
  const orderId = data.id;

  if (!userEmail || !productId) {
    console.error('Missing user email or product ID in order created webhook');
    return;
  }

  // Only process paid orders
  if (status !== 'paid') {
    console.log(`Order ${orderId} not paid yet, status: ${status}`);
    return;
  }

  // Get the plan type from product ID
  const planType = PRODUCT_PLAN_MAP[productId];
  if (!planType) {
    console.error(`Unknown product ID: ${productId}`);
    return;
  }

  console.log(`Processing order for ${userEmail}: ${planType} plan (Order ID: ${orderId})`);
  
  // Update user to Pro status with order tracking
  await updateUserProStatus(userEmail, planType, orderId);
}

async function handleSubscriptionCreated(payload: LemonSqueezyWebhookPayload) {
  const { data } = payload;
  const productId = data.attributes.product_id;
  const userEmail = data.attributes.user_email;
  const status = data.attributes.status;
  const subscriptionId = data.id;

  if (!userEmail || !productId) {
    console.error('Missing user email or product ID in subscription created webhook');
    return;
  }

  // Only process active subscriptions
  if (status !== 'active') {
    console.log(`Subscription ${subscriptionId} not active yet, status: ${status}`);
    return;
  }

  const planType = PRODUCT_PLAN_MAP[productId];
  if (!planType) {
    console.error(`Unknown product ID: ${productId}`);
    return;
  }

  console.log(`Processing subscription for ${userEmail}: ${planType} plan (Subscription ID: ${subscriptionId})`);
  
  // Update user to Pro status with subscription tracking
  await updateUserProStatus(userEmail, planType, undefined, subscriptionId);
}

async function handleSubscriptionUpdated(payload: LemonSqueezyWebhookPayload) {
  const { data } = payload;
  const userEmail = data.attributes.user_email;
  const status = data.attributes.status;

  if (!userEmail) {
    console.error('Missing user email in subscription updated webhook');
    return;
  }

  console.log(`Subscription updated for ${userEmail}: status ${status}`);

  // If subscription is cancelled or expired, remove Pro status
  if (status === 'cancelled' || status === 'expired') {
    console.log(`Removing Pro status for ${userEmail}`);
    await removeProUser(userEmail);
  }
}

async function handleSubscriptionCancelled(payload: LemonSqueezyWebhookPayload) {
  const { data } = payload;
  const userEmail = data.attributes.user_email;

  if (!userEmail) {
    console.error('Missing user email in subscription cancelled webhook');
    return;
  }

  console.log(`Subscription cancelled for ${userEmail}`);
  
  // Remove Pro status immediately on cancellation
  // Note: For better UX, you might want to keep Pro active until end of billing period
  await removeProUser(userEmail);
}
