import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Calendar as CalendarIcon,
  ThumbsUp,
  Eye,
  Upload,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { viewSocialInsights } from "@/lib/api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RecentReview = { author: string; rating: number; text: string; date: string };
type RecentPost = { image: string; caption: string; likes: number; comments: number; date: string };

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

type Social = {
  platform: string;
  followers: string;
  engagement: string;
  posts: number;
  trend: "up" | "down";
  change: string;
  recentPosts: RecentPost[];
  demographics: { age1825: number; age2635: number; age3645: number; age45plus: number };
};

type InsightPoint = { date: string; value: number };
type InsightMetric = { total: number; series?: InsightPoint[] };
type SocialInsights = Record<string, number | InsightMetric>;
type InstagramInsights = {
  impressions: InsightMetric;
  reach: InsightMetric;
  engagement: InsightMetric;
  saved: InsightMetric;
  video_views: InsightMetric;
};

const ReviewsAndSocial: React.FC = () => {
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);
  const [selectedSocial, setSelectedSocial] = React.useState<Social | null>(null);
  const [schedulerOpen, setSchedulerOpen] = React.useState(false);
  const [scheduleContent, setScheduleContent] = React.useState("");
  const [scheduleDate, setScheduleDate] = React.useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = React.useState("");
  const [scheduleMedia, setScheduleMedia] = React.useState<string | null>(null);
  const [descriptionPrompt, setDescriptionPrompt] = React.useState("");
  const [respondingReview, setRespondingReview] = React.useState<RecentReview | null>(null);
  const [replyPlatform, setReplyPlatform] = React.useState<string | null>(null);
  const [replySent, setReplySent] = React.useState(false);
  const [allReviewsOpen, setAllReviewsOpen] = React.useState(false);
  const [allReviews, setAllReviews] = React.useState<RecentReview[]>([]);
  const [allReviewsPlatform, setAllReviewsPlatform] = React.useState("");
  const [insightsOpen, setInsightsOpen] = React.useState(false);
  const [insightsData, setInsightsData] = React.useState<SocialInsights | null>(null);
  const [insightsPlatform, setInsightsPlatform] = React.useState("");
  const [insightsRange, setInsightsRange] = React.useState("7");
  const [insightsCategory, setInsightsCategory] = React.useState("Account");
  const suggestedResponse =
    "Thanks so much for the wonderful review! We're thrilled you enjoyed our pasta. Our chef will be delighted to hear this. " +
    "Looking forward to welcoming you back soon.";

  // TODO: replace with getTrendingHashtags() when backend is available
  const trendingHashtags = ["foodie", "yum", "instafood"];

  // Default data for reviews
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

  // Default data for social media
  const defaultSocial: Social[] = [
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

  const { data: reviewsData = defaultReviews } = useQuery<Review[]>({
    queryKey: ["reviews"],
    // TODO: replace with getReviews() when backend is available
    queryFn: async () => Promise.resolve(defaultReviews),
    initialData: defaultReviews,
  });

  const { data: socialData = defaultSocial } = useQuery<Social[]>({
    queryKey: ["social"],
    // TODO: replace with getSocialStats() when backend is available
    queryFn: async () => Promise.resolve(defaultSocial),
    initialData: defaultSocial,
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

  const openInsights = async (platform: string) => {
    try {
      const data = await viewSocialInsights<{ platform: string; insights: SocialInsights }>(platform);
      setInsightsData(data.insights);
      setInsightsPlatform(platform);
      setInsightsOpen(true);
      toast({ title: "Opened", description: `Viewing ${platform} insights` });
    } catch {
      toast({ title: "Error", description: `Failed to load ${platform} insights` });
    }
  };

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
                  {selectedReview.recentReviews?.map((review: RecentReview, index: number) => (
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
                    // TODO: call escalate API
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
                    // TODO: call resolve API
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
                            await navigator.clipboard?.writeText(
                              suggestedResponse
                            );
                            window.open(
                              "https://www.tripadvisor.com/OwnerCenter",
                              "_blank",
                              "noopener"
                            );
                            toast({
                              title: "TripAdvisor",
                              description:
                                "Opened TripAdvisor. Please paste the copied response.",
                            });
                            setReplySent(true);
                          } else {
                            // TODO: call respond API
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
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
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
                  {selectedSocial.recentPosts?.map((post: RecentPost, index: number) => (
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
                <Button onClick={() => setSchedulerOpen(true)}>
                  Schedule Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    selectedSocial && openInsights(selectedSocial.platform)
                  }
                >
                  View Insights
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: manage audience via API
                    toast({
                      title: "Opened",
                      description: `Managing ${selectedSocial.platform} audience`,
                    });
                  }}
                >
                  Manage Audience
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Social Insights Modal */}
      <Dialog open={insightsOpen} onOpenChange={setInsightsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{insightsPlatform} Insights</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between mb-4">
            <Select value={insightsCategory} onValueChange={setInsightsCategory}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Account">Account</SelectItem>
                <SelectItem value="Content">Content</SelectItem>
              </SelectContent>
            </Select>
            <Select value={insightsRange} onValueChange={setInsightsRange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {insightsPlatform === "Instagram" && insightsData ? (
            insightsCategory === "Account" ? (
              (() => {
                const data = insightsData as InstagramInsights;
                const range = parseInt(insightsRange, 10);
                const filtered = Object.fromEntries(
                  Object.entries(data).map(([key, metric]) => {
                    const series = metric.series?.slice(-range) ?? [];
                    const total = series.reduce((sum, p) => sum + p.value, 0);
                    return [key, { total, series }];
                  })
                ) as InstagramInsights;
                const lineData = filtered.impressions.series.map((pt, idx) => ({
                  date: pt.date,
                  impressions: pt.value,
                  reach: filtered.reach.series[idx]?.value ?? 0,
                  engagement: filtered.engagement.series[idx]?.value ?? 0,
                }));
                const barData = filtered.saved.series.map((pt, idx) => ({
                  date: pt.date,
                  saved: pt.value,
                  video_views: filtered.video_views.series[idx]?.value ?? 0,
                }));
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(filtered).map(([key, metric]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold">{metric.total}</div>
                          <div className="text-sm text-muted-foreground">
                            {key.replace(/_/g, " ")}
                          </div>
                        </div>
                      ))}
                    </div>
                    <ChartContainer
                      className="h-[250px]"
                      config={{
                        impressions: { label: "Impressions", color: "hsl(var(--chart-1))" },
                        reach: { label: "Reach", color: "hsl(var(--chart-2))" },
                        engagement: { label: "Engagement", color: "hsl(var(--chart-3))" },
                      }}
                    >
                      <AreaChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="impressions"
                          stroke="var(--color-impressions)"
                          fill="var(--color-impressions)"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="reach"
                          stroke="var(--color-reach)"
                          fill="var(--color-reach)"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="engagement"
                          stroke="var(--color-engagement)"
                          fill="var(--color-engagement)"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ChartContainer>
                    <ChartContainer
                      className="h-[250px]"
                      config={{
                        saved: { label: "Saved", color: "hsl(var(--chart-4))" },
                        video_views: { label: "Video Views", color: "hsl(var(--chart-5))" },
                      }}
                    >
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="saved"
                          fill="var(--color-saved)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="video_views"
                          fill="var(--color-video_views)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                );
              })()
            ) : (
              <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
                Content insights coming soon
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {insightsData &&
                Object.entries(insightsData).map(([key, value]) => {
                  const displayValue =
                    typeof value === "object" && value !== null
                      ? (value as InsightMetric).total
                      : (value as number);
                  return (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold">{displayValue}</div>
                      <div className="text-sm text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={schedulerOpen} onOpenChange={setSchedulerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create {selectedSocial?.platform} Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your post idea..."
                value={descriptionPrompt}
                onChange={(e) => setDescriptionPrompt(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  // TODO: generate description via API
                  setScheduleContent(`Auto description for: ${descriptionPrompt}`);
                }}
              >
                Generate Description
              </Button>
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Post description..."
                value={scheduleContent}
                onChange={(e) => setScheduleContent(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setScheduleContent((prev) =>
                        prev.includes(`#${tag}`)
                          ? prev
                          : `${prev}${prev ? " " : ""}#${tag}`
                      )
                    }
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-md border-2 border-dashed p-4 text-center">
              {scheduleMedia ? (
                <img
                  src={scheduleMedia}
                  alt="Preview"
                  className="mx-auto max-h-40 rounded-md object-cover"
                />
              ) : (
                <div className="space-y-1">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload image</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setScheduleMedia(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-50 bg-popover"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setSchedulerOpen(false);
                setScheduleContent("");
                setScheduleDate(undefined);
                setScheduleTime("");
                setScheduleMedia(null);
                setDescriptionPrompt("");
              }}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  // TODO: post immediately via API
                  toast({
                    title: "Posted",
                    description: `Post published on ${selectedSocial?.platform}`,
                  });
                  setSchedulerOpen(false);
                  setScheduleContent("");
                  setScheduleDate(undefined);
                  setScheduleTime("");
                  setScheduleMedia(null);
                  setDescriptionPrompt("");
                }}
              >
                Post Now
              </Button>
              <Button
                onClick={() => {
                  // TODO: schedule post via API
                  const scheduledFor = scheduleDate
                    ? new Date(
                        `${format(scheduleDate, "yyyy-MM-dd")}T${
                          scheduleTime || "00:00"
                        }`
                      ).toISOString()
                    : undefined;
                  toast({
                    title: "Scheduled",
                    description: `Post scheduled on ${selectedSocial?.platform}`,
                  });
                  setSchedulerOpen(false);
                  setScheduleContent("");
                  setScheduleDate(undefined);
                  setScheduleTime("");
                  setScheduleMedia(null);
                  setDescriptionPrompt("");
                }}
              >
                Schedule Post
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewsAndSocial;