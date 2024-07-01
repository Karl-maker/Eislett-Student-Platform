-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "primarySubjectId" INTEGER,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectTopic" (
    "subjectId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "SubjectTopic_pkey" PRIMARY KEY ("subjectId","topicId")
);

-- CreateTable
CREATE TABLE "PrimarySubject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrimarySubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectPrimarySubject" (
    "subjectId" INTEGER NOT NULL,
    "primarySubjectId" INTEGER NOT NULL,

    CONSTRAINT "SubjectPrimarySubject_pkey" PRIMARY KEY ("primarySubjectId","subjectId")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "coinsRewareded" INTEGER NOT NULL,
    "isCollected" BOOLEAN NOT NULL,
    "studentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_primarySubjectId_fkey" FOREIGN KEY ("primarySubjectId") REFERENCES "PrimarySubject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTopic" ADD CONSTRAINT "SubjectTopic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTopic" ADD CONSTRAINT "SubjectTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPrimarySubject" ADD CONSTRAINT "SubjectPrimarySubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPrimarySubject" ADD CONSTRAINT "SubjectPrimarySubject_primarySubjectId_fkey" FOREIGN KEY ("primarySubjectId") REFERENCES "PrimarySubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
