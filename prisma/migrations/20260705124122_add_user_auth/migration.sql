-- AlterTable
ALTER TABLE "CompletedLesson" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "sessionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "sessionId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompletedLesson_userId_lessonId_key" ON "CompletedLesson"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "Submission_userId_promptId_idx" ON "Submission"("userId", "promptId");

-- AddForeignKey
ALTER TABLE "CompletedLesson" ADD CONSTRAINT "CompletedLesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

