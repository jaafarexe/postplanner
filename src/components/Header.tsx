import React from 'react';
import { ViewMode } from '../types/post';
import { Calendar, ListFilter, BarChart3, Plus, Sparkles, Download, Upload, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenNewPostModal: () => void;
  onExport: () => void;
  onImportClick: () => void;
  onResetSampleData: () => void;
  totalPosts: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenNewPostModal,
  onExport,
  onImportClick,
  onResetSampleData,
  totalPosts,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element with icon mark) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                PostPlanner
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                Content Calendar
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links / Segmented View Modes */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => onViewChange('calendar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                currentView === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Month Calendar</span>
            </button>

            <button
              onClick={() => onViewChange('agenda')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                currentView === 'agenda'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-blue-600" />
              <span>Agenda Schedule</span>
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                currentView === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Metrics & Cadence</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Utility dropdown/buttons + Primary CTA) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick backup / export options */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <button
                onClick={onExport}
                title="Export posts as JSON backup"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Export posts backup"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onImportClick}
                title="Import posts from JSON backup"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Import posts backup"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                onClick={onResetSampleData}
                title="Reset to default sample marketing calendar"
                className="p-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                aria-label="Reset demo data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewPostModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden border-t border-slate-100 py-2 items-center justify-around">
          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${
              currentView === 'calendar' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => onViewChange('agenda')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${
              currentView === 'agenda' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Agenda</span>
          </button>
          <button
            onClick={() => onViewChange('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${
              currentView === 'analytics' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Metrics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
