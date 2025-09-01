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
