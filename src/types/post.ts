export type Platform = 'instagram' | 'x' | 'linkedin' | 'tiktok' | 'youtube';

export type PostStatus = 'draft' | 'scheduled' | 'published';

export type MediaType = 'carousel' | 'image' | 'video' | 'reel' | 'text';

export interface Post {
  id: string;
  title: string;
  platform: Platform;
  caption: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  status: PostStatus;
  tags: string[];
  campaign?: string;
  mediaType?: MediaType;
  mediaPlaceholderTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'calendar' | 'agenda' | 'analytics';

export interface PlatformConfig {
  id: Platform;
  name: string;
  shortName: string;
  brandColor: string;
  accentBg: string;
  borderAccent: string;
  textColor: string;
  badgeBg: string;
  charLimit: number;
  recommendedLength: string;
  bestTimes: string[];
  handlePrefix: string;
  defaultProfileName: string;
}
