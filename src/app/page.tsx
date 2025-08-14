'use client';

import { useState } from 'react';
import { type CasingStyle } from '@/utils/cleanFileName';
import FileUploader from '@/components/FileUploader';
import FileListPreview from '@/components/FileListPreview';
import DownloadButton from '@/components/DownloadButton';
import UsageIndicator from '@/components/UsageIndicator';
import AuthButtons from '@/components/AuthButtons';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [casingStyle, setCasingStyle] = useState<CasingStyle>('lowercase');
  const [usageRefreshTrigger, setUsageRefreshTrigger] = useState(0);

  const handleUsageUpdate = () => {
    // Trigger refresh of usage indicator
    setUsageRefreshTrigger(prev => prev + 1);
  };

  return (
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
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-sm) 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <AuthButtons />
        </div>

        <header style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--spacing-xl)' 
        }}>
          <h1 style={{ 
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--text)'
          }}>
            <span>File</span><span>Fixer</span>
          </h1>
          <p style={{ 
            fontSize: '18px'
          }}>
            Drop your files, we’ll remove spaces, clean names, and zip them up.
          </p>
        </header>

        <UsageIndicator key={usageRefreshTrigger} />

        <main>
          <FileUploader 
            files={files} 
            setFiles={setFiles} 
            maxFiles={10} 
          />
          
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
  );
}
