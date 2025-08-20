'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUsageStats } from '@/utils/usageTracker';

interface UsageStats {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export default function UsageIndicator() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Don't show usage indicator for Pro users
  const user = session?.user as { isPro?: boolean; role?: string } | undefined;
  const isPro = user?.isPro || user?.role === 'admin';
  
  useEffect(() => {
    if (!isPro) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [isPro]);

  const loadStats = async () => {
    try {
      const usageStats = await getUsageStats();
      setStats(usageStats);
    } catch (error) {
      console.error('Error loading usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh stats when component receives focus (user switches back to tab)
  useEffect(() => {
    if (!isPro) {
      const handleFocus = () => loadStats();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [isPro]);

  // Don't render anything for Pro users
  if (isPro) {
    return null;
  }

  if (loading || !stats) {
    return null;
  }

  const isNearLimit = stats.percentage >= 75;
  const isAtLimit = stats.remaining === 0;

  return (
    <div style={{
      background: isAtLimit 
        ? 'linear-gradient(135deg, var(--color-danger), var(--color-warning))' 
        : isNearLimit 
          ? 'linear-gradient(135deg, var(--color-warning), var(--color-chartreuse))'
          : 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
      borderRadius: 'var(--border-radius)',
      marginBottom: 'var(--spacing-md)',
      color: isAtLimit ? 'var(--color-night)' : 'var(--color-night)',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center'
    }}>
      {isAtLimit ? (
        <div>
          <div style={{ marginBottom: 'var(--spacing-xs)' }}>
            ⚠️ <strong>Free limit reached</strong> — upgrade to Pro for unlimited renames
          </div>
          <a 
            href="/pro" 
            style={{
              color: 'var(--color-night)',
              textDecoration: 'underline',
              fontWeight: '600'
            }}
          >
            Upgrade to Pro →
          </a>
        </div>
      ) : (
        <div>
          {/* 📁 Daily usage: <strong>{stats.used}/{stats.limit}</strong> files renamed
          {isNearLimit && (
            <span style={{ marginLeft: 'var(--spacing-xs)' }}>
              ({stats.remaining} remaining)
            </span>
          )} */}
        </div>
      )}
    </div>
  );
}
