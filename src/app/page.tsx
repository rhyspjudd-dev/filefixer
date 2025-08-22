'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { type CasingStyle } from '@/utils/cleanFileName';
import FileUploader from '@/components/FileUploader';
import FileListPreview from '@/components/FileListPreview';
import DownloadButton from '@/components/DownloadButton';
import UsageIndicator from '@/components/UsageIndicator';
import AuthButtons from '@/components/AuthButtons';
import ErrorBoundary from '@/components/ErrorBoundary';
import styles from './page.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [casingStyle, setCasingStyle] = useState<CasingStyle>('lowercase');
  const [usageRefreshTrigger, setUsageRefreshTrigger] = useState(0);
  
  // State for hover effects to prevent hydration issues
  const [faqHovered, setFaqHovered] = useState(false);
  const [proHovered, setProHovered] = useState(false);

  // Check if user is Pro (same logic as FileUploader)
  const isPro = useMemo(() => {
    // Only check Pro status when session is fully loaded
    if (status !== 'authenticated' || !session?.user) return false;
    
    const user = session.user as { isPro?: boolean; role?: string } | undefined;
    return user?.isPro || user?.role === 'admin';
  }, [session, status]);

  const handleUsageUpdate = useCallback(() => {
    // Trigger refresh of usage indicator
    setUsageRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <ErrorBoundary>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        padding: 'var(--spacing-md)'
      }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'var(--spacing-lg)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-sm) 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <nav>
            <a 
              href="/faq" 
              className={`${styles.navLink} ${faqHovered ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setFaqHovered(true)}
              onMouseLeave={() => setFaqHovered(false)}
            >
              FAQ
            </a>
          </nav>
          <AuthButtons />
        </div>

        <header style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--spacing-xl)' 
        }}>
          <h2 style={{ 
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--text)'
          }}>
            <span>File</span><span>Fixer</span>
          </h2>
          <h1>Instantly remove spaces from file names.</h1>
        </header>

        {/* <UsageIndicator key={usageRefreshTrigger} /> */}

        <main>
          <FileUploader 
            files={files} 
            setFiles={setFiles} 
            maxFiles={10} 
          />
          
          {/* Mini CTA for Pro upgrade - always render but hide for Pro users with CSS */}
          <div className={`${styles.miniCta} ${status === 'authenticated' && isPro ? styles.hiddenForPro : ''}`}>
            Need more than 10 files per day?{' '}
            <a 
              href="/pro"
              className={`${styles.proLink} ${proHovered ? styles.proLinkHover : ''}`}
              onMouseEnter={() => setProHovered(true)}
              onMouseLeave={() => setProHovered(false)}
            >
              Go Pro
            </a>
          </div>
          
          <FileListPreview 
            files={files} 
            casingStyle={casingStyle}
            setCasingStyle={setCasingStyle}
          />
          
          <DownloadButton 
            files={files} 
            casingStyle={casingStyle}
            onUsageUpdate={handleUsageUpdate}
          />
        </main>


          {/* <UpgradePromoBanner /> */}

        <footer style={{ 
          textAlign: 'center', 
          marginTop: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border)',
          color: 'var(--text-muted)',
          fontSize: '14px'
        }}>
          <p>We never store your files • File processing happens entirely in your browser</p>
        </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}
