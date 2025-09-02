import { FrameCapturesResponse } from '@/types';

interface FrameGalleryProps {
  frameCaptures: FrameCapturesResponse | null;
  className?: string;
}

export function FrameGallery({ frameCaptures, className }: FrameGalleryProps) {
  if (!frameCaptures || frameCaptures.frame_captures.length === 0) {
    return (
      <div className={`text-center py-8 ${className || ''}`}>
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500">No frame captures available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {frameCaptures.frame_captures.map((frame, index) => (
          <div
            key={frame.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100">
              <img
                src={frame.public_url}
                alt={`Frame ${frame.frame_number}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-900">
                  Frame {frame.frame_number}
                </span>
                <span className="text-gray-500">
                  {frame.t_start.toFixed(1)}s
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
