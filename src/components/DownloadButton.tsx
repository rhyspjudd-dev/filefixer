'use client';

import { useState } from 'react';
import { cleanFileName } from '@/utils/cleanFileName';

type CasingStyle = 'kebab' | 'camel' | 'pascal';

interface DownloadButtonProps {
  files: File[];
  casingStyle: CasingStyle;
}

export default function DownloadButton({ files, casingStyle }: DownloadButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      // Dynamic import of JSZip for client-side only
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add each file to the zip with cleaned name
      for (const file of files) {
        const cleanedName = cleanFileName(file.name, casingStyle);
        zip.file(cleanedName, file);
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cleaned-files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip:', error);
      alert('Error creating zip file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (files.length === 0) return null;

  return (
    <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
      <button
        onClick={handleDownload}
        disabled={isProcessing}
        style={{
          backgroundColor: isProcessing ? 'var(--color-secondary)' : 'var(--color-warning)',
          color: isProcessing ? 'white' : 'var(--background)',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: 1,
          transition: '0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isProcessing) {
            e.currentTarget.style.background = 'var(--background)';
            e.currentTarget.style.color = 'var(--color-warning)';
            e.currentTarget.style.border = '1px solid var(--color-warning)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isProcessing) {
            e.currentTarget.style.background = 'var(--color-warning)';
            e.currentTarget.style.color = 'var(--background)';
            e.currentTarget.style.border = 'none';
          }
        }}
      >
        {isProcessing ? (
          <>
            <span style={{ marginRight: 'var(--spacing-xs)' }}>⏳</span>
            Processing...
          </>
        ) : (
          <>
            <span style={{ marginRight: 'var(--spacing-xs)' }}>📦</span>
            Download Cleaned Files ({files.length})
          </>
        )}
      </button>
      
      <p style={{ 
        marginTop: 'var(--spacing-xs)', 
        fontSize: '14px', 
        color: 'var(--text-muted)' 
      }}>
        Files will be renamed and zipped for download
      </p>
    </div>
  );
}
