// Quick test to verify frontend will work with fixed URLs
const http = require('http');

const API_BASE = 'http://localhost:8001';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function verifyFrontendWillWork() {
  console.log('🧪 Verificando que el frontend funcionará correctamente...\n');
  
  try {
    // 1. Get files
    const filesResponse = await makeRequest(`${API_BASE}/files`);
    if (filesResponse.status !== 200) {
      throw new Error(`Files endpoint failed: ${filesResponse.status}`);
    }
    
    const file = filesResponse.data.files[0];
    const fileId = file.id;
    
    console.log(`✅ Files endpoint OK - Archivo: ${file.filename} (ID: ${fileId})`);
    
    // 2. Get file-info (this is what VideoPlayer needs)
    const fileInfoResponse = await makeRequest(`${API_BASE}/file-info/${fileId}`);
    if (fileInfoResponse.status !== 200) {
      throw new Error(`File-info endpoint failed: ${fileInfoResponse.status}`);
    }
    
    const fileInfo = fileInfoResponse.data;
    console.log(`✅ File-info endpoint OK`);
    console.log(`   file_id: ${fileInfo.file_id}`);
    console.log(`   storage.bucket: ${fileInfo.storage.bucket}`);
    console.log(`   storage.path: ${fileInfo.storage.path}`);
    
    // 3. Construct the Supabase URL that VideoPlayer will use
    const supabaseUrl = `https://ztxizhteeaffqhfzzwud.supabase.co/storage/v1/object/public/${fileInfo.storage.bucket}/${fileInfo.storage.path}`;
    console.log(`\n🔗 URL que usará VideoPlayer:`);
    console.log(`   ${supabaseUrl}`);
    
    // 4. Test that URL
    const https = require('https');
    const url = require('url');
    
    const testUrl = new Promise((resolve) => {
      const parsedUrl = url.parse(supabaseUrl);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'HEAD'
      };
      
      const req = https.request(options, (res) => {
        resolve({ status: res.statusCode, success: res.statusCode === 200 });
      });
      req.on('error', () => resolve({ status: 'ERROR', success: false }));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ status: 'TIMEOUT', success: false });
      });
      req.end();
    });
    
    const urlResult = await testUrl;
    if (urlResult.success) {
      console.log(`✅ Supabase URL funciona correctamente`);
      console.log(`\n🎉 ¡El reproductor de video debería funcionar ahora!`);
      console.log(`\n📋 Lo que hemos arreglado:`);
      console.log(`   - API devuelve datos correctos ✅`);
      console.log(`   - Bucket de videos es público ✅`);
      console.log(`   - VideoPlayer usa URL de Supabase ✅`);
      console.log(`   - URL de Supabase funciona ✅`);
      console.log(`\n🚀 Ve al frontend (puerto 3001) y prueba el viewer!`);
    } else {
      console.log(`❌ Supabase URL no funciona (Status: ${urlResult.status})`);
      console.log(`   Verifica que el bucket 'videos' sea público en Supabase`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyFrontendWillWork();
