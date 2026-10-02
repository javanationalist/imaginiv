/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Upload, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  AlertCircle, 
  Loader2, 
  GripVertical, 
  X, 
  ChevronUp, 
  ChevronDown,
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  ImaginersPageData, 
  ImaginersMember, 
  MemberSocialLink, 
  SocialPlatform 
} from '../../types';
import { 
  imaginersService, 
  MAX_MEMBER_FILE_SIZE_BYTES, 
  ALLOWED_IMAGE_MIME_TYPES 
} from '../../services/imaginersService';
import { SocialIcon } from '../imaginers/SocialIcon';
import { Modal } from '../common/Modal';

const PLATFORM_OPTIONS: SocialPlatform[] = [
  'Email',
  'LinkedIn',
  'Instagram',
  'YouTube',
  'TikTok',
  'Website',
  'Pinterest',
  'X',
  'Threads',
  'Lainnya',
];

const ROLE_TEMPLATES = [
  'Creative Director & Narrative Lead',
  'Head of Visual Architecture & Tactile Design',
  'Lead Sound Architect & Spatial Composer',
  'Creative Technologist & Systems Engineer',
  'AI Ethics & Human Authorship Coordinator',
  'Exhibition Architect & Spatial Producer',
  'Cinematographer & Field Director',
  'Artisan Typographer & Print Specialist',
];

