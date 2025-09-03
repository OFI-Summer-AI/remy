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
  'TripAdvisor': reviewPlatforms[0].recentReviews,
  'Google Maps': reviewPlatforms[1].recentReviews,
  'Yelp': reviewPlatforms[2].recentReviews
};

const socialPlatforms = [
  {
    platform: 'Instagram',
    followers: '12.3K',
    engagement: '4.2%',
    posts: 42,
    trend: 'up',
    change: '+2.1%',
    recentPosts: [
      { image: '🍝', caption: 'Fresh pasta made daily! #PastaLovers', likes: 245, comments: 18, date: '2 days ago' },
      { image: '🍷', caption: 'Wine night specials every Friday', likes: 156, comments: 12, date: '4 days ago' },
      { image: '👨‍🍳', caption: 'Meet our head chef Marco!', likes: 312, comments: 24, date: '1 week ago' }
    ],
    demographics: { age1825: 25, age2635: 35, age3645: 28, age45plus: 12 }
  },
  {
    platform: 'Facebook',
    followers: '8.7K',
    engagement: '3.8%',
    posts: 18,
    trend: 'up',
    change: '+1.4%',
    recentPosts: [
      { image: '🎉', caption: 'Celebrating 5 years in business!', likes: 189, comments: 34, date: '3 days ago' },
      { image: '🥗', caption: 'New summer menu now available', likes: 123, comments: 15, date: '1 week ago' },
      { image: '📅', caption: "Book your table for Mother's Day", likes: 98, comments: 8, date: '1 week ago' }
    ],
    demographics: { age1825: 15, age2635: 30, age3645: 35, age45plus: 20 }
  },
  {
    platform: 'Twitter',
    followers: '3.2K',
    engagement: '2.1%',
    posts: 24,
    trend: 'down',
    change: '-0.3%',
    recentPosts: [
      { image: '☕', caption: 'Perfect morning coffee to start your day right', likes: 45, comments: 6, date: '1 day ago' },
      { image: '🍰', caption: 'Try our new dessert menu!', likes: 32, comments: 4, date: '3 days ago' },
      { image: '🎵', caption: 'Live music every Saturday night', likes: 28, comments: 3, date: '5 days ago' }
    ],
    demographics: { age1825: 40, age2635: 35, age3645: 20, age45plus: 5 }
  }
];

function handleRequest(req, res) {
  const { pathname, query } = parse(req.url, true);
  if (!pathname) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  if (req.method === 'GET' && pathname === '/api/reviews') {
    return sendJson(res, 200, reviewPlatforms);
  }
  if (req.method === 'GET' && pathname === '/api/reviews/all') {
    const reviews = allReviewMap[query.platform] || [];
    return sendJson(res, 200, { platform: query.platform, reviews });
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
    return sendJson(res, 200, socialPlatforms);
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
    const platform = query.platform;
    if (platform === 'Instagram') {
      const daily = [
        { date: 'Mon', impressions: 200, reach: 180, engagement: 45, saved: 5, video_views: 20 },
        { date: 'Tue', impressions: 240, reach: 190, engagement: 52, saved: 4, video_views: 25 },
        { date: 'Wed', impressions: 260, reach: 210, engagement: 60, saved: 6, video_views: 30 },
        { date: 'Thu', impressions: 180, reach: 160, engagement: 40, saved: 5, video_views: 18 },
        { date: 'Fri', impressions: 220, reach: 190, engagement: 55, saved: 7, video_views: 22 },
        { date: 'Sat', impressions: 160, reach: 140, engagement: 35, saved: 3, video_views: 15 },
        { date: 'Sun', impressions: 160, reach: 130, engagement: 38, saved: 2, video_views: 10 },
      ];
      return sendJson(res, 200, {
        platform,
        insights: {
          impressions: {
            total: 1420,
            series: daily.map(d => ({ date: d.date, value: d.impressions })),
          },
          reach: {
            total: 1200,
            series: daily.map(d => ({ date: d.date, value: d.reach })),
          },
          engagement: {
            total: 325,
            series: daily.map(d => ({ date: d.date, value: d.engagement })),
          },
          saved: {
            total: 32,
            series: daily.map(d => ({ date: d.date, value: d.saved })),
          },
          video_views: {
            total: 140,
            series: daily.map(d => ({ date: d.date, value: d.video_views })),
          },
        },
      });
    }
    if (platform === 'Facebook') {
      return sendJson(res, 200, {
        platform,
        insights: {
          impressions: { total: 2360 },
          reach: { total: 1805 },
          engagement: { total: 190 },
          shares: { total: 47 },
          clicks: { total: 128 },
        },
      });
    }
    return sendJson(res, 200, {
      platform,
      insights: {
        impressions: { total: 0 },
        reach: { total: 0 },
      },
    });
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
