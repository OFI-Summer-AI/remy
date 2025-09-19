import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown, Users, MessageSquare, Calendar, ThumbsUp, Eye } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

const ReviewsAndSocial: React.FC = () => {
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = React.useState<any>(null);
  const [selectedSocial, setSelectedSocial] = React.useState<any>(null);

  // Mock data for reviews
  const reviewsData = [
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
      platform: "GoogleMaps",
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
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Social Media Engagement</h2>
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
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {social.change}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{social.followers}</span>
                    <span className="text-sm text-muted-foreground">followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{social.engagement}</span>
                    <span className="text-sm text-muted-foreground">engagement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {social.posts} posts this month
                  </p>
                  <p className="text-xs text-blue-600 mt-2">Click for details →</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                  {selectedReview.recentReviews?.map((review: any, index: number) => (
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
                <Button onClick={() => {
                  toast({ title: "Action", description: `Viewing all ${selectedReview.platform} reviews` });
                }}>
                  View All Reviews
                </Button>
                <Button variant="outline" onClick={() => {
                  toast({ title: "Action", description: `Responding to ${selectedReview.platform} reviews` });
                }}>
                  Respond to Reviews
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Social Media Detail Modal */}
      <Dialog open={!!selectedSocial} onOpenChange={() => setSelectedSocial(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSocial?.platform} Analytics Details
              <Badge variant={selectedSocial?.trend === "up" ? "default" : "destructive"}>
                {selectedSocial?.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {selectedSocial?.change} this month
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedSocial && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{selectedSocial.followers}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{selectedSocial.engagement}</div>
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">{selectedSocial.posts}</div>
                      <div className="text-sm text-muted-foreground">Posts This Month</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold">{selectedSocial.change}</div>
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {selectedSocial.recentPosts?.map((post: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{post.image}</div>
                          <div className="flex-1">
                            <p className="text-sm mb-2">{post.caption}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {post.likes} likes
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {post.comments} comments
                              </span>
                              <span>{post.date}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Audience Demographics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{selectedSocial.demographics?.age1825}%</div>
                    <div className="text-sm text-muted-foreground">18-25 years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{selectedSocial.demographics?.age2635}%</div>
                    <div className="text-sm text-muted-foreground">26-35 years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{selectedSocial.demographics?.age3645}%</div>
                    <div className="text-sm text-muted-foreground">36-45 years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{selectedSocial.demographics?.age45plus}%</div>
                    <div className="text-sm text-muted-foreground">45+ years</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => {
                  toast({ title: "Action", description: `Opening ${selectedSocial.platform} scheduler` });
                }}>
                  Schedule Post
                </Button>
                <Button variant="outline" onClick={() => {
                  toast({ title: "Action", description: `Viewing ${selectedSocial.platform} insights` });
                }}>
                  View Insights
                </Button>
                <Button variant="outline" onClick={() => {
                  toast({ title: "Action", description: `Managing ${selectedSocial.platform} audience` });
                }}>
                  Manage Audience
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewsAndSocial;