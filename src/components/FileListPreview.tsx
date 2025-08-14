'use client';

import React from 'react';
import { cleanFileName } from '@/utils/cleanFileName';

type CasingStyle = 'lowercase' | 'kebab' | 'camel' | 'pascal';

interface FileListPreviewProps {
  files: File[];
  casingStyle: CasingStyle;
  setCasingStyle: (style: CasingStyle) => void;
}

export default function FileListPreview({ files, casingStyle, setCasingStyle }: FileListPreviewProps) {
  if (files.length === 0) return null;

  return (
    <div style={{ marginTop: 'var(--spacing-lg)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)'
      }}>
        <h3>File Rename Preview</h3>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Style:</label>
          <select
            value={casingStyle}
            onChange={(e) => setCasingStyle(e.target.value as CasingStyle)}
            style={{
              padding: 'var(--spacing-xs)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '14px'
            }}
          >
            <option value="lowercase">lowercase</option>
            <option value="kebab">kebab-case</option>
            <option value="camel">camelCase</option>
            <option value="pascal">PascalCase</option>
          </select>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          backgroundColor: 'var(--border)'
        }}>
          <div style={{
            padding: 'var(--spacing-sm)',
            backgroundColor: 'var(--surface)',
            fontWeight: '600',
            color: 'var(--text)'
          }}>
            Original Name
          </div>
          <div style={{
            padding: 'var(--spacing-sm)',
            backgroundColor: 'var(--surface)',
            fontWeight: '600',
            color: 'var(--text)'
          }}>
            Cleaned Name
          </div>
          
          {files.map((file, index) => (
            <React.Fragment key={index}>
              <div 
                style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  wordBreak: 'break-all'
                }}
              >
                {file.name}
              </div>
              <div 
                style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '14px',
                  color: 'var(--text)',
                  fontWeight: '500',
                  wordBreak: 'break-all'
                }}
              >
                {cleanFileName(file.name, casingStyle)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}