
// Types and interfaces for reviews functionality

export type Platform = 'GoogleMaps' | 'Yelp' | 'TripAdvisor';

export interface ReviewData {
  platform: Platform;
  review: string;
  customer_name: string;
  review_date: string;
  review_rate: number;
  review_link: string;
}

export interface SuggestedComment {
  Response: string;
}

export interface ReviewRequestBody {
  review: string;
  platform: Platform;
  business_name: string;
}

export interface ReviewsState {
  reviews: ReviewData[];
  loading: boolean;
  error: string | null;
}

export interface CommentSuggestionState {
  [reviewKey: string]: {
    loading: boolean;
    comment: string | null;
    error: string | null;
  };
}