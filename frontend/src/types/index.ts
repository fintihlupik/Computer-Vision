// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// File Types
export interface FileInfo {
  id: number;  // Changed from file_id to id to match API response
  filename: string;
  file_type: 'video' | 'image';
  created_at: string;
  bucket: string;
  path: string;
  duration_seconds?: number;
  fps?: number;
  origin_video_id?: number | null;
}

// For files endpoint response
export interface FilesResponse {
  files: FileInfo[];
}

// For file-info endpoint response (extended file information)
export interface FileInfoDetailed {
  file_id: number;
  filename: string;
  file_type: 'video' | 'image';
  created_at: string;
  detections_count: number;
  brands_detected: string[];
  frame_captures_count: number;
  duration_seconds?: number;
  fps?: number;
  storage: {
    bucket: string;
    path: string;
  };
}

// Upload Response
export interface UploadResponse {
  message: string;
  session_id: string;
  file_id: number;
  filename: string;
  file_size: number;
  file_type: 'video' | 'image';
  processing_status: 'completed';
  detections_count: number;
  brands_detected: string[];
  urls: {
    video_url?: string;
    image_url?: string;
  };
  statistics?: any;
  endpoints: {
    detections: string;
    frame_captures: string;
    file_info: string;
  };
}

// Detection Types
export interface Detection {
  id: number;
  file_id: number;
  brand_name: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  t_start: number;
  t_end: number;
  frame: number;
  model: string;
  created_at: string;
  frame_capture_url?: string;
  frame_capture_path?: string;
  frame_number?: number;
}

export interface DetectionsResponse {
  detections: Detection[];
}

// Frame Capture Types
export interface FrameCapture {
  id: number;
  file_id: number;
  frame_number: number;
  bucket: string;
  path: string;
  public_url: string;
  t_start: number;
  t_end: number;
  created_at: string;
}

export interface FrameCapturesResponse {
  frame_captures: FrameCapture[];
}

// Brand Statistics
export interface BrandStats {
  brand_name: string;
  total_detections: number;
  avg_confidence: number;
  first_seen: string;
  last_seen: string;
}

// UI State Types
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: UploadResponse | null;
}

export interface FileGridState {
  files: FileInfo[];
  loading: boolean;
  error: string | null;
  selectedFile: FileInfo | null;
}

// Filter Types
export interface FileFilters {
  search: string;
  fileType: 'all' | 'video' | 'image';
  brand: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

// Component Props Types
export interface VideoPlayerProps {
  src: string;
  detections: Detection[];
  onTimeUpdate?: (time: number) => void;
  onDetectionClick?: (detection: Detection) => void;
}

export interface FrameGalleryProps {
  frames: FrameCapture[];
  detections: Detection[];
  onFrameClick?: (frame: FrameCapture) => void;
}

export interface UploadZoneProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
