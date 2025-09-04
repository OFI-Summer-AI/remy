/**
 * Temporary mocked API helpers.
 * TODO: Replace mock implementations with real API calls when backend is ready.
 */

import { format } from "date-fns";

export async function getReviews<T>(): Promise<T> {
  const mockReviews = [
    {
      platform: "TripAdvisor",
      rating: 4.3,
      totalReviews: 284,
      recentChange: "+12",
      trend: "up",
      color: "bg-green-500",
      recentReviews: [
        {
          author: "Sarah M.",
          rating: 5,
          text: "Amazing food and service! Will definitely come back.",
          date: "2 days ago",
        },
        {
          author: "John D.",
          rating: 4,
          text: "Great atmosphere, food was good but service was a bit slow.",
          date: "1 week ago",
        },
        {
          author: "Maria L.",
          rating: 5,
          text: "Perfect place for a romantic dinner. Highly recommended!",
          date: "1 week ago",
        },
      ],
      monthlyStats: { jan: 4.1, feb: 4.2, mar: 4.3 },
    },
    {
      platform: "Google Maps",
      rating: 4.1,
      totalReviews: 562,
      recentChange: "+8",
      trend: "up",
      color: "bg-blue-500",
      recentReviews: [
        {
          author: "Alex K.",
          rating: 4,
          text: "Good food, nice location. Parking can be difficult.",
          date: "3 days ago",
        },
        {
          author: "Emma R.",
          rating: 5,
          text: "Best pasta in town! Staff was very friendly.",
          date: "5 days ago",
        },
        {
          author: "Mike T.",
          rating: 3,
          text: "Food was okay, but prices are a bit high for the portion size.",
          date: "1 week ago",
        },
      ],
      monthlyStats: { jan: 3.9, feb: 4.0, mar: 4.1 },
    },
    {
      platform: "Yelp",
      rating: 3.9,
      totalReviews: 156,
      recentChange: "-3",
      trend: "down",
      color: "bg-red-500",
      recentReviews: [
        {
          author: "Lisa P.",
          rating: 2,
          text: "Food took too long to arrive and was cold when it did.",
          date: "1 day ago",
        },
        {
          author: "Tom W.",
          rating: 4,
          text: "Nice ambiance, good wine selection.",
          date: "4 days ago",
        },
        {
          author: "Rachel B.",
          rating: 5,
          text: "Excellent service and delicious food!",
          date: "6 days ago",
        },
      ],
      monthlyStats: { jan: 4.1, feb: 4.0, mar: 3.9 },
    },
  ];

  return Promise.resolve(mockReviews as T);
}

export async function getSocialStats<T>(): Promise<T> {
  const mockSocial = [
    {
      platform: "Instagram",
      followers: "12.3K",
      engagement: "4.5%",
      posts: 342,
      trend: "up",
      change: "+2.4%",
      recentPosts: [],
      demographics: { age1825: 40, age2635: 35, age3645: 15, age45plus: 10 },
    },
    {
      platform: "Facebook",
      followers: "8.7K",
      engagement: "3.2%",
      posts: 215,
      trend: "up",
      change: "+1.1%",
      recentPosts: [],
      demographics: { age1825: 30, age2635: 40, age3645: 20, age45plus: 10 },
    },
    {
      platform: "Twitter",
      followers: "3.1K",
      engagement: "2.8%",
      posts: 180,
      trend: "down",
      change: "-0.5%",
      recentPosts: [],
      demographics: { age1825: 50, age2635: 30, age3645: 15, age45plus: 5 },
    },
  ];

  return Promise.resolve(mockSocial as T);
}

export async function scheduleSocialPost<T>(data: T): Promise<T> {
  // const response = await fetch("/api/social/schedule", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to schedule social post");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve(data);
}

