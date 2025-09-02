// Test Supabase video URL
const http = require('http');
const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, { method: 'HEAD' }, (res) => {
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
    
    req.setTimeout(10000, () => {
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

async function testSupabaseVideoUrl() {
  console.log('🧪 Testing Supabase video URL...\n');
  
  // Based on the file info from the debug:
  // Storage bucket: "videos"
  // Storage path: "videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4"
  
  const supabaseUrl = 'https://ztxizhteeaffqhfzzwud.supabase.co';
  const bucket = 'videos';
  const path = 'videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4';
  
  const videoUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  
  console.log(`📹 Testing video URL: ${videoUrl}`);
  
  const result = await testUrl(videoUrl);
  
  if (result.success) {
    console.log('✅ Video URL is accessible!');
    console.log(`   Status: ${result.status}`);
    console.log(`   Content-Type: ${result.headers['content-type'] || 'Not specified'}`);
    console.log(`   Content-Length: ${result.headers['content-length'] || 'Not specified'}`);
  } else {
    console.log('❌ Video URL failed');
    console.log(`   Status: ${result.status}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    // Try alternative URL patterns
    console.log('\n🔄 Trying alternative URL patterns...');
    
    const alternatives = [
      `${supabaseUrl}/storage/v1/object/public/${path}`, // Without bucket prefix
      `${supabaseUrl}/storage/v1/object/sign/${bucket}/${path}`, // Signed URL endpoint
      `${supabaseUrl}/storage/v1/object/${bucket}/${path}`, // Direct object access
    ];
    
    for (const altUrl of alternatives) {
      console.log(`   Testing: ${altUrl}`);
      const altResult = await testUrl(altUrl);
      const status = altResult.success ? '✅' : '❌';
      console.log(`   ${status} Status: ${altResult.status}`);
    }
  }
}

testSupabaseVideoUrl();
