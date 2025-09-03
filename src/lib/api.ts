/**
 * Temporary mocked API helpers.
 * TODO: Replace mock implementations with real API calls when backend is ready.
 */

import { format } from "date-fns";

export async function getReviews<T>(): Promise<T> {
  // const response = await fetch("/api/reviews");
  // if (!response.ok) {
  //   throw new Error("Failed to fetch reviews");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve({} as T);
}

export async function getSocialStats<T>(): Promise<T> {
  // const response = await fetch("/api/social");
  // if (!response.ok) {
  //   throw new Error("Failed to fetch social stats");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve({} as T);
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

export async function postSocialNow<T>(data: T): Promise<T> {
  // const response = await fetch("/api/social/post", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to publish social post");
  // }
  // return response.json() as Promise<T>;
  return Promise.resolve(data);
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

  const mockData: Record<string, unknown> = {
    Instagram: {
      platform: "Instagram",
      insights: {
        impressions: { total: sum(impressionsSeries), series: impressionsSeries },
        reach: { total: sum(reachSeries), series: reachSeries },
        engagement: { total: sum(engagementSeries), series: engagementSeries },
        saved: { total: sum(savedSeries), series: savedSeries },
        video_views: { total: sum(videoSeries), series: videoSeries },
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
