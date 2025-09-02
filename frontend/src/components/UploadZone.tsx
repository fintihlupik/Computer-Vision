import { useState, useCallback } from 'react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  className?: string;
}

export function UploadZone({ className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { upload, uploadFile } = useAppStore();
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);
  
  const isVideoFile = (file: File) => file.type.startsWith('video/');
  const isImageFile = (file: File) => file.type.startsWith('image/');
  
  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400",
          upload.isUploading && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {/* Icon */}
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              />
            </svg>
          </div>
          
          {/* Text */}
          <div>
            <p className="text-lg font-medium text-gray-900">
              Upload video or image for logo detection
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports: MP4, AVI, MOV, JPG, PNG, WEBP (max 100MB)
            </p>
          </div>
          
          {/* File Input */}
          <input
            type="file"
            accept="video/*,image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={upload.isUploading}
          />
          <label
            htmlFor="file-upload"
            className="btn-primary cursor-pointer transition-all duration-300 hover:scale-105"
          >
            Select File
          </label>
        </div>
      </div>
      
      {/* Upload Progress */}
      {upload.isUploading && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Uploading and processing...</span>
            <span className="text-gradient-primary font-bold">{Math.round(upload.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="progress-bar-gradient h-3 transition-all duration-500 ease-out"
              style={{ width: `${upload.progress}%` }}
            />
          </div>
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
              <div className="loading-gradient w-4 h-4"></div>
              <span>AI is analyzing your media...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Error */}
      {upload.error && (
        <div className="mt-6 error-modern p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800">Upload Error</h3>
              <p className="text-red-700 mt-1">{upload.error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Success */}
      {upload.result && (
        <div className="mt-6 success-modern p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-green-800">Upload Successful! 🎉</h3>
              <div className="text-green-700 mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-medium">File "{upload.result.filename}" uploaded successfully</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📊</span>
                  <span>File size: {(upload.result.file_size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔍</span>
                  <span>Detections found: <strong>{upload.result.detections_count}</strong></span>
                </div>
                {upload.result.brands_detected.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <span className="text-2xl">🏷️</span>
                    <div>
                      <span>Brands detected: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {upload.result.brands_detected.map((brand, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 text-xs font-semibold rounded-full"
                            style={{ 
                              background: 'var(--gradient-primary)', 
                              color: 'white' 
                            }}
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🚀</span>
                    <span className="text-gradient-primary font-bold">
                      Redirecting to viewer in a moment...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
