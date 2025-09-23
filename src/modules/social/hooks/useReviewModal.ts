import { useState, useCallback } from 'react';
import { Platform } from '../types/reviewTypes';

interface ReviewData {
  platform: Platform;
  customer_name: string;
  review_rate: number;
  review_date: string;
  review: string;
  review_link: string;
}

interface CommentSuggestionState {
  [key: string]: {
    loading?: boolean;
    error?: string;
    comment?: string;
  };
}

interface UseReviewModalProps {
  platform: Platform | null;
  reviews: ReviewData[];
  loading: boolean;
  error: string | null;
  onSuggestComment: (review: string, platform: string, reviewKey: string) => void;
}

export const useReviewModal = ({
  platform,
  reviews,
  loading,
  error,
  onSuggestComment,
}: UseReviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commentSuggestions, setCommentSuggestions] = useState<CommentSuggestionState>({});

  const generateReviewKey = useCallback((review: ReviewData, index: number): string => {
    return `${review.platform}-${review.customer_name}-${index}-${review.review_date}`;
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Clear all comment suggestions when modal closes
    setCommentSuggestions({});
  }, []);

  const handleSuggestComment = useCallback(async (review: ReviewData, index: number) => {
    if (!platform) return;
    
    const reviewKey = generateReviewKey(review, index);
    
    // Set loading state
    setCommentSuggestions(prev => ({
      ...prev,
      [reviewKey]: {
        ...prev[reviewKey],
        loading: true,
        error: undefined,
      }
    }));

    try {
      await onSuggestComment(review.review, platform, reviewKey);
    } catch (error) {
      // Handle error in the suggestion process
      setCommentSuggestions(prev => ({
        ...prev,
        [reviewKey]: {
          ...prev[reviewKey],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to generate suggestion',
        }
      }));
    }
  }, [platform, generateReviewKey, onSuggestComment]);

  const setSuggestionResult = useCallback((reviewKey: string, comment: string) => {
    setCommentSuggestions(prev => ({
      ...prev,
      [reviewKey]: {
        loading: false,
        error: undefined,
        comment,
      }
    }));
  }, []);

  const setSuggestionError = useCallback((reviewKey: string, error: string) => {
    setCommentSuggestions(prev => ({
      ...prev,
      [reviewKey]: {
        loading: false,
        error,
        comment: undefined,
      }
    }));
  }, []);

  const clearCommentSuggestion = useCallback((reviewKey: string) => {
    setCommentSuggestions(prev => {
      const newState = { ...prev };
      delete newState[reviewKey];
      return newState;
    });
  }, []);

  const openReviewLink = useCallback((link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  const hasReviews = reviews.length > 0;
  const displayTitle = platform ? `${platform} Reviews` : 'Reviews';

  return {
    isOpen,
    commentSuggestions,
    hasReviews,
    displayTitle,
    generateReviewKey,
    openModal,
    closeModal,
    handleSuggestComment,
    setSuggestionResult,
    setSuggestionError,
    clearCommentSuggestion,
    openReviewLink,
    copyToClipboard,
  };
};