import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/lib/api";
import { Star, TrendingUp, TrendingDown, ArrowLeft, CheckCircle2 } from "lucide-react";

type RecentReview = { author: string; rating: number; text: string; date: string };

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

  const suggestedResponse =
    "Thanks so much for the wonderful review! We're thrilled you enjoyed our pasta. Our chef will be delighted to hear this. " +
    "Looking forward to welcoming you back soon.";

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
        { author: "John D.", rating: 4, text: "Great atmosphere, food was good but service was a bit slow.", date: "1 week ago" },
        { author: "Maria L.", rating: 5, text: "Perfect place for a romantic dinner. Highly recommended!", date: "1 week ago" }
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
        { author: "Emma R.", rating: 5, text: "Best pasta in town! Staff was very friendly.", date: "5 days ago" },
        { author: "Mike T.", rating: 3, text: "Food was okay, but prices are a bit high for the portion size.", date: "1 week ago" }
      ],
      monthlyStats: { jan: 3.9, feb: 4.0, mar: 4.1 }
    },
    {
      platform: "Yelp",
      rating: 3.9,
      totalReviews: 156,
      recentChange: "-3",
      trend: "down",
      color: "bg-red-500",
      recentReviews: [
        { author: "Lisa P.", rating: 2, text: "Food took too long to arrive and was cold when it did.", date: "1 day ago" },
        { author: "Tom W.", rating: 4, text: "Nice ambiance, good wine selection.", date: "4 days ago" },
        { author: "Rachel B.", rating: 5, text: "Excellent service and delicious food!", date: "6 days ago" }
      ],
      monthlyStats: { jan: 4.1, feb: 4.0, mar: 3.9 }
    }
  ];

  const { data: reviewsData = defaultReviews } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: () => getReviews<Review[]>(),
    initialData: defaultReviews,
  });

  const openAllReviews = (review: Review) => {
    // TODO: replace with viewAllReviews() when backend is available
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
      <h2 className="text-xl font-semibold mb-4">Reviews Overview</h2>
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
                    <Button
                      onClick={async () => {
                        try {
                          if (replyPlatform === "TripAdvisor") {
                            await navigator.clipboard?.writeText(suggestedResponse);
                            window.open(
                              "https://www.tripadvisor.com/OwnerCenter",
                              "_blank",
                              "noopener"
                            );
                            toast({
                              title: "TripAdvisor",
                              description: "Opened TripAdvisor. Please paste the copied response.",
                            });
                            setReplySent(true);
                          } else {
                            setReplySent(true);
                            toast({ title: "Reply Sent" });
                          }
                        } catch {
                          toast({
                            title: "Error",
                            description: "Failed to send reply",
                          });
                        }
                      }}
                    >
                      Accept
                    </Button>
                    <Button variant="outline">Create new</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Reply Sent</span>
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
