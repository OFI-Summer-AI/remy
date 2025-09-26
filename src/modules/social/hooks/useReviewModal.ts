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

  const generateReviewKey = useCallback((review: ReviewData, index: number): string => {
    return `${review.platform}-${review.customer_name}-${index}-${review.review_date}`;
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSuggestComment = useCallback(async (review: ReviewData, index: number) => {
    if (!platform) return;
    
    const reviewKey = generateReviewKey(review, index);
    
    try {
      await onSuggestComment(review.review, platform, reviewKey);
    } catch (error) {
      console.error('Error suggesting comment:', error);
    }
  }, [platform, generateReviewKey, onSuggestComment]);

  const setSuggestionResult = useCallback((reviewKey: string, comment: string) => {
    // This function is no longer needed as state is managed by parent
    console.log('Suggestion result received:', reviewKey, comment);
  }, []);

  const setSuggestionError = useCallback((reviewKey: string, error: string) => {
    // This function is no longer needed as state is managed by parent
    console.error('Suggestion error received:', reviewKey, error);
  }, []);

  const clearCommentSuggestion = useCallback((reviewKey: string) => {
    // This will be handled by the parent component
    console.log('Clear comment suggestion for:', reviewKey);
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