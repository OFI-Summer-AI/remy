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
