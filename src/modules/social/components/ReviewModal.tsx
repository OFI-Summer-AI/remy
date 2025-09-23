import React, { useCallback, useState } from 'react';
import { Star, ExternalLink, MessageSquare, Loader2, AlertCircle, X, Copy, Check } from 'lucide-react';
import { cn } from "@/shared/lib/utils";
import { useReviewModal } from '../hooks/useReviewModal';
import { Platform } from '../types/reviewTypes';


interface ReviewData {
  platform: Platform;
  customer_name: string;
  review_rate: number;
  review_date: string;
  review: string;
  review_link: string;
}

interface ReviewModalProps {
  platform: Platform;
  isOpen: boolean;
  onClose: () => void;
  reviews: ReviewData[];
  loading: boolean;
  error: string | null;
  onSuggestComment: (review: string, platform: string, reviewKey: string) => void;
  onSuggestionResult?: (reviewKey: string, comment: string) => void;
  onSuggestionError?: (reviewKey: string, error: string) => void;
}

const orangePalette = {
  primary: "#ff7a00",
  secondary: "#ff9d3d",
  tertiary: "#ffb26b", 
  quaternary: "#ffc69a",
  light: "#ffe0c7"
} as const;

const ReviewModal: React.FC<ReviewModalProps> = ({
  platform,
  isOpen,
  onClose,
  reviews,
  loading,
  error,
  onSuggestComment,
  onSuggestionResult,
  onSuggestionError,
}) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  const {
    commentSuggestions,
    hasReviews,
    displayTitle,
    generateReviewKey,
    handleSuggestComment,
    setSuggestionResult,
    setSuggestionError,
    clearCommentSuggestion,
    openReviewLink,
    copyToClipboard,
  } = useReviewModal({
    platform,
    reviews,
    loading,
    error,
    onSuggestComment: async (review: string, platformName: Platform, reviewKey: string) => {
      try {
        await onSuggestComment(review, platformName, reviewKey);
        // If parent component provides result handling, use it
        if (onSuggestionResult) {
          // This would be called by parent when suggestion is ready
          // For now, we'll handle it through the parent component
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestion';
        setSuggestionError(reviewKey, errorMessage);
        onSuggestionError?.(reviewKey, errorMessage);
      }
    },
  });

  const handleCopyToClipboard = useCallback(async (text: string, reviewKey: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedStates(prev => ({ ...prev, [reviewKey]: true }));
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [reviewKey]: false }));
      }, 2000);
    }
  }, [copyToClipboard]);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating
            ? "text-primary fill-current"
            : "text-muted-foreground/30"
        )}
        style={{ color: i < rating ? orangePalette.primary : undefined }}
      />
    ));
  }, []);

  const getRatingColor = useCallback((rating: number): string => {
    if (rating >= 4) return 'text-primary';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-destructive';
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, []);

  const getCustomerInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="relative w-full max-w-5xl mx-4 bg-card rounded-2xl shadow-2xl border overflow-hidden max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="review-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" style={{ color: orangePalette.primary }} />
              </div>
              <div>
                <h3 
                  id="review-modal-title"
                  className="text-2xl font-bold tracking-tight"
                >
                  {displayTitle}
                </h3>
                <p className="text-muted-foreground">Manage customer feedback and responses</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" style={{ color: orangePalette.primary }} />
                <span className="text-muted-foreground">Loading reviews...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <h4 className="font-semibold text-destructive">Error Loading Reviews</h4>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !hasReviews && (
            <div className="text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                <MessageSquare className="h-8 w-8" style={{ color: orangePalette.primary }} />
              </div>
              <h4 className="text-lg font-semibold mb-2">No Reviews Found</h4>
              <p className="text-muted-foreground">
                There are no reviews available for {platform || 'this platform'} at the moment.
              </p>
            </div>
          )}

          {!loading && !error && hasReviews && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold tracking-tight">
                  Recent Reviews ({reviews.length})
                </h4>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US')}
                </div>
              </div>

              <div className="grid gap-4">
                {reviews.map((review, index) => {
                  const reviewKey = generateReviewKey(review, index);
                  const suggestion = commentSuggestions[reviewKey] || {};
                  const ratingColor = getRatingColor(review.review_rate);
                  const isCopied = copiedStates[reviewKey];

                  return (
                    <div 
                      key={reviewKey} 
                      className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {getCustomerInitials(review.customer_name)}
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground">{review.customer_name}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {renderStars(review.review_rate)}
                                </div>
                                <span className={cn("text-sm font-medium", ratingColor)}>
                                  {review.review_rate}.0
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(review.review_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{review.review}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={() => handleSuggestComment(review, index)}
                          disabled={suggestion?.loading}
                          className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors text-sm",
                            "bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          )}
                          style={{ 
                            backgroundColor: suggestion?.loading ? `${orangePalette.primary}80` : orangePalette.primary,
                          }}
                        >
                          {suggestion?.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                          {suggestion?.loading ? 'Generating...' : 'Suggest Comment'}
                        </button>

                        <button
                          onClick={() => openReviewLink(review.review_link)}
                          className="inline-flex items-center gap-2 px-4 py-2 border hover:bg-accent text-foreground font-medium rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Original
                        </button>
                      </div>

                      {/* Error State */}
                      {suggestion?.error && (
                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-destructive font-medium text-sm">Error generating suggestion</span>
                          </div>
                          <p className="text-destructive/80 text-sm">{suggestion.error}</p>
                        </div>
                      )}

                      {/* Comment Suggestion */}
                      {suggestion?.comment && (
                        <div className="rounded-xl border bg-accent/50 p-4" style={{ backgroundColor: `${orangePalette.light}40` }}>
                          <div className="flex items-start justify-between mb-3">
                            <h6 className="font-semibold text-sm flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: orangePalette.primary }}></div>
                              Suggested Response
                            </h6>
                            <button
                              onClick={() => clearCommentSuggestion(reviewKey)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                              aria-label="Clear suggestion"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground mb-3">{suggestion.comment}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCopyToClipboard(suggestion.comment, reviewKey)}
                              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md border hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy to clipboard
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => openReviewLink(review.review_link)}
                              className="text-xs font-medium px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              style={{ 
                                backgroundColor: `${orangePalette.primary}20`,
                                color: orangePalette.primary
                              }}
                            >
                              Respond on platform
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;