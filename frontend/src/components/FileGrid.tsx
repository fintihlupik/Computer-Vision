import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { formatFileSize, formatDate } from '@/lib/utils';
import { FileTypeIcon } from '@/components/FileTypeIcon';
import { FileInfo } from '@/types';

interface FileGridProps {
  onFileSelect?: (file: FileInfo) => void;
  className?: string;
}

export function FileGrid({ onFileSelect, className }: FileGridProps) {
  const { files, fetchFiles, selectFile } = useAppStore();
  
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);
  
  const handleFileClick = (file: FileInfo) => {
    selectFile(file.id);  // Changed from file.file_id to file.id
    onFileSelect?.(file);
  };
  
  if (files.loading) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  if (files.error) {
    return (
      <div className={`${className || ''}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Files</h3>
              <p className="text-sm text-red-700 mt-1">{files.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (files.items.length === 0) {
    return (
      <div className={`${className || ''}`}>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading a video or image.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Files ({files.items.length})
        </h2>
        <button
          onClick={fetchFiles}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.items.map((file) => (
          <div
            key={file.id}  // Changed from file.file_id to file.id
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            {/* File Type Icon */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <FileTypeIcon filename={file.filename} />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Filename */}
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {file.filename}
                </h3>
                
                {/* File Info */}
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-500">
                    Type: {file.file_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {formatDate(file.created_at)}
                  </p>
                </div>
                
                {/* Processing Status */}
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            {file.processing_status === 'completed' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Detections: {file.detections_count || 0}</span>
                  <span>Frames: {file.frame_captures_count || 0}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