export const TheImaginersManager: React.FC = () => {
  // 1. Page Information state (Both Title and Description are optional)
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [pageInfoLoading, setPageInfoLoading] = useState(true);
  const [savingPageInfo, setSavingPageInfo] = useState(false);
  const [pageInfoNotice, setPageInfoNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 2. Members state
  const [members, setMembers] = useState<ImaginersMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  // 3. Member Form states (Add / Edit)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [socialLinks, setSocialLinks] = useState<MemberSocialLink[]>([]);
  
  // 4. Photo upload state (3:4 ratio)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [existingPhotoPath, setExistingPhotoPath] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // 5. Submission state & feedback
  const [submittingMember, setSubmittingMember] = useState(false);
  const [memberNotice, setMemberNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 6. Delete modal state
  const [memberToDelete, setMemberToDelete] = useState<ImaginersMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 7. Drag and drop reordering state
  const [draggedMemberIndex, setDraggedMemberIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  // Load initial data
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [pageRes, membersRes] = await Promise.all([
          imaginersService.getPageData(),
          imaginersService.getMembers(),
        ]);

        if (isMounted) {
          setPageTitle(pageRes.title || '');
          setPageDescription(pageRes.description || '');
          setPageInfoLoading(false);
          setMembers(membersRes);
          setMembersLoading(false);
        }
      } catch (err) {
        console.error('Failed to load The Imaginers admin data:', err);
        if (isMounted) {
          setPageInfoLoading(false);
          setMembersLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle saving page information
  const handleSavePageInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPageInfo(true);
    setPageInfoNotice(null);

    try {
      const res = await imaginersService.updatePageData(pageTitle, pageDescription);
      if (res.success) {
        setPageInfoNotice({
          text: 'Informasi halaman berhasil disimpan! Perubahan akan langsung disinkronkan ke halaman publik.',
          type: 'success',
        });
      } else {
        setPageInfoNotice({
          text: res.error || 'Gagal menyimpan informasi halaman.',
          type: 'error',
        });
      }
    } catch (err) {
      setPageInfoNotice({
        text: err instanceof Error ? err.message : 'Terjadi kesalahan sistem.',
        type: 'error',
      });
    } finally {
      setSavingPageInfo(false);
      setTimeout(() => setPageInfoNotice(null), 6000);
    }
  };

  // Handle file selection / drop for 3:4 photo
  const handleFileSelection = (file: File) => {
    setMemberNotice(null);

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      setMemberNotice({
        text: 'Format foto tidak valid. Harap gunakan JPG, PNG, WEBP, GIF, atau SVG.',
        type: 'error',
      });
      return;
    }

    if (file.size > MAX_MEMBER_FILE_SIZE_BYTES) {
      setMemberNotice({
        text: 'Ukuran foto melebihi batas 5MB. Silakan gunakan foto dengan resolusi lebih optimal.',
        type: 'error',
      });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  // Social media list management
  const handleAddSocialLink = () => {
    setSocialLinks((prev) => [...prev, { platform: 'LinkedIn', value_or_url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSocialPlatformChange = (index: number, platform: SocialPlatform) => {
    setSocialLinks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], platform };
      return copy;
    });
  };

  const handleSocialValueChange = (index: number, value_or_url: string) => {
    setSocialLinks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], value_or_url };
      return copy;
    });
  };

  // Reset member form
  const resetMemberForm = () => {
    setEditingMemberId(null);
    setName('');
    setRole('');
    setSocialLinks([]);
    setSelectedFile(null);
    setPreviewUrl(null);
    setExistingPhotoUrl(null);
    setExistingPhotoPath(null);
    setUploadProgress(0);
    setMemberNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Set member for editing
  const handleStartEdit = (member: ImaginersMember) => {
    setEditingMemberId(member.id);
    setName(member.name || '');
    setRole(member.role || '');
    setSocialLinks(member.social_media ? [...member.social_media] : []);
    const photoUrl = member.photo_url || member.picture_url || '';
    const photoPath = member.photo_path || member.picture_path || null;
    setExistingPhotoUrl(photoUrl);
    setExistingPhotoPath(photoPath);
    setPreviewUrl(photoUrl);
    setSelectedFile(null);
    setUploadProgress(0);
    setMemberNotice(null);

    // Smooth scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Submit member form (Add / Update)
  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberNotice(null);

    // Validate required fields
    if (!name.trim()) {
      setMemberNotice({ text: 'Nama Person wajib diisi.', type: 'error' });
      return;
    }

    if (!role.trim()) {
      setMemberNotice({ text: 'Role wajib diisi.', type: 'error' });
      return;
    }

    if (!selectedFile && !existingPhotoUrl) {
      setMemberNotice({ text: 'Photo dengan rasio 3:4 wajib diunggah.', type: 'error' });
      return;
    }

    // Filter out empty social media entries
    const validSocialLinks = socialLinks
      .map((s) => ({ platform: s.platform, value_or_url: s.value_or_url.trim() }))
      .filter((s) => s.value_or_url.length > 0);

    setSubmittingMember(true);

    try {
      let finalPhotoUrl = existingPhotoUrl || '';
      let finalPhotoPath = existingPhotoPath || null;

      // 1. Upload photo to Storage if a new file is chosen
      if (selectedFile) {
        setUploadingImage(true);
        const uploadRes = await imaginersService.uploadMemberPhoto(selectedFile, (progress) => {
          setUploadProgress(progress);
        });

        setUploadingImage(false);

        if (!uploadRes.success || !uploadRes.publicUrl) {
          setMemberNotice({
            text: uploadRes.error || 'Gagal mengunggah photo ke Supabase Storage.',
            type: 'error',
          });
          setSubmittingMember(false);
          return;
        }

        finalPhotoUrl = uploadRes.publicUrl;
        finalPhotoPath = uploadRes.storagePath || null;
      }

      // 2. Insert or Update member
      if (editingMemberId) {
        const updateRes = await imaginersService.updateMember(editingMemberId, {
          name: name.trim(),
          role: role.trim(),
          photo_url: finalPhotoUrl,
          photo_path: finalPhotoPath,
          social_media: validSocialLinks,
        });

        if (!updateRes.success || !updateRes.member) {
          setMemberNotice({
            text: updateRes.error || 'Gagal memperbarui data anggota di database.',
            type: 'error',
          });
          setSubmittingMember(false);
          return;
        }

        // Update local state
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMemberId ? updateRes.member! : m))
        );

        setMemberNotice({
          text: `Anggota "${name.trim()}" berhasil diperbarui!`,
          type: 'success',
        });
      } else {
        const createRes = await imaginersService.createMember({
          name: name.trim(),
          role: role.trim(),
          photo_url: finalPhotoUrl,
          photo_path: finalPhotoPath,
          social_media: validSocialLinks,
        });

        if (!createRes.success || !createRes.member) {
          setMemberNotice({
            text: createRes.error || 'Gagal menambahkan anggota ke database.',
            type: 'error',
          });
          setSubmittingMember(false);
          return;
        }

        // Append to local state
        setMembers((prev) => [...prev, createRes.member!]);

        setMemberNotice({
          text: `Anggota baru "${name.trim()}" berhasil ditambahkan!`,
          type: 'success',
        });
      }

      // Reset form on success
      resetMemberForm();
    } catch (err) {
      setMemberNotice({
        text: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat menyimpan anggota.',
        type: 'error',
      });
    } finally {
      setSubmittingMember(false);
      setTimeout(() => setMemberNotice(null), 6000);
    }
  };

  // Delete Member
  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);

    try {
      const photoPath = memberToDelete.photo_path || memberToDelete.picture_path || null;
      const res = await imaginersService.deleteMember(memberToDelete.id, photoPath);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
        setMemberNotice({
          text: `Anggota "${memberToDelete.name || memberToDelete.role}" berhasil dihapus.`,
          type: 'success',
        });
        if (editingMemberId === memberToDelete.id) {
          resetMemberForm();
        }
      } else {
        setMemberNotice({
          text: res.error || 'Gagal menghapus anggota.',
          type: 'error',
        });
      }
    } catch (err) {
      setMemberNotice({
        text: err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus.',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
      setTimeout(() => setMemberNotice(null), 5000);
    }
  };

  // Drag and drop reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedMemberIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedMemberIndex === null || draggedMemberIndex === index) return;

    // Optimistically reorder list
    const updated = [...members];
    const [moved] = updated.splice(draggedMemberIndex, 1);
    updated.splice(index, 0, moved);

    setDraggedMemberIndex(index);
    setMembers(updated);
  };

  const handleDragEnd = async () => {
    setDraggedMemberIndex(null);
    await persistMemberOrder(members);
  };

  // Accessible move up / down buttons
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const updated = [...members];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setMembers(updated);
    await persistMemberOrder(updated);
  };

  // Persist order to Supabase
  const persistMemberOrder = async (orderedList: ImaginersMember[]) => {
    setIsReordering(true);
    const payload = orderedList.map((m, idx) => ({
      id: m.id,
      display_order: idx,
    }));

    try {
      const res = await imaginersService.reorderMembers(payload);
      if (!res.success) {
        setMemberNotice({
          text: res.error || 'Gagal menyimpan urutan anggota baru.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Failed to persist order:', err);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: INFORMASI THE IMAGINERS (JUDUL & DESKRIPSI OPSIONAL)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="game-wood-frame p-4 sm:p-6 rounded-2xl relative">
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#D6BC90] pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border-2 border-[#542E10] flex items-center justify-center text-[#52C01B] shadow-xs">
              <Info className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl text-[#381E0A]">
                Informasi The Imaginers
              </h3>
              <p className="text-xs text-[#7C471E] font-semibold">
                Konfigurasi judul dan pengantar deskriptif untuk halaman publik The Imaginers (kedua bidang ini bersifat opsional).
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF0D4] border border-[#D6BC90] text-[#7C471E] shrink-0">
            Opsional
          </span>
        </div>

        {pageInfoNotice && (
          <div
            className={`p-3.5 mb-5 rounded-xl border-2 flex items-center gap-2.5 text-xs sm:text-sm font-bold shadow-xs ${
              pageInfoNotice.type === 'success'
                ? 'bg-[#EBF7E3] border-[#52BE1A] text-[#1E560B]'
                : 'bg-[#FDEDEC] border-[#E74C3C] text-[#922B21]'
            }`}
          >
            {pageInfoNotice.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-[#52BE1A]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E74C3C]" />
            )}
            <span>{pageInfoNotice.text}</span>
          </div>
        )}

        {pageInfoLoading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-sm font-bold text-[#7C471E]">
            <Loader2 className="w-5 h-5 animate-spin text-[#2F8FE0]" />
            <span>Memuat informasi halaman...</span>
          </div>
        ) : (
          <form onSubmit={handleSavePageInfo} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#381E0A] mb-1.5">
                Judul (Opsional)
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="contoh: The Imaginers (kosongkan jika tidak ingin menampilkan judul)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF0D4] border-2 border-[#D6BC90] focus:border-[#2F8FE0] focus:outline-hidden text-sm text-[#381E0A] font-semibold transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#381E0A] mb-1.5">
                Deskripsi (Opsional)
              </label>
              <textarea
                rows={3}
                value={pageDescription}
                onChange={(e) => setPageDescription(e.target.value)}
                placeholder="contoh: Meet the multidisciplinary collective of directors, narrative architects, sound ecologists, and creative technologists. (kosongkan jika tidak ingin menampilkan deskripsi)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF0D4] border-2 border-[#D6BC90] focus:border-[#2F8FE0] focus:outline-hidden text-sm text-[#381E0A] font-medium transition-all shadow-inner resize-y"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FAF0D4]/80 border border-[#D6BC90] flex items-start gap-2 text-xs text-[#7C471E] font-medium leading-relaxed">
              <Sparkles className="w-4 h-4 text-[#E68A00] shrink-0 mt-0.5" />
              <span>
                <strong>Aturan Tampilan Publik:</strong> Jika kedua bidang dibiarkan kosong, halaman publik The Imaginers tidak akan menampilkan kotak pengantar, judul, deskripsi, maupun ruang kosong (whitespace). Halaman akan langsung menampilkan profil anggota.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPageInfo}
                className="game-btn-blue text-xs sm:text-sm !py-2.5 !px-6 inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {savingPageInfo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Simpan Informasi Halaman</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: FORM TAMBAH / EDIT ANGGOTA THE IMAGINERS
          ═══════════════════════════════════════════════════════════════════ */}
      <div ref={formRef} className="game-wood-frame p-4 sm:p-6 rounded-2xl relative">
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#D6BC90] pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border-2 border-[#542E10] flex items-center justify-center text-[#2F8FE0] shadow-xs">
              {editingMemberId ? (
                <Edit3 className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <Plus className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl text-[#381E0A]">
                {editingMemberId ? 'Edit Anggota The Imaginers' : 'Tambah Anggota The Imaginers'}
              </h3>
              <p className="text-xs text-[#7C471E] font-semibold">
                Unggah photo portrait rasio 3:4, isi nama person, tentukan role, dan tautkan akun media sosial.
              </p>
            </div>
          </div>

          {editingMemberId && (
            <button
              type="button"
              onClick={resetMemberForm}
              className="game-btn-wood text-xs !py-1.5 !px-3 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        {memberNotice && (
          <div
            className={`p-3.5 mb-5 rounded-xl border-2 flex items-center gap-2.5 text-xs sm:text-sm font-bold shadow-xs ${
              memberNotice.type === 'success'
                ? 'bg-[#EBF7E3] border-[#52BE1A] text-[#1E560B]'
                : 'bg-[#FDEDEC] border-[#E74C3C] text-[#922B21]'
            }`}
          >
            {memberNotice.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-[#52BE1A]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E74C3C]" />
            )}
            <span>{memberNotice.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmitMember} className="space-y-6">
          {/* FIELD 1: PHOTO (RASIO 3:4 PORTRAIT) */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#381E0A] mb-1.5">
              Photo * <span className="text-xs font-semibold text-[#7C471E]">(Wajib, Rasio 3:4 Portrait)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Drag and drop upload zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`md:col-span-8 p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
                  isDragOver
                    ? 'border-[#2F8FE0] bg-[#E3F2FD]'
                    : 'border-[#D6BC90] bg-[#FAF0D4] hover:bg-[#F5E8CE]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border-2 border-[#542E10] flex items-center justify-center text-[#2F8FE0] mb-3 shadow-xs">
                  <Upload className="w-6 h-6 stroke-[2.3]" />
                </div>

                <p className="text-sm font-bold text-[#381E0A] mb-1">
                  Tarik & lepas file foto ke sini, atau klik untuk memilih
                </p>
                <p className="text-xs text-[#7C471E] font-medium">
                  Format: JPG, PNG, WEBP (Maksimal 5MB). Foto akan dipotong serasi pada rasio 3:4.
                </p>

                {selectedFile && (
                  <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#EBF7E3] border border-[#52BE1A] text-xs font-bold text-[#1E560B]">
                    File dipilih: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}

                {uploadingImage && (
                  <div className="w-full max-w-xs mt-3">
                    <div className="h-2 rounded-full bg-[#D6BC90] overflow-hidden">
                      <div
                        className="h-full bg-[#2F8FE0] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#2F8FE0] mt-1 block">
                      Mengunggah ke Storage ({uploadProgress}%)...
                    </span>
                  </div>
                )}
              </div>

              {/* 3:4 Aspect Ratio Portrait Preview */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="w-full max-w-[200px] aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#542E10] bg-[#1F1004] shadow-md relative flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Pratinjau Foto Anggota"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="p-4 text-center text-[#D6BC90] flex flex-col items-center gap-1.5">
                      <Users className="w-10 h-10 opacity-60" />
                      <span className="text-xs font-bold text-center">
                        Pratinjau Foto<br />(3:4 Portrait)
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#1F1004]/80 text-[10px] font-bold text-white border border-white/20">
                    3:4 Ratio
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#7C471E] mt-1.5 text-center">
                  Tampilan seragam 3:4 tanpa distorsi
                </span>
              </div>
            </div>
          </div>

          {/* FIELD 2: NAMA PERSON */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#381E0A] mb-1.5">
              Nama Person * <span className="text-xs font-semibold text-[#7C471E]">(Wajib, nama lengkap orang)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama person (contoh: Maya Lin, Arya Wardhana)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF0D4] border-2 border-[#D6BC90] focus:border-[#2F8FE0] focus:outline-hidden text-sm text-[#381E0A] font-semibold transition-all shadow-inner"
            />
          </div>

          {/* FIELD 3: ROLE DENGAN TEMPLATE PILIHAN */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#381E0A]">
                Role * <span className="text-xs font-semibold text-[#7C471E]">(Wajib, dapat diketik bebas atau gunakan opsi template)</span>
              </label>
            </div>

            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ketik role secara manual (contoh: Narrative Architect & Director)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF0D4] border-2 border-[#D6BC90] focus:border-[#2F8FE0] focus:outline-hidden text-sm text-[#381E0A] font-semibold transition-all shadow-inner mb-2"
            />

            {/* Role Template Selector Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#7C471E] block">
                Pilih opsi template role untuk mengisi otomatis (masih dapat diedit manual setelahnya):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRole(tmpl)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                      role === tmpl
                        ? 'bg-[#2F8FE0] text-white border-[#0D457C] shadow-xs'
                        : 'bg-[#FAF0D4] hover:bg-[#F5E8CE] text-[#542E10] border-[#D6BC90]'
                    }`}
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FIELD 4: SOCIAL MEDIA (REPEATABLE LINKS) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs sm:text-sm font-bold text-[#381E0A]">
                Social Media (Opsional)
              </label>
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="game-btn-wood text-xs !py-1 !px-2.5 inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Tambah Akun Media Sosial</span>
              </button>
            </div>

            {socialLinks.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-[#FAF0D4]/70 border border-[#D6BC90] text-xs text-[#7C471E] font-medium text-center">
                Belum ada akun media sosial yang ditambahkan. Klik tombol <strong>&ldquo;Tambah Akun Media Sosial&rdquo;</strong> di atas untuk menautkan profil LinkedIn, Instagram, Email, dsb.
              </div>
            ) : (
              <div className="space-y-2.5">
                {socialLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF0D4] border border-[#D6BC90] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                  >
                    {/* Platform Selector */}
                    <div className="sm:w-44 shrink-0 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF0D4] border border-[#542E10] flex items-center justify-center text-[#542E10] shrink-0">
                        <SocialIcon platform={link.platform} size={15} />
                      </div>
                      <select
                        value={link.platform}
                        onChange={(e) => handleSocialPlatformChange(idx, e.target.value as SocialPlatform)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D6BC90] text-xs font-bold text-[#381E0A] focus:outline-hidden"
                      >
                        {PLATFORM_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Value or URL */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.value_or_url}
                        onChange={(e) => handleSocialValueChange(idx, e.target.value)}
                        placeholder={
                          link.platform === 'Email'
                            ? 'alamat@email.com (otomatis menjadi tautan mailto)'
                            : `URL atau username ${link.platform}`
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D6BC90] text-xs font-semibold text-[#381E0A] focus:outline-hidden"
                      />
                    </div>

                    {/* Delete Link Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(idx)}
                      title="Hapus akun media sosial ini"
                      className="p-1.5 rounded-lg bg-[#FDEDEC] hover:bg-[#FADBD8] text-[#C0392B] border border-[#E74C3C] self-end sm:self-auto cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] font-semibold text-[#7C471E] mt-2">
              * Pada halaman publik, seluruh media sosial akan ditampilkan murni dalam bentuk ikon (ikon 3 titik untuk pilihan &ldquo;Lainnya&rdquo;) tanpa teks nama platform.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BC90]">
            {editingMemberId && (
              <button
                type="button"
                onClick={resetMemberForm}
                className="game-btn-wood text-xs sm:text-sm !py-2.5 !px-5 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Batal</span>
              </button>
            )}

            <button
              type="submit"
              disabled={submittingMember}
              className="game-btn-blue text-xs sm:text-sm !py-2.5 !px-6 inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {submittingMember ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{editingMemberId ? 'Memperbarui...' : 'Menambahkan...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{editingMemberId ? 'Perbarui Anggota' : 'Simpan Anggota'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: DAFTAR & PENGURUTAN ANGGOTA (DRAG & DROP)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="game-wood-frame p-4 sm:p-6 rounded-2xl relative">
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#D6BC90] pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFF8EC] to-[#EADBBD] border-2 border-[#542E10] flex items-center justify-center text-[#E68A00] shadow-xs">
              <Users className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl text-[#381E0A]">
                Daftar & Urutan Anggota The Imaginers ({members.length})
              </h3>
              <p className="text-xs text-[#7C471E] font-semibold">
                Tarik gagang untuk mengubah urutan (drag & drop) atau gunakan tombol panah. Urutan tersimpan secara permanen di database.
              </p>
            </div>
          </div>

          {isReordering && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F8FE0] bg-[#E3F2FD] px-3 py-1 rounded-full border border-[#90CAF9] animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Menyimpan urutan...</span>
            </div>
          )}
        </div>

        {membersLoading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-sm font-bold text-[#7C471E]">
            <Loader2 className="w-5 h-5 animate-spin text-[#2F8FE0]" />
            <span>Memuat anggota The Imaginers...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#FAF0D4] border-2 border-dashed border-[#D6BC90] space-y-2">
            <Users className="w-12 h-12 text-[#D6BC90] mx-auto" />
            <h4 className="font-display text-base text-[#381E0A]">Belum Ada Anggota Ditambahkan</h4>
            <p className="text-xs text-[#7C471E] font-medium max-w-sm mx-auto">
              Gunakan formulir &ldquo;Tambah Anggota The Imaginers&rdquo; di atas untuk memasukkan profil anggota perdana ke dalam database.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member, index) => {
              const photoUrl = member.photo_url || member.picture_url || '';
              const photoPath = member.photo_path || member.picture_path || null;

              return (
                <div
                  key={member.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOverItem(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    editingMemberId === member.id
                      ? 'border-[#2F8FE0] bg-[#E3F2FD]/80 shadow-md ring-2 ring-[#2F8FE0]/40'
                      : 'border-[#D6BC90] bg-[#FAF0D4] hover:bg-[#F5E8CE] shadow-xs'
                  }`}
                >
                  {/* Left: Drag Handle, Order Index, 3:4 Photo, Details */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Grip handle for drag and drop */}
                    <div
                      title="Tahan dan geser untuk mengubah urutan"
                      className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-[#8C5D35] hover:text-[#381E0A] hover:bg-black/5"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Order index pill */}
                    <span className="w-6 h-6 rounded-full bg-[#542E10] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>

                    {/* 3:4 Aspect Photo thumbnail */}
                    <div className="w-12 sm:w-14 aspect-[3/4] rounded-lg overflow-hidden border border-[#542E10] bg-[#1F1004] shrink-0 shadow-xs">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={member.name || member.role}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#D6BC90]">
                          <Users className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Person Name & Role */}
                    <div className="min-w-0">
                      <h4 className="font-display text-sm sm:text-base text-[#381E0A] truncate leading-tight">
                        {member.name || '(Nama belum diisi)'}
                      </h4>
                      <p className="text-xs text-[#7C471E] font-semibold truncate mt-0.5">
                        {member.role}
                      </p>

                      {/* Social icons preview */}
                      {member.social_media && member.social_media.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          {member.social_media.map((s, sIdx) => (
                            <div
                              key={sIdx}
                              title={`${s.platform}: ${s.value_or_url}`}
                              className="w-5 h-5 rounded-md bg-[#FFF8EC] border border-[#D6BC90] flex items-center justify-center text-[#542E10]"
                            >
                              <SocialIcon platform={s.platform} size={11} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Reorder arrow buttons & Edit/Delete actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Reorder Arrows */}
                    <div className="flex items-center border border-[#D6BC90] rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        title="Pindah ke atas"
                        className="p-1.5 text-[#542E10] hover:bg-[#FAF0D4] disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === members.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        title="Pindah ke bawah"
                        className="p-1.5 text-[#542E10] hover:bg-[#FAF0D4] disabled:opacity-30 disabled:hover:bg-white border-l border-[#D6BC90] cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(member)}
                      title="Edit anggota"
                      className="game-btn-wood text-xs !py-1.5 !px-3 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-white" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setMemberToDelete(member)}
                      title="Hapus anggota"
                      className="p-1.5 rounded-lg bg-[#FDEDEC] hover:bg-[#FADBD8] text-[#C0392B] border border-[#E74C3C] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        title="Konfirmasi Hapus Anggota"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#542E10] font-semibold leading-relaxed">
            Apakah Anda yakin ingin menghapus profil anggota{' '}
            <strong className="text-[#C0392B]">
              &ldquo;{memberToDelete?.name || memberToDelete?.role}&rdquo;
            </strong>{' '}
            secara permanen dari The Imaginers? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#D6BC90]">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setMemberToDelete(null)}
              className="game-btn-wood text-xs sm:text-sm !py-2 !px-4 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="game-btn-red text-xs sm:text-sm !py-2 !px-4 inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 text-white" />
                  <span>Hapus Permanen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
