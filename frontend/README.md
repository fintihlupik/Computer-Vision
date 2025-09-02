# Logo Detection Frontend

This is a React + Vite frontend application for the Logo Detection API.

## Prerequisites

Before running this application, you need to have Node.js installed on your system.

### Installing Node.js

1. **Download Node.js**: Go to [https://nodejs.org](https://nodejs.org) and download the LTS version
2. **Install Node.js**: Run the installer and follow the instructions
3. **Verify installation**: Open a new terminal/command prompt and run:
   ```bash
   node --version
   npm --version
   ```

## Setup Instructions

Once Node.js is installed:

1. **Navigate to the frontend directory**:
   ```bash
   cd "c:\Users\luisf\Desktop\ComputerVision\FactoriaF5API\frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── UploadZone.tsx   # File upload interface
│   │   ├── FileGrid.tsx     # Display uploaded files
│   │   ├── VideoPlayer.tsx  # Media player with detections
│   │   ├── FrameGallery.tsx # Frame capture gallery
│   │   ├── Dashboard.tsx    # Statistics dashboard
│   │   └── FileTypeIcon.tsx # File type icons
│   ├── lib/                 # Utilities and API client
│   │   ├── api.ts          # Axios API configuration
│   │   └── utils.ts        # Helper functions
│   ├── store/              # Zustand state management
│   │   └── index.ts        # Global app state
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # API and component types
│   ├── App.tsx             # Main application component
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles (Tailwind CSS)
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Features

### 1. Upload Interface
- Drag and drop file upload
- Support for videos (MP4, AVI, MOV) and images (JPG, PNG, WEBP)
- Real-time upload progress
- File validation

### 2. File Management
- Grid view of uploaded files
- File type icons and metadata
- Processing status indicators
- Click to view details

### 3. Media Viewer
- Video player for uploaded videos
- Image viewer for uploaded images
- Detection overlays and information
- Frame capture gallery

### 4. Analytics Dashboard
- Total files, detections, and brands statistics
- Top detected brands with confidence scores
- Recent upload tracking

### 5. Frame Capture Gallery
- Display captured frames from videos
- Thumbnail grid view
- Frame timing information

## API Integration

The frontend connects to the FastAPI backend running on `http://localhost:8001` and provides:

- **File Upload**: `POST /upload-file/`
- **File List**: `GET /files`
- **File Info**: `GET /file-info/{file_id}`
- **Detections**: `GET /detections/{file_id}`
- **Frame Captures**: `GET /frame-captures/{file_id}`
- **Statistics**: `GET /stats`
- **Brand Stats**: `GET /brand-stats`

## State Management

Uses Zustand for global state management with the following stores:

- **Upload State**: Track upload progress and results
- **File State**: Manage file list and selection
- **Current File State**: Handle detailed file information

## Styling

Built with Tailwind CSS for responsive, modern UI design including:

- Mobile-first responsive design
- Dark/light theme support ready
- Consistent component styling
- Smooth animations and transitions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the frontend directory if you need to configure:

```env
VITE_API_BASE_URL=http://localhost:8001
```

## Troubleshooting

### Common Issues

1. **TypeScript errors**: These are expected until dependencies are installed
2. **API connection**: Ensure the FastAPI backend is running on port 8001
3. **CORS issues**: The Vite proxy configuration should handle this

### Next Steps

After Node.js installation:

1. Install dependencies with `npm install`
2. Start both backend (FastAPI) and frontend (Vite) servers
3. Upload a video or image to test the complete workflow
4. Check the dashboard for statistics and analytics

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client
- **Video.js** - Video player (when needed)
- **Recharts** - Charts and analytics (when needed)
