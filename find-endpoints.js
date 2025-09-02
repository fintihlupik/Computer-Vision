// Script to find available API endpoints
const http = require('http');

const API_BASE = 'http://localhost:8001';

function makeRequest(path) {
  return new Promise((resolve) => {
    const req = http.request(`${API_BASE}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          path: path,
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
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

async function findMediaEndpoints() {
  console.log('🔍 Buscando endpoints de medios disponibles...\n');
  
  // Lista de posibles endpoints para medios
  const possibleEndpoints = [
    '/docs',
    '/openapi.json',
    '/redoc',
    '/video/53',
    '/image/53', 
    '/media/53',
    '/files/53/download',
    '/files/53/stream',
    '/storage/videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4',
    '/static/videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4',
    '/uploads/videos/44d7aea4-b979-4410-a827-1ae3ee9a01e2/test4.mp4',
    '/'
  ];
  
  for (const endpoint of possibleEndpoints) {
    const result = await makeRequest(endpoint);
    let status = '';
    
    if (result.status === 200) {
      status = '✅ 200 OK';
    } else if (result.status === 404) {
      status = '❌ 404 Not Found';
    } else if (result.status === 405) {
      status = '⚠️ 405 Method Not Allowed';
    } else if (result.status === 'ERROR') {
      status = `❌ ERROR: ${result.error}`;
    } else {
      status = `ℹ️ ${result.status}`;
    }
    
    console.log(`${endpoint} - ${status}`);
    
    // Si encontramos un endpoint que funciona, mostrar más detalles
    if (result.status === 200 && endpoint.includes('docs')) {
      console.log(`   📄 Documentation available at: ${API_BASE}${endpoint}`);
    }
  }
  
  console.log('\n📋 Verificando si hay algún endpoint de archivos estáticos...');
  
  // Probar algunos patrones comunes de archivos estáticos
  const staticPatterns = [
    '/static/',
    '/media/',
    '/uploads/',
    '/files/',
    '/assets/'
  ];
  
  for (const pattern of staticPatterns) {
    const result = await makeRequest(pattern);
    if (result.status !== 404) {
      console.log(`   ${pattern} - Status: ${result.status}`);
    }
  }
}

findMediaEndpoints();
