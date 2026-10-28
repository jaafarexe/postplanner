import { Platform, PlatformConfig, Post, PostStatus } from '../types/post';

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    shortName: 'IG',
    brandColor: '#E1306C',
    accentBg: 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200',
    borderAccent: 'border-l-rose-500',
    textColor: 'text-rose-600',
    badgeBg: 'bg-rose-100 text-rose-800',
    charLimit: 2200,
    recommendedLength: '125 - 150 characters',
    bestTimes: ['11:00 AM', '02:00 PM', '07:00 PM'],
    handlePrefix: '@',
    defaultProfileName: 'PostPlanner Studio',
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    shortName: 'X',
    brandColor: '#0F1419',
    accentBg: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300',
    borderAccent: 'border-l-slate-800',
    textColor: 'text-slate-900',
    badgeBg: 'bg-slate-200 text-slate-800',
    charLimit: 280,
    recommendedLength: '70 - 100 characters',
    bestTimes: ['08:30 AM', '12:00 PM', '05:00 PM'],
    handlePrefix: '@',
    defaultProfileName: 'PostPlanner Official',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    shortName: 'IN',
    brandColor: '#0A66C2',
    accentBg: 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-200',
    borderAccent: 'border-l-sky-600',
    textColor: 'text-sky-700',
    badgeBg: 'bg-sky-100 text-sky-800',
    charLimit: 3000,
    recommendedLength: '200 - 350 words',
    bestTimes: ['09:00 AM', '01:00 PM', '05:30 PM'],
    handlePrefix: '',
    defaultProfileName: 'PostPlanner Enterprise',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    shortName: 'TT',
    brandColor: '#00F2FE',
    accentBg: 'bg-teal-50 hover:bg-teal-100 text-teal-950 border-teal-200',
    borderAccent: 'border-l-teal-500',
    textColor: 'text-teal-700',
    badgeBg: 'bg-teal-100 text-teal-800',
    charLimit: 2200,
    recommendedLength: '100 - 150 characters with sound tags',
    bestTimes: ['07:00 AM', '03:00 PM', '09:00 PM'],
    handlePrefix: '@',
    defaultProfileName: 'postplanner_app',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    shortName: 'YT',
    brandColor: '#FF0000',
    accentBg: 'bg-red-50 hover:bg-red-100 text-red-950 border-red-200',
    borderAccent: 'border-l-red-600',
    textColor: 'text-red-700',
    badgeBg: 'bg-red-100 text-red-800',
    charLimit: 5000,
    recommendedLength: '250 - 500 characters teaser + links',
    bestTimes: ['02:00 PM', '04:00 PM', '06:00 PM'],
    handlePrefix: '@',
    defaultProfileName: 'PostPlanner Tech',
  },
};

export const STATUS_CONFIG: Record<
  PostStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    description: string;
  }
> = {
  draft: {
    label: 'Draft',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
    dotClass: 'bg-amber-500',
    description: 'Work in progress, not ready to queue',
  },
  scheduled: {
    label: 'Scheduled',
    badgeClass: 'bg-blue-50 text-blue-800 border border-blue-200',
    dotClass: 'bg-blue-500',
    description: 'Approved and waiting for publication time',
  },
  published: {
    label: 'Published',
    badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    dotClass: 'bg-emerald-500',
    description: 'Successfully posted live to platform',
  },
};

export const CAMPAIGN_OPTIONS = [
  'Q4 Product Launch',
  'Weekly Feature Spotlight',
  'Industry Insights & Thought Leadership',
  'Behind The Scenes & Culture',
  'Customer Testimonials & Case Studies',
  'Tutorials & How-To Guides',
  'Holiday & Seasonal Promo',
];

export const ENGAGEMENT_TIME_PRESETS = [
  { label: 'Morning Buzz (08:30)', time: '08:30' },
  { label: 'Mid-Morning (10:00)', time: '10:00' },
  { label: 'Lunch Break (12:30)', time: '12:30' },
  { label: 'Afternoon Peak (15:00)', time: '15:00' },
  { label: 'Evening Commute (17:30)', time: '17:30' },
  { label: 'Night Engagement (20:00)', time: '20:00' },
];

/**
 * Creates high-quality sample posts tailored to the current anchor month
 */
export function getInitialSamplePosts(anchorDate: Date = new Date()): Post[] {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth(); // 0-indexed

  // Helper to construct YYYY-MM-DD
  const formatDay = (d: number, mOffset: number = 0): string => {
    const target = new Date(year, month + mOffset, d);
    const yStr = target.getFullYear();
    const mStr = String(target.getMonth() + 1).padStart(2, '0');
    const dStr = String(target.getDate()).padStart(2, '0');
    return `${yStr}-${mStr}-${dStr}`;
  };

  return [
    {
      id: 'post-1',
      title: 'Q4 Major Platform 3.0 Reveal',
      platform: 'x',
      caption:
        'Today we are dropping PostPlanner 3.0 🚀 Faster scheduling, unified brand asset libraries, and instantaneous calendar drag-and-drop.\n\nTake a look inside the new workspace: https://postplanner.app/v3',
      date: formatDay(24),
      time: '09:00',
      status: 'published',
      tags: ['#ProductUpdate', '#MarketingTools', '#BuildInPublic'],
      campaign: 'Q4 Product Launch',
      mediaType: 'image',
      mediaPlaceholderTitle: 'Product 3.0 Interface Teaser',
      createdAt: '2026-10-20T10:00:00Z',
      updatedAt: '2026-10-24T09:00:00Z',
    },
    {
      id: 'post-2',
      title: '5 Ways Top Agencies Structure Weekly Content',
      platform: 'linkedin',
      caption:
        'Managing content across 5+ client accounts doesn’t need to be chaotic. The best digital teams follow a strict 3-tier cadence:\n\n1. Anchor pillar pieces (1 per week)\n2. Platform-native micro clips (3 per week)\n3. Conversation-starter polls & questions (daily)\n\nWhat is your team’s biggest bottleneck when planning monthly content? Drop your thoughts below.',
      date: formatDay(25),
      time: '10:30',
      status: 'published',
      tags: ['#ContentStrategy', '#AgencyGrowth', '#SocialMediaMarketing'],
      campaign: 'Industry Insights & Thought Leadership',
      mediaType: 'carousel',
      mediaPlaceholderTitle: '5-Slide Strategy Carousel Infographic',
      createdAt: '2026-10-21T11:00:00Z',
      updatedAt: '2026-10-25T10:30:00Z',
    },
    {
      id: 'post-3',
      title: 'Day in the Life of a Head of Growth',
      platform: 'tiktok',
      caption:
        'Rating every task in my Monday marketing standup ☕️👀 How many syncs are on your calendar today? #agencylife #growthhacker #worktok',
      date: formatDay(25),
      time: '15:00',
      status: 'scheduled',
      tags: ['#AgencyLife', '#WorkTok', '#MarketingDayInTheLife'],
      campaign: 'Behind The Scenes & Culture',
      mediaType: 'reel',
      mediaPlaceholderTitle: '30s Office Routine Clip with Audio',
      createdAt: '2026-10-22T08:00:00Z',
      updatedAt: '2026-10-22T08:00:00Z',
    },
    {
      id: 'post-4',
      title: 'Minimalist Desktop Setup for Creators',
      platform: 'instagram',
      caption:
        'A clean workspace equals clear copy. Swipe to see the desk layout and equipment our visual design team uses every day to produce 40+ campaign assets weekly.\n\nSave this for your weekend workspace refresh! ☕️✨',
      date: formatDay(26),
      time: '12:00',
      status: 'scheduled',
      tags: ['#WorkspaceInspo', '#CreatorDesk', '#DesignTools'],
      campaign: 'Weekly Feature Spotlight',
      mediaType: 'carousel',
      mediaPlaceholderTitle: 'Minimalist Desk Setup Photo Series',
      createdAt: '2026-10-23T14:00:00Z',
      updatedAt: '2026-10-23T14:00:00Z',
    },
    {
      id: 'post-5',
      title: 'How to Build a 30-Day Content Calendar in 15 Minutes',
      platform: 'youtube',
      caption:
        'In this deep-dive tutorial, we break down our proprietary content matrix: how to turn 1 core podcast or video into 20 multi-channel assets in under 15 minutes without burnout.\n\nTimestamps:\n0:00 The Content Matrix Method\n3:15 Batching Strategy\n8:40 Channel Formatting Guide\n12:10 Workflow Automation',
      date: formatDay(27),
      time: '14:00',
      status: 'scheduled',
      tags: ['#ContentCalendar', '#MarketingWorkflow', '#SocialMediaTips'],
      campaign: 'Tutorials & How-To Guides',
      mediaType: 'video',
      mediaPlaceholderTitle: 'YouTube 16:9 Thumbnail: 30 Days in 15 Mins',
      createdAt: '2026-10-22T16:00:00Z',
      updatedAt: '2026-10-22T16:00:00Z',
    },
    {
      id: 'post-6',
      title: 'Quick Tip: Optimal Video Aspect Ratios for 2027',
      platform: 'x',
      caption:
        'Stop uploading 16:9 videos to feeds that prefer vertical format.\n\nQuick cheatsheet:\n• Feed Posts: 4:5 or 1:1\n• Reels / Shorts / TikTok: 9:16\n• YouTube Longform: 16:9\n• Carousel Cards: 4:5\n\nBookmark this for your video editor.',
      date: formatDay(28),
      time: '08:30',
      status: 'scheduled',
      tags: ['#VideoMarketing', '#QuickTips', '#CreatorEconomy'],
      campaign: 'Tutorials & How-To Guides',
      mediaType: 'text',
      createdAt: '2026-10-23T09:30:00Z',
      updatedAt: '2026-10-23T09:30:00Z',
    },
    {
      id: 'post-7',
      title: 'Customer Story: How FinEdge Scaled Engagement 320%',
      platform: 'linkedin',
      caption:
        '“We went from sporadic, ad-hoc posting to a predictable multi-channel engine.”\n\nFinEdge CMO Marcus Vance breaks down how their team standardized campaign review cycles, reduced revisions from 4 rounds to 1, and drove over $480K in pipeline from LinkedIn in 90 days.',
      date: formatDay(29),
      time: '11:00',
      status: 'scheduled',
      tags: ['#B2BMarketing', '#CaseStudy', '#DemandGen'],
      campaign: 'Customer Testimonials & Case Studies',
      mediaType: 'image',
      mediaPlaceholderTitle: 'Customer Metric Spotlight Quote Card',
      createdAt: '2026-10-24T10:00:00Z',
      updatedAt: '2026-10-24T10:00:00Z',
    },
    {
      id: 'post-8',
      title: 'Behind the Scenes: Scripting the Launch Keynote',
      platform: 'instagram',
      caption:
        'Sneak peek from inside the writers room 📝 Over 40 whiteboard iterations before arriving at our opening keynote concept. What does your creative brainstorming ritual look like?',
      date: formatDay(30),
      time: '17:30',
      status: 'draft',
      tags: ['#BehindTheScenes', '#CreativeProcess', '#MarketingTeam'],
      campaign: 'Behind The Scenes & Culture',
      mediaType: 'image',
      mediaPlaceholderTitle: 'Whiteboard Sketches and Storyboards',
      createdAt: '2026-10-24T12:00:00Z',
      updatedAt: '2026-10-24T12:00:00Z',
    },
    {
      id: 'post-9',
      title: 'Halloween Campaign Flash Promo Announcement',
      platform: 'instagram',
      caption:
        'No tricks, just treats 🎃 For the next 48 hours, unlock complete access to our PostPlanner Pro Creator templates.\n\nLink in bio to claim your seasonal perk before it disappears!',
      date: formatDay(31),
      time: '10:00',
      status: 'draft',
      tags: ['#SeasonalCampaign', '#HalloweenSale', '#MarketingDiscount'],
      campaign: 'Holiday & Seasonal Promo',
      mediaType: 'image',
      mediaPlaceholderTitle: 'Vibrant Autumn/Halloween Badge Graphic',
      createdAt: '2026-10-24T13:00:00Z',
      updatedAt: '2026-10-24T13:00:00Z',
    },
    {
      id: 'post-10',
      title: 'November Content Planning Checklist',
      platform: 'x',
      caption:
        'November marketing checklist:\n- Black Friday / Cyber Monday queue finalized\n- End of year recap storylines drafted\n- Client holiday gifting campaigns pre-approved\n- Q1 2027 editorial calendar scaffolded\n\nAre you ahead or catching up?',
      date: formatDay(2, 1),
      time: '09:00',
      status: 'draft',
      tags: ['#Checklist', '#MarketingPlanning', '#Q4Strategy'],
      campaign: 'Industry Insights & Thought Leadership',
      mediaType: 'text',
      createdAt: '2026-10-24T14:00:00Z',
      updatedAt: '2026-10-24T14:00:00Z',
    },
    {
      id: 'post-11',
      title: '3 TikTok Editing Trends You Can Adopt in CapCut Today',
      platform: 'tiktok',
      caption:
        'Fast cuts, kinetic typography overlays, and seamless zoom transitions 🔥 Save this tutorial for your next short! #editingtips #capcut #contentcreator',
      date: formatDay(4, 1),
      time: '18:00',
      status: 'draft',
      tags: ['#CapCutTutorial', '#VideoEditing', '#TikTokGrowth'],
      campaign: 'Tutorials & How-To Guides',
      mediaType: 'reel',
      mediaPlaceholderTitle: 'Screen Recording Tutorial with Dynamic Zoom',
      createdAt: '2026-10-24T15:00:00Z',
      updatedAt: '2026-10-24T15:00:00Z',
    },
    {
      id: 'post-12',
      title: 'Executive Guide: The Future of Autonomous Social Workflows',
      platform: 'linkedin',
      caption:
        'How will marketing teams look in 2027? We surveyed 250 VP-level leaders across SaaS and e-commerce.\n\nThe consensus is clear: human voice and authentic storytelling matter more than ever, while scheduling, asset resizing, and telemetry must be fully streamlined.\n\nRead the full report in our comments.',
      date: formatDay(6, 1),
      time: '08:30',
      status: 'draft',
      tags: ['#Leadership', '#MarketingReport', '#FutureOfWork'],
      campaign: 'Industry Insights & Thought Leadership',
      mediaType: 'carousel',
      mediaPlaceholderTitle: 'Report Executive Summary Infographic Slide',
      createdAt: '2026-10-24T16:00:00Z',
      updatedAt: '2026-10-24T16:00:00Z',
    },
  ];
}
