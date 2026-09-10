-- Search queries use `contains` + `mode: 'insensitive'`, which compiles to
-- ILIKE '%term%'. A B-tree index cannot serve a leading-wildcard match, so the
-- previous plain indexes on these columns were dead weight and every search
-- fell back to a sequential scan. Trigram GIN indexes can serve them.

-- Provides the gin_trgm_ops operator class used below.
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- DropIndex
DROP INDEX "Candidate_name_idx";

-- DropIndex
DROP INDEX "Candidate_email_idx";

-- DropIndex
DROP INDEX "Candidate_location_idx";

-- DropIndex
DROP INDEX "Application_job_title_idx";

-- DropIndex
DROP INDEX "Application_company_idx";

-- CreateIndex
CREATE INDEX "Candidate_name_idx" ON "Candidate" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Candidate_email_idx" ON "Candidate" USING GIN ("email" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Candidate_location_idx" ON "Candidate" USING GIN ("location" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Application_job_title_idx" ON "Application" USING GIN ("job_title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Application_company_idx" ON "Application" USING GIN ("company" gin_trgm_ops);
