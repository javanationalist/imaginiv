-- ==============================================================================
-- FRAMEDIA CREATIVE - BANNER CAROUSEL DATABASE & STORAGE SETUP
-- ==============================================================================
-- Jalankan skrip SQL ini langsung di SQL Editor pada Supabase Dashboard.
-- Skrip ini akan membuat tabel 'banners', trigger proteksi maksimal 10 banner,
-- trigger auto-update timestamp, Row Level Security (RLS), serta Realtime.
-- ==============================================================================

-- 1. Buat Tabel 'banners'
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk mempercepat query tampilan carousel landing page
CREATE INDEX IF NOT EXISTS idx_banners_active_order 
ON public.banners (is_active, sort_order ASC);

-- 2. Fungsi & Trigger Otomatis Update Kolom 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_banners ON public.banners;
CREATE TRIGGER trigger_set_updated_at_banners
    BEFORE UPDATE ON public.banners
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Fungsi & Trigger Enforce Limit Maksimal 10 Banner di Database
-- Mencegah penambahan jika total banner di tabel sudah mencapai 10
CREATE OR REPLACE FUNCTION public.check_max_banners_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO current_count FROM public.banners;
    IF current_count >= 10 THEN
        RAISE EXCEPTION 'Maksimal 10 banner tercapai. Hapus banner lama terlebih dahulu sebelum mengunggah banner baru.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enforce_max_banners ON public.banners;
CREATE TRIGGER trigger_enforce_max_banners
    BEFORE INSERT ON public.banners
    FOR EACH ROW
    EXECUTE FUNCTION public.check_max_banners_limit();

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Policy 1: Publik (anon & authenticated) dapat melihat banner yang aktif (is_active = true)
DROP POLICY IF EXISTS "Public can view active banners" ON public.banners;
CREATE POLICY "Public can view active banners"
    ON public.banners
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR auth.role() = 'authenticated');

-- Policy 2: Hanya Admin yang sudah login (authenticated) yang boleh INSERT banner baru
DROP POLICY IF EXISTS "Authenticated admin can insert banners" ON public.banners;
CREATE POLICY "Authenticated admin can insert banners"
    ON public.banners
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy 3: Hanya Admin yang sudah login (authenticated) yang boleh UPDATE banner
DROP POLICY IF EXISTS "Authenticated admin can update banners" ON public.banners;
CREATE POLICY "Authenticated admin can update banners"
    ON public.banners
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 4: Hanya Admin yang sudah login (authenticated) yang boleh DELETE banner
DROP POLICY IF EXISTS "Authenticated admin can delete banners" ON public.banners;
CREATE POLICY "Authenticated admin can delete banners"
    ON public.banners
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Aktifkan Supabase Realtime agar perubahan langsung tersinkron tanpa refresh
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;

-- 6. Setup Kebijakan Storage Bucket 'banners'
-- CATATAN: Bucket 'banners' dibuat terlebih dahulu lewat menu Storage di Supabase Dashboard (pilih Public Bucket).
-- Script RLS di bawah mengamankan file di bucket 'banners':

-- Izin membaca file bagi semua pengunjung (Public Read):
CREATE POLICY "Public Read Access for Banners Storage"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'banners');

-- Izin upload file hanya untuk authenticated admin:
CREATE POLICY "Admin Upload Access for Banners Storage"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'banners');

-- Izin menghapus file hanya untuk authenticated admin:
CREATE POLICY "Admin Delete Access for Banners Storage"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'banners');
