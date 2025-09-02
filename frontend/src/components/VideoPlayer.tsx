import { useRef, useEffect, useState } from 'react';
import { FileInfo, DetectionsResponse, FileInfoDetailed } from '@/types';
import { isVideoFile } from '@/lib/utils';

interface VideoPlayerProps {
  file: FileInfo;
  fileInfo?: FileInfoDetailed | null; // Add detailed file info
  detections: DetectionsResponse | null;
  className?: string;
}

export function VideoPlayer({ file, fileInfo, detections, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [fitMode, setFitMode] = useState<'contain' | 'cover' | 'auto'>('auto');
  
  // Generate Supabase URL based on the storage path pattern
  const generateSupabaseUrl = (bucketName: string, filePath: string) => {
    // Based on our testing, the working pattern is:
    // https://ztxizhteeaffqhfzzwud.supabase.co/storage/v1/object/public/{bucket}/{path}
    // Note: the path already includes the bucket name, so we use it as-is
    const supabaseUrl = 'https://ztxizhteeaffqhfzzwud.supabase.co';
    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
  };
  
  // Try to use Supabase URL if we have detailed file info, otherwise fallback to API
  let mediaUrl: string;
  
  if (fileInfo?.storage) {
    // Use Supabase direct URL - now that the bucket is public, this should work
    mediaUrl = generateSupabaseUrl(fileInfo.storage.bucket, fileInfo.storage.path);
  } else {
    // Fallback to API endpoints (though these don't exist yet)
    const fileIdForUrl = fileInfo?.file_id || file.id;
    mediaUrl = isVideoFile(file.filename) 
      ? `http://localhost:8001/video/${fileIdForUrl}`
      : `http://localhost:8001/image/${fileIdForUrl}`;
  }
  
  useEffect(() => {
    // Setup video player with detections if needed
    if (videoRef.current && detections?.detections) {
      // Could add detection markers to video timeline here
    }
  }, [detections]);
  
  if (isVideoFile(file.filename)) {
    const getVideoStyle = () => {
      switch (fitMode) {
        case 'contain':
          return { objectFit: 'contain' as const, minHeight: '300px', maxHeight: '500px' };
        case 'cover':
          return { objectFit: 'cover' as const, height: '400px' };
        case 'auto':
        default:
          return { 
            minHeight: '350px', 
            maxHeight: '550px',
            width: '100%',
            height: 'auto'
          };
      }
    };

    return (
      <div className={`space-y-4 ${className || ''}`}>
        <div className="bg-black rounded-lg overflow-hidden relative max-w-4xl mx-auto">
          {/* Fit mode controls */}
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            {(['auto', 'contain', 'cover'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFitMode(mode)}
                className={`px-2 py-1 text-xs rounded ${
                  fitMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <video
            ref={videoRef}
            className="w-full h-auto"
            controls
            preload="metadata"
            style={getVideoStyle()}
            onError={(e) => {
              console.error('Video failed to load:', mediaUrl);
              console.error('Error:', e);
            }}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Debug info - can be removed later */}
          <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-gray-400 bg-black bg-opacity-75">
            URL: {mediaUrl}
          </div>
        </div>
        
        {/* File Information */}
        {fileInfo && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">{fileInfo.duration_seconds}s</span>
              </div>
              <div>
                <span className="text-gray-600">FPS:</span>
                <span className="ml-2 font-medium">{fileInfo.fps}</span>
              </div>
              <div>
                <span className="text-gray-600">File Type:</span>
                <span className="ml-2 font-medium">{fileInfo.file_type}</span>
              </div>
              <div>
                <span className="text-gray-600">Storage:</span>
                <span className="ml-2 font-medium">{fileInfo.storage.bucket}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Detection Summary */}
        {detections && detections.detections.length > 0 && (
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Detections Found ({detections.detections.length})
            </h4>
            <div className="space-y-2">
              {detections.detections.slice(0, 5).map((detection, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{detection.brand_name}</span>
                  <span className="text-gray-500">
                    {detection.score.toFixed(2)} confidence
                  </span>
                </div>
              ))}
              {detections.detections.length > 5 && (
                <p className="text-sm text-gray-500">
                  And {detections.detections.length - 5} more...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        <div className="bg-gray-100 rounded-lg overflow-hidden relative max-w-4xl mx-auto">
          <img
            ref={imageRef}
            src={mediaUrl}
            alt={file.filename}
            className="w-full h-auto"
            style={{ minHeight: '400px', maxHeight: '600px', objectFit: 'contain' }}
            onError={(e) => {
              console.error('Image failed to load:', mediaUrl);
              console.error('Error:', e);
            }}
          />
          {/* Show the URL being used for debugging */}
          <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-gray-400 bg-gray-800 bg-opacity-75">
            URL: {mediaUrl}
          </div>
        </div>
        
        {/* Detection Summary */}
        {detections && detections.detections.length > 0 && (
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Detections Found ({detections.detections.length})
            </h4>
            <div className="space-y-2">
              {detections.detections.map((detection, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{detection.brand_name}</span>
                  <span className="text-gray-500">
                    {detection.score.toFixed(2)} confidence
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
