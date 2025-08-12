'use client';

import Link from 'next/link';

export default function ProPage() {
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
        maxWidth: '600px',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border)'
      }}>
        <h1 style={{
          marginBottom: 'var(--spacing-lg)',
          background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          FileFixer Pro
        </h1>
        
        <div style={{
          background: 'linear-gradient(135deg, var(--color-palatinate-blue), var(--color-turquoise))',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-lg)',
          color: 'white'
        }}>
          <h2 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '2rem' }}>
            Unlimited File Renames
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Process as many files as you need, whenever you need
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--background)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ 
              color: 'var(--color-secondary)', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.1rem'
            }}>
              Free Tier
            </h3>
            <ul style={{ 
              textAlign: 'left', 
              color: 'var(--text-muted)',
              fontSize: '14px',
              lineHeight: 1.6
            }}>
              <li>8 files per day</li>
              <li>Basic file cleaning</li>
              <li>ZIP download</li>
            </ul>
          </div>

          <div style={{
            padding: 'var(--spacing-md)',
            background: 'linear-gradient(135deg, var(--color-chartreuse), var(--color-warning))',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-night)'
          }}>
            <h3 style={{ 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Pro Tier
            </h3>
            <ul style={{ 
              textAlign: 'left',
              fontSize: '14px',
              lineHeight: 1.6,
              fontWeight: '500'
            }}>
              <li>✅ Unlimited files</li>
              <li>✅ Advanced renaming options</li>
              <li>✅ Priority support</li>
              <li>✅ Batch processing</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: 'var(--spacing-xs)',
            background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            $9.99
          </div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '16px'
          }}>
            one-time payment • lifetime access
          </div>
        </div>

        <button style={{
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

        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          30-day money-back guarantee • Secure payment • No subscription
        </div>

        <Link 
          href="/"
          style={{
            color: 'var(--color-turquoise)',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to FileFixer
        </Link>
      </div>
    </div>
  );
}
