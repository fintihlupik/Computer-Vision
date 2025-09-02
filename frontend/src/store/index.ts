import { create } from 'zustand';
import { api, uploadWithProgress } from '@/lib/api';
import { 
  UploadResponse, 
  DetectionsResponse, 
  FrameCapturesResponse, 
  FileInfo,
  FileInfoDetailed,  // Added this import
  ApiError 
} from '@/types';

interface AppState {
  // Upload state
  upload: {
    isUploading: boolean;
    progress: number;
    error: string | null;
    result: UploadResponse | null;
  };
  
  // Files state
  files: {
    items: FileInfo[];
    loading: boolean;
    error: string | null;
  };
  
  // Current file state
  currentFile: {
    info: FileInfoDetailed | null;  // Changed to FileInfoDetailed
    detections: DetectionsResponse | null;
    frameCaptures: FrameCapturesResponse | null;
    loading: boolean;
    error: string | null;
  };
  
  // Actions
  uploadFile: (file: File) => Promise<void>;
  fetchFiles: () => Promise<void>;
  selectFile: (fileId: number) => Promise<void>;
  clearUpload: () => void;
  clearCurrentFile: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  upload: {
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
  },
  
  files: {
    items: [],
    loading: false,
    error: null,
  },
  
  currentFile: {
    info: null,
    detections: null,
    frameCaptures: null,
    loading: false,
    error: null,
  },
  
  // Actions
  uploadFile: async (file: File) => {
    set((state) => ({
      upload: {
        ...state.upload,
        isUploading: true,
        progress: 0,
        error: null,
        result: null,
      },
    }));
    
    try {
      const response = await uploadWithProgress(file, (progress) => {
        set((state) => ({
          upload: {
            ...state.upload,
            progress,
          },
        }));
      });
      
      const result: UploadResponse = response.data;
      
      set((state) => ({
        upload: {
          ...state.upload,
          isUploading: false,
          result,
        },
      }));
      
      // Refresh files list
      get().fetchFiles();
      
    } catch (error) {
      const apiError = error as ApiError;
      set((state) => ({
        upload: {
          ...state.upload,
          isUploading: false,
          error: apiError.message,
        },
      }));
    }
  },
  
  fetchFiles: async () => {
    set((state) => ({
      files: {
        ...state.files,
        loading: true,
        error: null,
      },
    }));
    
    try {
      const response = await api.get('/files');
      const files: FileInfo[] = response.data.files;
      
      set((state) => ({
        files: {
          ...state.files,
          items: files,
          loading: false,
        },
      }));
      
    } catch (error) {
      const apiError = error as ApiError;
      set((state) => ({
        files: {
          ...state.files,
          loading: false,
          error: apiError.message,
        },
      }));
    }
  },
  
  selectFile: async (fileId: number) => {
    set((state) => ({
      currentFile: {
        ...state.currentFile,
        loading: true,
        error: null,
      },
    }));
    
    try {
      // Fetch file info, detections, and frame captures in parallel
      const [fileInfoResponse, detectionsResponse, frameCapturesResponse] = await Promise.all([
        api.get(`/file-info/${fileId}`),
        api.get(`/detections/${fileId}`),
        api.get(`/frame-captures/${fileId}`),
      ]);
      
      set((state) => ({
        currentFile: {
          ...state.currentFile,
          info: fileInfoResponse.data,
          detections: detectionsResponse.data,
          frameCaptures: frameCapturesResponse.data,
          loading: false,
        },
      }));
      
    } catch (error) {
      const apiError = error as ApiError;
      set((state) => ({
        currentFile: {
          ...state.currentFile,
          loading: false,
          error: apiError.message,
        },
      }));
    }
  },
  
  clearUpload: () => {
    set((state) => ({
      upload: {
        isUploading: false,
        progress: 0,
        error: null,
        result: null,
      },
    }));
  },
  
  clearCurrentFile: () => {
    set((state) => ({
      currentFile: {
        info: null,
        detections: null,
        frameCaptures: null,
        loading: false,
        error: null,
      },
    }));
  },
}));
