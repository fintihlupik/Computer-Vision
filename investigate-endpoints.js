// Script to investigate the /files/ redirect and find correct media endpoints
const http = require('http');

const API_BASE = 'http://localhost:8001';

function makeRequestWithRedirect(path, followRedirect = true) {
  return new Promise((resolve) => {
    const req = http.request(`${API_BASE}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 307 && followRedirect && res.headers.location) {
          console.log(`   Redirect from ${path} to: ${res.headers.location}`);
          // Follow redirect
          makeRequestWithRedirect(res.headers.location.replace(API_BASE, ''), false)
            .then(resolve);
        } else {
          resolve({
            path: path,
            status: res.statusCode,
            data: data,
            headers: res.headers,
            redirect: res.headers.location
          });
        }
      });
    });
    
    req.on('error', (e) => {
      resolve({
        path: path,
        status: 'ERROR',
        error: e.message
      });
    });
    
    req.end();
  });
}

async function investigateFileEndpoints() {
  console.log('🔍 Investigando endpoints de archivos...\n');
  
  // Probar el endpoint /files/ que devolvió 307
  const result = await makeRequestWithRedirect('/files/');
  console.log(`/files/ - Status: ${result.status}`);
  if (result.redirect) {
    console.log(`   Redirects to: ${result.redirect}`);
  }
  
  // Probar diferentes variaciones del ID de archivo
  const fileId = 53;
  const testPaths = [
    `/files/${fileId}`,
    `/files/${fileId}/`,
    `/file/${fileId}`,
    `/download/${fileId}`,
    `/stream/${fileId}`,
    `/video/${fileId}/stream`,
    `/media/video/${fileId}`,
    `/api/files/${fileId}`,
    `/api/media/${fileId}`
  ];
  
  console.log('\n🧪 Probando variaciones de endpoints de medios:');
  
  for (const path of testPaths) {
    const result = await makeRequestWithRedirect(path);
    let status = '';
    
    if (result.status === 200) {
      status = '✅ 200 OK';
      if (result.headers['content-type']) {
        status += ` (${result.headers['content-type']})`;
      }
    } else if (result.status === 404) {
      status = '❌ 404 Not Found';
    } else if (result.status === 405) {
      status = '⚠️ 405 Method Not Allowed';
    } else if (result.status === 307) {
      status = `🔄 307 Redirect to: ${result.redirect}`;
    } else {
      status = `ℹ️ ${result.status}`;
    }
    
    console.log(`   ${path} - ${status}`);
  }
  
  // Buscar en la información del archivo si hay URLs de medios
  console.log('\n📊 Revisando file-info para buscar URLs de medios...');
  
  const fileInfoResult = await makeRequestWithRedirect(`/file-info/${fileId}`);
  if (fileInfoResult.status === 200) {
    try {
      const fileInfo = JSON.parse(fileInfoResult.data);
      console.log('   Storage info:');
      console.log(`     Bucket: ${fileInfo.storage?.bucket}`);
      console.log(`     Path: ${fileInfo.storage?.path}`);
      
      // Buscar si hay alguna URL directa en la respuesta
      const responseText = fileInfoResult.data;
      const urlMatches = responseText.match(/https?:\/\/[^\s"]+/g);
      if (urlMatches) {
        console.log('   URLs encontradas en file-info:');
        urlMatches.forEach(url => console.log(`     ${url}`));
      }
    } catch (e) {
      console.log('   Error parsing file-info response');
    }
  }
}

investigateFileEndpoints();
