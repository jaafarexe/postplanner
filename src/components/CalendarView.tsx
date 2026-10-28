import React, { useState } from 'react';
import { Post } from '../types/post';
import { CalendarDay, WEEKDAY_LABELS } from '../utils/dateUtils';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { PlatformIcon } from './PlatformIcon';
import { Plus, Clock } from 'lucide-react';

interface CalendarViewProps {
  days: CalendarDay[];
  postsByDate: Record<string, Post[]>;
  onSelectPost: (post: Post) => void;
  onAddPostForDate: (dateString: string) => void;
  onOpenDayDetail: (dateString: string, posts: Post[]) => void;
  onReschedulePost: (postId: string, newDateString: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  days,
  postsByDate,
  onSelectPost,
  onAddPostForDate,
  onOpenDayDetail,
  onReschedulePost,
}) => {
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, post: Post) => {
    e.dataTransfer.setData('text/plain', post.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPostId(post.id);
  };

  const handleDragEnd = () => {
    setDraggedPostId(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: React.DragEvent, dateString: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDate !== dateString) {
      setDragOverDate(dateString);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('text/plain') || draggedPostId;
    if (postId) {
      onReschedulePost(postId, targetDate);
    }
    setDraggedPostId(null);
    setDragOverDate(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* 7-Column Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center">
        {WEEKDAY_LABELS.map((day, idx) => {
          const isWeekend = idx >= 5;
          return (
            <div
              key={day}
              className={`py-2.5 text-xs font-semibold uppercase tracking-wider ${
                isWeekend ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200 bg-slate-100">
        {days.map((day) => {
          const dayPosts = postsByDate[day.dateString] || [];
          const maxVisiblePosts = 3;
          const visiblePosts = dayPosts.slice(0, maxVisiblePosts);
          const hiddenCount = dayPosts.length - maxVisiblePosts;
          const isDraggedOver = dragOverDate === day.dateString;

          return (
            <div
              key={day.dateString}
              onDragOver={(e) => handleDragOver(e, day.dateString)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, day.dateString)}
              className={`min-h-[120px] sm:min-h-[140px] p-1.5 flex flex-col justify-between transition-colors group relative ${
                day.isCurrentMonth ? 'bg-white' : 'bg-slate-50/70 text-slate-400'
              } ${day.isToday ? 'ring-1 ring-inset ring-indigo-500/40 bg-indigo-50/20' : ''} ${
                isDraggedOver ? 'bg-indigo-50 ring-2 ring-indigo-500 ring-inset' : ''
              }`}
            >
              {/* Day Cell Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-semibold tabular-nums w-6 h-6 rounded-md ${
                      day.isToday
                        ? 'bg-slate-900 text-white font-bold'
                        : day.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  {day.isToday && (
                    <span className="hidden sm:inline text-[10px] font-bold text-indigo-700 uppercase tracking-tight">
                      Today
                    </span>
                  )}
                </div>

                {/* Quick Add Button on Hover */}
                <button
                  onClick={() => onAddPostForDate(day.dateString)}
                  title={`Add post on ${day.dateString}`}
                  aria-label={`Add post on ${day.dateString}`}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Posts List for this Day */}
              <div className="flex-1 space-y-1 overflow-hidden">
                {visiblePosts.map((post) => {
                  const platform = PLATFORMS[post.platform];
                  const status = STATUS_CONFIG[post.status];
                  const isBeingDragged = draggedPostId === post.id;

                  return (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, post)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectPost(post)}
                      className={`text-left p-1.5 rounded-md border text-xs cursor-pointer transition-all hover:shadow-xs active:cursor-grabbing select-none ${
                        platform.accentBg
                      } ${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'}`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <PlatformIcon
                            platform={post.platform}
                            size={12}
                            className={`shrink-0 ${platform.textColor}`}
                          />
                          <span className="text-[11px] font-mono tabular-nums text-slate-600 truncate">
                            {post.time}
                          </span>
                        </div>
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dotClass}`}
                          title={`Status: ${status.label}`}
                        />
                      </div>
                      <p className="font-medium text-slate-900 truncate leading-tight">
                        {post.title}
                      </p>
                    </div>
                  );
                })}

                {/* "+ X more" link if more than 3 posts */}
                {hiddenCount > 0 && (
                  <button
                    onClick={() => onOpenDayDetail(day.dateString, dayPosts)}
                    className="w-full text-center py-0.5 text-[11px] font-medium text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors"
                  >
                    +{hiddenCount} more
                  </button>
                )}
              </div>

              {/* Empty state hint on hover */}
              {dayPosts.length === 0 && (
                <div
                  onClick={() => onAddPostForDate(day.dateString)}
                  className="hidden group-hover:flex items-center justify-center py-2 text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer rounded border border-dashed border-slate-200"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  <span>Schedule</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
