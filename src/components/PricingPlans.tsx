'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { pricingPlans, createCheckoutUrl } from '@/lib/lemonsqueezy';
import { getLocalizedPrices } from '@/utils/currency';

interface PricingPlansProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function PricingPlans({ className = '', style }: PricingPlansProps) {
  const { data: session } = useSession();
  const [prices, setPrices] = useState({
    currency: 'GBP',
    monthly: '£4',
    yearly: '£29',
    lifetime: '£59.99'
  });
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  // Load localized prices
  useEffect(() => {
    async function loadPrices() {
      try {
        const localizedPrices = await getLocalizedPrices();
        setPrices(localizedPrices);
      } catch (error) {
        console.error('Failed to load localized prices:', error);
        // Keep default GBP prices
      } finally {
        setIsLoadingPrices(false);
      }
    }
    
    loadPrices();
  }, []);

  const handlePurchase = (planId: string) => {
    try {
      const checkoutUrl = createCheckoutUrl(
        planId,
        session?.user?.id,
        session?.user?.email || undefined
      );
      
      // Open checkout in new window
      window.open(checkoutUrl, '_blank', 'width=800,height=900');
    } catch (error) {
      console.error('Error creating checkout URL:', error);
      alert('Unable to process checkout. Please try again.');
    }
  };

  // Get localized price for each plan
  const getLocalizedPrice = (planId: string) => {
    if (isLoadingPrices) {
      const defaultPrices: { [key: string]: string } = {
        'yearly': '£29',
        'lifetime': '£59.99'
      };
      return defaultPrices[planId] || '£29';
    }
    
    const priceMap: { [key: string]: string } = {
      'yearly': prices.yearly,
      'lifetime': prices.lifetime
    };
    return priceMap[planId] || prices.yearly;
  };

  return (
    <div className={className} style={style}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--spacing-lg)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              position: 'relative',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--border-radius)',
              border: plan.isPopular 
                ? '2px solid var(--color-chartreuse)' 
                : '1px solid var(--border)',
              background: 'var(--surface)'
            }}
          >
            {plan.isPopular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, var(--color-chartreuse), var(--color-warning))',
                color: 'var(--color-night)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                🔥 MOST POPULAR
              </div>
            )}

            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--text)'
              }}>
                {plan.name}
              </h3>
              
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  WebkitBackgroundClip: plan.isPopular ? 'text' : 'unset',
                  WebkitTextFillColor: plan.isPopular ? 'transparent' : 'unset',
                  backgroundClip: plan.isPopular ? 'text' : 'unset',
                  color: plan.isPopular ? 'transparent' : 'var(--text)'
                }}>
                  {getLocalizedPrice(plan.id)}
                </span>
                <span style={{
                  fontSize: '1rem',
                  color: 'var(--text-muted)'
                }}>
                  {plan.period}
                </span>
              </div>

              <p style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                {plan.description}
              </p>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 var(--spacing-lg) 0'
            }}>
              {plan.features.map((feature, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-xs) 0',
                  fontSize: '14px',
                  color: 'var(--text)'
                }}>
                  <span style={{
                    color: 'var(--color-chartreuse)',
                    fontSize: '16px'
                  }}>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handlePurchase(plan.id)}
              variant={plan.isPopular ? 'gradient' : 'primary'}
              size="large"
              style={{
                width: '100%',
                background: plan.isPopular
                  ? 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))'
                  : undefined
              }}
            >
              {plan.id === 'lifetime' ? '🚀 Buy Lifetime Access' : 
               plan.id === 'yearly' ? '📅 Subscribe Yearly' : 
               '⚡ Subscribe Monthly'}
            </Button>

            <div style={{
              textAlign: 'center',
              marginTop: 'var(--spacing-sm)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              lineHeight: 1.4
            }}>
              Secure payment • Cancel anytime
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
