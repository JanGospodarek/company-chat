/*
  Warnings:

  - The primary key for the `ReadMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ReadMessage" DROP CONSTRAINT "ReadMessage_pkey",
ADD COLUMN     "readId" SERIAL NOT NULL,
ADD CONSTRAINT "ReadMessage_pkey" PRIMARY KEY ("readId");
