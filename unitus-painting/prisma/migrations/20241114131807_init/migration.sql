-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "location" JSONB NOT NULL,
    "mainHeading" JSONB NOT NULL,
    "subheading" TEXT NOT NULL,
    "buttons" JSONB NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);
