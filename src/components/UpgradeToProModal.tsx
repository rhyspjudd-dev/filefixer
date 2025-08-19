'use client';

import React from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface UpgradeToProModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingFiles: number;
  dailyLimit: number;
  attemptedFiles: number;
}

export default function UpgradeToProModal({ 
  isOpen, 
  onClose, 
  remainingFiles, 
  dailyLimit, 
  attemptedFiles 
}: UpgradeToProModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="🚀 Daily Limit Reached"
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-warning), var(--color-chartreuse))',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-night)'
        }}>
          <h3 style={{ 
            margin: 0, 
            marginBottom: 'var(--spacing-sm)',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            You&apos;ve used all {dailyLimit} free files today!
          </h3>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            opacity: 0.9
          }}>
            You tried to upload {attemptedFiles} more files, but you can only process {remainingFiles} more today.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h4 style={{ 
            color: 'var(--text)', 
            marginBottom: 'var(--spacing-md)',
            fontSize: '16px'
          }}>
            Upgrade to Pro for:
          </h4>
          
          <div style={{ 
            textAlign: 'left',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 'var(--spacing-sm)',
              color: 'var(--text)'
            }}>
              <span style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-success)' }}>✅</span>
              <span>Unlimited file renaming and downloads</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 'var(--spacing-sm)',
              color: 'var(--text)'
            }}>
              <span style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-success)' }}>✅</span>
              <span>Additional formatting controls</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 'var(--spacing-sm)',
              color: 'var(--text)'
            }}>
              <span style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-success)' }}>✅</span>
              <span>No ads</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text)'
            }}>
              <span style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-success)' }}>✅</span>
              <span>Technical support</span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          justifyContent: 'center'
        }}>
          <Button
            onClick={onClose}
            variant="outline"
            size="medium"
          >
            Maybe Later
          </Button>
          
          <Link href="/pro" style={{ textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="medium"
              style={{
                background: 'linear-gradient(135deg, var(--color-warning), var(--color-chartreuse))',
                color: 'var(--color-night)',
                fontWeight: '600',
                padding: 'var(--spacing-sm) var(--spacing-lg)'
              }}
            >
              🚀 View Pro Plans
            </Button>
          </Link>
        </div>
        
        <p style={{
          marginTop: 'var(--spacing-md)',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          Or come back tomorrow for {dailyLimit} more free files!
        </p>
      </div>
    </Modal>
  );
}
