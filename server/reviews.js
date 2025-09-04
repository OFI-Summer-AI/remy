import { sendJson } from './utils.js';

const reviewPlatforms = [
  {
    platform: 'TripAdvisor',
    rating: 4.3,
    totalReviews: 284,
    recentChange: '+12',
    trend: 'up',
    color: 'bg-green-500',
    recentReviews: [
      { author: 'Sarah M.', rating: 5, text: 'Amazing food and service! Will definitely come back.', date: '2 days ago' },
      { author: 'John D.', rating: 4, text: 'Great atmosphere, food was good but service was a bit slow.', date: '1 week ago' },
      { author: 'Maria L.', rating: 5, text: 'Perfect place for a romantic dinner. Highly recommended!', date: '1 week ago' }
    ],
    monthlyStats: { jan: 4.1, feb: 4.2, mar: 4.3 }
  },
  {
    platform: 'Google Maps',
    rating: 4.1,
    totalReviews: 562,
    recentChange: '+8',
    trend: 'up',
    color: 'bg-blue-500',
    recentReviews: [
      { author: 'Alex K.', rating: 4, text: 'Good food, nice location. Parking can be difficult.', date: '3 days ago' },
      { author: 'Emma R.', rating: 5, text: 'Best pasta in town! Staff was very friendly.', date: '5 days ago' },
      { author: 'Mike T.', rating: 3, text: 'Food was okay, but prices are a bit high for the portion size.', date: '1 week ago' }
    ],
    monthlyStats: { jan: 3.9, feb: 4.0, mar: 4.1 }
  },
  {
    platform: 'Yelp',
    rating: 3.9,
    totalReviews: 156,
    recentChange: '-3',
    trend: 'down',
    color: 'bg-red-500',
    recentReviews: [
      { author: 'Lisa P.', rating: 2, text: 'Food took too long to arrive and was cold when it did.', date: '1 day ago' },
      { author: 'Tom W.', rating: 4, text: 'Nice ambiance, good wine selection.', date: '4 days ago' },
      { author: 'Rachel B.', rating: 5, text: 'Excellent service and delicious food!', date: '6 days ago' }
    ],
    monthlyStats: { jan: 4.1, feb: 4.0, mar: 3.9 }
  }
];

const allReviewMap = {
  TripAdvisor: reviewPlatforms[0].recentReviews,
  'Google Maps': reviewPlatforms[1].recentReviews,
  Yelp: reviewPlatforms[2].recentReviews
};

export function handleReviews(req, res, pathname, query) {
  if (req.method === 'GET' && pathname === '/api/reviews') {
    sendJson(res, 200, reviewPlatforms);
    return true;
  }
  if (req.method === 'GET' && pathname === '/api/reviews/all') {
    const reviews = allReviewMap[query.platform] || [];
    sendJson(res, 200, { platform: query.platform, reviews });
    return true;
  }
  if (req.method === 'POST' && pathname === '/api/reviews/respond') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { platform } = JSON.parse(body || '{}');
      // TODO: replace with real review response integration
      sendJson(res, 200, { success: true, platform });
    });
    return true;
  }
  return false;
}
