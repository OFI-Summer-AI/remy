import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, TrendingUp, TrendingDown, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";

type WebhookReview = {
  platform: string;
  review: string;
  customer_name: string;
  review_date: string;
  review_rate: number;
  review_link: string;
};

type RecentReview = { 
  author: string; 
  rating: number; 
  text: string; 
  date: string;
  review_link?: string;
};

type Review = {
  platform: string;
  rating: number;
  totalReviews: number;
  recentChange: string;
  trend: "up" | "down";
  color: string;
  recentReviews: RecentReview[];
  monthlyStats: Record<string, number>;
};

const ReviewsSection: React.FC = () => {
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);
  const [respondingReview, setRespondingReview] = React.useState<RecentReview | null>(null);
  const [replyPlatform, setReplyPlatform] = React.useState<string | null>(null);
  const [replySent, setReplySent] = React.useState(false);
  const [allReviewsOpen, setAllReviewsOpen] = React.useState(false);
  const [allReviews, setAllReviews] = React.useState<RecentReview[]>([]);
  const [allReviewsPlatform, setAllReviewsPlatform] = React.useState("");
  const [reviewsData, setReviewsData] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [suggestedResponse, setSuggestedResponse] = React.useState("");

  const REVIEWS_WEBHOOK = "https://n8n.sofiatechnology.ai/webhook-test/af7a38f8-ac04-4582-8fe5-a8cf318e8eb2";
  const RESPONSE_WEBHOOK = "https://n8n.sofiatechnology.ai/webhook-test/93e945b3-bc99-4765-ae45-00a33b7240d4";

  // Default data for fallback
  const defaultReviews: Review[] = [
    {
      platform: "TripAdvisor",
      rating: 4.3,
      totalReviews: 284,
      recentChange: "+12",
      trend: "up",
      color: "bg-green-500",
      recentReviews: [
        { author: "Sarah M.", rating: 5, text: "Amazing food and service! Will definitely come back.", date: "2 days ago" },
        { author: "John D.", rating: 4, text: "Great atmosphere, food was good but service was a bit slow.", date: "1 week ago" }
      ],
      monthlyStats: { jan: 4.1, feb: 4.2, mar: 4.3 }
    },
    {
      platform: "Google Maps",
      rating: 4.1,
      totalReviews: 562,
      recentChange: "+8",
      trend: "up",
      color: "bg-blue-500",
      recentReviews: [
        { author: "Alex K.", rating: 4, text: "Good food, nice location. Parking can be difficult.", date: "3 days ago" },
        { author: "Emma R.", rating: 5, text: "Best pasta in town! Staff was very friendly.", date: "5 days ago" }
      ],
      monthlyStats: { jan: 3.9, feb: 4.0, mar: 4.1 }
    }
  ];

  const transformWebhookData = (webhookReviews: WebhookReview[]): Review[] => {
    // Group reviews by platform
    const groupedReviews = webhookReviews.reduce((acc, review) => {
      if (!acc[review.platform]) {
        acc[review.platform] = [];
      }
      acc[review.platform].push({
        author: review.customer_name,
        rating: review.review_rate,
        text: review.review,
        date: formatDate(review.review_date),
        review_link: review.review_link
      });
      return acc;
    }, {} as Record<string, RecentReview[]>);

    // Transform to Review[] format
    return Object.entries(groupedReviews).map(([platform, reviews]) => {
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const totalReviews = reviews.length;
      
      // Simple trend calculation (you can enhance this)
      const recentReviews = reviews.slice(0, 5); // Last 5 reviews
      const avgRecent = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;
      const trend = avgRecent >= averageRating ? "up" : "down";
      const recentChange = `+${Math.floor(Math.random() * 15) + 1}`; // Placeholder

      return {
        platform,
        rating: Math.round(averageRating * 10) / 10,
        totalReviews,
        recentChange,
        trend,
        color: trend === "up" ? "bg-green-500" : "bg-red-500",
        recentReviews: reviews.slice(0, 10), // Show latest 10
        monthlyStats: { jan: 4.0, feb: 4.1, mar: averageRating } // Placeholder
      };
    });
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 14) return "1 week ago";
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } catch {
      return dateString;
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(REVIEWS_WEBHOOK, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const webhookReviews: WebhookReview[] = await response.json();
      
      if (Array.isArray(webhookReviews) && webhookReviews.length > 0) {
        const transformedData = transformWebhookData(webhookReviews);
        setReviewsData(transformedData);
        toast({
          title: "Reviews Updated",
          description: `Loaded ${webhookReviews.length} reviews from ${transformedData.length} platforms`,
        });
      } else {
        setReviewsData(defaultReviews);
        toast({
          title: "Using Sample Data",
          description: "No reviews found from webhook, showing sample data",
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviewsData(defaultReviews);
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Using sample data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestedResponse = async (review: RecentReview, platform: string) => {
    // Generate AI response based on the review
    const defaultResponse = "Thank you so much for your wonderful review! We're thrilled you enjoyed your experience with us. Your feedback means the world to us and motivates our team to continue providing excellent service. We look forward to welcoming you back soon!";
    
    // You can integrate with OpenAI or another LLM here
    // For now, using a contextual default response
    if (review.rating >= 4) {
      setSuggestedResponse(defaultResponse);
    } else {
      setSuggestedResponse(
        "Thank you for taking the time to share your feedback. We sincerely apologize that your experience didn't meet your expectations. We take all feedback seriously and would love the opportunity to make things right. Please feel free to contact us directly so we can address your concerns and ensure a better experience in the future."
      );
    }
  };

  const sendResponseToWebhook = async (review: RecentReview, platform: string, response: string) => {
    try {
      const payload = {
        business_name: "El Tío Bigotes",
        platform: platform,
        review: review.text,
        customer_name: review.author,
        review_date: review.date,
        review_rate: review.rating,
        response: response
      };

      await fetch(RESPONSE_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error sending response to webhook:', error);
    }
  };

  const handleAcceptResponse = async () => {
    if (!respondingReview || !replyPlatform) return;

    try {
      // Copy the suggested response to clipboard
      await navigator.clipboard.writeText(suggestedResponse);
      
      // Send response data to webhook
      await sendResponseToWebhook(respondingReview, replyPlatform, suggestedResponse);
      
      // Open the review link if available
      if (respondingReview.review_link) {
        window.open(respondingReview.review_link, '_blank', 'noopener');
        toast({
          title: "Response Copied & Link Opened",
          description: "Response copied to clipboard. Review page opened - please paste your response.",
        });
      } else {
        // Fallback for platforms without direct links
        if (replyPlatform === "TripAdvisor") {
          window.open("https://www.tripadvisor.com/OwnerCenter", "_blank", "noopener");
        } else if (replyPlatform === "Google Maps") {
          window.open("https://business.google.com/", "_blank", "noopener");
        }
        toast({
          title: "Response Copied",
          description: "Response copied to clipboard. Platform opened - please find the review and paste your response.",
        });
      }
      
      setReplySent(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy response or open link",
        variant: "destructive"
      });
    }
  };

  // Load reviews on component mount
  React.useEffect(() => {
    fetchReviews();
  }, []);

  const openAllReviews = (review: Review) => {
    setAllReviewsPlatform(review.platform);
    setAllReviews(review.recentReviews);
    setAllReviewsOpen(true);
    setSelectedReview(null);
    toast({
      title: "Opened",
      description: `Viewing all ${review.platform} reviews`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reviews Overview</h2>
        <Button 
          onClick={fetchReviews} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviewsData.map((review) => (
          <Card
            key={review.platform}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedReview(review)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {review.platform}
                <Badge variant={review.trend === "up" ? "default" : "destructive"}>
                  {review.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {review.recentChange}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(review.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{review.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.totalReviews} total reviews
                </p>
                <p className="text-xs text-blue-600 mt-2">Click for details →</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reviews Detail Modal */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReview?.platform} Reviews Details
              <Badge variant={selectedReview?.trend === "up" ? "default" : "destructive"}>
                {selectedReview?.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {selectedReview?.recentChange} this month
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedReview.rating}</div>
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedReview.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Average Rating
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedReview.totalReviews}</div>
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedReview.recentChange}</div>
                      <div className="text-sm text-muted-foreground">This Month</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
                <div className="space-y-4">
                  {selectedReview.recentReviews?.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.author}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{review.text}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => selectedReview && openAllReviews(selectedReview)}>
                  View All Reviews
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedReview) {
                      setReplyPlatform(selectedReview.platform);
                      setRespondingReview(selectedReview.recentReviews[0]);
                      setReplySent(false);
                      generateSuggestedResponse(selectedReview.recentReviews[0], selectedReview.platform);
                    }
                  }}
                >
                  Respond to Reviews
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* All Reviews Modal */}
      <Dialog open={allReviewsOpen} onOpenChange={setAllReviewsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>All {allReviewsPlatform} Reviews</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {allReviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {review.text}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Response Modal */}
      <Dialog
        open={!!respondingReview}
        onOpenChange={(open) => {
          if (!open) {
            setRespondingReview(null);
            setReplyPlatform(null);
            setReplySent(false);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRespondingReview(null);
                  setReplyPlatform(null);
                  setReplySent(false);
                }}
                className="-ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to list
              </Button>
            </div>
          </DialogHeader>
          {respondingReview && replyPlatform && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge>{replyPlatform}</Badge>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < respondingReview.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-auto">
                  {respondingReview.date}
                </span>
              </div>
              <div>
                <p className="font-medium">{respondingReview.author}</p>
                <p className="text-sm text-muted-foreground">
                  {respondingReview.text}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    toast({
                      title: "Escalated",
                      description: "Escalated to Remy",
                    });
                  }}
                >
                  Escalate to Remy
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    toast({
                      title: "Resolved",
                      description: "Marked as resolved",
                    });
                  }}
                >
                  Mark as Resolved
                </Button>
              </div>
              <div className="rounded-md border p-4 space-y-4">
                <div className="font-medium">Suggested Response</div>
                <p className="text-sm">{suggestedResponse}</p>
                {!replySent ? (
                  <div className="flex gap-2">
                    <Button onClick={handleAcceptResponse}>
                      Accept & Open Link
                    </Button>
                    <Button variant="outline">Create new</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Response Sent</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsSection;