export async function postSocialNow(data: {
  file: File;
  description: string;
  tags?: string;
}): Promise<unknown> {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!url) throw new Error("Missing VITE_N8N_WEBHOOK_URL");

  const form = new FormData();
  // n8n webhook expects the binary under the "file" field to mirror the
  // Python `requests` example used for testing.
  form.append("file", data.file, data.file.name);
  form.append("description", data.description);
  if (data.tags) form.append("tags", data.tags);

  // Direct call to n8n webhook. `no-cors` lets the request go through even if
  // the deployment omits CORS headers. Remove once a backend proxy exists.
  const res = await fetch(url, {
    method: "POST",
    body: form,
    mode: "no-cors",
  });

  // Opaque responses return status 0 and `ok` is false, but the request is
  // still delivered to n8n. Treat that as success for now.
  if (!res.ok && res.type !== "opaque") {
    throw new Error("Failed to publish social post");
  }

  return {};
}

export async function viewAllReviews<T>(platform: string): Promise<T> {
  // const response = await fetch(
  //   `/api/reviews/all?platform=${encodeURIComponent(platform)}`
  // );
  // if (!response.ok) {
  //   throw new Error("Failed to load all reviews");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve({} as T);
}

export async function respondToReviews<T>(platform: string): Promise<T> {
  // const response = await fetch("/api/reviews/respond", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ platform }),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to respond to reviews");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve({} as T);
}

