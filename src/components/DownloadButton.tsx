'use client';

import { useState, useEffect } from 'react';
import { cleanFileName } from '@/utils/cleanFileName';
import { hasReachedLimit, incrementUsage } from '@/utils/usageTracker';
import Button from '@/components/Button';

type CasingStyle = 'kebab' | 'camel' | 'pascal';

interface DownloadButtonProps {
  files: File[];
  casingStyle: CasingStyle;
  onUsageUpdate?: () => void;
}

export default function DownloadButton({ files, casingStyle, onUsageUpdate }: DownloadButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  // Check usage limit when component mounts or files change
  useEffect(() => {
    checkUsageLimit();
  }, [files]);

  const checkUsageLimit = async () => {
    const reached = await hasReachedLimit();
    setLimitReached(reached);
  };

  const handleDownload = async () => {
    if (files.length === 0 || limitReached) return;

    // Check if processing these files would exceed the limit
    const wouldExceedLimit = await hasReachedLimit();
    if (wouldExceedLimit) {
      setLimitReached(true);
      return;
    }

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

      // Increment usage count for the number of files processed
      const usageResult = await incrementUsage(files.length);
      
      // Update limit reached state
      setLimitReached(usageResult.limitReached);
      
      // Notify parent component to refresh usage display
      if (onUsageUpdate) {
        onUsageUpdate();
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

  const isDisabled = isProcessing || limitReached;

  return (
    <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
            <Button
        onClick={handleDownload}
        disabled={isDisabled}
        variant="primary"
        size="large"
        style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          fontSize: '16px'
        }}
      >
        {limitReached ? (
          <>
            <span>🚫</span>
            Free Limit Reached
          </>
        ) : isProcessing ? (
          <>
            <span>⏳</span>
            Processing...
          </>
        ) : (
          <>
            <span>📦</span>
            Download Cleaned Files ({files.length})
          </>
        )}
      </Button>
      
      <p style={{ 
        marginTop: 'var(--spacing-xs)', 
        fontSize: '14px', 
        color: 'var(--text-muted)' 
      }}>
        {limitReached 
          ? 'Upgrade to Pro for unlimited file renames'
          : 'Files will be renamed and zipped for download'
        }
      </p>
    </div>
  );
}
