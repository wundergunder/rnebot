import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5, // Default 5MB
  className = '',
  label = 'Upload File',
  disabled = false
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={handleClick}
        className="w-full"
        disabled={disabled}
      >
        <Upload className="w-4 h-4 mr-2" />
        {label}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}