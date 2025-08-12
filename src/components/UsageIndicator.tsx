'use client';

import { useState, useEffect } from 'react';
import { getUsageStats } from '@/utils/usageTracker';

interface UsageStats {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export default function UsageIndicator() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

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
    const handleFocus = () => loadStats();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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
      padding: 'var(--spacing-sm)',
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
          📁 Daily usage: <strong>{stats.used}/{stats.limit}</strong> files renamed
          {isNearLimit && (
            <span style={{ marginLeft: 'var(--spacing-xs)' }}>
              ({stats.remaining} remaining)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
