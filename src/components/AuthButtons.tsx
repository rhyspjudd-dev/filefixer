'use client';

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Button from '@/components/Button'

export default function AuthButtons() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div style={{
        padding: 'var(--spacing-xs)',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}>
        ...
      </div>
    )
  }

  if (session?.user) {
    const user = session.user
    const isAdmin = (user as { role?: string }).role === 'admin'

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          padding: 'var(--spacing-xs)',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border)'
        }}>
          {user.image && (
            <img
              src={user.image}
              alt={user.name || 'User'}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%'
              }}
            />
          )}
          <span style={{
            color: 'var(--text)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {user.name || user.email}
          </span>
          {isAdmin && (
            <span style={{
              background: 'linear-gradient(135deg, var(--color-warning), var(--color-chartreuse))',
              color: 'var(--color-night)',
              fontSize: '11px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Admin
            </span>
          )}
        </div>
        
        <Button 
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="primary"
          size="small"
        >
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)'
    }}>
      <Link href="/pricing">
        <Button variant="secondary" size="small">
          Pricing
        </Button>
      </Link>
      <Link href="/signin">
        <Button variant="primary" size="small">
          Sign in
        </Button>
      </Link>
    </div>
  )
}
