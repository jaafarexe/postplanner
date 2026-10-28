import React from 'react';
import { Post, PostStatus } from '../types/post';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { PlatformIcon } from './PlatformIcon';
import { formatTimeDisplay, formatFriendlyDate } from '../utils/dateUtils';
import { X, Plus, Calendar, Clock, Copy, Edit2, Trash2 } from 'lucide-react';

interface DayDetailModalProps {
  dateString: string | null;
  posts: Post[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (post: Post) => void;
  onAddPostForDate: (dateString: string) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dateString,
  posts,
  isOpen,
  onClose,
  onSelectPost,
  onAddPostForDate,
  onEditPost,
  onDeletePost,
}) => {
  if (!isOpen || !dateString) return null;

  const friendly = formatFriendlyDate(dateString);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{friendly}</h3>
            <p className="text-xs text-slate-500 font-mono tabular-nums">
              {dateString} · {posts.length} {posts.length === 1 ? 'post' : 'posts'} scheduled
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAddPostForDate(dateString);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Post</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2.5 divide-y divide-slate-100">
          {posts.map((post) => {
            const platform = PLATFORMS[post.platform];
            const status = STATUS_CONFIG[post.status];

            return (
              <div
                key={post.id}
                className="pt-2.5 first:pt-0 flex items-start justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectPost(post);
                  }}
                  className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${platform.accentBg}`}
                  >
                    <PlatformIcon
                      platform={post.platform}
                      size={16}
                      className={platform.textColor}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                      <span className="font-semibold text-slate-800">{platform.name}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{formatTimeDisplay(post.time)}</span>
                      <span>·</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${status.badgeClass}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {post.caption}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onEditPost(post);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded"
                    title="Edit post"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
