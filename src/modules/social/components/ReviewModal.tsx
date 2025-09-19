import React from 'react';
import { Star, ExternalLink, MessageSquare, Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from "@/shared/lib/utils";

// Simulando las interfaces para el ejemplo
interface Platform {
  name: string;
}

interface ReviewData {
  platform: string;
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

interface ReviewModalProps {
  platform: Platform;
  isOpen: boolean;
  onClose: () => void;
  reviews: ReviewData[];
  loading: boolean;
  error: string | null;
  commentSuggestions: CommentSuggestionState;
  onSuggestComment: (review: string, platform: Platform, reviewKey: string) => void;
  onClearCommentSuggestion: (reviewKey: string) => void;
}

const orangePalette = ["#ff7a00", "#ff9d3d", "#ffb26b", "#ffc69a", "#ffe0c7"];

const ReviewModal: React.FC<ReviewModalProps> = ({
  platform,
  isOpen,
  onClose,
  reviews,
  loading,
  error,
  commentSuggestions,
  onSuggestComment,
  onClearCommentSuggestion,
}) => {
  if (!isOpen) return null;

  const generateReviewKey = (review: ReviewData, index: number) => 
    `${review.platform}-${review.customer_name}-${index}`;

  const handleSuggestComment = (review: ReviewData, index: number) => {
    const reviewKey = generateReviewKey(review, index);
    onSuggestComment(review.review, review.platform, reviewKey);
  };

  const openReviewLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating
            ? "text-primary fill-current"
            : "text-muted-foreground/30"
        )}
        style={{ color: i < rating ? orangePalette[0] : undefined }}
      />
    ));
  };

  // Mock data para el ejemplo
  const mockReviews = [
    {
      platform: "Google",
      customer_name: "María González",
      review_rate: 5,
      review_date: "2024-01-15",
      review: "Excelente experiencia! La comida estuvo deliciosa y el servicio fue impecable. Definitivamente regresaremos pronto.",
      review_link: "https://google.com/reviews/123"
    },
    {
      platform: "Google", 
      customer_name: "Carlos López",
      review_rate: 4,
      review_date: "2024-01-14",
      review: "Muy buen restaurante, la comida está muy rica aunque el tiempo de espera fue un poco largo. El ambiente es acogedor.",
      review_link: "https://google.com/reviews/124"
    },
    {
      platform: "Google",
      customer_name: "Ana Martínez",
      review_rate: 2,
      review_date: "2024-01-13", 
      review: "La comida estaba fría cuando llegó y el servicio fue lento. Esperaba mucho más por el precio que pagamos.",
      review_link: "https://google.com/reviews/125"
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl mx-4 bg-card rounded-2xl shadow-2xl border overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" style={{ color: orangePalette[0] }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{platform?.name || 'Google'} Reviews</h3>
                <p className="text-muted-foreground">Manage customer feedback and responses</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
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
                <Loader2 className="h-6 w-6 animate-spin text-primary" style={{ color: orangePalette[0] }} />
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

          {!loading && !error && displayReviews.length === 0 && (
            <div className="text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                <MessageSquare className="h-8 w-8" style={{ color: orangePalette[0] }} />
              </div>
              <h4 className="text-lg font-semibold mb-2">No Reviews Found</h4>
              <p className="text-muted-foreground">There are no reviews available for {platform?.name || 'this platform'} at the moment.</p>
            </div>
          )}

          {!loading && !error && displayReviews.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold tracking-tight">
                  Recent Reviews ({displayReviews.length})
                </h4>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="grid gap-4">
                {displayReviews.map((review, index) => {
                  const reviewKey = generateReviewKey(review, index);
                  const suggestion = commentSuggestions[reviewKey] || {};
                  const ratingColor = review.review_rate >= 4 ? 'text-primary' : review.review_rate >= 3 ? 'text-yellow-600' : 'text-destructive';

                  return (
                    <div key={reviewKey} className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {review.customer_name.charAt(0).toUpperCase()}
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
                                  {new Date(review.review_date).toLocaleDateString()}
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
                            "bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground"
                          )}
                          style={{ 
                            backgroundColor: suggestion?.loading ? `${orangePalette[0]}80` : orangePalette[0],
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
                          className="inline-flex items-center gap-2 px-4 py-2 border hover:bg-accent text-foreground font-medium rounded-lg transition-colors text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Original
                        </button>
                      </div>

                      {/* Comment Suggestion */}
                      {suggestion?.error && (
                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-destructive font-medium text-sm">Error generating suggestion</span>
                          </div>
                          <p className="text-destructive/80 text-sm">{suggestion.error}</p>
                        </div>
                      )}

                      {suggestion?.comment && (
                        <div className="rounded-xl border bg-accent/50 p-4" style={{ backgroundColor: `${orangePalette[4]}40` }}>
                          <div className="flex items-start justify-between mb-3">
                            <h6 className="font-semibold text-sm flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: orangePalette[0] }}></div>
                              Suggested Response
                            </h6>
                            <button
                              onClick={() => onClearCommentSuggestion(reviewKey)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground mb-3">{suggestion.comment}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(suggestion.comment);
                              }}
                              className="text-xs font-medium px-3 py-1 rounded-md border hover:bg-accent transition-colors"
                            >
                              Copy to clipboard
                            </button>
                            <button
                              onClick={() => openReviewLink(review.review_link)}
                              className="text-xs font-medium px-3 py-1 rounded-md transition-colors"
                              style={{ 
                                backgroundColor: `${orangePalette[0]}20`,
                                color: orangePalette[0]
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