import { useState, useEffect } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { FileGrid } from '@/components/FileGrid';
import { VideoPlayer } from '@/components/VideoPlayer';
import { FrameGallery } from '@/components/FrameGallery';
import { Dashboard } from '@/components/Dashboard';
import { useAppStore } from '@/store';
import { FileInfo } from '@/types';

type ActiveTab = 'upload' | 'files' | 'viewer' | 'dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const { currentFile, upload, clearUpload, selectFile } = useAppStore();
  
  // Auto-navigate after successful upload
  useEffect(() => {
    if (upload.result && !upload.isUploading) {
      // Wait a moment to show the success message
      const timer = setTimeout(() => {
        setActiveTab('files');
        
        // Auto-select the uploaded file and go to viewer
        if (upload.result?.file_id) {
          const newFile: FileInfo = {
            id: upload.result.file_id,
            filename: upload.result.filename || 'Uploaded File',
            file_type: upload.result.file_type || 'video',
            created_at: new Date().toISOString(),
            bucket: 'videos', // Default bucket
            path: `${upload.result.file_id}/${upload.result.filename}`,
          };
          
          setSelectedFile(newFile);
          selectFile(upload.result.file_id);
          
          // Switch to viewer after a short delay
          setTimeout(() => {
            setActiveTab('viewer');
          }, 500);
        }
      }, 2000); // Show success message for 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [upload.result, upload.isUploading, selectFile]);
  
  // Switch to viewer when file is selected
  const handleFileSelect = (file: FileInfo) => {
    setSelectedFile(file);
    setActiveTab('viewer');
  };
  
  // Clear current file when going back
  const handleBackToFiles = () => {
    setSelectedFile(null);
    setActiveTab('files');
  };
  
  const TabButton = ({ id, label, count }: { id: ActiveTab; label: string; count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 text-sm font-semibold transition-all duration-300 ${
        activeTab === id
          ? 'tab-active'
          : 'tab-inactive'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-2 px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
          activeTab === id 
            ? 'bg-white/20 text-white' 
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-24 relative">
            {/* Centered Logo Section - Text only */}
            <div className="flex items-center justify-center">
              {/* Logo only - centered and prominent */}
              <div className="text-center">
                <div className="flex justify-center">
                  <img 
                    src="/LogoHeader2.jpeg" 
                    alt="LogoVision PRO" 
                    className="h-24 w-auto"
                  />
                </div>
              </div>
            </div>
            
            {/* Clear Upload Button - Positioned in top right corner */}
            {upload.result && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={clearUpload}
                  className="px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                >
                  ✕ Clear Upload
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <nav className="nav-modern mx-4 mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 py-4">
            <TabButton id="upload" label="Upload" />
            <TabButton id="files" label="Files" />
            <TabButton id="dashboard" label="Dashboard" />
            {selectedFile && (
              <TabButton id="viewer" label={`Viewer - ${selectedFile.filename}`} />
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient-primary mb-4">
                Upload Media for AI Logo Detection
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload videos or images to detect and analyze logos using advanced AI technology. 
                Experience the power of LogoVision PRO's cutting-edge computer vision.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="card">
                <UploadZone />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'files' && (
          <FileGrid onFileSelect={handleFileSelect} />
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}
        
        {activeTab === 'viewer' && selectedFile && (
          <div className="space-y-8">
            {/* Back Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToFiles}
                className="btn-outline flex items-center space-x-2 px-4 py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Files</span>
              </button>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gradient-primary">
                  {selectedFile.filename}
                </h2>
                <p className="text-gray-600">
                  AI Logo Detection Results
                </p>
              </div>
            </div>
            
            {currentFile.loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="loading-gradient w-12 h-12 rounded-full animate-spin border-4 border-white/30"></div>
              </div>
            ) : currentFile.error ? (
              <div className="error-modern p-6">
                <p className="text-red-700 font-semibold">{currentFile.error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video/Image Player */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Media Player</h3>
                  <div className="card">
                    <VideoPlayer
                      file={selectedFile}
                      fileInfo={currentFile.info}
                      detections={currentFile.detections}
                    />
                  </div>
                </div>
                
                {/* Frame Captures Gallery */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Frame Captures</h3>
                  <div className="card">
                    <FrameGallery
                      frameCaptures={currentFile.frameCaptures}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
