import React from 'react';
import { Platform, PostStatus, ViewMode } from '../types/post';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { MONTH_NAMES } from '../utils/dateUtils';
import { PlatformIcon } from './PlatformIcon';
import { ChevronLeft, ChevronRight, Search, X, Calendar as CalendarIcon } from 'lucide-react';

interface FilterToolbarProps {
  currentView: ViewMode;
  currentYear: number;
  currentMonth: number; // 0-indexed
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  selectedPlatform: Platform | 'all';
  onPlatformChange: (p: Platform | 'all') => void;
  selectedStatus: PostStatus | 'all';
  onStatusChange: (s: PostStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  platformCounts: Record<Platform | 'all', number>;
  statusCounts: Record<PostStatus | 'all', number>;
  monthPostCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  currentView,
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  selectedPlatform,
  onPlatformChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  platformCounts,
  statusCounts,
  monthPostCount,
}) => {
  const monthName = MONTH_NAMES[currentMonth] || 'Month';

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Row 1: Month Navigation (or View header) & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Month Stepper */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={onPrevMonth}
                aria-label="Previous month"
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onToday}
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
              >
                Today
              </button>
              <button
                onClick={onNextMonth}
                aria-label="Next month"
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {monthName} {currentYear}
              </h1>
              <span className="text-xs text-slate-500 tabular-nums">
                ({monthPostCount} {monthPostCount === 1 ? 'post' : 'posts'} this month)
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts, captions, #tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Status & Platform Interactive Segmented Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Platform Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mr-1 shrink-0">
              Platform:
            </span>

            <button
              onClick={() => onPlatformChange('all')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                selectedPlatform === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>All</span>
              <span
                className={`text-[11px] font-mono tabular-nums px-1 rounded ${
                  selectedPlatform === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {platformCounts.all}
              </span>
            </button>

            {(Object.keys(PLATFORMS) as Platform[]).map((pKey) => {
              const config = PLATFORMS[pKey];
              const isSelected = selectedPlatform === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => onPlatformChange(pKey)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlatformIcon platform={pKey} size={13} className={isSelected ? 'text-white' : config.textColor} />
                  <span>{config.name}</span>
                  <span
                    className={`text-[11px] font-mono tabular-nums px-1 rounded ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {platformCounts[pKey] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mr-1">
              Status:
            </span>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => onStatusChange('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  selectedStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({statusCounts.all})
              </button>

              {(['scheduled', 'published', 'draft'] as PostStatus[]).map((st) => {
                const isSelected = selectedStatus === st;
                const conf = STATUS_CONFIG[st];
                return (
                  <button
                    key={st}
                    onClick={() => onStatusChange(st)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${conf.dotClass}`} />
                    <span>{conf.label}</span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-600">
                      ({statusCounts[st] || 0})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
