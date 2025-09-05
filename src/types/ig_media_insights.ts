export type MediaType = 'FEED' | 'STORY' | 'REELS';
export type Period = 'lifetime';
export type Region = 'global' | 'eu' | 'jp';

export type ProfileActivityBreakdown = {
  BIO_LINK_CLICKED: number;
  CALL: number;
  DIRECTION: number;
  EMAIL: number;
  OTHER: number;
  TEXT: number;
};

export type StoryNavigationBreakdown = {
  TAP_FORWARD: number;
  TAP_BACK: number;
  TAP_EXIT: number;
  SWIPE_FORWARD: number;
};

export interface MediaCore {
  id: string;
  type: MediaType;
  created_at: string; // ISO
  region?: Region;
  views: number;
  reach?: number;
  likes?: number;
  comments?: number;
  saved?: number;
  shares?: number;
  follows?: number;
  replies?: number; // STORY only
  impressions_legacy?: number; // FEED/STORY legacy only
  ig_reels_avg_watch_time?: number; // REELS
  ig_reels_video_view_total_time?: number; // REELS
  navigation_total?: number; // STORY
  navigation_breakdown?: StoryNavigationBreakdown; // STORY
  profile_activity_total?: number;
  profile_activity_breakdown?: ProfileActivityBreakdown;
}

export interface ApiInsightValue {
  value: number;
  breakdowns?: {
    action_type?: ProfileActivityBreakdown;
    story_navigation_action_type?: StoryNavigationBreakdown;
  };
  end_time?: string;
}

export interface ApiInsightDatum {
  name: string;
  period: Period;
  values: ApiInsightValue[];
}

export interface ApiInsightResponse {
  data: ApiInsightDatum[];
}

export interface ApiError10 {
  error: { message: string; code: 10; }; // "(#10) Not enough viewers"
}
