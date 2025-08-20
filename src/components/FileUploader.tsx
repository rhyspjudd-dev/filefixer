'use client';

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { checkDailyLimit, getUsageStats } from '@/utils/usageTracker';
import Button from '@/components/Button';
import UpgradeToProModal from '@/components/UpgradeToProModal';

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
}

export default function FileUploader({ files, setFiles, maxFiles = 10 }: FileUploaderProps) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dailyUsage, setDailyUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalData, setUpgradeModalData] = useState<{
    remainingFiles: number;
    dailyLimit: number;
    attemptedFiles: number;
  } | null>(null);

  // Check if user is Pro (Pro users have no daily limits) - memoized
  const isPro = useMemo(() => {
    const user = session?.user as { isPro?: boolean; role?: string } | undefined;
    return user?.isPro || user?.role === 'admin';
  }, [session?.user]);

  const loadDailyUsage = useCallback(async () => {
    try {
      const stats = await getUsageStats();
      setDailyUsage(stats);
    } catch (error) {
      console.error('Error loading daily usage:', error);
    }
  }, []);

  // Load daily usage stats for non-Pro users
  useEffect(() => {
    if (!isPro) {
      loadDailyUsage();
    }
  }, [isPro, loadDailyUsage]);

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    
    // Create a map of existing files by name and size for deduplication
    const existingFileMap = new Map(
      files.map(file => [`${file.name}-${file.size}`, file])
    );
    
    // Filter out duplicate files (same name and size)
    const uniqueNewFiles = newFiles.filter(file => {
      const fileKey = `${file.name}-${file.size}`;
      return !existingFileMap.has(fileKey);
    });
    
    if (uniqueNewFiles.length === 0) {
      alert('All selected files are already uploaded');
      return;
    }

    // Check max files limit first (sync operation) - only for non-Pro users
    const totalFiles = [...files, ...uniqueNewFiles];
    if (!isPro && totalFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. ${uniqueNewFiles.length} new files would exceed the limit.`);
      return;
    }

    // For non-Pro users, check daily limit (optimized async operation)
    if (!isPro) {
      const limitCheck = await checkDailyLimit(uniqueNewFiles.length);
      if (!limitCheck.allowed) {
        setUpgradeModalData({
          remainingFiles: limitCheck.remainingToday,
          dailyLimit: limitCheck.limit,
          attemptedFiles: uniqueNewFiles.length
        });
        setShowUpgradeModal(true);
        return;
      }
    }

    // Set files immediately (no async dependency)
    setFiles(totalFiles);
    
    // Refresh daily usage stats in background (non-blocking)
    if (!isPro) {
      loadDailyUsage().catch(console.error);
    }
  }, [files, maxFiles, isPro, setFiles, loadDailyUsage, setUpgradeModalData, setShowUpgradeModal]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]); // Add handleFileSelect dependency

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    // Reset the input value so the same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  }, [files, setFiles]);

  return (
    <div>
      <div
        className="upload-zone"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div style={{ fontSize: '48px' }}>📁</div>
        <div>
          <h3>Drop files here</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
            {isPro ? 'Unlimited files' : `Maximum ${maxFiles} files`}
          </p>
          {!isPro && dailyUsage && (
            <p style={{ 
              color: dailyUsage.remaining <= 2 ? 'var(--color-warning)' : 'var(--text-muted)', 
              marginTop: 'var(--spacing-xs)',
              fontSize: '13px'
            }}>
              Daily limit: {dailyUsage.used}/{dailyUsage.limit} files used today
            </p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />

      {files.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <h4>Selected Files ({files.length})</h4>
            <Button 
              onClick={() => setFiles([])}
              variant="primary"
              size="medium"
            >
              Clear All
            </Button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--spacing-xs)' 
          }}>
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${file.size}-${index}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-xs)',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border)'
                }}
              >
                <span style={{ fontSize: '14px' }}>{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                    padding: 'var(--spacing-xs)',
                    fontSize: '16px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade to Pro Modal */}
      {upgradeModalData && (
        <UpgradeToProModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          remainingFiles={upgradeModalData.remainingFiles}
          dailyLimit={upgradeModalData.dailyLimit}
          attemptedFiles={upgradeModalData.attemptedFiles}
        />
      )}
    </div>
  );
}
