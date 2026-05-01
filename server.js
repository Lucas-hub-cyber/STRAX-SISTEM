const http = require('http');
const fs = require('fs');
const { handleAnalyze } = require('./src/api/analyzeRoute');
const { handleEvaluate } = require('./src/api/evaluate');

if (fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}

const PORT = Number(process.env.PORT || 3001);
const ALLOWED_ORIGIN = 'http://localhost:3000';

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

function sendJson(response, statusCode, payload) {
  setCorsHeaders(response);
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'OPTIONS') {
    setCorsHeaders(response);
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/evaluate') {
    handleEvaluate(request, response);
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/analyze') {
    handleAnalyze(request, response);
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/') {
    sendJson(response, 200, {
      status: 'ok',
      service: 'strax-engine',
      mode: 'backend-only',
      endpoints: {
        health: '/health',
        analyze: '/analyze',
        evaluate: '/evaluate'
      },
      landing: 'http://localhost:3000'
    });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/health') {
    sendJson(response, 200, {
      status: 'ok',
      service: 'strax-system',
      timestamp: new Date().toISOString()
    });
    return;
  }

  sendJson(response, 404, {
    error: 'Not found',
    message: 'Usa GET /, GET /health, POST /analyze o POST /evaluate. La interfaz principal vive en http://localhost:3000'
  });
});

server.listen(PORT, () => {
  console.log(`STRAX system activo en http://localhost:${PORT}`);
});
