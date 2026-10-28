import React from 'react';
import { Post, Platform, PostStatus } from '../types/post';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { PlatformIcon } from './PlatformIcon';
import { BarChart2, Calendar, CheckCircle2, FileText, Send, TrendingUp, Layers } from 'lucide-react';

interface AnalyticsViewProps {
  posts: Post[];
  onOpenNewPost: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ posts, onOpenNewPost }) => {
  const total = posts.length;
  const published = posts.filter((p) => p.status === 'published').length;
  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;

  const publishedPercent = total > 0 ? Math.round((published / total) * 100) : 0;
  const scheduledPercent = total > 0 ? Math.round((scheduled / total) * 100) : 0;
  const draftPercent = total > 0 ? Math.round((drafts / total) * 100) : 0;

  // Platform breakdown
  const platformCounts: Record<Platform, number> = {
    instagram: posts.filter((p) => p.platform === 'instagram').length,
    x: posts.filter((p) => p.platform === 'x').length,
    linkedin: posts.filter((p) => p.platform === 'linkedin').length,
    tiktok: posts.filter((p) => p.platform === 'tiktok').length,
    youtube: posts.filter((p) => p.platform === 'youtube').length,
  };

  // Campaign breakdown
  const campaignMap = new Map<string, number>();
  for (const post of posts) {
    const campaign = post.campaign || 'General / Uncategorized';
    campaignMap.set(campaign, (campaignMap.get(campaign) || 0) + 1);
  }
  const campaigns = Array.from(campaignMap.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row (Single elevation, hairline borders, tabular-nums) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Content</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {total}
            </span>
            <span className="text-xs text-slate-500">posts in database</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Queue</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-blue-700 tabular-nums">
              {scheduled}
            </span>
            <span className="text-xs text-slate-500 tabular-nums">({scheduledPercent}%)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-700 tabular-nums">
              {published}
            </span>
            <span className="text-xs text-slate-500 tabular-nums">({publishedPercent}%)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Draft Ideas</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-700 tabular-nums">
              {drafts}
            </span>
            <span className="text-xs text-slate-500 tabular-nums">({draftPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Platform Distribution + Campaign Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Share */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Platform Distribution</h3>
              <p className="text-xs text-slate-500">Cross-channel publishing volume</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {(Object.keys(PLATFORMS) as Platform[]).map((pKey) => {
              const config = PLATFORMS[pKey];
              const count = platformCounts[pKey] || 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={pKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <PlatformIcon platform={pKey} size={15} className={config.textColor} />
                      <span>{config.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold text-slate-900 tabular-nums">{count}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono tabular-nums text-slate-500">{percent}%</span>
                    </div>
                  </div>

                  {/* Clean progress bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: config.brandColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Campaigns & Themes</h3>
              <p className="text-xs text-slate-500">Content grouped by marketing priority</p>
            </div>
            <BarChart2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {campaigns.map(([campaignName, count]) => {
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div
                  key={campaignName}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-800 truncate pr-2">
                    {campaignName}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {count} {count === 1 ? 'post' : 'posts'}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono tabular-nums text-slate-500">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
