import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as path from 'path';
import type { MediaType, Region, ProfileActivityBreakdown, StoryNavigationBreakdown, ApiInsightResponse, ApiError10 } from '../src/types/ig_media_insights';

interface PerItemSummary {
  id: string;
  type: string;
  date: string;
  image_url: string;
  views: number;
  reach: number;
  interactions: {
    likes?: number;
    comments?: number;
    saves?: number;
    shares?: number;
    replies?: number;
  };
  profile_activity: { profile_visits: number; follows: number };
  impressions_legacy?: number;
  ig_reels_avg_watch_time?: number;
  ig_reels_video_view_total_time?: number;
  navigation_breakdown?: StoryNavigationBreakdown;
}

// simple argument parser
function arg(name: string, def: string): string {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1) return process.argv[idx + 1];
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (found) return found.split('=')[1];
  return def;
}

const seed = Number(arg('seed', '42'));
const count = Number(arg('count', '15'));
const outDir = arg('out', 'mocks');
const region = arg('region', 'global') as Region;
const storyHighlight = arg('story_highlight', 'false') === 'true';

// deterministic PRNG
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(seed);
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number) {
  return rand() * (max - min) + min;
}

const now = new Date('2024-08-15T00:00:00Z');
const perItems: PerItemSummary[] = [];

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

