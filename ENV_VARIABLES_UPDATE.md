# ✅ Lemon Squeezy URLs Updated to Use Environment Variables

## Changes Made

### 1. Updated Pricing Page (`/src/app/pricing/page.tsx`)
- **Monthly URL** now uses `NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL` environment variable
- Falls back to current hardcoded URL if env var not set

### 2. Updated Lemon Squeezy Config (`/src/lib/lemonsqueezy.ts`)
- **Yearly URL** now uses `NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_URL` environment variable  
- **Lifetime URL** now uses `NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_URL` environment variable
- Both have fallback URLs

### 3. Updated Environment Variables (`.env.example`)
Added new public environment variables:
```env
NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL=https://filefixer.lemonsqueezy.com/buy/e5bbd23a-925e-44b3-a902-12e7bb725800
NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_URL=https://filefixer.lemonsqueezy.com/buy/125fa2e8-bd39-442b-9981-21032a6cd0ff
NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_URL=https://filefixer.lemonsqueezy.com/buy/your-lifetime-url
```

## Current URLs

### ✅ Monthly (Working)
- **URL**: `https://filefixer.lemonsqueezy.com/buy/e5bbd23a-925e-44b3-a902-12e7bb725800`
- **ENV VAR**: `NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL`

### ✅ Yearly (Updated)  
- **URL**: `https://filefixer.lemonsqueezy.com/buy/125fa2e8-bd39-442b-9981-21032a6cd0ff`
- **ENV VAR**: `NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_URL`

### ⏳ Lifetime (Waiting for URL)
- **URL**: *Placeholder - waiting for your lifetime URL*
- **ENV VAR**: `NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_URL`

## Benefits of This Approach

1. **Environment Flexibility**: Different URLs for development/staging/production
2. **Easy Updates**: Change URLs without code changes
3. **Security**: Sensitive data in environment variables
4. **Consistency**: All checkout URLs managed the same way
5. **Fallback Safety**: Code still works if env vars aren't set

## Next Steps

1. **Get the lifetime URL** from Lemon Squeezy
2. **Add to your `.env.local`** file:
   ```env
   NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_URL=https://filefixer.lemonsqueezy.com/buy/your-lifetime-checkout-id
   ```
3. **Deploy with environment variables** set on your hosting platform

## Testing

The system will now use environment variables if available, or fall back to the hardcoded URLs. This ensures everything keeps working while being more flexible for different environments.

Ready for the lifetime URL when you have it! 🚀
