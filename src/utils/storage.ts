import { Post } from '../types/post';
import { getInitialSamplePosts } from './constants';

const STORAGE_KEY = 'postplanner_content_calendar_posts_v1';

export function loadPostsFromStorage(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSamplePosts();
      savePostsToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialSamplePosts();
    savePostsToStorage(initial);
    return initial;
  } catch (error) {
    console.error('Failed to load posts from localStorage, initializing samples:', error);
    return getInitialSamplePosts();
  }
}

export function savePostsToStorage(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
  }
}

export function exportPostsToJsonFile(posts: Post[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `postplanner-calendar-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseImportedJson(jsonText: string): { success: boolean; data?: Post[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) {
      return { success: false, error: 'Imported file must contain a JSON array of posts.' };
    }
    // Basic validation of post shape
    const validPosts: Post[] = parsed.map((item, idx) => ({
      id: item.id || `imported-${Date.now()}-${idx}`,
      title: String(item.title || 'Untitled Post'),
      platform: ['instagram', 'x', 'linkedin', 'tiktok', 'youtube'].includes(item.platform)
        ? item.platform
        : 'x',
      caption: String(item.caption || ''),
      date: item.date && /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? item.date : new Date().toISOString().split('T')[0],
      time: item.time && /^\d{2}:\d{2}$/.test(item.time) ? item.time : '10:00',
      status: ['draft', 'scheduled', 'published'].includes(item.status) ? item.status : 'draft',
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      campaign: item.campaign ? String(item.campaign) : undefined,
      mediaType: item.mediaType || 'image',
      mediaPlaceholderTitle: item.mediaPlaceholderTitle || undefined,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    }));

    return { success: true, data: validPosts };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid JSON file format';
    return { success: false, error: errorMsg };
  }
}
