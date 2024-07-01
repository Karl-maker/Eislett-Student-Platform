/*
  Warnings:

  - You are about to drop the `SubjectTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubjectTopic" DROP CONSTRAINT "SubjectTopic_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectTopic" DROP CONSTRAINT "SubjectTopic_topicId_fkey";

-- DropTable
DROP TABLE "SubjectTopic";

-- CreateTable
CREATE TABLE "SubjectCourse" (
    "subjectId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "SubjectCourse_pkey" PRIMARY KEY ("subjectId","courseId")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTopic" (
    "topicId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "CourseTopic_pkey" PRIMARY KEY ("topicId","courseId")
);

-- AddForeignKey
ALTER TABLE "SubjectCourse" ADD CONSTRAINT "SubjectCourse_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCourse" ADD CONSTRAINT "SubjectCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTopic" ADD CONSTRAINT "CourseTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTopic" ADD CONSTRAINT "CourseTopic_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
