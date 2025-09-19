// API service for reviews functionality

import { Platform, ReviewData, SuggestedComment, ReviewRequestBody } from '../types/reviews';

const FETCH_REVIEWS_URL = 'https://n8n.sofiatechnology.ai/webhook/af7a38f8-ac04-4582-8fe5-a8cf318e8eb2';
const SUGGEST_COMMENT_URL = 'https://n8n.sofiatechnology.ai/webhook/93e945b3-bc99-4765-ae45-00a33b7240d4';
const BUSINESS_NAME = 'El Tío Bigotes';

class ReviewService {
  private async makePostRequest<T>(url: string, body: ReviewRequestBody): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during the API request');
    }
  }

  private async makeGetRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during the API request');
    }
  }

  async fetchReviews(platform: Platform): Promise<ReviewData[]> {
    try {
      // Build URL with platform as query parameter
      const url = `${FETCH_REVIEWS_URL}?platform=${encodeURIComponent(platform)}`;
      const data = await this.makeGetRequest<ReviewData[]>(url);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error(`Failed to fetch reviews for ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async suggestComment(review: string, platform: Platform): Promise<string> {
    const requestBody: ReviewRequestBody = {
      review,
      platform,
      business_name: BUSINESS_NAME,
    };

    try {
      const data = await this.makePostRequest<SuggestedComment>(SUGGEST_COMMENT_URL, requestBody);
      return data.Response;
    } catch (error) {
      throw new Error(`Failed to generate comment suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const reviewService = new ReviewService();