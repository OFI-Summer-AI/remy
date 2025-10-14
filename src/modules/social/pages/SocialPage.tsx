import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { 
  Star, TrendingUp, TrendingDown, Users, MessageSquare, Calendar, 
  ThumbsUp, Eye, Instagram, Plus, BarChart3, Sparkles, Target,
  Clock, Hash, Zap, Award, AlertCircle, CheckCircle, XCircle,
  Brain, Activity, PieChart, LineChart
} from "lucide-react";

// Mock AI Recommendations
const aiRecommendations = [
  {
    type: "content",
    priority: "high",
    title: "Post at 6 PM for Maximum Engagement",
    description: "Based on your audience activity, posting at 6 PM increases engagement by 45%",
    icon: Clock,
    color: "text-orange-600"
  },
  {
    type: "response",
    priority: "urgent",
    title: "3 Reviews Need Response",
    description: "You have 3 recent reviews waiting for a response. Quick replies increase ratings.",
    icon: AlertCircle,
    color: "text-red-600"
  },
  {
    type: "hashtag",
    priority: "medium",
    title: "Trending: #LocalEats",
    description: "Add #LocalEats to your posts. It's trending with 250K interactions this week.",
    icon: Hash,
    color: "text-blue-600"
  },
  {
    type: "content",
    priority: "low",
    title: "Video Content Gap",
    description: "Your competitors post 3x more videos. Consider adding video content to your strategy.",
    icon: Target,
    color: "text-purple-600"
  }
];

// Mock Sentiment Analysis
const sentimentData = {
  positive: 65,
  neutral: 25,
  negative: 10
};

// Mock Content Calendar
const contentCalendar = [
  { day: "Mon", planned: 2, posted: 2, status: "complete" },
  { day: "Tue", planned: 1, posted: 1, status: "complete" },
  { day: "Wed", planned: 3, posted: 2, status: "partial" },
  { day: "Thu", planned: 2, posted: 0, status: "pending" },
  { day: "Fri", planned: 3, posted: 0, status: "pending" },
  { day: "Sat", planned: 1, posted: 0, status: "pending" },
  { day: "Sun", planned: 2, posted: 0, status: "pending" }
];

// Mock Performance Metrics
const performanceMetrics = [
  { metric: "Avg Response Time", value: "2.3h", change: "-15%", trend: "up", target: "< 3h" },
  { metric: "Review Rating", value: "4.1", change: "+0.2", trend: "up", target: "4.5" },
  { metric: "Engagement Rate", value: "3.8%", change: "+0.5%", trend: "up", target: "5%" },
  { metric: "Follower Growth", value: "+285", change: "+12%", trend: "up", target: "500/mo" }
];

// Mock Competitor Analysis
const competitors = [
  { name: "La Bella Vita", rating: 4.5, reviews: 420, followers: "15.2K", engagement: "5.1%" },
  { name: "Trattoria Rosa", rating: 4.2, reviews: 380, followers: "11.8K", engagement: "4.5%" },
  { name: "Your Restaurant", rating: 4.1, reviews: 562, followers: "12.3K", engagement: "4.2%" },
  { name: "Casa Mia", rating: 3.9, reviews: 290, followers: "9.5K", engagement: "3.8%" }
];

// Mock Best Times to Post
const bestTimes = [
  { time: "6:00 PM", day: "Friday", engagement: "8.2%", recommended: true },
  { time: "1:00 PM", day: "Saturday", engagement: "7.8%", recommended: true },
  { time: "12:30 PM", day: "Wednesday", engagement: "7.1%", recommended: true },
  { time: "7:30 PM", day: "Thursday", engagement: "6.5%", recommended: false },
  { time: "11:00 AM", day: "Sunday", engagement: "6.2%", recommended: false }
];

// Mock reviews data
const reviewsData = [
  {
    platform: "TripAdvisor",
    rating: 4.3,
    totalReviews: 284,
    recentChange: "+12",
    trend: "up",
    pendingResponses: 3
  },
  {
    platform: "Google Maps",
    rating: 4.1,
    totalReviews: 562,
    recentChange: "+8",
    trend: "up",
    pendingResponses: 0
  },
  {
    platform: "Yelp",
    rating: 3.9,
    totalReviews: 156,
    recentChange: "-3",
    trend: "down",
    pendingResponses: 2
  }
];

// Mock social data
const socialData = [
  {
    platform: "Instagram",
    followers: "12.3K",
    engagement: "4.2%",
    posts: 42,
    trend: "up",
    change: "+2.1%"
  },
  {
    platform: "Facebook", 
    followers: "8.7K",
    engagement: "3.8%",
    posts: 18,
    trend: "up",
    change: "+1.4%"
  },
  {
    platform: "Twitter",
    followers: "3.2K", 
    engagement: "2.1%",
    posts: 24,
    trend: "down",
    change: "-0.3%"
  }
];

