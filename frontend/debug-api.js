// Debug script to check the API response structure
const checkAPIResponse = async () => {
  try {
    console.log('Checking /files endpoint...');
    const filesResponse = await fetch('http://localhost:8001/files');
    const filesData = await filesResponse.json();
    
    console.log('Files response structure:', JSON.stringify(filesData.files[0], null, 2));
    
    if (filesData.files && filesData.files.length > 0) {
      const fileId = filesData.files[0].id;
      console.log(`\nTesting with file ID: ${fileId}`);
      
      // Test file-info endpoint
      console.log('\nTesting /file-info endpoint...');
      const fileInfoResponse = await fetch(`http://localhost:8001/file-info/${fileId}`);
      if (fileInfoResponse.ok) {
        const fileInfoData = await fileInfoResponse.json();
        console.log('File-info response:', JSON.stringify(fileInfoData, null, 2));
      } else {
        console.log('File-info error:', fileInfoResponse.status, fileInfoResponse.statusText);
      }
      
      // Test detections endpoint
      console.log('\nTesting /detections endpoint...');
      const detectionsResponse = await fetch(`http://localhost:8001/detections/${fileId}`);
      if (detectionsResponse.ok) {
        const detectionsData = await detectionsResponse.json();
        console.log('Detections response:', JSON.stringify(detectionsData, null, 2));
      } else {
        console.log('Detections error:', detectionsResponse.status, detectionsResponse.statusText);
      }
      
      // Test frame-captures endpoint
      console.log('\nTesting /frame-captures endpoint...');
      const frameCapturesResponse = await fetch(`http://localhost:8001/frame-captures/${fileId}`);
      if (frameCapturesResponse.ok) {
        const frameCapturesData = await frameCapturesResponse.json();
        console.log('Frame captures response:', JSON.stringify(frameCapturesData, null, 2));
      } else {
        console.log('Frame captures error:', frameCapturesResponse.status, frameCapturesResponse.statusText);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the function
checkAPIResponse();
