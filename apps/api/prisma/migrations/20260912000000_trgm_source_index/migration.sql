-- The /applications search ORs `source ILIKE '%term%'` together with the
-- trigram-indexed job_title and company. With no index on source, PostgreSQL
-- cannot build a BitmapOr and scans the whole table for every search.

-- CreateIndex
CREATE INDEX "Application_source_idx" ON "Application" USING GIN ("source" gin_trgm_ops);
