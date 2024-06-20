-- DropForeignKey
ALTER TABLE "MultipleChoiceOption" DROP CONSTRAINT "MultipleChoiceOption_questionId_fkey";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "difficultyLevel" DECIMAL(65,30) NOT NULL DEFAULT 0.1;

-- AddForeignKey
ALTER TABLE "MultipleChoiceOption" ADD CONSTRAINT "MultipleChoiceOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
