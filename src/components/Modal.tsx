'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--spacing-md)'
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          backgroundColor: 'var(--background)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: 'var(--text)',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '24px',
              padding: 'var(--spacing-xs)',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
