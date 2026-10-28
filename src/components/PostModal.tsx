import React, { useState, useEffect } from 'react';
import { Post, Platform, PostStatus, MediaType } from '../types/post';
import { PLATFORMS, STATUS_CONFIG, CAMPAIGN_OPTIONS, ENGAGEMENT_TIME_PRESETS } from '../utils/constants';
import { PlatformIcon } from './PlatformIcon';
import { X, Calendar, Clock, Tag, Sparkles, Hash, AlertCircle, Eye, Edit3, Image as ImageIcon } from 'lucide-react';
import { formatTimeDisplay } from '../utils/dateUtils';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
  postToEdit?: Post | null;
  initialDate?: string;
}

export const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  postToEdit,
  initialDate,
}) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [status, setStatus] = useState<PostStatus>('scheduled');
  const [campaign, setCampaign] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaPlaceholderTitle, setMediaPlaceholderTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setPlatform(postToEdit.platform);
      setCaption(postToEdit.caption);
      setDate(postToEdit.date);
      setTime(postToEdit.time);
      setStatus(postToEdit.status);
      setCampaign(postToEdit.campaign || '');
      setMediaType(postToEdit.mediaType || 'image');
      setMediaPlaceholderTitle(postToEdit.mediaPlaceholderTitle || '');
      setTags(postToEdit.tags || []);
    } else {
      // New post defaults
      const todayStr = initialDate || new Date().toISOString().split('T')[0];
      setTitle('');
      setPlatform('instagram');
      setCaption('');
      setDate(todayStr);
      setTime('10:00');
      setStatus('scheduled');
      setCampaign('');
      setMediaType('image');
      setMediaPlaceholderTitle('');
      setTags([]);
    }
    setErrors({});
    setActiveTab('form');
  }, [postToEdit, initialDate, isOpen]);

  if (!isOpen) return null;

  const currentPlatformConfig = PLATFORMS[platform];
  const charCount = caption.length;
  const isOverCharLimit = charCount > currentPlatformConfig.charLimit;

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, `#${trimmed}`]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    }
    if (!date) {
      errs.date = 'Date is required';
    }
    if (!time) {
      errs.time = 'Time is required';
    }
    if (isOverCharLimit) {
      errs.caption = `Caption exceeds ${currentPlatformConfig.name} limit (${currentPlatformConfig.charLimit} chars)`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        title: title.trim(),
        platform,
        caption: caption.trim(),
        date,
        time,
        status,
        tags,
        campaign: campaign.trim() || undefined,
        mediaType,
        mediaPlaceholderTitle: mediaPlaceholderTitle.trim() || undefined,
      },
      postToEdit ? postToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {postToEdit ? 'Edit Scheduled Post' : 'Schedule New Post'}
              </h2>
              <p className="text-xs text-slate-500">
                Craft, format, and organize multi-channel campaign content
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Toggle: Form vs Social Preview */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'form' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Platform Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Platform <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(PLATFORMS) as Platform[]).map((pKey) => {
                  const conf = PLATFORMS[pKey];
                  const isSelected = platform === pKey;
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => setPlatform(pKey)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-2xs font-bold'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <PlatformIcon
                        platform={pKey}
                        size={18}
                        className={isSelected ? 'text-white' : conf.textColor}
                      />
                      <span className="mt-1 truncate">{conf.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Post Title / Internal Headline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 Major Platform 3.0 Reveal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 text-xs text-slate-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  errors.title ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Caption & Character Count */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Caption & Copy
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">Limit: {currentPlatformConfig.charLimit}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span
                    className={`font-mono tabular-nums font-semibold ${
                      isOverCharLimit ? 'text-rose-600' : 'text-slate-600'
                    }`}
                  >
                    {charCount}/{currentPlatformConfig.charLimit}
                  </span>
                </div>
              </div>
              <textarea
                rows={4}
                placeholder="Write your engaging post caption, hook, or call to action..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className={`w-full px-3 py-2 text-xs text-slate-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  errors.caption ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.caption && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.caption}
                </p>
              )}
              <p className="mt-1 text-[11px] text-slate-500">
                Recommended for {currentPlatformConfig.name}: {currentPlatformConfig.recommendedLength}
              </p>
            </div>

            {/* Date, Time & Status in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Publish Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs text-slate-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                    errors.date ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Publish Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs text-slate-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                    errors.time ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workflow Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="draft">● Draft</option>
                  <option value="scheduled">● Scheduled</option>
                  <option value="published">● Published</option>
                </select>
              </div>
            </div>

            {/* Quick Engagement Time Shortcuts */}
            <div>
              <span className="block text-[11px] font-medium text-slate-500 mb-1">
                Suggested Engagement Times ({currentPlatformConfig.name}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ENGAGEMENT_TIME_PRESETS.map((preset) => (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => setTime(preset.time)}
                    className={`px-2 py-0.5 text-[11px] font-mono tabular-nums rounded border transition-colors ${
                      time === preset.time
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign & Media Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campaign / Pillar
                </label>
                <select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">No specific campaign</option>
                  {CAMPAIGN_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Media Format
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as MediaType)}
                  className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="image">Single Image / Graphic</option>
                  <option value="carousel">Multi-Slide Carousel</option>
                  <option value="reel">Reel / Short / Clip (9:16)</option>
                  <option value="video">Standard Video (16:9)</option>
                  <option value="text">Text Only</option>
                </select>
              </div>
            </div>

            {/* Media Asset Label */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asset Name / Visual Description
              </label>
              <input
                type="text"
                placeholder="e.g. Infographic Slide Deck or Hero Product Photo"
                value={mediaPlaceholderTitle}
                onChange={(e) => setMediaPlaceholderTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Tags / Hashtags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hashtags & Topic Tags
              </label>
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Type tag and press Enter (e.g. MarketingTips)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md border border-slate-200"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-400 hover:text-slate-700"
                        aria-label={`Remove tag ${t}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-950"
              >
                {postToEdit ? 'Save Changes' : 'Schedule Post'}
              </button>
            </div>
          </form>
        ) : (
          /* Live Social Card Preview Tab */
          <div className="p-6 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
              <span>Simulated feed appearance for {currentPlatformConfig.name}</span>
              <span className="font-mono tabular-nums text-slate-500">
                {date || 'Date unset'} · {formatTimeDisplay(time)}
              </span>
            </div>

            {/* Social Card Mockup */}
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              {/* Mockup Author Bar */}
              <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                      platform === 'instagram'
                        ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                        : platform === 'x'
                        ? 'bg-black'
                        : platform === 'linkedin'
                        ? 'bg-sky-700'
                        : platform === 'tiktok'
                        ? 'bg-teal-900'
                        : 'bg-red-600'
                    }`}
                  >
                    PP
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900">
                        {currentPlatformConfig.defaultProfileName}
                      </span>
                      <span className="w-3 h-3 text-sky-500 inline-flex items-center justify-center font-bold text-[9px] bg-sky-100 rounded-full">
                        ✓
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {currentPlatformConfig.handlePrefix}postplanner · {formatTimeDisplay(time)}
                    </span>
                  </div>
                </div>
                <PlatformIcon platform={platform} size={16} className={currentPlatformConfig.textColor} />
              </div>

              {/* Mockup Media Area */}
              {mediaType !== 'text' && (
                <div className="w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center text-slate-200 p-6 text-center">
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-white">
                    {mediaPlaceholderTitle || title || 'Visual Asset'}
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">
                    {mediaType}
                  </span>
                </div>
              )}

              {/* Mockup Caption Area */}
              <div className="p-3.5 space-y-2">
                <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {caption || 'No caption provided yet. Type caption in the editor.'}
                </p>

                {tags.length > 0 && (
                  <p className="text-xs font-medium text-indigo-600">
                    {tags.join(' ')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Back to Editor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
