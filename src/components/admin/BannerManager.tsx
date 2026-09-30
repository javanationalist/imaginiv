/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  RefreshCw,
  Info,
  Maximize2
} from 'lucide-react';
import { BannerItem } from '../../types';
import { 
  bannersService, 
  MAX_BANNERS_LIMIT, 
  MAX_FILE_SIZE_BYTES, 
  ALLOWED_MIME_TYPES 
} from '../../services/bannersService';
import { Modal } from '../common/Modal';

export const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File upload state & resolution advisory
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [imageResolution, setImageResolution] = useState<{ width: number; height: number } | null>(null);
  const [resolutionNotice, setResolutionNotice] = useState<string | null>(null);

  // Delete confirmation modal
  const [bannerToDelete, setBannerToDelete] = useState<BannerItem | null>(null);

  // Selected banner for live preview in mini landing page frame
  const [previewBannerId, setPreviewBannerId] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'saving' | 'saved' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannersService.getAllBanners();
      setBanners(data);
      if (data.length > 0 && !previewBannerId) {
        setPreviewBannerId(data.find(b => b.is_active)?.id || data[0].id);
      }
    } catch (err) {
      console.error('Failed to load background banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();

    const unsubscribe = bannersService.subscribeToBannersChanges((fresh) => {
      setBanners(fresh);
      if (fresh.length > 0 && !previewBannerId) {
        setPreviewBannerId(fresh.find(b => b.is_active)?.id || fresh[0].id);
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (text: string, type: 'saving' | 'saved' | 'error' = 'saved') => {
    setToastMessage({ text, type });
    if (type !== 'saving') {
      setTimeout(() => setToastMessage(null), 3200);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setResolutionNotice(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError('Invalid format. Please select a JPG, PNG, or WEBP image.');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is 5MB.`);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);

    // Detect image dimensions for advisory check
    const img = new Image();
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      setImageResolution({ width: naturalWidth, height: naturalHeight });
      if (naturalWidth < 1920 || naturalHeight < 1080) {
        setResolutionNotice(
          `Detected resolution: ${naturalWidth} × ${naturalHeight}px. Note: 1920 × 1080px or higher is recommended for crisp full-screen backgrounds.`
        );
      }
    };
    img.src = objectUrl;
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (banners.length >= MAX_BANNERS_LIMIT) {
      setUploadError(`Maximum limit of ${MAX_BANNERS_LIMIT} backgrounds reached. Please delete an older background first.`);
      return;
    }

    setUploading(true);
    setUploadProgress(15);
    setUploadError(null);
    showToast('Uploading full-screen background to storage...', 'saving');

    const result = await bannersService.uploadBanner(
      selectedFile,
      '',
      (progress) => setUploadProgress(progress)
    );

    setUploading(false);

    if (result.success && result.banner) {
      showToast('New background banner published successfully!', 'saved');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setImageResolution(null);
      setResolutionNotice(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setPreviewBannerId(result.banner.id);
      fetchBanners();
    } else {
      const errMsg = result.error || 'Upload failed.';
      setUploadError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  const handleToggleActive = async (banner: BannerItem) => {
    const nextState = !banner.is_active;
    showToast('Saving background status...', 'saving');

    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, is_active: nextState } : b))
    );

    const success = await bannersService.toggleBannerActive(banner.id, nextState);
    if (success) {
      showToast(`Background is now ${nextState ? 'ACTIVE in slideshow' : 'RESTING (OFF)'}`, 'saved');
    } else {
      showToast('Failed to update status in database.', 'error');
      fetchBanners();
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    showToast('Updating slideshow sequence...', 'saving');
    const updated = await bannersService.moveBanner(id, direction);
    setBanners(updated);
    showToast('Slideshow sequence updated.', 'saved');
  };

  const confirmDeleteBanner = async () => {
    if (!bannerToDelete) return;
    const { id, storage_path } = bannerToDelete;
    setBannerToDelete(null);

    showToast('Deleting background image...', 'saving');
    const success = await bannersService.deleteBanner(id, storage_path);

    if (success) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showToast('Background permanently removed.', 'saved');
    } else {
      showToast('Failed to delete background from server.', 'error');
      fetchBanners();
    }
  };

  const isLimitReached = banners.length >= MAX_BANNERS_LIMIT;
  const activeCount = banners.filter((b) => b.is_active).length;

  const currentPreviewBanner = banners.find((b) => b.id === previewBannerId) || banners.find((b) => b.is_active) || banners[0];

  return (
    <div className="space-y-8 text-[#381E0A]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="game-parchment p-3 sm:p-4 rounded-xl border-2 border-[#542E10] shadow-[0_6px_0_#2B1302,0_12px_24px_rgba(0,0,0,0.35)] flex items-center gap-3 max-w-sm">
            {toastMessage.type === 'saving' ? (
              <Loader2 className="w-5 h-5 text-[#2F8FE0] animate-spin shrink-0" />
            ) : toastMessage.type === 'error' ? (
              <div className="w-6 h-6 rounded-full bg-[#E53935] text-white flex items-center justify-center shrink-0 border border-[#8B0000]">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#52BE1A] text-white flex items-center justify-center shrink-0 border border-[#1F5407]">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="text-xs sm:text-sm font-bold text-[#381E0A]">
              {toastMessage.text}
            </div>
          </div>
        </div>
      )}

      {/* Header Notice Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FFF8EC] to-[#FCEECC] rounded-2xl border-2 border-[#D6BC90] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFF5E0] to-[#EADBBD] border border-[#542E10] flex items-center justify-center text-[#8B5226] shrink-0 shadow-xs">
            <ImageIcon className="w-5 h-5 text-[#E8863A]" />
          </div>
          <div>
            <h3 className="font-display text-base text-[#381E0A]">
              Top Landing Page Banners
            </h3>
            <p className="text-xs text-[#5C3210] font-semibold mt-0.5 leading-relaxed">
              These images rotate in the dedicated banner section below the header, scrolling naturally with the page in normal document flow.
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`game-wood-pill text-xs font-bold px-3 py-1 flex items-center gap-1.5 ${isLimitReached ? 'border-amber-600 bg-amber-100 text-amber-900' : ''}`}>
            <span>Capacity:</span>
            <strong className="text-sm font-black">{banners.length} / {MAX_BANNERS_LIMIT}</strong>
          </span>
          <span className="text-xs font-bold text-[#2A7513] bg-[#EAF7E2] px-2.5 py-1 rounded-full border border-[#BCE4AA]">
            {activeCount} Active
          </span>
        </div>
      </div>

      {/* Creative Aesthetic Guidelines */}
      <div className="p-4 rounded-xl bg-[#FFF9E6] border border-[#ECD9A8] text-xs font-semibold text-[#664319] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#B87C2B] shrink-0 mt-0.5" />
        <div>
          <strong>Widescreen Banner Advisory:</strong> The banner section is wide with a limited height (~320–400px). For best presentation, upload panoramic images with wide ratios like <strong>16:6 or 21:9</strong> (avoid square or portrait photos).
        </div>
      </div>

      {/* SECTION 1: UPLOAD FULL-SCREEN BACKGROUND */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#D6BC90] shadow-sm">
        <div className="flex items-center justify-between border-b-2 border-[#D6BC90] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#2F8FE0]" />
            <h4 className="font-display text-lg text-[#381E0A]">Upload New Background</h4>
          </div>
          {isLimitReached && (
            <span className="text-xs font-bold text-[#D32F2F] bg-[#FFEBEE] px-3 py-1 rounded-full border border-[#FFCDD2] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Limit Reached (Max 10)</span>
            </span>
          )}
        </div>

        {isLimitReached ? (
          <div className="p-4 rounded-xl bg-[#FFF8E1] border border-[#FFE082] text-xs text-[#6D4C41] font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FFA000] shrink-0" />
            <span>
              The maximum limit of 10 backgrounds has been reached. Please delete an existing background before uploading a new one.
            </span>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* File picker drop area */}
              <div className="md:col-span-8">
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                    selectedFile
                      ? 'border-[#2F8FE0] bg-[#F0F8FF]'
                      : 'border-[#CBB38B] hover:border-[#8B5226] bg-[#FAF3E4]'
                  } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />

                  {filePreviewUrl ? (
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg border-2 border-[#2F8FE0] bg-[#1F1004] group shadow-inner">
                      <img
                        src={filePreviewUrl}
                        alt="Selected background preview"
                        className="w-full h-full object-contain object-center"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white bg-black/70 px-3 py-1.5 rounded-full">
                          Click to Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border border-[#5D2B03] flex items-center justify-center text-[#8B5226] mb-2 shadow-xs">
                        <ImageIcon className="w-5 h-5 text-[#2F8FE0]" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#381E0A]">
                        Click to select background image
                      </p>
                      <p className="text-[11px] text-[#7C471E] mt-0.5 font-medium">
                        JPG, PNG, or WEBP &bull; Max 5MB &bull; 1920 &times; 1080 or 16:9 widescreen recommended
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Upload trigger column */}
              <div className="md:col-span-4 flex flex-col justify-center space-y-3">
                {resolutionNotice && (
                  <div className="p-2.5 rounded-lg bg-[#FFF8E1] border border-[#FFE082] text-[11px] text-[#8C5D35] font-semibold flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#B87C2B] shrink-0 mt-0.5" />
                    <span>{resolutionNotice}</span>
                  </div>
                )}

                {uploading && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2F8FE0]">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E2D4BE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#67BDFF] to-[#146FBF] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="p-2.5 bg-[#FFEBEE] border border-[#FFCDD2] rounded-lg text-xs text-[#C62828] font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className={`game-btn-blue text-xs sm:text-sm !py-2.5 !px-5 inline-flex items-center justify-center gap-2 w-full cursor-pointer shadow-md ${
                    !selectedFile || uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Background...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Background</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 2: GRID OF UPLOADED BACKGROUNDS (POLAROID / WOOD MINI-FRAME STYLE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#D6BC90] pb-2">
          <div>
            <h4 className="font-display text-lg text-[#381E0A]">
              Background Gallery ({banners.length} of {MAX_BANNERS_LIMIT})
            </h4>
            <p className="text-xs text-[#6B492B] font-semibold">
              Manage all full-screen backgrounds. Toggle active state, reorder, or delete.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchBanners}
            className="game-btn-wood text-xs !py-1 !px-2.5 flex items-center gap-1.5 cursor-pointer"
            title="Refresh background list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#2F8FE0] animate-spin mx-auto" />
            <div className="text-sm font-bold text-[#7C471E]">Loading background records...</div>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF2DF] rounded-2xl border-2 border-dashed border-[#D6BC90]">
            <ImageIcon className="w-10 h-10 text-[#C0A87A] mx-auto mb-2" />
            <div className="font-display text-base text-[#381E0A]">No Backgrounds Uploaded Yet</div>
            <p className="text-xs text-[#7C471E] font-semibold mt-1">
              The landing page is currently displaying the default cartoon forest backdrop. Upload an image above to start your custom slideshow.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {banners.map((banner, index) => {
              const isFirst = index === 0;
              const isLast = index === banners.length - 1;
              const isSelectedForPreview = previewBannerId === banner.id;

              return (
                <div
                  key={banner.id}
                  className={`rounded-2xl border-3 transition-all flex flex-col justify-between overflow-hidden shadow-sm relative ${
                    banner.is_active
                      ? isSelectedForPreview
                        ? 'bg-white border-[#2F8FE0] ring-3 ring-[#2F8FE0]/40'
                        : 'bg-white border-[#CDB48D]'
                      : 'bg-[#F2E5CE]/75 border-[#D1B78E] opacity-75'
                  }`}
                >
                  {/* Polaroid Wood Photo Header with 16:9 Widescreen Ratio */}
                  <div className="relative w-full aspect-video bg-[#1F1004] overflow-hidden group">
                    <img
                      src={banner.image_url}
                      alt={`Banner #${index + 1}`}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Sequence Badge */}
                    <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border border-white/20">
                      #{index + 1}
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-2 right-2 z-10">
                      {banner.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#2A7513]/90 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/20 shadow-xs">
                          <Eye className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EAD0A8] bg-[#633917]/90 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/20 shadow-xs">
                          <EyeOff className="w-3 h-3" />
                          <span>Resting</span>
                        </span>
                      )}
                    </div>

                    {/* Quick Preview Click Action */}
                    <button
                      type="button"
                      onClick={() => setPreviewBannerId(banner.id)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer gap-1.5"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>Preview in Section</span>
                    </button>
                  </div>

                  {/* Card Controls & Details */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#7C471E]">
                      <span className="font-mono bg-[#FAF0D4] px-2 py-0.5 rounded border border-[#E0CEB0]">
                        Order: {banner.sort_order}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewBannerId(banner.id)}
                        className="text-[#2F8FE0] hover:underline cursor-pointer"
                      >
                        {isSelectedForPreview ? 'Currently Previewed' : 'Preview this'}
                      </button>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8D8B8]">
                      {/* Sort Order Up/Down */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(banner.id, 'up')}
                          disabled={isFirst}
                          aria-label="Move sequence earlier"
                          title="Move earlier in slideshow"
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                            isFirst
                              ? 'opacity-35 bg-[#E8D4B4] border-[#D1B892] text-[#8C6B4E] cursor-not-allowed'
                              : 'bg-[#FAF0D4] hover:bg-[#F3E2BD] border-[#CBB38B] text-[#5C3210]'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(banner.id, 'down')}
                          disabled={isLast}
                          aria-label="Move sequence later"
                          title="Move later in slideshow"
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                            isLast
                              ? 'opacity-35 bg-[#E8D4B4] border-[#D1B892] text-[#8C6B4E] cursor-not-allowed'
                              : 'bg-[#FAF0D4] hover:bg-[#F3E2BD] border-[#CBB38B] text-[#5C3210]'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 3D Game Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={banner.is_active}
                        aria-label={`Toggle background #${index + 1}`}
                        onClick={() => handleToggleActive(banner)}
                        className={`
                          group relative inline-flex items-center w-16 h-7 rounded-full cursor-pointer select-none transition-colors duration-200 ease-in-out border-2 border-[#4A2306] shadow-[0_2px_0_#2B1302]
                          ${banner.is_active
                            ? 'bg-gradient-to-r from-[#62C922] to-[#45A311]'
                            : 'bg-gradient-to-r from-[#8C5D35] to-[#633917]'}
                        `}
                      >
                        <span className={`text-[8px] font-black uppercase tracking-wider absolute transition-opacity ${banner.is_active ? 'left-1.5 text-white' : 'right-1.5 text-[#EAD0A8]'}`}>
                          {banner.is_active ? 'ON' : 'OFF'}
                        </span>
                        <span
                          className={`
                            pointer-events-none inline-block w-5 h-5 rounded-full bg-white border border-[#542E10] shadow-sm transform transition-transform duration-200
                            ${banner.is_active ? 'translate-x-9' : 'translate-x-1'}
                          `}
                        />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setBannerToDelete(banner)}
                        aria-label="Delete background"
                        title="Delete background"
                        className="w-7 h-7 rounded-lg bg-[#FFF2F0] hover:bg-[#FDE2DF] border border-[#F5C2BC] text-[#D32F2F] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: LIVE MINI-FRAME PREVIEW OF LANDING PAGE SECTION */}
      {currentPreviewBanner && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF2DF] border-2 border-[#D6BC90] shadow-inner space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#2F8FE0]" />
              <h4 className="font-display text-base text-[#381E0A]">
                Banner Section Placement Preview
              </h4>
            </div>
            <span className="text-xs font-bold text-[#7C471E]">
              Normal document scroll flow below header &bull; Height ~320-400px
            </span>
          </div>

          {/* Mini-mock frame representing the landing page layout with the banner section */}
          <div className="relative w-full rounded-2xl overflow-hidden border-3 border-[#542E10] shadow-[0_6px_0_#2B1302] bg-[#76C7F5] p-3 space-y-3">
            {/* Mock Header */}
            <div className="flex items-center justify-between px-3 py-1.5 game-wood-plank rounded-lg shadow-sm text-[11px] font-bold text-[#FFE8C2]">
              <span>Framedia Creative Atelier</span>
              <span className="text-[10px] text-white/80">Directory &bull; Article</span>
            </div>

            {/* Mock Dedicated Banner Section with 16:9 Aspect Ratio */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[#542E10] shadow-sm bg-[#1F1004]">
              <img
                src={currentPreviewBanner.image_url}
                alt="Banner preview"
                className="w-full h-full object-contain object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="game-wood-pill text-[9px] font-bold px-2 py-0.5">
                  Atelier Showcase
                </span>
              </div>
            </div>

            {/* Mock Intro Wood Frame below the Banner */}
            <div className="game-wood-frame p-2 rounded-xl text-center">
              <div className="game-parchment p-2 rounded-lg text-center">
                <span className="font-display text-xs text-[#381E0A]">
                  FRAMEDIA CREATIVE &bull; Narrative Craft &amp; Tactile Visual Production
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {bannerToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setBannerToDelete(null)}
          title="Delete Background Image"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#B71C1C] font-semibold leading-relaxed">
                Are you sure you want to permanently delete this full-screen background? The file will be removed from Supabase Storage and database records immediately.
              </div>
            </div>

            {bannerToDelete.image_url && (
              <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-[#542E10] shadow-sm bg-[#1F1004]">
                <img
                  src={bannerToDelete.image_url}
                  alt="Background preview"
                  className="w-full h-full object-contain object-center"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BC90]">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="game-btn-wood text-xs !py-2 !px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteBanner}
                className="px-4 py-2 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-b from-[#EF5350] to-[#C62828] border-2 border-[#8E0000] shadow-[0_3px_0_#5F0000] hover:brightness-105 active:translate-y-0.5 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
