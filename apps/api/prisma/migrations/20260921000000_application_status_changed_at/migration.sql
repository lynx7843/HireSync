-- "Hired this month" counted applications by updated_at, which moves on any
-- edit: fixing a typo in the notes of an old hire re-counted it as a hire this
-- month. Record when the status itself last changed instead.

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "status_changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill. Existing rows carry no record of when their status was set, and
-- updated_at is exactly the value that cannot be trusted here. created_at is
-- the one bound that is always true (the status was set at or after the row was
-- created) and, unlike updated_at, it cannot invent a transition that never
-- happened. Historical rows may therefore read older than they truly are.
UPDATE "Application" SET "status_changed_at" = "created_at";

-- CreateIndex
CREATE INDEX "Application_status_changed_at_idx" ON "Application"("status_changed_at");
