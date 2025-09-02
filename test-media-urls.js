// Test script to verify media URLs are working
const http = require('http');

const API_BASE = 'http://localhost:8001';

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        url: url,
        status: res.statusCode,
        headers: res.headers,
        success: res.statusCode === 200
      });
    });
    
    req.on('error', (e) => {
      resolve({
        url: url,
        status: 'ERROR',
        error: e.message,
        success: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url: url,
        status: 'TIMEOUT',
        error: 'Request timeout',
        success: false
      });
    });
    
    req.end();
  });
}

async function testMediaUrls() {
  try {
    console.log('🧪 Testing Media URLs...\n');
    
    // Get files first
    const filesResponse = await new Promise((resolve, reject) => {
      const req = http.request(`${API_BASE}/files`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
    
    if (filesResponse.files && filesResponse.files.length > 0) {
      const file = filesResponse.files[0];
      const fileId = file.id;
      
      console.log(`📁 Testing with file: ${file.filename} (ID: ${fileId})`);
      console.log(`   File type: ${file.file_type}`);
      
      // Test different media URL formats
      const urlsToTest = [
        `${API_BASE}/video/${fileId}`,
        `${API_BASE}/image/${fileId}`,
        `${API_BASE}/media/${fileId}`,
        `${API_BASE}/files/${fileId}/download`
      ];
      
      console.log('\n🔗 Testing media URLs:');
      
      for (const url of urlsToTest) {
        const result = await checkUrl(url);
        const status = result.success ? '✅' : '❌';
        console.log(`   ${status} ${url} - Status: ${result.status}`);
        
        if (result.success && result.headers) {
          console.log(`      Content-Type: ${result.headers['content-type'] || 'Not specified'}`);
          console.log(`      Content-Length: ${result.headers['content-length'] || 'Not specified'}`);
        } else if (result.error) {
          console.log(`      Error: ${result.error}`);
        }
      }
      
      // Test the storage path from file-info
      console.log('\n📊 Checking storage path from file-info...');
      const fileInfoResponse = await new Promise((resolve, reject) => {
        const req = http.request(`${API_BASE}/file-info/${fileId}`, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });
        req.on('error', reject);
        req.end();
      });
      
      if (fileInfoResponse.storage) {
        console.log(`   Storage bucket: ${fileInfoResponse.storage.bucket}`);
        console.log(`   Storage path: ${fileInfoResponse.storage.path}`);
        
        // Test if there's a direct storage URL endpoint
        const storageUrl = `${API_BASE}/storage/${fileInfoResponse.storage.bucket}/${fileInfoResponse.storage.path}`;
        const storageResult = await checkUrl(storageUrl);
        const storageStatus = storageResult.success ? '✅' : '❌';
        console.log(`   ${storageStatus} ${storageUrl} - Status: ${storageResult.status}`);
      }
      
    } else {
      console.log('❌ No files found to test');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMediaUrls();
