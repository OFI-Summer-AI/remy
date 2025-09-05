import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react";

// Simple type definitions
type Review = {
  platform: string;
  rating: number;
  totalReviews: number;
  recentChange: string;
  trend: "up" | "down";
  recentReviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
    review_link?: string;
  }>;
};

const ReviewsSection = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [respondingReview, setRespondingReview] = useState(null);
  const [replySent, setReplySent] = useState(false);

  // Sample data that always works
  const reviewsData = [
    {
      platform: "TripAdvisor",
      rating: 4.3,
      totalReviews: 284,
      recentChange: "+12",
      trend: "up",
      recentReviews: [
        { 
          author: "Swen B", 
          rating: 5, 
          text: "Very tasty empanadas and very good coffee! Nice addition for The Hague! The owner is very friendly and happy to help you with your choice.", 
          date: "2 days ago",
          review_link: "https://www.tripadvisor.com/ShowUserReviews-g188633-d33100009-r1011819476-Tio_Bigotes-The_Hague_South_Holland_Province.html"
        },
        { 
          author: "Mike Johnson", 
          rating: 3, 
          text: "Good food but service was slow. Nice atmosphere though.", 
          date: "1 week ago",
          review_link: "https://www.tripadvisor.com/ShowUserReviews-g188633-d33100009-r1011819477-Tio_Bigotes-The_Hague_South_Holland_Province.html"
        }
      ]
    },
    {
      platform: "Google Maps",
      rating: 4.1,
      totalReviews: 562,
      recentChange: "+8",
      trend: "up",
      recentReviews: [
        { 
          author: "Juliana de Souza", 
          rating: 5, 
          text: "Absolutely amazing! We tried the Criolla, Vacio, Chorizo, and the Smash Burger — it's hard to pick a favorite. We can't wait for our next time in Den Haag to try more empanadas!", 
          date: "3 days ago",
          review_link: "https://maps.google.com/review/123"
        },
        { 
          author: "Carlos M", 
          rating: 5, 
          text: "Excellent empanadas! Best I've had outside Argentina. Will definitely be back.", 
          date: "5 days ago",
          review_link: "https://maps.google.com/review/456"
        }
      ]
    }
  ];

  const handleAcceptResponse = async (review, platform) => {
    const suggestedResponse = "Thank you so much for your wonderful review! We're thrilled you enjoyed your experience with us. Your feedback means the world to us and motivates our team to continue providing excellent service. We look forward to welcoming you back soon!";
    
    try {
      // Copy the response to clipboard
      await navigator.clipboard.writeText(suggestedResponse);
      
      // Open the review link if available
      if (review.review_link) {
        window.open(review.review_link, '_blank', 'noopener');
        alert("Response copied to clipboard! Review page opened - please paste your response.");
      } else {
        if (platform === "TripAdvisor") {
          window.open("https://www.tripadvisor.com/OwnerCenter", "_blank", "noopener");
        } else if (platform === "Google Maps") {
          window.open("https://business.google.com/", "_blank", "noopener");
        }
        alert("Response copied to clipboard! Platform opened - please find the review and paste your response.");
      }
      
      setReplySent(true);
    } catch (error) {
      alert("Failed to copy response. Please copy manually: " + suggestedResponse);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reviews Overview</h2>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      {/* Review Details Modal */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
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
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{selectedReview.rating}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{selectedReview.totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Total Reviews</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{selectedReview.recentChange}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>

              {/* Recent Reviews */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Reviews</h3>
                <div className="space-y-3">
                  {selectedReview.recentReviews?.map((review, index) => (
                    <Card 
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setRespondingReview(review);
                        setReplySent(false);
                      }}
                    >
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
                            <p className="text-xs text-blue-600">Click to respond →</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline">View All Reviews</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog
        open={!!respondingReview}
        onOpenChange={(open) => {
          if (!open) {
            setRespondingReview(null);
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
                  setReplySent(false);
                }}
                className="-ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </div>
          </DialogHeader>
          
          {respondingReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge>{selectedReview?.platform}</Badge>
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
              </div>
              
              <div>
                <p className="font-medium">{respondingReview.author}</p>
                <p className="text-sm text-muted-foreground">{respondingReview.text}</p>
              </div>

              <div className="rounded-md border p-4 space-y-4">
                <div className="font-medium">Suggested Response</div>
                <p className="text-sm">
                  Thank you so much for your wonderful review! We're thrilled you enjoyed your experience with us. 
                  Your feedback means the world to us and motivates our team to continue providing excellent service. 
                  We look forward to welcoming you back soon!
                </p>
                
                {!replySent ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptResponse(respondingReview, selectedReview?.platform)}
                    >
                      Accept & Open Link
                    </Button>
                    <Button variant="outline">Create New</Button>
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
