'use client';

import Link from 'next/link';
import PricingPlans from '@/components/PricingPlans';
import Button from '@/components/Button';

export default function PricingPage() {
  const handlePurchaseMonthly = () => {
    try {
      // Create checkout URL for monthly plan
      const checkoutUrl = `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || 'https://filefixer.lemonsqueezy.com/checkout/buy'}/${process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_PRODUCT_ID || 'placeholder-monthly-id'}`;
      
      // Open checkout in new window
      window.open(checkoutUrl, '_blank', 'width=800,height=900');
    } catch (error) {
      console.error('Error creating checkout URL:', error);
      alert('Unable to process checkout. Please try again.');
    }
  };
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: 'var(--spacing-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '900px',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border)'
      }}>
        {/* Header */}
        <h1 style={{ 
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text)',
          fontSize: '3rem',
          fontWeight: '700'
        }}>
          <span>FileFixer</span> <span>Pricing</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          margin: '0 auto var(--spacing-xl) auto',
          lineHeight: 1.6
        }}>
          Choose the perfect plan for your file renaming needs. Upgrade to Pro for unlimited file processing and advanced features.
        </p>

        {/* Featured Pro Monthly */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, var(--color-palatinate-blue), var(--color-turquoise))',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--border-radius)',
          border: '2px solid gray',
          marginBottom: 'var(--spacing-xl)',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 0 0 2px var(--color-chartreuse)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '4px 12px',
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: 'var(--spacing-sm)'
          }}>
            🔥 MOST POPULAR
          </div>
          
          <h2 style={{ 
            marginBottom: 'var(--spacing-sm)', 
            fontSize: '2.2rem',
            fontWeight: '600'
          }}>
            🔐 Pro Tier
            <br />
            £4/month
          </h2>
          
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-sm)',
            fontSize: '1.1rem',
            opacity: 0.95,
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto var(--spacing-lg) auto'
          }}>
            <div>✓ Unlimited file renaming and downloads</div>
            <div>✓ Additional formatting controls</div>
            <div>✓ No ads</div>
            <div>✓ Technical support</div>
          </div>
          
          <Button
            onClick={handlePurchaseMonthly}
            variant="gradient"
            size="large"
          >
            ⚡ Subscribe Monthly
          </Button>
        </div>

        {/* Pricing Plans */}
        <PricingPlans style={{ marginBottom: 'var(--spacing-lg)' }} />

        {/* Trust Indicators */}
        <div style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          marginBottom: 'var(--spacing-lg)',
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap'
        }}>
          <span>🔒 Secure Payment</span>
          <span>⚡ Instant Access</span>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap'
        }}>
          <Link 
            href="/"
            style={{
              color: 'var(--color-turquoise)',
              textDecoration: 'none',
              fontSize: '14px',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-turquoise)',
              transition: 'all 0.2s ease'
            }}
          >
            ← Back to FileFixer
          </Link>
          <Link 
            href="/signin"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '14px',
              padding: 'var(--spacing-xs) var(--spacing-sm)'
            }}
          >
            Already have an account? Sign in →
          </Link>
        </div>
      </div>
    </div>
  );
}
