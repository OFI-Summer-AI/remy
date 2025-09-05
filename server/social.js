import { sendJson } from './utils.js';

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

export function handleSocial(req, res, pathname, query) {
  if (req.method === 'GET' && pathname === '/api/social') {
    sendJson(res, 200, socialPlatforms);
    return true;
  }
  if (req.method === 'POST' && pathname === '/api/social/post') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { text, image } = JSON.parse(body || '{}');
      // TODO: post to real social API
      sendJson(res, 200, { success: true, text, image });
    });
    return true;
  }
  if (req.method === 'POST' && pathname === '/api/social/schedule') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { datetime, text, image } = JSON.parse(body || '{}');
      // TODO: schedule post via backend automation
      sendJson(res, 200, { success: true, scheduled: datetime, text, image });
    });
    return true;
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
      const account = {
        time_ranges: ['last_7_days', 'last_14_days', 'last_30_days', 'last_90_days'],
        accounts_reached: {
          reach: 1200,
          reached_audience: { followers: 800, non_followers: 400 },
          content_reach: { posts: 700, stories: 300, reels: 200, videos: 100, live: 50 },
          top_posts: [{ id: 'p1', type: 'post', accounts_reached: 400, impressions: 500, interactions: 50 }],
          top_stories: [{ id: 's1', type: 'story', accounts_reached: 200, impressions: 250, interactions: 30 }],
          impressions: 1500,
          profile_activity: {
            profile_visits: 100,
            website_taps: 20,
            address_taps: 5,
            call_button_taps: 2,
            email_button_taps: 3,
            text_button_taps: 1,
          },
        },
        accounts_engaged: {
          total_accounts_engaged: 600,
          engaged_audience: { followers: 400, non_followers: 200 },
          engager_demographics: {
            top_countries: ['US', 'CA'],
            top_cities: ['New York', 'Toronto'],
            age_ranges: ['18-24', '25-34'],
            gender_distribution: { male: 55, female: 45 },
          },
          content_interactions: {
            likes: 300,
            comments: 40,
            shares: 20,
            saves: 25,
            replies: 15,
          },
          top_posts: [{ id: 'p1', type: 'post', accounts_reached: 400, impressions: 500, interactions: 50 }],
          top_stories: [{ id: 's1', type: 'story', accounts_reached: 200, impressions: 250, interactions: 30 }],
          top_reels: [{ id: 'r1', type: 'reel', accounts_reached: 150, impressions: 200, interactions: 25 }],
          top_videos: [{ id: 'v1', type: 'video', accounts_reached: 100, impressions: 150, interactions: 20 }],
          top_live_videos: [{ id: 'l1', type: 'live', accounts_reached: 80, impressions: 120, interactions: 10 }],
        },
        total_followers: {
          follower_count: 5000,
          growth: { follows: 120, unfollows: 30, net: 90 },
          top_locations: { countries: ['US', 'CA'], cities: ['New York', 'Toronto'] },
          age_distribution: {
            overall: { '18-24': 40, '25-34': 35, '35-44': 15 },
            men: { '18-24': 20, '25-34': 15, '35-44': 5 },
            women: { '18-24': 20, '25-34': 20, '35-44': 10 },
          },
          gender_distribution: { male: 50, female: 48, other: 2 },
          active_times: {
            by_hour: [5,3,2,1,1,2,4,6,8,9,7,6,5,4,3,2,3,5,6,7,8,7,6,5],
            by_day: { Mon: 500, Tue: 550, Wed: 600, Thu: 580, Fri: 620, Sat: 700, Sun: 650 },
          },
        },
      };
      const content = {
        summary: {
          period: 'last_30_days',
          counts: { posts: 10, stories: 15, reels: 5, videos: 2, live: 1 },
          active_promotions: 1,
        },
        per_post: [
          {
            post_id: 'p1',
            accounts_reached: 400,
            content_interactions: { likes: 300, comments: 40, shares: 20, saves: 25 },
            profile_activity: {
              profile_visits: 50,
              website_taps: 10,
              address_taps: 2,
              call_button_taps: 1,
              email_button_taps: 1,
              text_button_taps: 0,
            },
            impressions: 500,
            reach_sources: { home: 300, hashtags: 100, profile: 80, other: 20 },
            promoted: false,
          },
        ],
        per_story: [
          {
            story_id: 's1',
            accounts_reached: 200,
            impressions: 250,
            taps_back: 10,
            taps_forward: 15,
            taps_next_story: 5,
            exits: 2,
            link_clicks: 3,
            replies: 4,
            profile_activity: {
              profile_visits: 20,
              website_taps: 5,
              address_taps: 1,
              call_button_taps: 0,
              email_button_taps: 0,
              text_button_taps: 0,
            },
          },
        ],
        per_reel: [
          {
            reel_id: 'r1',
            plays: 100,
            reach: 90,
            likes: 30,
            comments: 5,
            shares: 10,
            saves: 8,
          },
        ],
        per_video: [
          {
            video_id: 'v1',
            views: 150,
            avg_watch_percent: 65,
            content_interactions: { likes: 40, comments: 6, shares: 3, saves: 5 },
            profile_activity: {
              profile_visits: 20,
              website_taps: 4,
              address_taps: 1,
              call_button_taps: 0,
              email_button_taps: 1,
              text_button_taps: 0,
            },
          },
        ],
        per_live: [
          {
            live_id: 'l1',
            peak_viewers: 45,
            reach: 60,
            comments: 10,
            content_interactions: { likes: 25, comments: 10, shares: 3, saves: 2, replies: 5 },
          },
        ],
      };
      sendJson(res, 200, {
        platform,
        insights: {
          metrics: {
            impressions: { total: 1420, series: daily.map(d => ({ date: d.date, value: d.impressions })) },
            reach: { total: 1200, series: daily.map(d => ({ date: d.date, value: d.reach })) },
            engagement: { total: 325, series: daily.map(d => ({ date: d.date, value: d.engagement })) },
            saved: { total: 32, series: daily.map(d => ({ date: d.date, value: d.saved })) },
            video_views: { total: 140, series: daily.map(d => ({ date: d.date, value: d.video_views })) },
          },
          account,
          content,
        },
      });
      return true;
    }
    if (platform === 'Facebook') {
      sendJson(res, 200, {
        platform,
        insights: {
          impressions: { total: 2360 },
          reach: { total: 1805 },
          engagement: { total: 190 },
          shares: { total: 47 },
          clicks: { total: 128 },
        },
      });
      return true;
    }
    sendJson(res, 200, { platform, insights: { impressions: { total: 0 }, reach: { total: 0 } } });
    return true;
  }
  if (req.method === 'GET' && pathname === '/api/social/audience') {
    sendJson(res, 200, { platform: query.platform, audience: { age: 'unknown', location: 'unknown' } });
    return true;
  }
  if (req.method === 'POST' && pathname === '/api/social/describe') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { prompt } = JSON.parse(body || '{}');
      // TODO: integrate with caption generation service
      sendJson(res, 200, { description: `Generated description for: ${prompt}` });
    });
    return true;
  }
  if (req.method === 'GET' && pathname === '/api/social/hashtags') {
    // TODO: fetch real trending hashtags
    sendJson(res, 200, { hashtags: ['#trending', '#social', '#fun'] });
    return true;
  }
  return false;
}