export async function viewSocialInsights<T>(platform: string): Promise<T> {
  // const response = await fetch(
  //   `/api/social/insights?platform=${encodeURIComponent(platform)}`
  // );
  // if (!response.ok) {
  //   throw new Error("Failed to load social insights");
  // }
  // return response.json() as Promise<T>;

  const makeSeries = (base: number[]) => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - i));
      return {
        date: format(date, "MMM d"),
        value: base[i % base.length],
      };
    });
  };

  const impressionsSeries = makeSeries([200, 240, 260, 180, 220, 160, 160]);
  const reachSeries = makeSeries([180, 190, 210, 160, 190, 140, 130]);
  const engagementSeries = makeSeries([45, 52, 60, 40, 55, 35, 38]);
  const savedSeries = makeSeries([5, 4, 6, 5, 7, 3, 2]);
  const videoSeries = makeSeries([20, 25, 30, 18, 22, 15, 10]);

  const sum = (series: { value: number }[]) =>
    series.reduce((acc, cur) => acc + cur.value, 0);

  // Mock account-level breakdowns (mirrors server/index.js)
  const account = {
    time_ranges: [
      "last_7_days",
      "last_14_days",
      "last_30_days",
      "last_90_days",
    ] as const,
    accounts_reached: {
      reach: 1200,
      reached_audience: { followers: 800, non_followers: 400 },
      content_reach: { posts: 700, stories: 300, reels: 200, videos: 100, live: 50 },
      top_posts: [
        {
          id: "p1",
          type: "post",
          accounts_reached: 400,
          impressions: 500,
          interactions: 50,
        },
      ],
      top_stories: [
        {
          id: "s1",
          type: "story",
          accounts_reached: 200,
          impressions: 250,
          interactions: 30,
        },
      ],
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
        top_countries: ["US", "CA"],
        top_cities: ["New York", "Toronto"],
        age_ranges: ["18-24", "25-34"],
        gender_distribution: { male: 55, female: 45 },
      },
      content_interactions: {
        likes: 300,
        comments: 40,
        shares: 20,
        saves: 25,
        replies: 15,
      },
      top_posts: [
        {
          id: "p1",
          type: "post",
          accounts_reached: 400,
          impressions: 500,
          interactions: 50,
        },
      ],
      top_stories: [
        {
          id: "s1",
          type: "story",
          accounts_reached: 200,
          impressions: 250,
          interactions: 30,
        },
      ],
      top_reels: [
        {
          id: "r1",
          type: "reel",
          accounts_reached: 150,
          impressions: 200,
          interactions: 25,
        },
      ],
      top_videos: [
        {
          id: "v1",
          type: "video",
          accounts_reached: 100,
          impressions: 150,
          interactions: 20,
        },
      ],
      top_live_videos: [
        {
          id: "l1",
          type: "live",
          accounts_reached: 80,
          impressions: 120,
          interactions: 10,
        },
      ],
    },
    total_followers: {
      follower_count: 5000,
      growth: { follows: 120, unfollows: 30, net: 90 },
      top_locations: { countries: ["US", "CA"], cities: ["New York", "Toronto"] },
      age_distribution: {
        overall: { "18-24": 40, "25-34": 35, "35-44": 15 },
        men: { "18-24": 20, "25-34": 15, "35-44": 5 },
        women: { "18-24": 20, "25-34": 20, "35-44": 10 },
      },
      gender_distribution: { male: 50, female: 48, other: 2 },
      active_times: {
        by_hour: [
          5, 3, 2, 1, 1, 2, 4, 6, 8, 9, 7, 6, 5, 4, 3, 2, 3, 5, 6, 7, 8, 7, 6,
          5,
        ],
        by_day: {
          Mon: 500,
          Tue: 550,
          Wed: 600,
          Thu: 580,
          Fri: 620,
          Sat: 700,
          Sun: 650,
        },
      },
    },
  };

  // Mock content summary and per-item insights
  const content = {
    summary: {
      period: "last_30_days" as const,
      counts: { posts: 10, stories: 15, reels: 5, videos: 2, live: 1 },
      active_promotions: 1,
    },
    per_post: [
      {
        post_id: "p1",
        views: 500,
        accounts_reached: 400,
        reach: 400,
        content_interactions: {
          likes: 300,
          comments: 40,
          shares: 20,
          saves: 25,
        },
        profile_activity: {
          profile_visits: 50,
          website_taps: 10,
          address_taps: 2,
          call_button_taps: 1,
          email_button_taps: 1,
          text_button_taps: 0,
        },
        impressions_legacy: 500,
        reach_sources: { home: 300, hashtags: 100, profile: 80, other: 20 },
        promoted: false,
      },
    ],
    per_story: [
      {
        story_id: "s1",
        views: 250,
        accounts_reached: 200,
        impressions_legacy: 250,
        taps_back: 10,
        taps_forward: 15,
        taps_next_story: 5,
        exits: 2,
        link_clicks: 3,
        replies: 4,
        navigation_breakdown: {
          TAP_FORWARD: 15,
          TAP_BACK: 10,
          TAP_EXIT: 2,
          SWIPE_FORWARD: 5,
        },
        navigation_total: 32,
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
        reel_id: "r1",
        views: 100,
        reach: 90,
        likes: 30,
        comments: 5,
        shares: 10,
        saves: 8,
        ig_reels_avg_watch_time: 12,
        ig_reels_video_view_total_time: 1200,
      },
    ],
    per_video: [
      {
        video_id: "v1",
        views: 150,
        avg_watch_percent: 65,
        content_interactions: {
          likes: 40,
          comments: 6,
          shares: 3,
          saves: 5,
        },
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
        live_id: "l1",
        peak_viewers: 45,
        reach: 60,
        comments: 10,
        content_interactions: {
          likes: 25,
          comments: 10,
          shares: 3,
          saves: 2,
          replies: 5,
        },
      },
    ],
  };

  const mockData: Record<string, unknown> = {
    Instagram: {
      platform: "Instagram",
      insights: {
        metrics: {
          impressions: { total: sum(impressionsSeries), series: impressionsSeries },
          reach: { total: sum(reachSeries), series: reachSeries },
          engagement: { total: sum(engagementSeries), series: engagementSeries },
          saved: { total: sum(savedSeries), series: savedSeries },
          video_views: { total: sum(videoSeries), series: videoSeries },
        },
        account,
        content,
      },
    },
    Facebook: {
      platform: "Facebook",
      insights: {
        impressions: { total: 2360 },
        reach: { total: 1805 },
        engagement: { total: 190 },
        shares: { total: 47 },
        clicks: { total: 128 },
      },
    },
  };

  return Promise.resolve(mockData[platform] as T);
}

export async function manageSocialAudience<T>(platform: string): Promise<T> {
  // const response = await fetch(
  //   `/api/social/audience?platform=${encodeURIComponent(platform)}`
  // );
  // if (!response.ok) {
  //   throw new Error("Failed to manage audience");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve({} as T);
}

export async function generateSocialDescription<T>(data: {
  prompt: string;
}): Promise<T> {
  // const response = await fetch("/api/social/describe", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to generate description");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve({} as T);
}

export async function getTrendingHashtags<T>(): Promise<T> {
  // const response = await fetch("/api/social/hashtags");
  // if (!response.ok) {
  //   throw new Error("Failed to fetch trending hashtags");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve({} as T);
}
