import React, { useMemo } from 'react';
import { Post, PostStatus } from '../types/post';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { formatFriendlyDate, formatTimeDisplay } from '../utils/dateUtils';
import { PlatformIcon } from './PlatformIcon';
import { Clock, Copy, Edit2, Trash2, CopyCheck, ArrowUpDown, Plus, Sparkles, Eye, Check } from 'lucide-react';

interface AgendaViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onDuplicatePost: (post: Post) => void;
  onUpdateStatus: (postId: string, newStatus: PostStatus) => void;
  onCopyCaption: (caption: string) => void;
  onOpenNewPost: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  posts,
  onSelectPost,
  onEditPost,
  onDeletePost,
  onDuplicatePost,
  onUpdateStatus,
  onCopyCaption,
  onOpenNewPost,
  onClearFilters,
  hasActiveFilters,
}) => {
  // Sort posts chronologically by date and time
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      return a.time.localeCompare(b.time);
    });
  }, [posts]);

  // Group by date string (YYYY-MM-DD)
  const groupedByDate = useMemo(() => {
    const groups: { dateString: string; friendlyLabel: string; posts: Post[] }[] = [];
    const dateMap = new Map<string, Post[]>();

    for (const post of sortedPosts) {
      if (!dateMap.has(post.date)) {
        dateMap.set(post.date, []);
      }
      dateMap.get(post.date)!.push(post);
    }

    for (const [dateString, datePosts] of dateMap.entries()) {
      groups.push({
        dateString,
        friendlyLabel: formatFriendlyDate(dateString),
        posts: datePosts,
      });
    }

    return groups;
  }, [sortedPosts]);

  if (sortedPosts.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {hasActiveFilters ? 'No posts match your filters' : 'Your schedule is clear'}
        </h3>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          {hasActiveFilters
            ? 'Try adjusting your platform, status, or search query to see other queued content.'
            : 'Plan your next marketing milestone by adding high-impact posts across social channels.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {hasActiveFilters ? (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          ) : null}
          <button
            onClick={onOpenNewPost}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedByDate.map((group) => (
        <div key={group.dateString} className="space-y-2">
          {/* Date Header with zero-pill typographic separator */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900">{group.friendlyLabel}</h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {group.dateString}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">
              {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {/* Posts for this day */}
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-xs overflow-hidden">
            {group.posts.map((post) => {
              const platform = PLATFORMS[post.platform];
              const status = STATUS_CONFIG[post.status];

              return (
                <div
                  key={post.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Left: Platform & Metadata & Title & Caption */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Platform Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${platform.accentBg}`}
                      title={platform.name}
                    >
                      <PlatformIcon
                        platform={post.platform}
                        size={20}
                        className={platform.textColor}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Quiet zero-pill metadata line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">
                          {platform.name}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-slate-700">
                          {formatTimeDisplay(post.time)}
                        </span>
                        {post.campaign && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-600 truncate max-w-[200px]">
                              {post.campaign}
                            </span>
                          </>
                        )}
                        {post.mediaType && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize text-slate-500">
                              {post.mediaType}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectPost(post)}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors truncate"
                      >
                        {post.title}
                      </h3>

                      {/* Caption Snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>

                      {/* Hashtags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-indigo-600 font-medium">
                          {post.tags.map((tag) => (
                            <span key={tag} className="hover:underline cursor-pointer">
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status selector & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Status Dropdown / Cycle Button */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={post.status}
                        onChange={(e) => onUpdateStatus(post.id, e.target.value as PostStatus)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-md border focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer ${status.badgeClass}`}
                      >
                        <option value="draft">● Draft</option>
                        <option value="scheduled">● Scheduled</option>
                        <option value="published">● Published</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 text-slate-400">
                      <button
                        onClick={() => onSelectPost(post)}
                        title="Preview social card mockup"
                        className="p-1.5 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
                        aria-label="Preview post mockup"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onCopyCaption(post.caption)}
                        title="Copy caption to clipboard"
                        className="p-1.5 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
                        aria-label="Copy caption"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditPost(post)}
                        title="Edit post details"
                        className="p-1.5 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
                        aria-label="Edit post"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDuplicatePost(post)}
                        title="Duplicate post"
                        className="p-1.5 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
                        aria-label="Duplicate post"
                      >
                        <CopyCheck className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeletePost(post.id)}
                        title="Delete post"
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
