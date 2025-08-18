'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { cleanFileName, type CasingStyle } from '@/utils/cleanFileName';
import { hasReachedLimit, incrementUsage, checkDailyLimit } from '@/utils/usageTracker';
import Button from '@/components/Button';
import UpgradeToProModal from '@/components/UpgradeToProModal';

interface DownloadButtonProps {
  files: File[];
  casingStyle: CasingStyle;
  onUsageUpdate?: () => void;
}

export default function DownloadButton({ files, casingStyle, onUsageUpdate }: DownloadButtonProps) {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalData, setUpgradeModalData] = useState<{
    remainingFiles: number;
    totalUsed: number;
    dailyLimit: number;
    attemptedFiles: number;
  } | null>(null);

  // Check if user is Pro
  const isPro = session?.user?.isPro || session?.user?.role === 'admin';

  // Check usage limit when component mounts or files change (only for non-Pro users)
  useEffect(() => {
    if (!isPro) {
      checkUsageLimit();
    }
  }, [files, isPro]);

  const checkUsageLimit = async () => {
    const reached = await hasReachedLimit();
    setLimitReached(reached);
  };

  const handleDownload = async () => {
    if (files.length === 0) return;

    // For Pro users, skip usage limit checks
    if (!isPro) {
      if (limitReached) return;

      // Double-check the daily limit right before processing (in case user waited and limit changed)
      const limitCheck = await checkDailyLimit(files.length);
      if (!limitCheck.allowed) {
        setUpgradeModalData({
          remainingFiles: limitCheck.remainingToday,
          totalUsed: limitCheck.totalToday,
          dailyLimit: limitCheck.limit,
          attemptedFiles: files.length
        });
        setShowUpgradeModal(true);
        setLimitReached(true);
        return;
      }
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

      // Increment usage count for the number of files processed (only for non-Pro users)
      if (!isPro) {
        const usageResult = await incrementUsage(files.length);
        
        // Update limit reached state
        setLimitReached(usageResult.limitReached);
        
        // Notify parent component to refresh usage display
        if (onUsageUpdate) {
          onUsageUpdate();
        }
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

    const isDisabled = files.length === 0 || isProcessing || (!isPro && limitReached);

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
        {!isPro && limitReached ? (
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
        {!isPro && limitReached 
          ? 'Upgrade to Pro for unlimited file renames'
          : 'Files will be renamed and zipped for download'
        }
      </p>

      {/* Upgrade to Pro Modal */}
      {upgradeModalData && (
        <UpgradeToProModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          remainingFiles={upgradeModalData.remainingFiles}
          totalUsed={upgradeModalData.totalUsed}
          dailyLimit={upgradeModalData.dailyLimit}
          attemptedFiles={upgradeModalData.attemptedFiles}
        />
      )}
    </div>
  );
}