for (let i = 0; i < count; i++) {
  const typeRand = rand();
  const type: MediaType = typeRand < 0.5 ? 'FEED' : typeRand < 0.8 ? 'REELS' : 'STORY';
  const id = `${Math.floor(rand() * 1e8)}`;
  const createdAt = new Date(now.getTime() - randInt(0, 59) * 86400000);

  const views = randInt(120, 250);
  const reach = Math.round(views * randFloat(0.65, 0.9));

  let likes: number | undefined;
  let comments: number | undefined;
  let saved: number | undefined;
  let shares: number | undefined;
  let replies: number | undefined;
  let navigation_breakdown: StoryNavigationBreakdown | undefined;
  let navigation_total: number | undefined;
  let ig_reels_avg_watch_time: number | undefined;
  let ig_reels_video_view_total_time: number | undefined;
  let impressions_legacy: number | undefined;

  // interactions
  if (type === 'FEED' || type === 'REELS') {
    likes = Math.round(reach * randFloat(0.06, 0.12));
    comments = Math.round((likes || 0) * randFloat(0.07, 0.12));
    saved = Math.round((likes || 0) * randFloat(0.10, 0.18));
    shares = Math.round((likes || 0) * randFloat(0.05, 0.10));
  } else if (type === 'STORY') {
    shares = Math.round(reach * randFloat(0.01, 0.03));
    replies = region === 'eu' || region === 'jp' ? 0 : Math.round(reach * randFloat(0.005, 0.02));
    navigation_breakdown = {
      TAP_FORWARD: randInt(10, 30),
      TAP_BACK: randInt(5, 15),
      TAP_EXIT: randInt(1, 5),
      SWIPE_FORWARD: randInt(10, 25),
    };
    navigation_total = Object.values(navigation_breakdown).reduce((a, b) => a + b, 0);
  }

  // reels extras
  if (type === 'REELS') {
    ig_reels_avg_watch_time = randFloat(6, 18);
    ig_reels_video_view_total_time = Math.round(views * ig_reels_avg_watch_time);
  }

  // profile activity
  const profile_activity_breakdown: ProfileActivityBreakdown = {
    BIO_LINK_CLICKED: randInt(0, 5),
    CALL: randInt(0, 3),
    DIRECTION: randInt(0, 3),
    EMAIL: randInt(0, 3),
    OTHER: randInt(0, 2),
    TEXT: randInt(0, 2),
  };
  const profile_activity_total = Object.values(profile_activity_breakdown).reduce((a, b) => a + b, 0);
  const follows = randInt(0, 5);

  // legacy impressions
  if (createdAt <= new Date('2024-07-01T00:00:00Z') && (type === 'FEED' || type === 'STORY')) {
    impressions_legacy = randInt(views, Math.round(views * 1.1));
  }

  // story lifecycle rules
  if (type === 'STORY' && !storyHighlight) {
    const ageMs = now.getTime() - createdAt.getTime();
    if (ageMs > 86400000) {
      writeFileSync(path.join(outDir, `media_${id}.insights.json`), JSON.stringify({ data: [] }, null, 2));
      continue;
    }
  }

  if (type === 'STORY' && views < 5) {
    const err: ApiError10 = { error: { message: '(#10) Not enough viewers', code: 10 } };
    writeFileSync(path.join(outDir, `media_${id}.insights.json`), JSON.stringify(err, null, 2));
    continue;
  }

  const data: ApiInsightResponse = { data: [] };
  data.data.push({ name: 'views', period: 'lifetime', values: [{ value: views }] });
  data.data.push({ name: 'reach', period: 'lifetime', values: [{ value: reach }] });
  if (likes !== undefined) data.data.push({ name: 'likes', period: 'lifetime', values: [{ value: likes }] });
  if (comments !== undefined) data.data.push({ name: 'comments', period: 'lifetime', values: [{ value: comments }] });
  if (saved !== undefined) data.data.push({ name: 'saved', period: 'lifetime', values: [{ value: saved }] });
  if (shares !== undefined) data.data.push({ name: 'shares', period: 'lifetime', values: [{ value: shares }] });
  if (follows !== undefined) data.data.push({ name: 'follows', period: 'lifetime', values: [{ value: follows }] });
  if (replies !== undefined) data.data.push({ name: 'replies', period: 'lifetime', values: [{ value: replies }] });
  if (impressions_legacy !== undefined) data.data.push({ name: 'impressions', period: 'lifetime', values: [{ value: impressions_legacy }] });
  if (type === 'STORY' && navigation_breakdown && navigation_total !== undefined) {
    data.data.push({
      name: 'navigation',
      period: 'lifetime',
      values: [{ value: navigation_total, breakdowns: { story_navigation_action_type: navigation_breakdown } }],
    });
  }
  if (profile_activity_breakdown && profile_activity_total !== undefined) {
    data.data.push({
      name: 'profile_activity',
      period: 'lifetime',
      values: [{ value: profile_activity_total, breakdowns: { action_type: profile_activity_breakdown } }],
    });
  }
  if (ig_reels_avg_watch_time !== undefined) {
    data.data.push({ name: 'ig_reels_avg_watch_time', period: 'lifetime', values: [{ value: ig_reels_avg_watch_time }] });
  }
  if (ig_reels_video_view_total_time !== undefined) {
    data.data.push({ name: 'ig_reels_video_view_total_time', period: 'lifetime', values: [{ value: ig_reels_video_view_total_time }] });
  }

  writeFileSync(path.join(outDir, `media_${id}.insights.json`), JSON.stringify(data, null, 2));

  // aggregate per-item structure
  const typeMap: Record<MediaType, string> = {
    FEED: 'post',
    STORY: 'story',
    REELS: 'reel',
  };

  const item = {
    id,
    type: typeMap[type],
    date: createdAt.toISOString(),
    image_url: `https://picsum.photos/seed/${id}/200/200`,
    views,
    reach,
    interactions: { likes, comments, saves: saved, shares, replies },
    profile_activity: {
      profile_visits: profile_activity_total,
      follows,
    },
    impressions_legacy,
    ig_reels_avg_watch_time,
    ig_reels_video_view_total_time,
    navigation_breakdown,
  };

  // filter for last 30 days
  const cutoff = new Date(now.getTime() - 30 * 86400000);
  if (createdAt >= cutoff) {
    perItems.push(item);
  }
}

// write aggregator
writeFileSync(path.join(outDir, 'instagram_insights.per_item.last_30_days.json'), JSON.stringify(perItems, null, 2));
