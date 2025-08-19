'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';

export function useProStatus() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const refreshProStatus = useCallback(async () => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/check-pro?email=${encodeURIComponent(session.user.email)}`);
      const data = await response.json();
      
      const currentUser = session.user as { isPro?: boolean };
      if (data.isPro !== currentUser.isPro) {
        // Update the session with new pro status
        await update({
          ...session,
          user: {
            ...session.user,
            isPro: data.isPro,
            plan: data.isPro ? 'pro' : 'free'
          }
        });
      }
    } catch (error) {
      console.error('Error refreshing pro status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session, update]);

  // Check pro status when component mounts or session changes
  useEffect(() => {
    const user = session?.user as { email?: string; role?: string } | undefined;
    if (user?.email && user.role !== 'admin') {
      refreshProStatus();
    }
  }, [session?.user?.email, session?.user, refreshProStatus]);

  return {
    isPro: (session?.user as { isPro?: boolean; role?: string })?.isPro || (session?.user as { role?: string })?.role === 'admin',
    isAdmin: (session?.user as { role?: string })?.role === 'admin',
    refreshProStatus,
    isLoading
  };
}
