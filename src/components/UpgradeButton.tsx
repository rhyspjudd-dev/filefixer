'use client';

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
    <button 
      style={{
        background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
        color: 'var(--color-night)',
        border: 'none',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-md) var(--spacing-xl)',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: 'var(--spacing-md)',
        transition: 'transform 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onClick={() => {
        alert('Payment integration would go here! For now, this is just a demo.');
      }}
    >
      🚀 Upgrade to Pro
    </button>
  );
}
