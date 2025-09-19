import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Star, TrendingUp, TrendingDown, Users, MessageSquare, Calendar, ThumbsUp, Eye, Instagram, Plus } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import InstagramUploadDialog from "../components/InstagramPostDialog";
import ReviewModal from "../components/ReviewModal";
import { useReviews } from "../hooks/useReviews";
import { Platform } from "../types/reviewTypes";

// Main Social Page Component
const SocialPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedSocial, setSelectedSocial] = React.useState<any>(null);
  const [isInstagramDialogOpen, setIsInstagramDialogOpen] = React.useState(false);
  const [selectedReviewPlatform, setSelectedReviewPlatform] = React.useState<Platform | null>(null);
  
  // Use the custom reviews hook
  const {
    reviewsState,
    commentSuggestions,
    fetchReviews,
    suggestComment,
    clearCommentSuggestion,
    clearReviews,
  } = useReviews();

  // Success handler for Instagram uploads
  const handleInstagramSuccess = (message: string) => {
    toast({
      title: "Success!",
      description: message,
    });
  };

  // Error handler for Instagram uploads
  const handleInstagramError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  // Handle review platform selection
  const handleReviewClick = async (platform: Platform) => {
    setSelectedReviewPlatform(platform);
    await fetchReviews(platform);
  };

  // Close review modal
  const handleCloseReviewModal = () => {
    setSelectedReviewPlatform(null);
    clearReviews();
  };

  // Mock data for review statistics (this would come from your analytics)
  const reviewsData = [
    {
      platform: "TripAdvisor" as Platform,
      rating: 4.3,
      totalReviews: 284,
      recentChange: "+12",
      trend: "up",
      color: "bg-success"
    },
    {
      platform: "GoogleMaps" as Platform,
      rating: 4.1,
      totalReviews: 562,
      recentChange: "+8",
      trend: "up", 
      color: "bg-primary"
    },
    {
      platform: "Yelp" as Platform,
      rating: 3.9,
      totalReviews: 156,
      recentChange: "-3",
      trend: "down",
      color: "bg-danger"
    }
  ];

  // Mock data for social media
  const socialData = [
    {
      platform: "Instagram",
      followers: "12.3K",
      engagement: "4.2%",
      posts: 42,
      trend: "up",
      change: "+2.1%",
      recentPosts: [
        { image: "🍝", caption: "Fresh pasta made daily! #PastaLovers", likes: 245, comments: 18, date: "2 days ago" },
        { image: "🍷", caption: "Wine night specials every Friday", likes: 156, comments: 12, date: "4 days ago" },
        { image: "👨‍🍳", caption: "Meet our head chef Marco!", likes: 312, comments: 24, date: "1 week ago" }
      ],
      demographics: { age1825: 25, age2635: 35, age3645: 28, age45plus: 12 }
    },
    {
      platform: "Facebook", 
      followers: "8.7K",
      engagement: "3.8%",
      posts: 18,
      trend: "up",
      change: "+1.4%",
      recentPosts: [
        { image: "🎉", caption: "Celebrating 5 years in business!", likes: 189, comments: 34, date: "3 days ago" },
        { image: "🥗", caption: "New summer menu now available", likes: 123, comments: 15, date: "1 week ago" },
        { image: "📅", caption: "Book your table for Mother's Day", likes: 98, comments: 8, date: "1 week ago" }
      ],
      demographics: { age1825: 15, age2635: 30, age3645: 35, age45plus: 20 }
    },
    {
      platform: "Twitter",
      followers: "3.2K", 
      engagement: "2.1%",
      posts: 24,
      trend: "down",
      change: "-0.3%",
      recentPosts: [
        { image: "☕", caption: "Perfect morning coffee to start your day right", likes: 45, comments: 6, date: "1 day ago" },
        { image: "🍰", caption: "Try our new dessert menu!", likes: 32, comments: 4, date: "3 days ago" },
        { image: "🎵", caption: "Live music every Saturday night", likes: 28, comments: 3, date: "5 days ago" }
      ],
      demographics: { age1825: 40, age2635: 35, age3645: 20, age45plus: 5 }
    }
  ];

  return (
    <section aria-label="Reviews and Social Media Overview" className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Social & Reviews</h1>
          <p className="text-muted-foreground">Manage your online presence and customer feedback</p>
        </div>
        <button
          onClick={() => setIsInstagramDialogOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          Create Post
        </button>
      </div>

      {/* Reviews Overview Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-primary">Reviews Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviewsData.map((review) => (
            <Card 
              key={review.platform} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleReviewClick(review.platform)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  {review.platform}
                  <Badge variant={review.trend === "up" ? "default" : "destructive"}>
                    {review.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-danger" />
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
                              ? "text-accent fill-current"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                  <p className="text-sm text-bg">
                    {review.totalReviews} total reviews
                  </p>
                  <p className="text-xs text-primary mt-2">Click for details →</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Media Engagement Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-primary">Social Media Engagement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialData.map((social) => (
            <Card 
              key={social.platform}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedSocial(social)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  {social.platform}
                  <Badge variant={social.trend === "up" ? "default" : "destructive"}>
                    {social.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-danger" />
                    )}
                    {social.change}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-base" />
                    <span className="font-semibold">{social.followers}</span>
                    <span className="text-sm text-primary">followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-bg" />
                    <span className="font-semibold">{social.engagement}</span>
                    <span className="text-sm text-bg">engagement</span>
                  </div>
                  <p className="text-sm text-bg">
                    {social.posts} posts this month
                  </p>
                  <p className="text-xs text-primary mt-2">Click for details →</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Instagram Upload Dialog */}
      <InstagramUploadDialog 
        isOpen={isInstagramDialogOpen}
        onClose={() => setIsInstagramDialogOpen(false)}
        onSuccess={handleInstagramSuccess}
      />

      {/* Review Modal */}
      {selectedReviewPlatform && (
        <ReviewModal
          platform={selectedReviewPlatform}
          isOpen={true}
          onClose={handleCloseReviewModal}
          reviews={reviewsState.reviews}
          loading={reviewsState.loading}
          error={reviewsState.error}
          commentSuggestions={commentSuggestions}
          onSuggestComment={suggestComment}
          onClearCommentSuggestion={clearCommentSuggestion}
        />
      )}

      {/* Social Detail Modal (keeping the original functionality) */}
      {selectedSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedSocial(null)}
          />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedSocial.platform} Analytics</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                    <span>{selectedSocial.followers} followers</span>
                    <span>{selectedSocial.engagement} engagement</span>
                    <span>{selectedSocial.posts} posts this month</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSocial(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-500">×</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Posts</h4>
                <div className="space-y-3">
                  {selectedSocial.recentPosts.map((post: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{post.image}</div>
                        <div className="flex-grow">
                          <p className="text-gray-900 mb-2">{post.caption}</p>
                          <div className="flex items-center gap-4 text-sm text-muted">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {post.comments}
                            </div>
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Audience Demographics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted">18-25 years</div>
                    <div className="font-semibold">{selectedSocial.demographics.age1825}%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted">26-35 years</div>
                    <div className="font-semibold">{selectedSocial.demographics.age2635}%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted">36-45 years</div>
                    <div className="font-semibold">{selectedSocial.demographics.age3645}%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted">45+ years</div>
                    <div className="font-semibold">{selectedSocial.demographics.age45plus}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialPage;