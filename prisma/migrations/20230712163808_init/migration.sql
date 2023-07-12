-- CreateEnum
CREATE TYPE "ReadingMetric" AS ENUM ('Voltage', 'Current');

-- CreateTable
CREATE TABLE "readings" (
    "id" SERIAL NOT NULL,
    "name" "ReadingMetric" NOT NULL,
    "value" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "readings_pkey" PRIMARY KEY ("id")
);
