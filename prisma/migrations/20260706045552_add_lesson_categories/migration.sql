-- CreateTable
CREATE TABLE "LessonCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LessonCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonCategory_slug_key" ON "LessonCategory"("slug");

-- AlterTable: added nullable here; seed.ts backfills existing rows, then a
-- follow-up migration tightens this to NOT NULL once every row has a value.
ALTER TABLE "Lesson" ADD COLUMN     "categoryId" TEXT;

-- CreateIndex
CREATE INDEX "Lesson_categoryId_idx" ON "Lesson"("categoryId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LessonCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
