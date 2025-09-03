/**
 * Temporary mocked API helpers.
 * TODO: Replace mock implementations with real API calls when backend is ready.
 */

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

  const mockData: Record<string, unknown> = {
    Instagram: {
      platform: "Instagram",
      insights: {
        impressions: {
          total: 1420,
          series: [
            { date: "Mon", value: 200 },
            { date: "Tue", value: 240 },
            { date: "Wed", value: 260 },
            { date: "Thu", value: 180 },
            { date: "Fri", value: 220 },
            { date: "Sat", value: 160 },
            { date: "Sun", value: 160 },
          ],
        },
        reach: {
          total: 1200,
          series: [
            { date: "Mon", value: 180 },
            { date: "Tue", value: 190 },
            { date: "Wed", value: 210 },
            { date: "Thu", value: 160 },
            { date: "Fri", value: 190 },
            { date: "Sat", value: 140 },
            { date: "Sun", value: 130 },
          ],
        },
        engagement: {
          total: 325,
          series: [
            { date: "Mon", value: 45 },
            { date: "Tue", value: 52 },
            { date: "Wed", value: 60 },
            { date: "Thu", value: 40 },
            { date: "Fri", value: 55 },
            { date: "Sat", value: 35 },
            { date: "Sun", value: 38 },
          ],
        },
        saved: {
          total: 32,
          series: [
            { date: "Mon", value: 5 },
            { date: "Tue", value: 4 },
            { date: "Wed", value: 6 },
            { date: "Thu", value: 5 },
            { date: "Fri", value: 7 },
            { date: "Sat", value: 3 },
            { date: "Sun", value: 2 },
          ],
        },
        video_views: {
          total: 140,
          series: [
            { date: "Mon", value: 20 },
            { date: "Tue", value: 25 },
            { date: "Wed", value: 30 },
            { date: "Thu", value: 18 },
            { date: "Fri", value: 22 },
            { date: "Sat", value: 15 },
            { date: "Sun", value: 10 },
          ],
        },
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
