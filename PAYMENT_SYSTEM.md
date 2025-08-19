# FileFixer Pro User Management System

## Overview

FileFixer now has a complete Pro user management system that links Lemon Squeezy purchases to user accounts via email addresses. This system handles both users who purchase before signing up and users who sign up before purchasing.

## How It Works

### 1. Purchase Flow

**When a user makes a purchase:**
1. User clicks a pricing button (Monthly/Yearly/Lifetime)
2. If user is signed in, their email is pre-filled in the Lemon Squeezy checkout
3. User completes payment on Lemon Squeezy
4. Lemon Squeezy sends webhook to `/api/webhooks/lemon`
5. Webhook stores Pro status in `/data/pro-users.json` file with user's email


**When a user signs in via Google/GitHub:**
1. User completes OAuth authentication
2. System checks if their email exists in Pro users database
3. If found, user session is enhanced with Pro status and plan type
4. User immediately has access to Pro features

### 3. Edge Cases Handled

- **Purchase before sign-up**: Pro status is stored by email, applied when user signs in
- **Multiple purchases**: Latest purchase overrides previous plan
- **Expired subscriptions**: Automatically removed from Pro status
- **No OAuth credentials**: System falls back to mock auth for development

## File Structure

### Core Files

- `/src/lib/nextAuthConfig.ts` - NextAuth configuration with Pro status integration
- `/src/lib/auth.ts` - Auth utilities with Pro status checking
- `/src/lib/proStorage.ts` - Pro user database management
- `/src/app/api/webhooks/lemon/route.ts` - Lemon Squeezy webhook handler
- `/src/types/next-auth.d.ts` - TypeScript definitions for enhanced session

### User Interface

- `/src/app/pricing/page.tsx` - Pricing page with session-aware checkouts
- `/src/components/PricingPlans.tsx` - Reusable pricing components
- `/src/middleware.ts` - Route protection for Pro-only pages

## Configuration

### Environment Variables Required

#### For OAuth Authentication (Production)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id  # Optional
GITHUB_CLIENT_SECRET=your_github_client_secret  # Optional
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
```

#### For Lemon Squeezy Integration
```env
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
LEMONSQUEEZY_MONTHLY_PRODUCT_ID=your_monthly_product_id
LEMONSQUEEZY_YEARLY_PRODUCT_ID=your_yearly_product_id
LEMONSQUEEZY_LIFETIME_PRODUCT_ID=your_lifetime_product_id

# Public checkout URLs (accessible in browser)
NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL=https://filefixer.lemonsqueezy.com/buy/your-monthly-checkout-id
NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_URL=https://filefixer.lemonsqueezy.com/buy/your-yearly-checkout-id
NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_URL=https://filefixer.lemonsqueezy.com/buy/your-lifetime-checkout-id
```

#### For Admin Access
```env
OWNER_EMAILS=admin@yourdomain.com,another@yourdomain.com
```

### Activation Steps

1. **Set up OAuth providers** (Google/GitHub) and add credentials to environment
2. **Configure Lemon Squeezy webhook** to point to `/api/webhooks/lemon`
3. **Test with mock auth** using `document.cookie = "mock-auth=true"` in browser console
4. **Deploy and test** the full purchase → sign-in → Pro access flow

## Development vs Production

### Development Mode
- Uses mock authentication when OAuth not configured
- Pro status still works via webhook system
- Can simulate user sessions for testing

### Production Mode
- Full OAuth integration with Google/GitHub
- Real-time Pro status checking on sign-in
- Protected routes redirect non-Pro users to pricing

## Database Schema

### Pro Users Storage (`/data/pro-users.json`)

```json
[
  {
    "email": "user@example.com",
    "plan": "monthly",
    "activatedAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-02-15T10:30:00.000Z",
    "orderId": "123456",
    "subscriptionId": "sub_123456"
  }
]
```

### Session Structure

```typescript
{
  user: {
    id: string,
    name: string,
    email: string,
    image: string,
    role: "admin" | "user",
    plan: "free" | "monthly" | "yearly" | "lifetime",
    isPro: boolean
  }
}
```

## User Experience

### For New Users
1. Visit pricing page
2. Click "Subscribe Monthly" → Checkout opens
3. Complete payment on Lemon Squeezy
4. Later, sign in with Google/GitHub
5. Immediately see Pro features unlocked

### For Existing Users
1. Sign in with Google/GitHub
2. Click "Subscribe Monthly" → Checkout pre-filled with email
3. Complete payment
4. Page refresh shows Pro status active

### For Pro Users
- Pro status badge in UI
- Access to `/pro` routes
- No usage limits
- Enhanced features unlocked

## Security Features

- **Webhook signature verification** for all Lemon Squeezy webhooks
- **JWT session management** with secure Pro status
- **Email-based user matching** prevents unauthorized access
- **Automatic expiry handling** for time-based subscriptions
- **Protected route middleware** for Pro-only content

## Testing

### Test Purchase Flow
1. Use Lemon Squeezy test mode
2. Complete test purchase
3. Check `/data/pro-users.json` for new entry
4. Sign in and verify Pro status

### Test Auth Flow
1. Set mock auth: `document.cookie = "mock-auth=true"`
2. Refresh page to see signed-in state
3. Verify Pro features if test user in Pro database

This system is ready for production use and will seamlessly handle the user identification challenge you mentioned.
