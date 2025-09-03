export type TimeRange =
  | "last_7_days"
  | "last_14_days"
  | "last_30_days"
  | "last_90_days";

export interface ProfileActivity {
  profile_visits: number;
  website_taps: number;
  address_taps: number;
  call_button_taps: number;
  email_button_taps: number;
  text_button_taps: number;
}

export interface ReachSources {
  home?: number;
  hashtags?: number;
  profile?: number;
  other?: number;
}

export interface ContentInteractions {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  replies?: number; // for stories/reels/live
}

export interface TopItem {
  id: string;
  type: "post" | "story" | "reel" | "video" | "live";
  title?: string;
  accounts_reached?: number;
  impressions?: number;
  interactions?: number;
}

export interface AccountsReachedSection {
  reach: number;
  reached_audience: { followers: number; non_followers: number };
  content_reach: {
    posts?: number;
    stories?: number;
    reels?: number;
    videos?: number;
    live?: number;
  };
  top_posts?: TopItem[];
  top_stories?: TopItem[];
  impressions: number;
  profile_activity: ProfileActivity;
}

export interface AccountsEngagedSection {
  total_accounts_engaged: number;
  engaged_audience: { followers: number; non_followers: number };
  engager_demographics?: {
    top_countries?: string[];
    top_cities?: string[];
    age_ranges?: string[];
    gender_distribution?: { male?: number; female?: number; other?: number | string };
  };
  content_interactions: ContentInteractions;
  top_posts?: TopItem[];
  top_stories?: TopItem[];
  top_reels?: TopItem[];
  top_videos?: TopItem[];
  top_live_videos?: TopItem[];
}

export interface TotalFollowersSection {
  follower_count: number;
  growth: { follows: number; unfollows: number; net: number };
  top_locations?: { countries?: string[]; cities?: string[] };
  age_distribution?: {
    overall?: Record<string, number>;
    men?: Record<string, number>;
    women?: Record<string, number>;
  };
  gender_distribution?: { male?: number; female?: number; other?: number | string };
  active_times?: {
    by_hour?: number[];
    by_day?: Record<
      "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun",
      number
    >;
  };
}

export interface AccountInsights {
  time_ranges: TimeRange[];
  accounts_reached: AccountsReachedSection;
  accounts_engaged: AccountsEngagedSection;
  total_followers: TotalFollowersSection;
}

export interface PerPostInsights {
  post_id: string;
  accounts_reached: number;
  content_interactions: ContentInteractions;
  profile_activity: ProfileActivity;
  impressions: number;
  reach_sources: ReachSources;
  promoted?: boolean;
}

export interface ContentYouSharedSummary {
  period: TimeRange;
  counts: {
    posts: number;
    stories: number;
    reels: number;
    videos: number;
    live: number;
  };
  active_promotions: number;
}

export interface ContentInsights {
  summary: ContentYouSharedSummary;
  per_post?: PerPostInsights[];
}

export interface InstagramInsightsBundle {
  account: AccountInsights;
  content: ContentInsights;
}
