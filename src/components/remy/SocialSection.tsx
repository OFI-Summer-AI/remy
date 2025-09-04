import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Calendar as CalendarIcon,
  ThumbsUp,
  Eye,
  Upload,
} from "lucide-react";
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
import type { InstagramInsightsBundle } from "@/types/instagram_insights";
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
import Mark from "./Mark";

type RecentPost = { image: string; caption: string; likes: number; comments: number; date: string };

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

interface InstagramInsightsData extends InstagramInsightsBundle {
  metrics: {
    impressions: InsightMetric;
    reach: InsightMetric;
    engagement: InsightMetric;
    saved: InsightMetric;
    video_views: InsightMetric;
  };
}

const SocialSection: React.FC = () => {
  const { toast } = useToast();
  const [selectedSocial, setSelectedSocial] = React.useState<Social | null>(null);
  const [schedulerOpen, setSchedulerOpen] = React.useState(false);
  const [scheduleContent, setScheduleContent] = React.useState("");
  const [scheduleDate, setScheduleDate] = React.useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = React.useState("");
  const [scheduleMedia, setScheduleMedia] = React.useState<string | null>(null);
  const [descriptionPrompt, setDescriptionPrompt] = React.useState("");
  const [insightsOpen, setInsightsOpen] = React.useState(false);
  const [insightsData, setInsightsData] = React.useState<InstagramInsightsData | Record<string, number | InsightMetric> | null>(null);
  const [insightsPlatform, setInsightsPlatform] = React.useState("");
  const [insightsRange, setInsightsRange] = React.useState("7");
  const [insightsCategory, setInsightsCategory] = React.useState("Account");

  // TODO: replace with getTrendingHashtags() when backend is available
  const trendingHashtags = ["foodie", "yum", "instafood"];

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

  const { data: socialData = defaultSocial } = useQuery<Social[]>({
    queryKey: ["social"],
    // TODO: replace with getSocialStats() when backend is available
    queryFn: async () => Promise.resolve(defaultSocial),
    initialData: defaultSocial,
  });

  const openInsights = async (platform: string) => {
    try {
      if (platform === "Instagram") {
        const data = await viewSocialInsights<{ platform: string; insights: InstagramInsightsData }>(platform);
        setInsightsData(data.insights);
      } else {
        const data = await viewSocialInsights<{ platform: string; insights: Record<string, number | InsightMetric> }>(platform);
        setInsightsData(data.insights);
      }
      setInsightsPlatform(platform);
      setInsightsOpen(true);
      toast({ title: "Opened", description: `Viewing ${platform} insights` });
    } catch {
      toast({ title: "Error", description: `Failed to load ${platform} insights` });
    }
  };

  return (
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
                  {selectedSocial.recentPosts?.map((post, index) => (
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
                <Button onClick={() => selectedSocial && openInsights(selectedSocial.platform)}>
                  View Insights
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      title: "Audience",
                      description: `Managing ${selectedSocial?.platform} audience`,
                    })
                  }
                >
                  Manage Audience
                </Button>
                <Button variant="secondary" onClick={() => setSchedulerOpen(true)}>
                  Create Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Insights Modal */}
      <Dialog open={insightsOpen} onOpenChange={setInsightsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{insightsPlatform} Insights</DialogTitle>
          </DialogHeader>
          <div className="mb-4 flex gap-2">
            <Button
              variant={insightsCategory === "Account" ? "default" : "outline"}
              size="sm"
              onClick={() => setInsightsCategory("Account")}
            >
              Account
            </Button>
            <Button
              variant={insightsCategory === "Content" ? "default" : "outline"}
              size="sm"
              onClick={() => setInsightsCategory("Content")}
            >
              Content
            </Button>
          </div>
          {insightsPlatform === "Instagram" && insightsData && 'metrics' in insightsData ? (
            insightsCategory === "Account" ? (
              (() => {
                const lineData = insightsData.metrics.impressions.series?.map((point, idx) => ({
                  date: point.date,
                  impressions: point.value,
                  reach: insightsData.metrics.reach.series?.[idx]?.value ?? 0,
                  engagement: insightsData.metrics.engagement.series?.[idx]?.value ?? 0,
                })) ?? [];
                const barData = insightsData.metrics.saved.series?.map((point, idx) => ({
                  date: point.date,
                  saved: point.value,
                  video_views: insightsData.metrics.video_views.series?.[idx]?.value ?? 0,
                })) ?? [];
                const account = insightsData.account;
                return (
                  <div className="space-y-6">
                    <Select value={insightsRange} onValueChange={setInsightsRange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="14">Last 14 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <ChartContainer className="h-[250px]" config={{
                        impressions: { label: "Impressions", color: "hsl(var(--chart-1))" },
                        reach: { label: "Reach", color: "hsl(var(--chart-2))" },
                        engagement: { label: "Engagement", color: "hsl(var(--chart-3))" },
                      }}>
                      <AreaChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="impressions" stroke="var(--color-impressions)" fill="var(--color-impressions)" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="reach" stroke="var(--color-reach)" fill="var(--color-reach)" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="engagement" stroke="var(--color-engagement)" fill="var(--color-engagement)" fillOpacity={0.3} />
                      </AreaChart>
                    </ChartContainer>
                    <ChartContainer className="h-[250px]" config={{
                        saved: { label: "Saved", color: "hsl(var(--chart-4))" },
                        video_views: { label: "Video Views", color: "hsl(var(--chart-5))" },
                      }}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="saved" fill="var(--color-saved)" radius={[4,4,0,0]} />
                        <Bar dataKey="video_views" fill="var(--color-video_views)" radius={[4,4,0,0]} />
                      </BarChart>
                    </ChartContainer>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-1">Accounts Reached</h4>
                        <p>Reach: {account.accounts_reached.reach}</p>
                        <p>Followers: {account.accounts_reached.reached_audience.followers}</p>
                        <p>Non-followers: {account.accounts_reached.reached_audience.non_followers}</p>
                        <p>Impressions: {account.accounts_reached.impressions}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Accounts Engaged</h4>
                        <p>Total: {account.accounts_engaged.total_accounts_engaged}</p>
                        <p>Followers: {account.accounts_engaged.engaged_audience.followers}</p>
                        <p>Non-followers: {account.accounts_engaged.engaged_audience.non_followers}</p>
                        <p>Likes: {account.accounts_engaged.content_interactions.likes}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Total Followers</h4>
                        <p>Count: {account.total_followers.follower_count}</p>
                        <p>Net Growth: {account.total_followers.growth.net}</p>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              (() => {
                const content = insightsData.content;
                return (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">Content You Shared</h4>
                      <p>
                        Posts: {content.summary.counts.posts}, Stories: {content.summary.counts.stories}, Reels: {content.summary.counts.reels}, Videos: {content.summary.counts.videos}, Live: {content.summary.counts.live}
                      </p>
                      <p>Active promotions: {content.summary.active_promotions}</p>
                    </div>
                    {content.per_post && (
                      <div>
                        <h5 className="font-semibold">Posts</h5>
                        {content.per_post.map((p) => (
                          <pre key={p.post_id} className="bg-muted p-2 rounded mb-2 text-xs">{JSON.stringify(p, null, 2)}</pre>
                        ))}
                      </div>
                    )}
                    {content.per_story && (
                      <div>
                        <h5 className="font-semibold">Stories</h5>
                        {content.per_story.map((s) => (
                          <pre key={s.story_id} className="bg-muted p-2 rounded mb-2 text-xs">{JSON.stringify(s, null, 2)}</pre>
                        ))}
                      </div>
                    )}
                    {content.per_reel && (
                      <div>
                        <h5 className="font-semibold">Reels</h5>
                        {content.per_reel.map((r) => (
                          <pre key={r.reel_id} className="bg-muted p-2 rounded mb-2 text-xs">{JSON.stringify(r, null, 2)}</pre>
                        ))}
                      </div>
                    )}
                    {content.per_video && (
                      <div>
                        <h5 className="font-semibold">Videos</h5>
                        {content.per_video.map((v) => (
                          <pre key={v.video_id} className="bg-muted p-2 rounded mb-2 text-xs">{JSON.stringify(v, null, 2)}</pre>
                        ))}
                      </div>
                    )}
                    {content.per_live && (
                      <div>
                        <h5 className="font-semibold">Live</h5>
                        {content.per_live.map((l) => (
                          <pre key={l.live_id} className="bg-muted p-2 rounded mb-2 text-xs">{JSON.stringify(l, null, 2)}</pre>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()
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
                      <div className="text-sm text-muted-foreground">{key.replace(/_/g, " ")}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scheduler Dialog */}
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
                <img src={scheduleMedia} alt="Preview" className="mx-auto max-h-40 rounded-md object-cover" />
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
                    reader.onloadend = () => setScheduleMedia(reader.result as string);
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
                <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                  <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
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
                  const scheduledFor = scheduleDate
                    ? new Date(`${format(scheduleDate, "yyyy-MM-dd")}T${scheduleTime || "00:00"}`).toISOString()
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
      <Mark />
    </div>
  );
};

export default SocialSection;
