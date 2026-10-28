import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Post, Platform, PostStatus, ViewMode } from './types/post';
import {
  loadPostsFromStorage,
  savePostsToStorage,
  exportPostsToJsonFile,
  parseImportedJson,
} from './utils/storage';
import { getInitialSamplePosts } from './utils/constants';
import { generateMonthCalendar, formatDateString } from './utils/dateUtils';
import { Header } from './components/Header';
import { FilterToolbar } from './components/FilterToolbar';
import { CalendarView } from './components/CalendarView';
import { AgendaView } from './components/AgendaView';
import { AnalyticsView } from './components/AnalyticsView';
import { PostModal } from './components/PostModal';
import { PostPreviewModal } from './components/PostPreviewModal';
import { DayDetailModal } from './components/DayDetailModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Current anchor date (e.g. October 2026)
  const initialDate = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()); // 0-indexed

  // Posts State & Persistence
  const [posts, setPosts] = useState<Post[]>(() => loadPostsFromStorage());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // Filters State
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [initialDateForNewPost, setInitialDateForNewPost] = useState<string | undefined>(undefined);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [dayDetailDate, setDayDetailDate] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage on change
  useEffect(() => {
    savePostsToStorage(posts);
  }, [posts]);

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Month Stepper Handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Month Calendar Days Grid
  const calendarDays = useMemo(() => {
    return generateMonthCalendar(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Platform filter
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && post.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = post.title.toLowerCase().includes(query);
        const inCaption = post.caption.toLowerCase().includes(query);
        const inTags = post.tags?.some((t) => t.toLowerCase().includes(query));
        const inCampaign = post.campaign?.toLowerCase().includes(query);
        const inPlatform = post.platform.toLowerCase().includes(query);
        if (!inTitle && !inCaption && !inTags && !inCampaign && !inPlatform) {
          return false;
        }
      }
      return true;
    });
  }, [posts, selectedPlatform, selectedStatus, searchQuery]);

  // Posts grouped by date string for Calendar View
  const postsByDate = useMemo(() => {
    const map: Record<string, Post[]> = {};
    for (const post of filteredPosts) {
      if (!map[post.date]) {
        map[post.date] = [];
      }
      map[post.date].push(post);
    }
    // Sort posts within each date by time
    for (const key in map) {
      map[key].sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [filteredPosts]);

  // Counters for Platform tabs
  const platformCounts = useMemo(() => {
    const counts: Record<Platform | 'all', number> = {
      all: posts.length,
      instagram: 0,
      x: 0,
      linkedin: 0,
      tiktok: 0,
      youtube: 0,
    };
    for (const post of posts) {
      if (counts[post.platform] !== undefined) {
        counts[post.platform]++;
      }
    }
    return counts;
  }, [posts]);

  // Counters for Status tabs
  const statusCounts = useMemo(() => {
    const counts: Record<PostStatus | 'all', number> = {
      all: posts.length,
      scheduled: 0,
      published: 0,
      draft: 0,
    };
    for (const post of posts) {
      if (counts[post.status] !== undefined) {
        counts[post.status]++;
      }
    }
    return counts;
  }, [posts]);

  // Current Month Post Count
  const monthPostCount = useMemo(() => {
    const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return posts.filter((p) => p.date.startsWith(currentMonthPrefix)).length;
  }, [posts, currentYear, currentMonth]);

  // CRUD Operations
  const handleSavePost = (
    postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => {
    const nowIso = new Date().toISOString();
    if (existingId) {
      // Edit existing
      setPosts((prev) =>
        prev.map((p) => (p.id === existingId ? { ...p, ...postData, updatedAt: nowIso } : p))
      );
      addToast(`Updated post: "${postData.title}"`);
    } else {
      // Add new
      const newPost: Post = {
        ...postData,
        id: `post-${Date.now()}`,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setPosts((prev) => [newPost, ...prev]);
      addToast(`Scheduled new post: "${newPost.title}"`);
    }
  };

  const handleDeletePost = (postId: string) => {
    const postToDelete = posts.find((p) => p.id === postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (previewPost?.id === postId) {
      setPreviewPost(null);
    }
    addToast(`Deleted post ${postToDelete ? `"${postToDelete.title}"` : ''}`, 'info');
  };

  const handleDuplicatePost = (post: Post) => {
    // Schedule duplicate for the next day at same time
    const [y, m, d] = post.date.split('-').map(Number);
    const nextDay = new Date(y, (m || 1) - 1, (d || 1) + 1);
    const newDateStr = formatDateString(nextDay);
    const nowIso = new Date().toISOString();

    const duplicated: Post = {
      ...post,
      id: `post-${Date.now()}`,
      title: `${post.title} (Copy)`,
      date: newDateStr,
      status: 'draft',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setPosts((prev) => [duplicated, ...prev]);
    addToast(`Duplicated as draft on ${newDateStr}`);
  };

  const handleReschedulePost = (postId: string, newDateString: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, date: newDateString, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
    addToast(`Rescheduled post to ${newDateString}`);
  };

  const handleUpdateStatus = (postId: string, newStatus: PostStatus) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
    if (previewPost && previewPost.id === postId) {
      setPreviewPost((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    addToast(`Status updated to ${newStatus}`);
  };

  const handleCopyCaption = (caption: string) => {
    if (!caption) {
      addToast('No caption to copy', 'info');
      return;
    }
    navigator.clipboard
      .writeText(caption)
      .then(() => {
        addToast('Caption copied to clipboard!');
      })
      .catch(() => {
        addToast('Failed to copy to clipboard', 'error');
      });
  };

  // Open Modals
  const handleOpenNewPost = (prefillDate?: string) => {
    setPostToEdit(null);
    setInitialDateForNewPost(prefillDate);
    setIsPostModalOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
    setInitialDateForNewPost(undefined);
    setIsPostModalOpen(true);
  };

  const handleOpenDayDetail = (dateString: string) => {
    setDayDetailDate(dateString);
  };

  // Export / Import / Reset Handlers
  const handleExport = () => {
    exportPostsToJsonFile(posts);
    addToast('Exported calendar backup to JSON file');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = parseImportedJson(text);
      if (result.success && result.data) {
        setPosts(result.data);
        addToast(`Successfully imported ${result.data.length} posts!`);
      } else {
        addToast(result.error || 'Failed to import JSON', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset content calendar to default marketing sample data?')) {
      const freshSamples = getInitialSamplePosts(new Date());
      setPosts(freshSamples);
      addToast('Calendar restored to default sample marketing data');
    }
  };

  const handleClearFilters = () => {
    setSelectedPlatform('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedPlatform !== 'all' || selectedStatus !== 'all' || searchQuery.trim().length > 0;

  // Selected Day Posts for DayDetailModal
  const dayDetailPosts = useMemo(() => {
    if (!dayDetailDate) return [];
    return postsByDate[dayDetailDate] || [];
  }, [dayDetailDate, postsByDate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Hidden File Input for JSON Backup Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header adhere to Top Bar Contract */}
      <Header
        currentView={viewMode}
        onViewChange={setViewMode}
        onOpenNewPostModal={() => handleOpenNewPost()}
        onExport={handleExport}
        onImportClick={handleImportClick}
        onResetSampleData={handleResetSampleData}
        totalPosts={posts.length}
      />

      {/* Toolbar & Filters */}
      <FilterToolbar
        currentView={viewMode}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        platformCounts={platformCounts}
        statusCounts={statusCounts}
        monthPostCount={monthPostCount}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Filter Notice if searching or filtering */}
        {hasActiveFilters && (
          <div className="mb-4 flex items-center justify-between text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>
              Showing <strong className="font-semibold">{filteredPosts.length}</strong> matching{' '}
              {filteredPosts.length === 1 ? 'post' : 'posts'}
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <button
              onClick={handleClearFilters}
              className="text-indigo-600 hover:text-indigo-900 font-semibold cursor-pointer underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {viewMode === 'calendar' && (
          <CalendarView
            days={calendarDays}
            postsByDate={postsByDate}
            onSelectPost={(post) => setPreviewPost(post)}
            onAddPostForDate={(dateStr) => handleOpenNewPost(dateStr)}
            onOpenDayDetail={(dateStr) => handleOpenDayDetail(dateStr)}
            onReschedulePost={handleReschedulePost}
          />
        )}

        {viewMode === 'agenda' && (
          <AgendaView
            posts={filteredPosts}
            onSelectPost={(post) => setPreviewPost(post)}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onDuplicatePost={handleDuplicatePost}
            onUpdateStatus={handleUpdateStatus}
            onCopyCaption={handleCopyCaption}
            onOpenNewPost={() => handleOpenNewPost()}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {viewMode === 'analytics' && (
          <AnalyticsView posts={posts} onOpenNewPost={() => handleOpenNewPost()} />
        )}
      </main>

      {/* Footer (Quiet single-line footer per constitution) */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">PostPlanner Content Calendar</span>
            <span aria-hidden="true">·</span>
            <span>Multi-channel marketing campaign planner</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Instagram</span>
            <span aria-hidden="true">·</span>
            <span>X (Twitter)</span>
            <span aria-hidden="true">·</span>
            <span>LinkedIn</span>
            <span aria-hidden="true">·</span>
            <span>TikTok</span>
            <span aria-hidden="true">·</span>
            <span>YouTube</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSave={handleSavePost}
        postToEdit={postToEdit}
        initialDate={initialDateForNewPost}
      />

      <PostPreviewModal
        post={previewPost}
        onClose={() => setPreviewPost(null)}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        onDuplicate={handleDuplicatePost}
        onUpdateStatus={handleUpdateStatus}
        onCopyCaption={handleCopyCaption}
      />

      <DayDetailModal
        isOpen={!!dayDetailDate}
        dateString={dayDetailDate}
        posts={dayDetailPosts}
        onClose={() => setDayDetailDate(null)}
        onSelectPost={(post) => setPreviewPost(post)}
        onAddPostForDate={(dateStr) => handleOpenNewPost(dateStr)}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
