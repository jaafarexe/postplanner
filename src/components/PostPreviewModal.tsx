import React, { useState } from 'react';
import { Post, PostStatus } from '../types/post';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { PlatformIcon } from './PlatformIcon';
import { formatTimeDisplay, formatFriendlyDate } from '../utils/dateUtils';
import {
  X,
  Copy,
  Edit2,
  Trash2,
  CopyCheck,
  Check,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Repeat,
  Share2,
  Send,
  Image as ImageIcon,
} from 'lucide-react';

interface PostPreviewModalProps {
  post: Post | null;
  onClose: () => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onDuplicate: (post: Post) => void;
  onUpdateStatus: (postId: string, newStatus: PostStatus) => void;
  onCopyCaption: (caption: string) => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  post,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdateStatus,
  onCopyCaption,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!post) return null;

  const platform = PLATFORMS[post.platform];
  const status = STATUS_CONFIG[post.status];

  const handleDelete = () => {
    onDelete(post.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <PlatformIcon platform={post.platform} size={16} className={platform.textColor} />
            <span className="text-xs font-bold text-slate-800">{platform.name}</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {formatFriendlyDate(post.date)} at {formatTimeDisplay(post.time)}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Mockup Frame */}
        <div className="p-5 space-y-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            {/* Social Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                    post.platform === 'instagram'
                      ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                      : post.platform === 'x'
                      ? 'bg-black'
                      : post.platform === 'linkedin'
                      ? 'bg-sky-700'
                      : post.platform === 'tiktok'
                      ? 'bg-teal-900'
                      : 'bg-red-600'
                  }`}
                >
                  PP
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900">
                      {platform.defaultProfileName}
                    </span>
                    <span className="w-3.5 h-3.5 text-sky-500 inline-flex items-center justify-center font-bold text-[9px] bg-sky-100 rounded-full">
                      ✓
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {platform.handlePrefix}postplanner · {post.date}
                  </span>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${status.badgeClass}`}>
                {status.label}
              </span>
            </div>

            {/* Media Canvas Mockup */}
            {post.mediaType !== 'text' && (
              <div className="w-full aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center text-slate-200 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <ImageIcon className="w-5 h-5 text-indigo-300" />
                  </div>
                  <p className="text-sm font-semibold text-white max-w-xs">
                    {post.mediaPlaceholderTitle || post.title}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="uppercase tracking-wider font-mono">
                      {post.mediaType || 'Image'}
                    </span>
                    <span>·</span>
                    <span>HD 1080p</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">
                {post.title}
              </h4>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {post.caption}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 text-xs font-medium text-indigo-600">
                  {post.tags.map((t) => (
                    <span key={t}>{t.startsWith('#') ? t : `#${t}`}</span>
                  ))}
                </div>
              )}

              {/* Campaign / Metadata info */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Campaign: {post.campaign || 'None'}</span>
                <span className="font-mono tabular-nums">{post.caption.length} chars</span>
              </div>
            </div>

            {/* Simulated Social Action Bar */}
            <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-around text-slate-500">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs hover:text-rose-600 transition-colors"
                title="Mock like interaction"
              >
                <Heart className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums text-[11px]">142</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs hover:text-indigo-600 transition-colors"
                title="Mock comment interaction"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums text-[11px]">28</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs hover:text-emerald-600 transition-colors"
                title="Mock repost interaction"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums text-[11px]">19</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs hover:text-slate-900 transition-colors"
                title="Mock share interaction"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Status Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold text-slate-700">Quick Status Update:</span>
            <div className="flex items-center gap-1.5">
              {(['draft', 'scheduled', 'published'] as PostStatus[]).map((st) => {
                const isCurrent = post.status === st;
                const conf = STATUS_CONFIG[st];
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(post.id, st)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                      isCurrent
                        ? `${conf.badgeClass} font-semibold shadow-2xs`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delete Confirmation Alert if active */}
          {showDeleteConfirm && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
              <p className="text-xs text-rose-800 font-medium">
                Are you sure you want to delete this scheduled post? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white rounded border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded"
                >
                  Yes, Delete Post
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onCopyCaption(post.caption)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Caption</span>
              </button>

              <button
                onClick={() => {
                  onDuplicate(post);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <CopyCheck className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!showDeleteConfirm && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  onEdit(post);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
