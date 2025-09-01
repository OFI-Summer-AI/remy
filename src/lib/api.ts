export async function getReviews<T>(): Promise<T> {
  const response = await fetch("/api/reviews");
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  return response.json() as Promise<T>;
}

export async function getSocialStats<T>(): Promise<T> {
  const response = await fetch("/api/social");
  if (!response.ok) {
    throw new Error("Failed to fetch social stats");
  }
  return response.json() as Promise<T>;
}

export async function scheduleSocialPost<T>(data: T): Promise<T> {
  const response = await fetch("/api/social/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to schedule social post");
  }
  return response.json() as Promise<T>;
}

export async function postSocialNow<T>(data: T): Promise<T> {
  const response = await fetch("/api/social/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to publish social post");
  }
  return response.json() as Promise<T>;
}

export async function viewAllReviews<T>(platform: string): Promise<T> {
  const response = await fetch(
    `/api/reviews/all?platform=${encodeURIComponent(platform)}`
  );
  if (!response.ok) {
    throw new Error("Failed to load all reviews");
  }
  return response.json() as Promise<T>;
}

export async function respondToReviews<T>(platform: string): Promise<T> {
  const response = await fetch("/api/reviews/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform }),
  });
  if (!response.ok) {
    throw new Error("Failed to respond to reviews");
  }
  return response.json() as Promise<T>;
}

export async function viewSocialInsights<T>(platform: string): Promise<T> {
  const response = await fetch(
    `/api/social/insights?platform=${encodeURIComponent(platform)}`
  );
  if (!response.ok) {
    throw new Error("Failed to load social insights");
  }
  return response.json() as Promise<T>;
}

export async function manageSocialAudience<T>(platform: string): Promise<T> {
  const response = await fetch(
    `/api/social/audience?platform=${encodeURIComponent(platform)}`
  );
  if (!response.ok) {
    throw new Error("Failed to manage audience");
  }
  return response.json() as Promise<T>;
}
