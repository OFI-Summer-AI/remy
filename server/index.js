import { createServer } from 'http';
import { parse } from 'url';
import { sendJson } from './utils.js';
import { handleReviews } from './reviews.js';
import { handleSocial } from './social.js';

function handleRequest(req, res) {
  const { pathname, query } = parse(req.url, true);
  if (!pathname) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  if (handleReviews(req, res, pathname, query)) return;
  if (handleSocial(req, res, pathname, query)) return;
  return sendJson(res, 404, { error: 'Not found' });
}

const server = createServer(handleRequest);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
