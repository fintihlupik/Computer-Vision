// Test Supabase video URLs directly
const http = require('https');
const url = require('url');

function testSupabaseUrl(supabaseUrl) {
  return new Promise((resolve) => {
    const parsedUrl = url.parse(supabaseUrl);
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    const req = http.request(options, (res) => {
      resolve({
        url: supabaseUrl,
        status: res.statusCode,
        headers: res.headers,
        success: res.statusCode === 200
      });
    });
    
    req.on('error', (e) => {
      resolve({
        url: supabaseUrl,
        status: 'ERROR',
        error: e.message,
        success: false
      });
    });
    
    req.setTimeout(60000, () => {
      req.destroy();
      resolve({
        url: supabaseUrl,
        status: 'TIMEOUT',
        error: 'Request timeout',
        success: false
      });
    });
    
    req.end();
  });
}

async function testVideoUrls() {
  // Based on the pattern from frame captures, construct the video URL
  const supabaseBaseUrl = 'https://ztxizhteeaffqhfzzwud.supabase.co/storage/v1/object/public';
  const videoPath = 'videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4';
  
  const urlsToTest = [
    `${supabaseBaseUrl}/videos/${videoPath}`,
    `${supabaseBaseUrl}/videos/videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4`,
    `${supabaseBaseUrl}/${videoPath}`,
    // Test with query parameter like frame captures
    `${supabaseBaseUrl}/videos/${videoPath}?`,
    `${supabaseBaseUrl}/videos/videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4?`
  ];
  
  console.log('🧪 Testing Supabase Video URLs...\n');
  
  for (const testUrl of urlsToTest) {
    console.log(`🔗 Testing: ${testUrl}`);
    const result = await testSupabaseUrl(testUrl);
    
    const status = result.success ? '✅' : '❌';
    console.log(`   ${status} Status: ${result.status}`);
    
    if (result.success && result.headers) {
      console.log(`   Content-Type: ${result.headers['content-type'] || 'Not specified'}`);
      console.log(`   Content-Length: ${result.headers['content-length'] || 'Not specified'}`);
    } else if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  }
  
  // Also test a known working frame capture URL to compare
  console.log('📸 Testing known working frame capture URL for comparison:');
  const frameUrl = 'https://ztxizhteeaffqhfzzwud.supabase.co/storage/v1/object/public/images/frames/44d7aea4-b979-4410-a827-1ae3ee9a01e2/frame_000001.jpg?';
  const frameResult = await testSupabaseUrl(frameUrl);
  const frameStatus = frameResult.success ? '✅' : '❌';
  console.log(`   ${frameStatus} ${frameUrl}`);
  console.log(`   Status: ${frameResult.status}`);
}

testVideoUrls();
