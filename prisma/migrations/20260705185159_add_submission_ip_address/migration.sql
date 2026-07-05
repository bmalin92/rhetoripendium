-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "ipAddress" TEXT;

-- CreateIndex
CREATE INDEX "Submission_ipAddress_idx" ON "Submission"("ipAddress");
