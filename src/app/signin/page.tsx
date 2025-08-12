'use client';

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from "next/link";

function SignInContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/pro';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--text)' }}>Loading...</div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--text)' }}>Redirecting...</div>
      </div>
    );
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
        maxWidth: '400px',
        width: '100%',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <h1 style={{
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--text)',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Sign in to FileFixer
        </h1>
        
        <p style={{
          marginBottom: 'var(--spacing-xl)',
          color: 'var(--text-muted)',
          fontSize: '16px',
          lineHeight: 1.5
        }}>
          Sign in to access Pro features and unlimited file renames
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)'
        }}>
          <button
            onClick={() => signIn("google", { callbackUrl })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md)',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: '0.2s',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3367d6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4285f4';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md)',
              backgroundColor: '#24292e',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: '0.2s',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1e22';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#24292e';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div style={{
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border)'
        }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginBottom: 'var(--spacing-sm)'
          }}>
            Don&apos;t need Pro features?
          </p>
          <Link
            href="/"
            style={{
              color: 'var(--color-turquoise)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Continue using FileFixer for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--text)' }}>Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
