-- ==============================================================================
-- FRAMEDIA CREATIVE - ARTICLES & EDITORIAL MANUSCRIPTS DATABASE SETUP
-- ==============================================================================
-- Jalankan skrip SQL ini langsung di SQL Editor pada Supabase Dashboard.
-- Skrip ini mencakup:
-- 1. Tabel 'articles' & Index kolom slug unik
-- 2. Trigger auto-update timestamp 'updated_at'
-- 3. Row Level Security (RLS) untuk artikel (publik baca published, admin kelola semua)
-- 4. Kebijakan Storage bucket 'article-covers'
-- 5. Seed pendaftaran menu 'article' ke tabel 'pages' (Page Visibility Control)
-- ==============================================================================

-- 1. Buat Tabel 'articles'
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    cover_image_path TEXT,
    author TEXT DEFAULT 'Framedia Editorial',
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pada kolom slug untuk lookup cepat dan performa tinggi pada /article/:slug
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);

-- Index pada status published dan tanggal rilis untuk halaman daftar /article
CREATE INDEX IF NOT EXISTS idx_articles_published_date 
ON public.articles (is_published, created_at DESC);

-- 2. Trigger Auto-Update Timestamp updated_at pada Tabel 'articles'
DROP TRIGGER IF EXISTS trigger_set_updated_at_articles ON public.articles;
CREATE TRIGGER trigger_set_updated_at_articles
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Aktifkan Row Level Security (RLS) pada Tabel 'articles'
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Publik (anon & authenticated) boleh membaca artikel yang berstatus published
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
    ON public.articles
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR auth.role() = 'authenticated');

-- Policy 2: Hanya Admin login (authenticated) yang boleh INSERT artikel
DROP POLICY IF EXISTS "Authenticated admin can insert articles" ON public.articles;
CREATE POLICY "Authenticated admin can insert articles"
    ON public.articles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy 3: Hanya Admin login (authenticated) yang boleh UPDATE artikel
DROP POLICY IF EXISTS "Authenticated admin can update articles" ON public.articles;
CREATE POLICY "Authenticated admin can update articles"
    ON public.articles
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 4: Hanya Admin login (authenticated) yang boleh DELETE artikel
DROP POLICY IF EXISTS "Authenticated admin can delete articles" ON public.articles;
CREATE POLICY "Authenticated admin can delete articles"
    ON public.articles
    FOR DELETE
    TO authenticated
    USING (true);

-- 4. Aktifkan Supabase Realtime untuk sinkronisasi otomatis
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;

-- 5. Kebijakan Akses Storage Bucket 'article-covers'
CREATE POLICY "Public Read Access for Article Covers"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'article-covers');

CREATE POLICY "Admin Upload Access for Article Covers"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'article-covers');

CREATE POLICY "Admin Update Access for Article Covers"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'article-covers')
    WITH CHECK (bucket_id = 'article-covers');

CREATE POLICY "Admin Delete Access for Article Covers"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'article-covers');

-- 6. Daftarkan Halaman 'article' ke Tabel 'pages' (Page Visibility Control)
INSERT INTO public.pages (id, label, is_visible)
VALUES ('article', 'Article', true)
ON CONFLICT (id) DO NOTHING;
