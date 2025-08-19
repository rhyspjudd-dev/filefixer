'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function UpgradePromoBanner() {
  const { data: session } = useSession();

  // Don't show to Pro users or admins
  const user = session?.user as { isPro?: boolean; role?: string } | undefined;
  if (user?.isPro || user?.role === 'admin') {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-palatinate-blue), var(--color-turquoise))',
      borderRadius: 'var(--border-radius)',
      padding: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-lg)',
      color: 'white',
      textAlign: 'center'
    }}>
      <h3 style={{ 
        marginBottom: 'var(--spacing-sm)',
        fontSize: '1.3rem',
        fontWeight: '600'
      }}>
        Need more than 10 files per day?
      </h3>
      <p style={{ 
        marginBottom: 'var(--spacing-md)',
        fontSize: '16px',
        opacity: 0.9,
        lineHeight: 1.4
      }}>
        Upgrade to Pro for unlimited file processing, advanced features, and priority support.
        Starting at just £4/month.
      </p>
      <Link href="/pro">
        <Button
          variant="gradient"
          size="large"
        >
          🚀 See Pro Plans
        </Button>
      </Link>
    </div>
  );
}
