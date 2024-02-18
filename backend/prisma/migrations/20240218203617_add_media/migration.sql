-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);
