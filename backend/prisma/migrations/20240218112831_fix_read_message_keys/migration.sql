/*
  Warnings:

  - The primary key for the `ReadMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `readId` on the `ReadMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReadMessage" DROP CONSTRAINT "ReadMessage_pkey",
DROP COLUMN "readId",
ADD CONSTRAINT "ReadMessage_pkey" PRIMARY KEY ("messageId", "userId");
