'use client';

import { useCallback, useRef } from 'react';
import Button from '@/components/Button';

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
}

export default function FileUploader({ files, setFiles, maxFiles = 10 }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const totalFiles = [...files, ...newFiles];

    if (totalFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles(totalFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

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
          <h3>Drop files here or click to browse</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
            Maximum {maxFiles} files
          </p>
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
                key={index}
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
    </div>
  );
}
