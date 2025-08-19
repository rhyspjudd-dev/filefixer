import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PaymentSuccessPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/signin');
  }

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
        maxWidth: '500px',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: 'var(--spacing-md)'
        }}>
          🎉
        </div>

        <h1 style={{
          marginBottom: 'var(--spacing-md)',
          background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Welcome to Pro!
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: 'var(--text)',
          marginBottom: 'var(--spacing-md)',
          lineHeight: 1.5
        }}>
          Thank you for upgrading to FileFixer Pro! Your account will be activated shortly.
        </p>

        <div style={{
          background: 'linear-gradient(135deg, var(--color-palatinate-blue), var(--color-turquoise))',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-lg)',
          color: 'white'
        }}>
          <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.2rem' }}>
            You now have access to:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            textAlign: 'left'
          }}>
            <li style={{ marginBottom: 'var(--spacing-xs)' }}>✨ Unlimited file processing</li>
            <li style={{ marginBottom: 'var(--spacing-xs)' }}>🚀 Advanced renaming options</li>
            <li style={{ marginBottom: 'var(--spacing-xs)' }}>📞 Priority support</li>
            <li>🔄 Future updates included</li>
          </ul>
        </div>

        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          justifyContent: 'center'
        }}>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
              color: 'var(--color-night)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderRadius: 'var(--border-radius)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            🚀 Start Using Pro
          </Link>
          
          <Link 
            href="/pro"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: 'var(--color-turquoise)',
              border: '1px solid var(--color-turquoise)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderRadius: 'var(--border-radius)',
              textDecoration: 'none',
              fontSize: '16px'
            }}
          >
            View Account
          </Link>
        </div>

        <p style={{
          marginTop: 'var(--spacing-lg)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: 1.4
        }}>
          It may take a few minutes for your Pro access to activate. 
          If you don&apos;t see changes after 5 minutes, please contact support.
        </p>
      </div>
    </div>
  );
}
