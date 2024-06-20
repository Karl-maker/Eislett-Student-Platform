/*
  Warnings:

  - The primary key for the `QuestionTopic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assigned_at` on the `QuestionTopic` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `QuestionTopic` table. All the data in the column will be lost.
  - You are about to drop the column `topic_id` on the `QuestionTopic` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Topic` table. All the data in the column will be lost.
  - Added the required column `questionId` to the `QuestionTopic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `QuestionTopic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestionTopic" DROP CONSTRAINT "QuestionTopic_question_id_fkey";

-- DropForeignKey
ALTER TABLE "QuestionTopic" DROP CONSTRAINT "QuestionTopic_topic_id_fkey";

-- AlterTable
ALTER TABLE "QuestionTopic" DROP CONSTRAINT "QuestionTopic_pkey",
DROP COLUMN "assigned_at",
DROP COLUMN "question_id",
DROP COLUMN "topic_id",
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD COLUMN     "topicId" INTEGER NOT NULL,
ADD CONSTRAINT "QuestionTopic_pkey" PRIMARY KEY ("questionId", "topicId");

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "QuestionTopic" ADD CONSTRAINT "QuestionTopic_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTopic" ADD CONSTRAINT "QuestionTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
