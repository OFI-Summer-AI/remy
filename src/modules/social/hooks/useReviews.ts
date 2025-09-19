
// Custom hook for managing reviews state and API calls

import { useState, useCallback } from 'react';
import { Platform, ReviewData, ReviewsState, CommentSuggestionState } from '../types/reviewTypes';
import { reviewService } from '../services/reviewService';

export const useReviews = () => {
  const [reviewsState, setReviewsState] = useState<ReviewsState>({
    reviews: [],
    loading: false,
    error: null,
  });

  const [commentSuggestions, setCommentSuggestions] = useState<CommentSuggestionState>({});

  const fetchReviews = useCallback(async (platform: Platform) => {
    setReviewsState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const reviews = await reviewService.fetchReviews(platform);
      setReviewsState({
        reviews,
        loading: false,
        error: null,
      });
    } catch (error) {
      setReviewsState({
        reviews: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
      });
    }
  }, []);

  const suggestComment = useCallback(async (review: string, platform: Platform, reviewKey: string) => {
    setCommentSuggestions(prev => ({
      ...prev,
      [reviewKey]: {
        loading: true,
        comment: null,
        error: null,
      },
    }));

    try {
      const comment = await reviewService.suggestComment(review, platform);
      setCommentSuggestions(prev => ({
        ...prev,
        [reviewKey]: {
          loading: false,
          comment,
          error: null,
        },
      }));
    } catch (error) {
      setCommentSuggestions(prev => ({
        ...prev,
        [reviewKey]: {
          loading: false,
          comment: null,
          error: error instanceof Error ? error.message : 'Failed to generate comment suggestion',
        },
      }));
    }
  }, []);

  const clearCommentSuggestion = useCallback((reviewKey: string) => {
    setCommentSuggestions(prev => {
      const newState = { ...prev };
      delete newState[reviewKey];
      return newState;
    });
  }, []);

  const clearReviews = useCallback(() => {
    setReviewsState({
      reviews: [],
      loading: false,
      error: null,
    });
    setCommentSuggestions({});
  }, []);

  return {
    reviewsState,
    commentSuggestions,
    fetchReviews,
    suggestComment,
    clearCommentSuggestion,
    clearReviews,
  };
};