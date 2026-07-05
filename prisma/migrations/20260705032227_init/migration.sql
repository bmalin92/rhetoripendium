-- CreateEnum
CREATE TYPE "SectionKind" AS ENUM ('EXPLANATION', 'EXAMPLE', 'CLASSICAL_EXAMPLE', 'SUMMARY');

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "summary" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSection" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "kind" "SectionKind" NOT NULL,
    "heading" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "LessonSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingPrompt" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "instructions" TEXT,
    "minWords" INTEGER,
    "maxWords" INTEGER,

    CONSTRAINT "WritingPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationCriterion" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "EvaluationCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RhetoricalDevice" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "RhetoricalDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonDevice" (
    "lessonId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,

    CONSTRAINT "LessonDevice_pkey" PRIMARY KEY ("lessonId","deviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "LessonSection_lessonId_idx" ON "LessonSection"("lessonId");

-- CreateIndex
CREATE INDEX "WritingPrompt_lessonId_idx" ON "WritingPrompt"("lessonId");

-- CreateIndex
CREATE INDEX "EvaluationCriterion_promptId_idx" ON "EvaluationCriterion"("promptId");

-- CreateIndex
CREATE UNIQUE INDEX "RhetoricalDevice_slug_key" ON "RhetoricalDevice"("slug");

-- AddForeignKey
ALTER TABLE "LessonSection" ADD CONSTRAINT "LessonSection_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingPrompt" ADD CONSTRAINT "WritingPrompt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCriterion" ADD CONSTRAINT "EvaluationCriterion_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "WritingPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonDevice" ADD CONSTRAINT "LessonDevice_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonDevice" ADD CONSTRAINT "LessonDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "RhetoricalDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
