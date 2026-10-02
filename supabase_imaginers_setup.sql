-- ==============================================================================
-- IMAGINIV - THE IMAGINERS DATABASE & STORAGE SETUP (FINAL SCHEMA)
-- ==============================================================================
-- Jalankan skrip SQL ini langsung di SQL Editor pada Supabase Dashboard.
-- Skrip ini dirancang aman dan idempoten (non-destruktif).
-- ==============================================================================

-- 1. Tabel 'the_imaginers_page' (Judul & Deskripsi Opsional)
CREATE TABLE IF NOT EXISTS public.the_imaginers_page (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title TEXT DEFAULT '',
    description TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pastikan kolom title dan description opsional (bisa bernilai kosong/null)
ALTER TABLE public.the_imaginers_page ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.the_imaginers_page ALTER COLUMN description DROP NOT NULL;

-- Seed baris utama jika belum ada
INSERT INTO public.the_imaginers_page (id, title, description)
VALUES ('main', 'The Imaginers', 'Meet the multidisciplinary collective of directors, narrative architects, sound ecologists, and creative technologists.')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabel 'the_imaginers_members'
CREATE TABLE IF NOT EXISTS public.the_imaginers_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '',
    photo_url TEXT,
    picture_url TEXT,
    photo_path TEXT,
    picture_path TEXT,
    social_media JSONB NOT NULL DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrasi kolom jika tabel sudah ada sebelumnya
ALTER TABLE public.the_imaginers_members ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.the_imaginers_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.the_imaginers_members ADD COLUMN IF NOT EXISTS photo_path TEXT;
ALTER TABLE public.the_imaginers_members ADD COLUMN IF NOT EXISTS picture_url TEXT;
ALTER TABLE public.the_imaginers_members ADD COLUMN IF NOT EXISTS picture_path TEXT;

-- Sinkronisasi photo_url dan picture_url untuk backward compatibility
UPDATE public.the_imaginers_members SET photo_url = picture_url WHERE photo_url IS NULL AND picture_url IS NOT NULL;
UPDATE public.the_imaginers_members SET picture_url = photo_url WHERE picture_url IS NULL AND photo_url IS NOT NULL;

-- Index pada display_order untuk performa tampilan cepat di /theimaginers
CREATE INDEX IF NOT EXISTS idx_the_imaginers_order 
ON public.the_imaginers_members (display_order ASC, created_at ASC);

-- 3. Trigger Auto-Update Timestamp updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_imaginers_page ON public.the_imaginers_page;
CREATE TRIGGER trigger_set_updated_at_imaginers_page
    BEFORE UPDATE ON public.the_imaginers_page
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_imaginers_members ON public.the_imaginers_members;
CREATE TRIGGER trigger_set_updated_at_imaginers_members
    BEFORE UPDATE ON public.the_imaginers_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.the_imaginers_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.the_imaginers_members ENABLE ROW LEVEL SECURITY;

-- Policies untuk 'the_imaginers_page'
DROP POLICY IF EXISTS "Public can view the_imaginers_page" ON public.the_imaginers_page;
CREATE POLICY "Public can view the_imaginers_page"
    ON public.the_imaginers_page
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated admin can update the_imaginers_page" ON public.the_imaginers_page;
CREATE POLICY "Authenticated admin can update the_imaginers_page"
    ON public.the_imaginers_page
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies untuk 'the_imaginers_members'
DROP POLICY IF EXISTS "Public can view the_imaginers_members" ON public.the_imaginers_members;
CREATE POLICY "Public can view the_imaginers_members"
    ON public.the_imaginers_members
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated admin can insert the_imaginers_members" ON public.the_imaginers_members;
CREATE POLICY "Authenticated admin can insert the_imaginers_members"
    ON public.the_imaginers_members
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can update the_imaginers_members" ON public.the_imaginers_members;
CREATE POLICY "Authenticated admin can update the_imaginers_members"
    ON public.the_imaginers_members
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can delete the_imaginers_members" ON public.the_imaginers_members;
CREATE POLICY "Authenticated admin can delete the_imaginers_members"
    ON public.the_imaginers_members
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Publikasi Realtime Supabase
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'the_imaginers_page'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.the_imaginers_page;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'the_imaginers_members'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.the_imaginers_members;
    END IF;
END $$;

-- 6. Storage Bucket 'the-imaginers'
INSERT INTO storage.buckets (id, name, public)
VALUES ('the-imaginers', 'the-imaginers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Access for The Imaginers" ON storage.objects;
CREATE POLICY "Public Read Access for The Imaginers"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'the-imaginers');

DROP POLICY IF EXISTS "Admin Upload Access for The Imaginers" ON storage.objects;
CREATE POLICY "Admin Upload Access for The Imaginers"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'the-imaginers');

DROP POLICY IF EXISTS "Admin Update Access for The Imaginers" ON storage.objects;
CREATE POLICY "Admin Update Access for The Imaginers"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'the-imaginers')
    WITH CHECK (bucket_id = 'the-imaginers');

DROP POLICY IF EXISTS "Admin Delete Access for The Imaginers" ON storage.objects;
CREATE POLICY "Admin Delete Access for The Imaginers"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'the-imaginers');

-- 7. Pastikan 'infra-team' terdaftar di tabel 'pages'
INSERT INTO public.pages (id, label, is_visible)
VALUES ('infra-team', 'The Imaginers', true)
ON CONFLICT (id) DO UPDATE SET label = 'The Imaginers';
