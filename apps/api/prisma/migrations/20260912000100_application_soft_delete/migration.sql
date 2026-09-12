-- Candidates were soft-deleted but applications were hard-deleted. Give
-- applications the same deleted_at column so both tables follow one model.
-- The FK stays ON DELETE RESTRICT: rows are never hard-deleted by the app, and
-- it still prevents orphaned applications.

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "deleted_at" TIMESTAMP(3);
