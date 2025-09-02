import { createServer } from 'http';
import { parse } from 'url';

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function handleRequest(req, res) {
  const { pathname, query } = parse(req.url, true);
  if (!pathname) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  if (req.method === 'GET' && pathname === '/api/reviews') {
    return sendJson(res, 200, { reviews: [] });
  }
  if (req.method === 'GET' && pathname === '/api/reviews/all') {
    return sendJson(res, 200, { platform: query.platform, reviews: [] });
  }
  if (req.method === 'POST' && pathname === '/api/reviews/respond') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { platform } = JSON.parse(body || '{}');
      sendJson(res, 200, { success: true, platform });
    });
    return;
  }
  if (req.method === 'GET' && pathname === '/api/social') {
    return sendJson(res, 200, { followers: 0, engagement: 0, posts: 0 });
  }
  if (req.method === 'POST' && pathname === '/api/social/post') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { text, image } = JSON.parse(body || '{}');
      sendJson(res, 200, { success: true, text, image });
    });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/social/schedule') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { datetime, text, image } = JSON.parse(body || '{}');
      sendJson(res, 200, { success: true, scheduled: datetime, text, image });
    });
    return;
  }
  if (req.method === 'GET' && pathname === '/api/social/insights') {
    return sendJson(res, 200, { platform: query.platform, insights: { impressions: 0, clicks: 0 } });
  }
  if (req.method === 'GET' && pathname === '/api/social/audience') {
    return sendJson(res, 200, { platform: query.platform, audience: { age: 'unknown', location: 'unknown' } });
  }
  if (req.method === 'POST' && pathname === '/api/social/describe') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { prompt } = JSON.parse(body || '{}');
      sendJson(res, 200, { description: `Generated description for: ${prompt}` });
    });
    return;
  }
  if (req.method === 'GET' && pathname === '/api/social/hashtags') {
    return sendJson(res, 200, { hashtags: ['#trending', '#social', '#fun'] });
  }
  return sendJson(res, 404, { error: 'Not found' });
}

const server = createServer(handleRequest);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