const SocialAnalyticsApp = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <section aria-label="Reviews and Social Media Overview" className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Social & Reviews</h1>
          <p className="text-muted-foreground">AI-powered insights for your online presence</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
          <Plus className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          Create Post
        </button>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Content Planning
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* AI Recommendations Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRecommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${rec.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{rec.title}</h3>
                            <Badge
                              variant={
                                rec.priority === "urgent"
                                  ? "destructive"
                                  : rec.priority === "high"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <Badge variant={metric.trend === "up" ? "default" : "destructive"}>
                          {metric.trend === "up" ? (
                            <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                          )}
                          {metric.change}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sentiment & Calendar Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Sentiment Analysis</h2>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Positive</span>
                        </div>
                        <span className="font-semibold">{sentimentData.positive}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${sentimentData.positive}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium">Neutral</span>
                        </div>
                        <span className="font-semibold">{sentimentData.neutral}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${sentimentData.neutral}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">Negative</span>
                        </div>
                        <span className="font-semibold">{sentimentData.negative}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${sentimentData.negative}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Calendar */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">This Week's Content</h2>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {contentCalendar.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-12">{day.day}</span>
                        <div className="flex-grow mx-3">
                          <div className="flex items-center gap-1">
                            {[...Array(day.planned)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-2 flex-grow rounded ${
                                  i < day.posted
                                    ? "bg-green-500"
                                    : day.status === "pending"
                                    ? "bg-gray-200"
                                    : "bg-yellow-500"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {day.posted}/{day.planned}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* REVIEWS TAB */}
        <TabsContent value="reviews" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Reviews Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviewsData.map((review, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      {review.platform}
                      <Badge variant={review.trend === "up" ? "default" : "destructive"}>
                        {review.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
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
                                  ? "text-yellow-500 fill-current"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.totalReviews} total reviews
                      </p>
                      {review.pendingResponses > 0 ? (
                        <p className="text-xs font-medium text-orange-600 pt-2 border-t">
                          {review.pendingResponses} pending response{review.pendingResponses > 1 ? 's' : ''}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-green-600 pt-2 border-t">
                          All responses up to date
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Response Suggestions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Response Suggestions
            </h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">Sarah M. - Google Maps</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <Badge>2 hours ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      "Amazing pasta! Best Italian food I've had outside Italy. The service was wonderful."
                    </p>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-purple-900 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Suggested Response:
                      </p>
                      <p className="text-sm text-gray-800">
                        "Thank you so much, Sarah! We're thrilled you enjoyed our pasta. Our chef takes great pride in using authentic Italian recipes. We'd love to welcome you back soon! 🍝"
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">John D. - TripAdvisor</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                      </div>
                      <Badge>5 hours ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      "Great atmosphere and delicious food. Wait time was a bit long but worth it!"
                    </p>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-purple-900 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Suggested Response:
                      </p>
                      <p className="text-sm text-gray-800">
                        "Thank you for your feedback, John! We're glad you enjoyed the atmosphere and food. We apologize for the wait and are working on improving our service times. Hope to see you again!"
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SOCIAL MEDIA TAB */}
        <TabsContent value="social" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Social Media Engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {socialData.map((social, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      {social.platform}
                      <Badge variant={social.trend === "up" ? "default" : "destructive"}>
                        {social.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Times to Post */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Optimal Posting Times
            </h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {bestTimes.map((time, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        time.recommended ? "bg-green-50 border border-green-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {time.recommended && <Zap className="w-4 h-4 text-green-600" />}
                        <div>
                          <p className="font-medium text-sm">{time.day} at {time.time}</p>
                          <p className="text-xs text-muted-foreground">
                            Avg engagement: {time.engagement}
                          </p>
                        </div>
                      </div>
                      {time.recommended && (
                        <Badge variant="default" className="bg-green-600">Recommended</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CONTENT PLANNING TAB */}
        <TabsContent value="content" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Content Calendar - This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentCalendar.map((day, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      {day.day}
                      <Badge
                        variant={
                          day.status === "complete"
                            ? "default"
                            : day.status === "partial"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {day.posted}/{day.planned} posted
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(day.planned)].map((_, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border-2 ${
                            i < day.posted
                              ? "border-green-500 bg-green-50"
                              : "border-dashed border-gray-300 bg-gray-50"
                          }`}
                        >
                          <p className="text-xs font-medium">
                            {i < day.posted ? "✓ Posted" : "Scheduled"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {["6:00 PM", "1:00 PM", "12:30 PM"][i % 3]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Hashtag Suggestions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Trending Hashtags for You
            </h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: "#LocalEats", count: "250K", trend: "hot" },
                    { tag: "#FoodieLife", count: "180K", trend: "rising" },
                    { tag: "#ItalianFood", count: "150K", trend: "stable" },
                    { tag: "#RestaurantWeek", count: "95K", trend: "hot" },
                    { tag: "#ChefSpecial", count: "75K", trend: "rising" },
                    { tag: "#FoodPhotography", count: "320K", trend: "stable" }
                  ].map((hashtag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-full"
                    >
                      <span className="text-sm font-medium text-blue-900">{hashtag.tag}</span>
                      <span className="text-xs text-blue-600">{hashtag.count}</span>
                      {hashtag.trend === "hot" && <span className="text-xs">🔥</span>}
                      {hashtag.trend === "rising" && (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Competitor Analysis</h2>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {competitors.map((comp, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        comp.name === "Your Restaurant"
                          ? "border-primary bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{comp.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{comp.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {comp.reviews} reviews
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{comp.followers}</p>
                        <p className="text-xs text-muted-foreground">{comp.engagement} eng.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Monthly Growth</h2>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { month: "January", followers: 285, reviews: 42 },
                      { month: "February", followers: 312, reviews: 38 },
                      { month: "March", followers: 298, reviews: 45 }
                    ].map((month, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">+{month.followers}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">+{month.reviews}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Top Performing Posts</h2>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { emoji: "🍝", likes: 312, platform: "Instagram" },
                      { emoji: "🎉", likes: 289, platform: "Facebook" },
                      { emoji: "🍷", likes: 245, platform: "Instagram" }
                    ].map((post, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{post.emoji}</span>
                          <span className="text-sm text-muted-foreground">{post.platform}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SocialAnalyticsApp;