'use client';

import Button from '@/components/Button';

interface UpgradeButtonProps {
  isAdmin: boolean;
}

export default function UpgradeButton({ isAdmin }: UpgradeButtonProps) {
  if (isAdmin) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, var(--color-warning), var(--color-chartreuse))',
        color: 'var(--color-night)',
        border: 'none',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-md) var(--spacing-xl)',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: 'var(--spacing-md)',
        textAlign: 'center'
      }}>
        🔑 Admin Account - Pro Access Active
      </div>
    );
  }

  return (
    <Button 
      onClick={() => {
        alert('Payment integration would go here! For now, this is just a demo.');
      }}
      variant="gradient"
      size="xlarge"
    >
      🚀 Upgrade to Pro
    </Button>
  );
}
