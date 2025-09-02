// Optimización para reducir costes de bandwidth
export const VideoOptimizer = {
  // Solo cargar video cuando el usuario realmente quiera verlo
  lazyLoadVideo: (fileInfo) => {
    return {
      thumbnail: `frame_000001.jpg`, // Usar frame capture como preview
      fullVideo: null, // Solo cargar bajo demanda
      loadOnDemand: true
    };
  },
  
  // Calcular costes estimados
  estimateCost: (fileSizeMB, expectedViews) => {
    const bandwidthGB = (fileSizeMB * expectedViews) / 1024;
    const freeLimit = 2; // GB gratis por mes
    const overageGB = Math.max(0, bandwidthGB - freeLimit);
    const cost = overageGB * 0.09; // $0.09 per GB
    
    return {
      bandwidthUsed: bandwidthGB.toFixed(2),
      withinFreeLimit: bandwidthGB <= freeLimit,
      estimatedCost: cost.toFixed(3),
      recommendation: cost > 5 ? 'Consider video optimization' : 'Current usage is cost-effective'
    };
  },
  
  // Sugerir optimizaciones
  suggestOptimizations: (fileInfo) => {
    const suggestions = [];
    
    if (fileInfo.duration_seconds > 300) { // >5 min
      suggestions.push('Consider video segmentation for long videos');
    }
    
    if (!fileInfo.compressed) {
      suggestions.push('Compress video to reduce file size');
    }
    
    suggestions.push('Use frame captures as thumbnails');
    suggestions.push('Implement click-to-play instead of autoplay');
    
    return suggestions;
  }
};

// Ejemplo de uso en tu componente
const VideoWithCostOptimization = ({ fileInfo }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const costEstimate = VideoOptimizer.estimateCost(
    fileInfo.file_size_mb || 6.18, 
    100 // estimated monthly views
  );
  
  return (
    <div>
      {!videoLoaded ? (
        <div className="video-placeholder" onClick={() => setVideoLoaded(true)}>
          <img src={frameCaptures[0].public_url} alt="Video thumbnail" />
          <div className="play-button">▶️ Click to load video</div>
          <div className="cost-info">
            Est. bandwidth: {costEstimate.bandwidthUsed}GB
            {!costEstimate.withinFreeLimit && ` (Cost: $${costEstimate.estimatedCost})`}
          </div>
        </div>
      ) : (
        <video src={videoUrl} controls />
      )}
    </div>
  );
};
